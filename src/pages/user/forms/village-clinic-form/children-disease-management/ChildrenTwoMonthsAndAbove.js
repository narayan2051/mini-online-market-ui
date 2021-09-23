import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon, Help } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { MEDICINE_OPTIONS } from "../../../../../utils/constants/forms";
import { ARMS_COLOR_OPTIONS, CASTE_CODES, DEHYDRATION_OPTIONS, EDIT_SELECTED_RECORD, FOLLOWUP_RESULT_OPTIONS, GENDER_OPTIONS, ID, MALNUTRITION_STATUS_OPTION, NO, PNEUMONIA_STATUS_OPTIONS, REQUIRED_FIELD, SKIN_TWIST_OPTIONS, SOMETHING_WENT_WRONG, SUCCESS, SUGGESTION_GIVEN_TO_MOTHER, VILLAGE_CLINIC_REFERRED_BY_OPTIONS_FOR_CHILDREN, WEIGHT_STATUS_OPTIONS, WHITE_PATCH_STATUS_OPTIONS, YES, ZERO_OR_GREATER } from "../../../../../utils/constants/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import AddMedicineList from "../../../components/add-medicine-list/AddMedicineList";
import ChildrenTwoMonthsAndAboveRegister from "../../../components/registers/village-clinic-register/children-disease-management-registers/ChildrenTwoMonthsAndAboveRegister";
import styles from "./style";

