import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { COUNSELLING_TO_MOTHER_FOR_CHILD_ABOVE_TWO_MONTH, ICD_CODE_OPTIONS, MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH, MEDICINE_OPTIONS, MUL_DARTA_NUMBERS_LIST } from "../../../../utils/constants/forms";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, NO, REFERRED_BY_OPTIONS, REQUIRED_FIELD, SOMETHING_WENT_WRONG, YES, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import AddMedicineList from "../../components/add-medicine-list/AddMedicineList";
import IMCITwoMonthsAndAboveRegister from "../../components/registers/imci-register/IMCITwoMonthsAndAboveRegister";
import styles from "./style";

export default function IMCIRegisterAboveTwoMonths() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [openIMCITwoMonthsAndAboveModal, setOpenIMCITwoMonthsAndAboveModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [counsellingToMother, setCounsellingToMother] = useState([]);
  const [medicineObjectList, setMedicineObjectList] = useState([]);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("Add New Record To IMCI Register For Children Aged 2-59 Months.");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [majorClassificationsLabel, setMajorClassificationsLabel] = useState();
  const [icdCodeLabel, setIcdCodeLabel] = useState();
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [feverFieldChecked, setFeverFieldChecked] = useState();
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "referredBy" });
    register({ name: "followUpDate" });
    register({ name: "icdCodeForMajorDiagnosis" }, { required: true });
    register({ name: "majorClassifications" }, { required: true, validate: value => value.length > 0 });
  }, [register]);

  useEffect(() => {
    attachMulDartaaOptions();
  }, []);

  const handleSewaDartaaRegisterDateFromSelect = date => {
    date &&
      setSewaDartaaRegisterDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleSewaDartaaRegisterDateToSelect = (date) => {
    date &&
      setSewaDartaaRegisterDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  const handleMajorClassificationChange = (classifications) => {
    setValue("numberOfClassification", classifications.length);
    setShrinkLabel(true);
    setValue("majorClassifications", classifications.map(({ value }) => value));
    setMajorClassificationsLabel(classifications ? classifications : "");
  }

  const handleCounsellingMotherChange = event => {
    setCounsellingToMother(event.target.value);
  }

  useEffect(() => {
    modalDefaultValues.medicineDetailList && setMedicineObjectList(modalDefaultValues.medicineDetailList);
  }, [modalDefaultValues]);

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    patientDetails.dartaaNumber && setMulDartaaLabel(mulDartaaOptions.find(option => option.value === patientDetails.dartaaNumber));

    setValue("mulDartaaNumber", patientDetails.dartaaNumber);
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

  const attachMulDartaaOptions = () => {
    var mulDartaaOptions = [];
    HMIS.get(API_URL.mulDartaaRegister + "/all-between-two-months-to-five-years")
      .then(response => {
        var data = response.data.objectList;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const handleMulDartaaChange = (mulDartaaOption) => {
    let mulDartaaNumbers = SessionStorage.getItem(MUL_DARTA_NUMBERS_LIST);

    if (mulDartaaNumbers) {
      let muldartaaNumberInfo = mulDartaaNumbers.find(obj => obj.dartaaNumber === mulDartaaOption.value);
      muldartaaNumberInfo ? updatePatientDetails(muldartaaNumberInfo) : getDetailsByMulDartaaNumber(mulDartaaOption.value);
    } else {
      getDetailsByMulDartaaNumber(mulDartaaOption.value)
    }
  };

  const getDetailsByMulDartaaNumber = (mulDartaaNumber) => {
    HMIS.get(API_URL.mulDartaaNumber + "/" + mulDartaaNumber)
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          updatePatientDetails(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.followUpDate = data.followUpDate && DateUtils.getDateMilliseconds(data.followUpDate);
    data.medicineDetailList = medicineObjectList;
    data.counsellingToMother = counsellingToMother;

    HMIS.post(API_URL.imciTwoMonthsAndAbove, data)
      .then(response => {
        if (response.data.type === "success") {
          closeIMCITwoMonthsAndAboveModal();
          sewaDartaaRegisterDate && getListOfIMCIRegisterTwoMonthsAndAbove();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleICDCodeChange = icdCodeOption => {
    setValue("icdCodeForMajorDiagnosis", icdCodeOption.value);
    setIcdCodeLabel(icdCodeOption ? icdCodeOption : "");
  };

  const imciRegisterAboveTwoMonthsEditFunction = id => {
    HMIS.get(API_URL.imciTwoMonthsAndAbove + "/" + id)
      .then(response => {
        response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.followUpDate = response.data.followUpDate && DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        setValue("majorClassifications", response.data.majorClassifications);
        setCounsellingToMother(response.data.counsellingToMother);

        setShrinkLabel(true);
        setModalDefaultValues(response.data)
        setModalTitle(EDIT_SELECTED_RECORD);
        setOpenIMCITwoMonthsAndAboveModal(true);
        setValue("mulDartaaNumber", response.data.mulDartaaNumber);
        setValue("icdCodeForMajorDiagnosis", response.data.icdCodeForMajorDiagnosis);
        setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
        setIcdCodeLabel(AppMisc.getIcdCodeObject(response.data.icdCodeForMajorDiagnosis));
        setMajorClassificationsLabel(AppMisc.getMajorClassificationOptionsForTwoMonthsAbove(response.data.majorClassifications));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListOfIMCIRegisterTwoMonthsAndAbove = () => {
    HMIS.get(API_URL.imciTwoMonthsAndAbove + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        response.data.dartaaMiti = DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.followUpDate = DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const closeIMCITwoMonthsAndAboveModal = () => {
    reset({});
    setOpenIMCITwoMonthsAndAboveModal(false);
    setModalTitle("Add New Record To IMCI Register For Children Aged 2-59 Months.");
    setModalDefaultValues({});
    setMedicineObjectList([]);
    setFeverFieldChecked();
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
    setIcdCodeLabel("");
    setMajorClassificationsLabel("");
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleFollowUpDateChange = date => {
    setValue("followUpDate", date)
  }

  const handleTemperatureChange = (event) => {
    event.target.value !== "" ? setFeverFieldChecked(event.target.value >= 37.5) : setFeverFieldChecked();
  }

  const handleAcuteRespiratoryInfectionChange = (event) => {
    setShowRequiredMessage(event.target.value === YES)
  }

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getListOfIMCIRegisterTwoMonthsAndAbove();
  }, [sewaDartaaRegisterDate]);


  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          IMCI REGISTER FOR CHILDREN AGED 2‐59 MONTHS
        </Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleSewaDartaaRegisterDateFromSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getDaysBeforeBSDate(30)} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleSewaDartaaRegisterDateToSelect(date) }} labelText="दर्ता मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenIMCITwoMonthsAndAboveModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openIMCITwoMonthsAndAboveModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeIMCITwoMonthsAndAboveModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">MRN, SRN, Date, Name, Caste and Ethnicity Code</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="सेवाग्राही दर्ता भएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="dartaaMiti"
                    defaultDate={modalDefaultValues.dartaaMiti || true}
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={(date) => { handleDartaaMitiChange(date) }}
                    placeholder="दर्ता मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="मुल दर्ता नं."
                options={mulDartaaOptions}
                value={mulDartaaLabel}
                name="mulDartaaNumber"
                variant="outlined"
                onChange={handleMulDartaaChange}
              />
              {errors.mulDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
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
              <TextField
                label="बिरामीको उमेर"
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
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                defaultValue={modalDefaultValues.palikaName}
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
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                defaultValue={modalDefaultValues.wardNumber}
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
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                defaultValue={modalDefaultValues.gaunOrTole}
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
                name="phoneNumber"
                label="सम्पर्क नं."
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                defaultValue={modalDefaultValues.phoneNumber}
                inputRef={register}
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
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
            <Grid item xs>
              <TextField
                label="Weight (kg)"
                name="weightInKg"
                type="number"
                variant="outlined"
                defaultValue={modalDefaultValues.weightInKg}
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.weightInKg && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.weightInKg && errors.weightInKg.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="Temperature in &deg; C"
                name="temperatureInCelsius"
                variant="outlined"
                defaultValue={modalDefaultValues.temperatureInCelsius}
                type="number"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                onChange={handleTemperatureChange}
                size="small"
                fullWidth
              />
              {errors.temperatureInCelsius && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.temperatureInCelsius && errors.temperatureInCelsius.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="referredBy"
                label="Referred By"
                value={modalDefaultValues.referredBy}
                options={REFERRED_BY_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.patientSignsAndSymptoms}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Patient Signs And Symptoms</Typography>
          </Box>
          <Box className={classes.patientSignsAndSymptomsContainer}>
            <Typography variant="subtitle2">1. General Danger Signs (GDS)</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" className={classes.semiBold}>GENERAL DANGER SIGNS</FormLabel>
                  <RadioGroup name="hasGeneralDangerSigns" defaultValue={modalDefaultValues.hasGeneralDangerSigns} row>
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
              <Grid item xs={9}>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Unable to drink"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.unableToDrink === true}
                      name="unableToDrink"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Vomiting all"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.vomitingAll === true}
                      name="vomitingAll"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Convulsion"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.convulsion === true}
                      name="convulsion"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Lethargic/ Unconscious"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.unconscious === true}
                      name="unconscious"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">2. Acute Respiratory Infection (ARI)</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" className={classes.semiBold}>ACUTE RESPIRATORY INFECTION</FormLabel>
                  <RadioGroup name="acuteRespiratoryInfection" defaultValue={modalDefaultValues.acuteRespiratoryInfection} row onChange={handleAcuteRespiratoryInfectionChange}>
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
              <Grid item xs={1}>
                <TextField
                  size="small"
                  defaultValue={modalDefaultValues.respirationAffectedDays || ""}
                  label="Days"
                  name="respirationAffectedDays"
                  variant="outlined"
                  inputRef={register({
                    required: showRequiredMessage,
                  })}
                  fullWidth
                />
                {errors.respirationAffectedDays && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs={2}>
                <TextField
                  size="small"
                  defaultValue={modalDefaultValues.respiratoryRate}
                  label="Respiratory Rate"
                  name="respiratoryRate"
                  variant="outlined"
                  inputRef={register({
                    required: showRequiredMessage,
                  })}
                  fullWidth
                />
                {errors.respiratoryRate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Chest indrawing"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.chestIndrawing === true}
                    name="chestIndrawing"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Stridor"
                control={
                  <Checkbox defaultChecked={modalDefaultValues.stridor === true} name="stridor" variant="outlined" inputRef={register} color="primary" />

                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Wheezing"
                control={
                  <Checkbox defaultChecked={modalDefaultValues.wheezing === true} name="wheezing" variant="outlined" inputRef={register} color="primary" />
                }
              />
            </Grid>
            <Typography variant="subtitle2">3. Diarrhoea</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={2}>
                <FormControl component="fieldset">
                  <RadioGroup name="diarrhoea" defaultValue={modalDefaultValues.diarrhoea} row>
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
              <Grid item xs={4}>
                <TextField
                  defaultValue={modalDefaultValues.diarrhoeaAffectedDays || ""}
                  label="Days"
                  name="diarrhoeaAffectedDays"
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Blood"
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.blood === true} name="blood" variant="outlined" inputRef={register} color="primary" />
                  }
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Lethargic/Unconscious"
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.lethargic === true} name="lethargic" variant="outlined" inputRef={register} color="primary" />
                  }
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Irritable"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.irritable === true}
                      name="irritable"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Sunken eyes"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.sunkenEyes === true}
                      name="sunkenEyes"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Unable to drink"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.diarrhoeaUnableToDrink === true}
                      name="diarrhoeaUnableToDrink"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Drinks eagerly"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.drinksEagerly === true}
                      name="drinksEagerly"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Skin pinch very slowly"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.skinPinchVerySlowly === true}
                      name="skinPinchVerySlowly"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Skin pinch slowly"
                  control={
                    <Checkbox
                      defaultChecked={modalDefaultValues.skinPinchSlowly === true}
                      name="skinPinchSlowly"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">4. Fever</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Fever</FormLabel>
                  <RadioGroup name="fever" defaultValue={modalDefaultValues.fever} row>
                    <FormControlLabel
                      value={YES}
                      control={<Radio color="primary" />}
                      label="Yes"
                      inputRef={register}
                      {...(feverFieldChecked !== undefined && { checked: feverFieldChecked })}
                    />
                    <FormControlLabel
                      value={NO}
                      control={<Radio color="primary" />}
                      label="No"
                      inputRef={register}
                      {...(feverFieldChecked !== undefined && { checked: !feverFieldChecked })}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <TextField
                  size="small"
                  defaultValue={modalDefaultValues.feverAffectedDays}
                  label="Days"
                  name="feverAffectedDays"
                  variant="outlined"
                  inputRef={register}
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Malaria Risk</FormLabel>
                  <RadioGroup name="malariaRisk" defaultValue={modalDefaultValues.malariaRisk} row>
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
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Stiff neck"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.stiffNeck === true}
                    name="stiffNeck"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Nasal Discharge"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.nasalDischarge === true}
                    name="nasalDischarge"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Falciparum"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.falciparum === true}
                    name="falciparum"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Non Falciparum"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.nonFalciparum === true}
                    name="nonFalciparum"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="General rash"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.generalRash === true}
                    name="generalRash"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={2}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Microscopic</FormLabel>
                  <RadioGroup name="microscopic" defaultValue={modalDefaultValues.microscopic} row>
                    <FormControlLabel
                      value="+ve"
                      control={<Radio color="primary" />}
                      label="+ve"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="-ve"
                      control={<Radio color="primary" />}
                      label="-ve"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">RDT</FormLabel>
                  <RadioGroup name="rdt" defaultValue={modalDefaultValues.rdt} row>
                    <FormControlLabel
                      value="+ve"
                      control={<Radio color="primary" />}
                      label="+ve"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="-ve"
                      control={<Radio color="primary" />}
                      label="-ve"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Hazy Cornea / Oral Ulcer (deep &amp spread)"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.hazyCornea === true}
                    name="hazyCornea"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Pus From Eye / Oral Ulcer"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.pusFromEye === true}
                    name="pusFromEye"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Typography variant="subtitle2">5. Ear infection</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={2}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Ear Infection</FormLabel>
                  <RadioGroup name="hasEarInfection" defaultValue={modalDefaultValues.hasEarInfection} row>
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
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Ear pain"
                control={
                  <Checkbox defaultChecked={modalDefaultValues.earPain === true} name="earPain" variant="outlined" inputRef={register} color="primary" />

                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Ear discharge"
                control={
                  <Checkbox defaultChecked={modalDefaultValues.earDischarge === true} name="earDischarge" variant="outlined" inputRef={register} color="primary" />

                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Tender swelling behind the ear"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.tenderSwellingBehindTheEar === true}
                    name="tenderSwellingBehindTheEar"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <Grid item xs={1}>
                <TextField
                  size="small"
                  defaultValue={modalDefaultValues.earPainAffectedDays || ""}
                  label="Days"
                  name="earPainAffectedDays"
                  variant="outlined"
                  inputRef={register}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">6. Nutrition status</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Weight</FormLabel>
                  <RadioGroup name="weight" defaultValue={modalDefaultValues.weight} row>
                    <FormControlLabel
                      value="normalWeight"
                      control={<Radio color="primary" />}
                      label="Normal Weight"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value="lowWeight"
                      control={<Radio color="primary" />}
                      label="Low Weight"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value="veryLowWeight"
                      control={<Radio color="primary" />}
                      label="Very Low Weight"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">MUAC</FormLabel>
                  <RadioGroup name="muac" defaultValue={modalDefaultValues.muac} row>
                    <FormControlLabel
                      value="green"
                      control={<Radio color="primary" />}
                      label="Green"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value="yellow"
                      control={<Radio color="primary" />}
                      label="Yellow"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value="red"
                      control={<Radio color="primary" />}
                      label="Red"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Severe wasting"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.severeWasting === true}
                    name="severeWasting"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Oedema feet"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.oedemaFeet === true}
                    name="oedemaFeet"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Severe pallor"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.severePallor === true}
                    name="severePallor"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Some pallor"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.somePallor === true}
                    name="somePallor"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
          </Box>
        </Box>
        <Box className={classes.classificationAndCodeDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Classification &amp; Code</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="Major Classifications"
                options={MAJOR_CLASSIFICATIONS_FOR_ABOVE_TWO_MONTH}
                value={majorClassificationsLabel}
                name="majorClassifications"
                variant="outlined"
                onChange={handleMajorClassificationChange.bind(this)}
                closeMenuOnSelect={false}
                isMulti
              />
              {errors.majorClassifications && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Others"
                variant="outlined"
                name="others"
                defaultValue={modalDefaultValues.others}
                placeholder="Others"
                inputRef={register}
                size="small"
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                size="small"
                defaultValue={modalDefaultValues.numberOfClassification}
                label="Number of classification"
                name="numberOfClassification"
                variant="outlined"
                InputLabelProps={{ shrink: shrinkLabel }}
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                name="icdCodeForMajorDiagnosis"
                placeholder="ICD Code for one major diagnosis"
                options={ICD_CODE_OPTIONS}
                value={icdCodeLabel}
                onChange={handleICDCodeChange.bind(this)}
              />
              {errors.icdCodeForMajorDiagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.treatmentAndCounselingDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Treatment and counseling</Typography>
          </Box>
          <Box className={classes.treatmentAndCounselingDetailsContainer}>
            <AddMedicineList
              medicineOptions={MEDICINE_OPTIONS}
              medicineObjectList={medicineObjectList}
              onAddMedicineObjectList={(data) => setMedicineObjectList(data)}
            />
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel>Counselling to Mother</InputLabel>
                  <MaterialSelect
                    multiple
                    value={counsellingToMother}
                    onChange={handleCounsellingMotherChange}
                    name="counsellingToMother"
                  >
                    <MenuItem value="" disabled>कृपया छान्नुहोस </MenuItem>
                    {COUNSELLING_TO_MOTHER_FOR_CHILD_ABOVE_TWO_MONTH.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                  </MaterialSelect>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <NepaliDate
                  defaultDate={modalDefaultValues.followUpDate}
                  onDateSelect={(date) => { handleFollowUpDateChange(date) }}
                  placeholder="Follow up date"
                  labelText="Follow up date"
                  dateLabelClass={classes.labelSmall}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Result</FormLabel>
                  <RadioGroup name="result" defaultValue={modalDefaultValues.result} row>
                    <FormControlLabel
                      value="improved"
                      control={<Radio color="primary" />}
                      label="Improved"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="same"
                      control={<Radio color="primary" />}
                      label="Same"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="worse"
                      control={<Radio color="primary" />}
                      label="Worse"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <TextField
                  label="Referred to"
                  variant="outlined"
                  name="referredTo"
                  defaultValue={modalDefaultValues.referredTo}
                  placeholder="Referred to"
                  inputRef={register}
                  size="small"
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <TextField
                  defaultValue={modalDefaultValues.remarks}
                  label="Remarks"
                  placeholder="Remarks"
                  name="remarks"
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Died"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.didChildDie === true}
                    name="didChildDie"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
          </Box>
        </Box>
      </CustomModal>
      <IMCITwoMonthsAndAboveRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={imciRegisterAboveTwoMonthsEditFunction.bind(this)} />
    </div>
  );
}
