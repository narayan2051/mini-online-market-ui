import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
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
import { GENTAMYCIN_DOSES, MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH } from "../../../../../utils/constants/forms/index";
import { BABY_SUGGESTION_OPTIONS, CASTE_CODES, EDIT_SELECTED_RECORD, FOLLOWUP_RESULT_OPTIONS, GENDER_OPTIONS, ID, MOTHER_SUGGESTION_OPTIONS, NO, PEEP_LE_BHARIYEKA_FOKA_COUNT_OPTIONS, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, VILLAGE_CLINIC_REFERRED_BY_OPTIONS_FOR_CHILDREN, YES, ZERO_OR_GREATER } from "../../../../../utils/constants/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import ChildrenBelowTwoMonthsRegister from "../../../components/registers/village-clinic-register/children-disease-management-registers/ChildrenBelowTwoMonthsRegister";
import styles from "./style";

let gentamycinDoses = [];

export default function ChildrenBelowTwoMonths(props) {
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, setValue, handleSubmit, reset, errors } = useForm();
  const classes = styles();

  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showChildrenBelowTwoMonthsModal, setShowChildrenBelowTwoMonthsModal] = useState(false);
  const [babySuggestionsValue, setBabySuggestionsValue] = useState([]);
  const [motherSuggestionsValue, setMotherSuggestionsValue] = useState([]);
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [modalTitle, setModalTitle] = useState("२ महिना भन्दा कम उमेरका रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [villageClinicDartaaNumberLabel, setVillageClinicDartaaNumberLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [diseaseClassificationsLabel, setDiseaseClassificationsLabel] = useState();
  const [dartaaNumber, setDartaaNumber] = useState("");

  const communityClinicId = AppUtils.getUrlParam(ID);

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "referredBy" }, { required: true });
    register({ name: "followUpDate" });
    register({ name: "followUpResult" });
    register({ name: "peepLeBhariyekaFoka" });
    register({ name: "diseaseClassifications" }, { required: true, validate: value => value.length > 0 });
    attachVillageClinicDartaaNumbers();
    getChildrenBelowTwoMonthsFromVillageClinicId();
  }, [register]);

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

  useEffect(() => {
    dartaaNumber && getDetailsByVillageClinicDartaaNumber(dartaaNumber);
  }, [dartaaNumber])

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const followUpdateChange = (date) => {
    setValue("followUpDate", date);
  }

  const handleDiseaseClassificationChange = (classifications) => {
    setValue("diseaseClassifications", classifications.map(({ value }) => value));
    setDiseaseClassificationsLabel(classifications ? classifications : "");
  }

  const handleBabySuggestionsChange = event => {
    setBabySuggestionsValue(event.target.value);
  }

  const handleMotherSuggestionsChange = event => {
    setMotherSuggestionsValue(event.target.value);
  }

  const handleFollowUpResultChange = (followUpResult) => {
    setValue("followUpResult", followUpResult);
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
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all-below-two-months?communityClinicId=" + communityClinicId)
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
    data.babySuggestions = babySuggestionsValue;
    data.motherSuggestions = motherSuggestionsValue;
    if (gentamycinDoses.length) {
      data.gentamycinDoses = gentamycinDoses;
    }

    HMIS.post(API_URL.childrenBelowTwoMonths, data)
      .then(response => {
        if (response.data.type === "success") {
          closeChildrenBelowTwoMonthsModal();
          getChildrenBelowTwoMonthsFromVillageClinicId();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleGentamycinDoseCheckBoxChange = (e) => {
    e.target.checked ? gentamycinDoses.push(e.target.value) : gentamycinDoses.splice(gentamycinDoses.indexOf(e.target.value), 1);
  }

  const childrenBelowTwoMonthsEditFunction = id => {
    HMIS.get(API_URL.childrenBelowTwoMonths + "/" + id)
      .then(response => {
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.followUpDate = response.data.followUpDate && DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        response.data.gentamycinDoses && (gentamycinDoses = response.data.gentamycinDoses);
        setBabySuggestionsValue(response.data.babySuggestions);
        setMotherSuggestionsValue(response.data.motherSuggestions);
        setModalDefaultValues(response.data);
        setValue("diseaseClassifications", response.data.diseaseClassifications);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowChildrenBelowTwoMonthsModal(true);
        setValue("villageClinicDartaaNumber", response.data.villageClinicDartaaNumber);
        setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === response.data.villageClinicDartaaNumber));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
        setDiseaseClassificationsLabel(AppMisc.getMajorClassificationOptions(response.data.diseaseClassifications));
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const getChildrenBelowTwoMonthsFromVillageClinicId = () => {
    HMIS.get(API_URL.childrenBelowTwoMonths + "/clinicId/" + communityClinicId)
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closeChildrenBelowTwoMonthsModal = () => {
    setModalDefaultValues({});
    reset();
    setShowChildrenBelowTwoMonthsModal(false);
    setModalTitle("२ महिना भन्दा कम उमेरका रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setVillageClinicDartaaNumberLabel("");
    setAgeUnitLabel("");
    setBabySuggestionsValue([]);
    setMotherSuggestionsValue([]);
    setDiseaseClassificationsLabel("");
    setDartaaNumber("");
    gentamycinDoses = [];
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          २ महिना भन्दा कम उमेरका बिरामी बच्चाहरुको व्यवस्थापन
        </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowChildrenBelowTwoMonthsModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showChildrenBelowTwoMonthsModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeChildrenBelowTwoMonthsModal}
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
                label="शिशुको नाम"
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
                label="शिशुको थर"
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="शिशुको उमेर"
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
                inputRef={register}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="शिशुको आमा को नाम"
                defaultValue={modalDefaultValues.childrenMotherName}
                name="childrenMotherName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.childrenMotherName && <span className="error-message">{REQUIRED_FIELD}</span>}
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
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
        <Box className={classes.childExaminationDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">शिशुको जाँच गर्दा पाइएका चिन्हहरु</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="breathing"
                type="number"
                label="श्वासप्रस्वास (प्रति मि.)"
                variant="outlined"
                defaultValue={modalDefaultValues.breathing}
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.breathing && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.breathing && errors.breathing.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>कडा कोखा हानेको</FormLabel>
                <RadioGroup name="kadaKokhaHaneko" defaultValue={modalDefaultValues.kadaKokhaHaneko} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>दुध चुस्न नसक्ने</FormLabel>
                <RadioGroup name="notAbleToBreastFeed" defaultValue={modalDefaultValues.notAbleToBreastFeed} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>कम चलाई</FormLabel>
                <RadioGroup name="lessMovement" defaultValue={modalDefaultValues.lessMovement} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>सुस्त</FormLabel>
                <RadioGroup name="dull" defaultValue={modalDefaultValues.dull} row>
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
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>बेहोस</FormLabel>
                <RadioGroup name="fainted" defaultValue={modalDefaultValues.fainted} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>ज्वरो</FormLabel>
                <RadioGroup name="fever" defaultValue={modalDefaultValues.fever} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>शिताङ्ग</FormLabel>
                <RadioGroup name="sitaanga" defaultValue={modalDefaultValues.sitaanga} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>कडा शिताङ्ग</FormLabel>
                <RadioGroup name="severeSitaanga" defaultValue={modalDefaultValues.severeSitaanga} row>
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
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>कमलपित्त (जण्डिस)</FormLabel>
                <RadioGroup name="jaundice" defaultValue={modalDefaultValues.jaundice} row>
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
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <FormControl component="fieldset">
                <FormLabel component="legend" className={classes.bold}>नाइटो पाकेको/रातोपन छाला सम्म फैलिएको</FormLabel>
                <RadioGroup name="naitoPakeko" defaultValue={modalDefaultValues.naitoPakeko} row>
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
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={3}>
              <CustomSelect
                label="पिपले भरिएका"
                size="small"
                name="peepLeBhariyekaFoka"
                value={modalDefaultValues.peepLeBhariyekaFoka}
                options={PEEP_LE_BHARIYEKA_FOKA_COUNT_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.childTreatmentDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">वर्गिकरण तथा उपचार</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={4}>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="वर्गिकरण"
                options={MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH}
                value={diseaseClassificationsLabel}
                name="diseaseClassifications"
                variant="outlined"
                onChange={handleDiseaseClassificationChange.bind(this)}
                closeMenuOnSelect={false}
                isMulti
              />
              {errors.diseaseClassifications && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                label="एम्पीसिलिन"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.ampicillin}
                    name="ampicillin"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                label="एमोक्सिसिलिन"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.amoxicillin}
                    name="amoxicillin"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                label="जि.भि. प्रयोग"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.useGV}
                    name="useGV"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>शिशुको उपचार बारे आमालाई सल्लाह</InputLabel>
                <MaterialSelect
                  multiple
                  value={babySuggestionsValue}
                  onChange={handleBabySuggestionsChange}
                  name="babySuggestions"
                >
                  <MenuItem value="">कृपया छान्नुहोस </MenuItem>
                  {BABY_SUGGESTION_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>आमा को स्वास्थ्य सल्लाह </InputLabel>
                <MaterialSelect
                  multiple
                  value={motherSuggestionsValue}
                  onChange={handleMotherSuggestionsChange}
                  name="motherSuggestions"
                >
                  <MenuItem value="">कृपया छान्नुहोस </MenuItem>
                  {MOTHER_SUGGESTION_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
            </Grid>
            <Grid item>
              <Box>
                <FormLabel component="legend">जेन्टामाइसिन सुइ डोज</FormLabel>
                <Grid container spacing={1} alignItems="center">
                  {GENTAMYCIN_DOSES.map((item, index) => (
                    <Grid item key={index}>
                      <FormControlLabel
                        classes={{
                          label: classes.checkboxLabelSmall,
                        }}
                        label={index + 1}
                        control={
                          <Checkbox
                            defaultChecked={modalDefaultValues.gentamycinDoses?.includes(item) || false}
                            variant="outlined"
                            color="primary"
                            value={item}
                            onChange={handleGentamycinDoseCheckBoxChange}
                          />
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.followUpDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">फलोअप नतिजा तथा अन्य विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="शिशु फलोअपमा आएको मिति" placement="top" arrow>
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
                onChange={handleFollowUpResultChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
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
      <ChildrenBelowTwoMonthsRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={childrenBelowTwoMonthsEditFunction} villageClinicServiceDate={props.villageClinicServiceDate} />
    </div>
  );
}