export default function ChildrenTwoMonthsAndAbove(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, setValue, handleSubmit, reset, errors } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showChildrenTwoMonthsAndAboveModal, setShowChildrenTwoMonthsAndAboveModal] = useState(false);
  const [motherSuggestionsValue, setMotherSuggestionsValue] = useState([]);
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showDiarrhoeaDetails, setShowDiarrhoeaDetails] = useState(false);
  const [modalTitle, setModalTitle] = useState("दुई महिनादेखि ५ वर्षमुनिका बिरामी बच्चाहरुको व्यवस्थापन नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [villageClinicDartaaNumberLabel, setVillageClinicDartaaNumberLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [medicineObjectList, setMedicineObjectList] = useState([]);
  const [dartaaNumber, setDartaaNumber] = useState("");

  const communityClinicId = AppUtils.getUrlParam(ID);

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "referredBy" }, { required: true });
    register({ name: "weightStatus" });
    register({ name: "skinTwist" });
    register({ name: "whitePatchesOnWrist" });
    register({ name: "armsColor" });
    register({ name: "pneumoniaStatus" });
    register({ name: "dehydration" });
    register({ name: "malnutritionStatus" });
    register({ name: "followUpDate" });
    register({ name: "followUpResult" });
  }, [register]);

  useEffect(() => {
    attachVillageClinicDartaaNumbers();
    getChildrenTwoMonthsAndAboveFromClinicId();
  }, []);

  useEffect(() => {
    dartaaNumber && getDetailsByVillageClinicDartaaNumber(dartaaNumber);
  }, [dartaaNumber])

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

  useEffect(() => {
    modalDefaultValues.medicineDetailList && setMedicineObjectList(modalDefaultValues.medicineDetailList);
  }, [modalDefaultValues]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const followUpdateChange = (date) => {
    setValue("followUpDate", date);
  }

  const handleMotherSuggestionsChange = event => {
    setMotherSuggestionsValue(event.target.value);
  }

  const handleDiarrhoeaChange = event => {
    setValue("diarrhoea", event.target.value);
    setShowDiarrhoeaDetails(event.target.value === YES);
    if (event.target.value === NO) {
      setValue("skinTwist", "");
    }
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    patientDetails.dartaaNumber && setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === patientDetails.dartaaNumber));

    setValue("villageClinicDartaaNumber", patientDetails.dartaaNumber);
    setValue("patientFirstName", patientDetails.patientFirstName);
    setValue("patientLastName", patientDetails.patientLastName);
    setValue("age", patientDetails.age);
    setValue("ageUnit", patientDetails.ageUnit);
    setValue("palikaName", patientDetails.palikaName);
    setValue("wardNumber", patientDetails.wardNumber);
    setValue("gaunOrTole", patientDetails.gaunOrTole);
    setValue("phoneNumber", patientDetails.phoneNumber);

    setModalDefaultValues(prev => ({
      ...prev,
      casteCode: patientDetails.casteCode,
      gender: patientDetails.gender,
      district: patientDetails.district,
    }));
  }

  const attachVillageClinicDartaaNumbers = () => {
    var villageClinicDartaaNumbers = [];
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all-between-two-months-to-five-years?communityClinicId=" + communityClinicId)
      .then(response => {
        var data = response.data.objectList;
        data.forEach(item => {
          villageClinicDartaaNumbers.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setVillageClinicDartaaNumbers(villageClinicDartaaNumbers);
        props.afterAttachDartaaNumber(false);
      })
  }

  const handleVillageClinicDartaaNumberChange = (villageDartaaNumberOption) => {
    setDartaaNumber(villageDartaaNumberOption.value);
  };


  const getDetailsByVillageClinicDartaaNumber = (villageClinicDartaaNumber) => {
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/imnci?communityClinicId=" + communityClinicId + "&villageClinicDartaaNumber=" + villageClinicDartaaNumber)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          updatePatientDetails(jsondata.data);
        } else {
          AddAlertMessage({ type: jsondata.type, message: jsondata.message })
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.communityClinicId = modalDefaultValues.communityClinicId || communityClinicId;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.followUpDate = data.followUpDate && DateUtils.getDateMilliseconds(data.followUpDate);
    data.medicineDetailList = medicineObjectList;
    data.motherSuggestions = motherSuggestionsValue;

    HMIS.post(API_URL.childrenTwoMonthsAndAbove, data)
      .then(response => {
        if (response.data.type === "success") {
          closeChildrenTwoMonthsAndAboveModal();
          getChildrenTwoMonthsAndAboveFromClinicId();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const childrenTwoMonthsAndAboveEditFunction = id => {
    HMIS.get(API_URL.childrenTwoMonthsAndAbove + "/" + id)
      .then(response => {
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.followUpDate = response.data.followUpDate && DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        setShowDiarrhoeaDetails(response.data.diarrhoea);
        setMotherSuggestionsValue(response.data.motherSuggestions);
        setModalDefaultValues(response.data);
        setShowDiarrhoeaDetails(response.data.diarrhoea === YES);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowChildrenTwoMonthsAndAboveModal(true);
        setValue("villageClinicDartaaNumber", response.data.villageClinicDartaaNumber);
        setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === response.data.villageClinicDartaaNumber));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  };

  const getChildrenTwoMonthsAndAboveFromClinicId = () => {
    HMIS.get(API_URL.childrenTwoMonthsAndAbove + "/clinicId/" + communityClinicId)
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closeChildrenTwoMonthsAndAboveModal = () => {
    setModalDefaultValues({});
    reset();
    setShowChildrenTwoMonthsAndAboveModal(false);
    setModalTitle("दुई महिनादेखि ५ वर्षमुनिका बिरामी बच्चाहरुको व्यवस्थापन नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setVillageClinicDartaaNumberLabel("");
    setAgeUnitLabel("");
    setMotherSuggestionsValue([]);
    setShowDiarrhoeaDetails(false);
    setMedicineObjectList([]);
    setDartaaNumber("");
  }
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          दुई महिनादेखि ५ वर्षमुनिका बिरामी बच्चाहरुको व्यवस्थापन
        </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowChildrenTwoMonthsAndAboveModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showChildrenTwoMonthsAndAboveModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeChildrenTwoMonthsAndAboveModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="सेवा लिन आएको मिति: गाउँघर क्लिनिक संचालन भएको मिति नै सेवाग्राहीले सेवा लिन आएको मिति हुने हुनाले यो फिल्ड Disable गरिएको छ।" placement="top" arrow>
                <Box>
                  <TextField
                    label="सेवा लिन आएको मिति"
                    size="small"
                    name="dartaaMiti"
                    variant="outlined"
                    defaultValue={DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)}
                    InputProps={{ readOnly: true }}
                    inputRef={register}
                    fullWidth
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="गाउँघर क्लिनिक दर्ता नं."
                options={villageClinicDartaaNumbers}
                value={villageClinicDartaaNumberLabel}
                name="villageClinicDartaaNumber"
                variant="outlined"
                onChange={handleVillageClinicDartaaNumberChange}
              />
              {errors.villageClinicDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="बिरामी बच्चाको नाम"
                size="small"
                name="patientFirstName"
                variant="outlined"
                defaultValue={modalDefaultValues.patientFirstName}
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="बिरामी बच्चाको थर"
                size="small"
                name="patientLastName"
                variant="outlined"
                defaultValue={modalDefaultValues.patientLastName}
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.patientLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="जाति कोड"
                name="casteCode"
                variant="outlined"
                size="small"
                value={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCustomSelectChange}
                disabled
                fullWidth
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="लिङ्ग"
                size="small"
                name="gender"
                value={modalDefaultValues.gender}
                options={GENDER_OPTIONS}
                onChange={handleCustomSelectChange.bind(this)}
                variant="outlined"
                fullWidth
                disabled
              />
              {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बिरामी बच्चाको उमेर"
                size="small"
                name="age"
                variant="outlined"
                defaultValue={modalDefaultValues.age}
                InputLabelProps={{ shrink: shrinkLabel }}
                inputRef={register({
                  required: true
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="start">{ageUnitLabel}</InputAdornment>,
                  readOnly: true,
                }}
                fullWidth
              />
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="district"
                label="जिल्ला"
                options={districtOptions}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.district}
                variant="outlined"
                size="small"
                disabled
                fullWidth
              />
              {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="palikaName"
                label="नगर/गाउँपालिका"
                placeholder="नगर/गाउँपालिका"
                defaultValue={modalDefaultValues.palikaName}
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
              {errors.palikaName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="wardNumber"
                label="वडा नं."
                defaultValue={modalDefaultValues.wardNumber}
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
              {errors.wardNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="gaunOrTole"
                label="गाँउ/टोल"
                defaultValue={modalDefaultValues.gaunOrTole}
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                name="phoneNumber"
                label="सम्पर्क नं."
                defaultValue={modalDefaultValues.phoneNumber}
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="तापक्रम (सेन्टिग्रेडमा)"
                type="number"
                defaultValue={modalDefaultValues.temperature}
                name="temperature"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                fullWidth
              />
              {errors.temperature && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.temperature && errors.temperature.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="तौल (के.जी. मा)"
                type="number"
                defaultValue={modalDefaultValues.weight}
                name="weight"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                fullWidth
              />
              {errors.weight && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.weight && errors.weight.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="आएको प्रकार"
                size="small"
                name="referredBy"
                value={modalDefaultValues.referredBy}
                options={VILLAGE_CLINIC_REFERRED_BY_OPTIONS_FOR_CHILDREN}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
              {errors.referredBy && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.childExaminationDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">शिशुको जाँच गर्दा पाइएका चिन्हहरु</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>सुस्त/बेहोस</FormLabel>
                <RadioGroup name="unconsciousness" defaultValue={modalDefaultValues.unconsciousness} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>आमाको दुध/झोलकुरा पिउन सक्ने</FormLabel>
                <RadioGroup name="canDrinkMothersMilkOrOtherFluid" defaultValue={modalDefaultValues.canDrinkMothersMilkOrOtherFluid} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="छ"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="छैन"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={7}></Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>श्वासप्रश्वास सम्बन्धी समस्या</FormLabel>
                <RadioGroup name="breathingDifficulties" defaultValue={modalDefaultValues.breathingDifficulties} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <Tooltip title="श्वासप्रश्वास सम्बन्धी समस्या छ भने यसमा सास दर प्रतिमिनेटमा लेख्नुहोस्।" placement="top" arrow>
                <TextField
                  name="breathing"
                  type="number"
                  label="श्वासप्रस्वास (प्रति मि.)"
                  variant="outlined"
                  defaultValue={modalDefaultValues.breathing}
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
              </Tooltip>
              {errors.breathing && errors.breathing.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs={7}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="कोखा हानेको"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.kokhaHaneko === true}
                    name="kokhaHaneko"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>झाडापखाला</FormLabel>
                <RadioGroup name="diarrhoea" onChange={handleDiarrhoeaChange} defaultValue={modalDefaultValues.diarrhoea} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {
          showDiarrhoeaDetails &&
          <Box className={classes.diarrhoeaDetails}>
            <Box className={classes.subTitle} display="flex" alignItems="center">
              <Typography variant="h6">झाडापखाला सम्बन्धी विवरण</Typography>
              <Tooltip title="झाडापखाला सम्बन्धी समस्या छ भने, कति दिनदेखि झाडापखाला लागेको हो, लागेको अबधि (दिन) अंकमा लेख्नुपर्दछ। साथै अन्य चिन्हहरूको मुल्याङ्कन गरी सोहीअनुसारको कोडहरूमा चेक लगाउनुपर्दछ ।  झाडापखाला सम्बन्धी समस्या भएमात्र सो सँग सम्बन्धित विवरणहरु सोधी तल भर्नुपर्दछ।" placement="top" arrow>
                <Help className={classes.helpIcon} fontSize="small" />
              </Tooltip>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  label="कति दिन देखी"
                  defaultValue={modalDefaultValues.howManyDays || ""}
                  name="howManyDays"
                  size="small"
                  variant="outlined"
                  inputRef={register}
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="दिसामा रगत"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.bloodInStool === true}
                      name="bloodInStool"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="सुस्त बेहोस"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.unconsciousDueToDiarrhoea === true}
                      name="unconsciousDueToDiarrhoea"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="आँखा गडेको"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.sunkenEyes === true}
                      name="sunkenEyes"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="पिउन नसक्ने"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.drinkingIssueDueToDiarrhoea === true}
                      name="drinkingIssueDueToDiarrhoea"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="हतारिएर पिउने"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.rapidDrinking === true}
                      name="rapidDrinking"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="छाला फर्किने"
                  size="small"
                  name="skinTwist"
                  value={modalDefaultValues.skinTwist}
                  options={SKIN_TWIST_OPTIONS}
                  onChange={handleCustomSelectChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        }

        <Box className={classes.nutritionDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">पोषणको स्थिति विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="तौल"
                size="small"
                name="weightStatus"
                value={modalDefaultValues.weightStatus}
                options={WEIGHT_STATUS_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="हत्केलामा सेतोपन"
                size="small"
                name="whitePatchesOnWrist"
                value={modalDefaultValues.whitePatchesOnWrist}
                options={WHITE_PATCH_STATUS_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="पाखुरा नाप"
                size="small"
                name="armsColor"
                value={modalDefaultValues.armsColor}
                options={ARMS_COLOR_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="शरिरको मासु सुकेको"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.muscleLoss === true}
                    name="muscleLoss"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="दुवै गोडा सुन्निएको"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.swollenKnees === true}
                    name="swollenKnees"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.nutritionDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">वर्गिकरण सम्बन्धी विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="निमोनिया"
                name="pneumoniaStatus"
                size="small"
                value={modalDefaultValues.pneumoniaStatus}
                variant="outlined"
                options={PNEUMONIA_STATUS_OPTIONS}
                onChange={handleCustomSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="जलवियोजन"
                name="dehydration"
                size="small"
                value={modalDefaultValues.dehydration}
                variant="outlined"
                options={DEHYDRATION_OPTIONS}
                onChange={handleCustomSelectChange}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="कुपोषण"
                size="small"
                name="malnutritionStatus"
                value={modalDefaultValues.malnutritionStatus}
                options={MALNUTRITION_STATUS_OPTION}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="अन्य"
                defaultValue={modalDefaultValues.otherClassification}
                name="otherClassification"
                size="small"
                variant="outlined"
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="ज्वरो"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.fever === true}
                    name="fever"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="सामान्य तौल भएको"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.normalWeight === true}
                    name="normalWeight"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="दिर्घ पखाला वा आउँ रगत"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.chronicDiarrheaOrBleeding === true}
                    name="chronicDiarrheaOrBleeding"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.followUpDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">फलोअप, उपचार, तथा सल्लाह सम्बन्धी विवरण</Typography>
          </Box>
          <AddMedicineList
            medicineOptions={MEDICINE_OPTIONS}
            medicineObjectList={medicineObjectList}
            onAddMedicineObjectList={(data) => setMedicineObjectList(data)}
          />
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="बच्चालाई पे्रषण गर्नुपर्ने भएमा प्रेषण गरिएको स्वास्थ्य संस्थाको नाम र ठेगाना लेख्नुपर्दछ।" placement="top" arrow>
                <TextField
                  label="प्रेषण"
                  defaultValue={modalDefaultValues.presan}
                  name="presan"
                  size="small"
                  variant="outlined"
                  inputRef={register}
                  fullWidth
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>आमालाई सल्लाह</InputLabel>
                <MaterialSelect
                  multiple
                  value={motherSuggestionsValue}
                  onChange={handleMotherSuggestionsChange}
                  name="motherSuggestions"
                >
                  <MenuItem value="">कृपया छान्नुहोस </MenuItem>
                  {SUGGESTION_GIVEN_TO_MOTHER.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
            </Grid>
            <Grid item xs>
              <Tooltip title="बच्चा फलोअपमा आएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="followUpDate"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={(date) => { followUpdateChange(date) }}
                    placeholder="फलोअप मिति"
                    defaultDate={modalDefaultValues.followUpDate}
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="फलोअप नतिजा"
                size="small"
                name="followUpResult"
                value={modalDefaultValues.followUpResult}
                options={FOLLOWUP_RESULT_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="कैफियत"
                defaultValue={modalDefaultValues.remarks}
                name="remarks"
                size="small"
                variant="outlined"
                inputRef={register}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <ChildrenTwoMonthsAndAboveRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={childrenTwoMonthsAndAboveEditFunction} villageClinicServiceDate={props.villageClinicServiceDate} />
    </>
  );

}