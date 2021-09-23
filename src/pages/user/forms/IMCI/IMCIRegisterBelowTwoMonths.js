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
import { COUNSELLING_TO_MOTHER_FOR_CHILD_BELOW_TWO_MONTH, GENTAMYCIN_DOSES, ICD_CODE_OPTIONS, MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH, MEDICINE_OPTIONS_FOR_CHILD_BELOW_TWO_MONTHS, MUL_DARTA_NUMBERS_LIST } from "../../../../utils/constants/forms";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, NO, REFERRED_BY_OPTIONS, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import AddMedicineList from "../../components/add-medicine-list/AddMedicineList";
import IMCIBelowTwoMonthsRegister from "../../components/registers/imci-register/IMCIBelowTwoMonthsRegister";
import styles from "./style";

let gentamycinDoses = [];

export default function IMCIRegisterBelowTwoMonths() {
  const classes = styles();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const districtOptions = AppMisc.getDistrictOptions();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [medicineObjectList, setMedicineObjectList] = useState([]);
  const [openIMCIBelowTwoMonthsModal, setOpenIMCIBelowTwoMonthsModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [counsellingToMother, setCounsellingToMother] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("Add New Record To IMCI Register For Children Aged Below 2 Months.");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [icdCodeLabel, setIcdCodeLabel] = useState();
  const [majorClassificationsLabel, setMajorClassificationsLabel] = useState();
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [showGentamycinDoseList, setShowGentamycinDoseList] = useState(false);

  useEffect(() => {
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "referredBy" });
    register({ name: "followUpDate" });
    register({ name: "icdCodeForMajorDiagnosis" }, { required: true });
    register({ name: "majorClassifications" }, { required: true, validate: value => value.length > 0 });
    attachMulDartaaOptions();
  }, [register]);

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getListOfIMCIRegisterBelowTwoMonths();
  }, [sewaDartaaRegisterDate]);

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
    HMIS.get(API_URL.mulDartaaRegister + "/all-below-two-months")
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

  const handleCounsellingMotherChange = event => {
    setCounsellingToMother(event.target.value);
  }

  const handleGentamycinDoseCheckBoxChange = (e) => {
    e.target.checked ? gentamycinDoses.push(e.target.value) : gentamycinDoses.splice(gentamycinDoses.indexOf(e.target.value), 1);
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.followUpDate = data.followUpDate && DateUtils.getDateMilliseconds(data.followUpDate);
    data.medicineDetailList = medicineObjectList;
    data.counsellingToMother = counsellingToMother;
    if (gentamycinDoses.length) {
      data.gentamycinDoses = gentamycinDoses;
    }

    HMIS.post(API_URL.imciBelowTwoMonths, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          closeIMCIBelowTwoMonthsModal();
          sewaDartaaRegisterDate && getListOfIMCIRegisterBelowTwoMonths();
        }
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const imciRegisterBelowTwoMonthsEditFunction = id => {
    HMIS.get(API_URL.imciBelowTwoMonths + "/" + id)
      .then(response => {
        response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.followUpDate = response.data.followUpDate && DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        gentamycinDoses = response.data.gentamycinDoses || [];
        setValue("majorClassifications", response.data.majorClassifications);
        setCounsellingToMother(response.data.counsellingToMother);
        setModalDefaultValues(response.data);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setOpenIMCIBelowTwoMonthsModal(true);
        setShowGentamycinDoseList(gentamycinDoses.length !== 0);
        setValue("mulDartaaNumber", response.data.mulDartaaNumber);
        setValue("icdCodeForMajorDiagnosis", response.data.icdCodeForMajorDiagnosis);
        setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
        setIcdCodeLabel(AppMisc.getIcdCodeObject(response.data.icdCodeForMajorDiagnosis));
        setMajorClassificationsLabel(AppMisc.getMajorClassificationOptions(response.data.majorClassifications));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListOfIMCIRegisterBelowTwoMonths = () => {
    HMIS.get(API_URL.imciBelowTwoMonths + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        response.data.dartaaMiti = DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.followUpDate = DateUtils.getDateFromMilliseconds(response.data.followUpDate);
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const closeIMCIBelowTwoMonthsModal = () => {
    reset({});
    setOpenIMCIBelowTwoMonthsModal(false);
    setModalTitle("Add New Record To IMCI Register For Children Aged Below 2 Months.");
    setModalDefaultValues({});
    setShowGentamycinDoseList(false);
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
    setIcdCodeLabel("");
    setMajorClassificationsLabel("");
    setMedicineObjectList([]);
    gentamycinDoses = [];
  }

  const handleFollowUpDateChange = (date) => {
    setValue("followUpDate", date)
  }

  const handleMajorClassificationChange = (classifications) => {
    setValue("numberOfClassification", classifications.length);
    setShrinkLabel(true);
    setValue("majorClassifications", classifications.map(({ value }) => value));
    setMajorClassificationsLabel(classifications ? classifications : "");
  }

  const handleICDCodeChange = icdCodeOption => {
    setValue("icdCodeForMajorDiagnosis", icdCodeOption.value);
    setIcdCodeLabel(icdCodeOption ? icdCodeOption : "");
  }

  const handleGentamycinChecked = (event) => {
    setShowGentamycinDoseList(event.target.checked);
    if (!event.target.checked) {
      gentamycinDoses = [];
    }
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          IMCI REGISTER FOR CHILDREN BELOW 2 MONTHS
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenIMCIBelowTwoMonthsModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openIMCIBelowTwoMonthsModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeIMCIBelowTwoMonthsModal}
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
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
                InputProps={{ readOnly: true }}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
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
                InputProps={{ readOnly: true }}
                fullWidth
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
                InputProps={{ readOnly: true }}
                fullWidth
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
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Name of Mother"
                defaultValue={modalDefaultValues.motherName}
                name="motherName"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.motherName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.healthInfo}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Sex, Age, Weight, Temperature, and Referral</Typography>
          </Box>
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
                label="Age In Weeks"
                type="number"
                defaultValue={modalDefaultValues.childAgeWeeks}
                name="childAgeWeeks"
                variant="outlined"
                inputRef={register({
                  required: true,
                  max: 9,
                })}
                size="small"
                fullWidth
              />
              {errors.childAgeWeeks && errors.childAgeWeeks.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.childAgeWeeks && errors.childAgeWeeks.type === "max" && (<span className="error-message">कृपया उमेर(हप्तामा) ९ भन्दा कम हुनुपर्दछ।</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="Days"
                type="number"
                defaultValue={modalDefaultValues.childAgeDays || ""}
                name="childAgeDays"
                variant="outlined"
                inputRef={register({
                  max: 6
                })}
                size="small"
                fullWidth
              />
              {errors.childAgeDays && errors.childAgeDays.type === "max" && (<span className="error-message">कृपया उमेर(दिनमा) ७ भन्दा कम हुनुपर्दछ।</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="Weight (kg)"
                defaultValue={modalDefaultValues.weightInKg}
                name="weightInKg"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.weightInKg && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Temperature in &deg;C"
                defaultValue={modalDefaultValues.temperatureInCelsius}
                name="temperatureInCelsius"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.temperatureInCelsius && <span className="error-message">{REQUIRED_FIELD}</span>}
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
            <Typography variant="subtitle2">1. PSBI/NBI/NBI</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={2}>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Convulsion"
                  control={
                    <Checkbox
                      name="convulsion"
                      defaultChecked={modalDefaultValues.convulsion}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Respiratory rate (RR)"
                  defaultValue={modalDefaultValues.respiratoryRate}
                  name="respiratoryRate"
                  variant="outlined"
                  inputRef={register}
                  size="small"
                />
              </Grid>
              <Grid item xs={8}></Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Severe chest indrawing"
                  control={
                    <Checkbox
                      name="severeChestIndrawing"
                      defaultChecked={modalDefaultValues.severeChestIndrawing}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Nasal flaring"
                  control={<Checkbox name="nasalFlaring" defaultChecked={modalDefaultValues.nasalFlaring} variant="outlined" inputRef={register} color="primary" />}
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Grunting"
                  control={
                    <Checkbox
                      name="grunting"
                      defaultChecked={modalDefaultValues.grunting}
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
                  label="Unable To Feed"
                  control={
                    <Checkbox
                      name="unableToFeed"
                      defaultChecked={modalDefaultValues.unableToFeed}
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
                  label="Bulging Fontanelle"
                  control={
                    <Checkbox
                      name="bulgingFontanelle"
                      defaultChecked={modalDefaultValues.bulgingFontanelle}
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
                  label="Umbilicus infection to skin"
                  control={
                    <Checkbox
                      name="umbilicusInfectionToSkin"
                      defaultChecked={modalDefaultValues.umbilicusInfectionToSkin}
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
                  label="Umbilicus red or with Pus"
                  control={
                    <Checkbox
                      name="umbilicusRedOrWithPus"
                      defaultChecked={modalDefaultValues.umbilicusRedOrWithPus}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Temp &gt; 37.5 &deg;C"
                  control={
                    <Checkbox
                      name="tempGreaterThan37point5C"
                      defaultChecked={modalDefaultValues.tempGreaterThan37point5C}
                      inputRef={register}
                      variant="outlined"
                      color="primary"
                    />
                  }
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Temp &lt; 35.5 &deg;C"
                  control={
                    <Checkbox
                      name="tempLessThan35point5C"
                      defaultChecked={modalDefaultValues.tempLessThan35point5C}
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
                  label="Lethargic/ Unconscious"
                  control={
                    <Checkbox
                      name="lethargicOrUnconscious"
                      defaultChecked={modalDefaultValues.lethargicOrUnconscious}
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
                  label="Less than normal movement"
                  control={
                    <Checkbox
                      name="lessThanNormalMovement"
                      defaultChecked={modalDefaultValues.lessThanNormalMovement}
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
                  label="Jaundice"
                  control={
                    <Checkbox name="jaundice" defaultChecked={modalDefaultValues.jaundice} variant="outlined" inputRef={register} color="primary" />
                  }
                />
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Jaundice upto hands feet"
                  control={
                    <Checkbox
                      name="jaundiceUptoHandsFeet"
                      defaultChecked={modalDefaultValues.jaundiceUptoHandsFeet}
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
                  label="Pus from Eye"
                  control={
                    <Checkbox
                      name="pusFromEye"
                      defaultChecked={modalDefaultValues.pusFromEye}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="Skin pustules: < 10"
                  control={
                    <Checkbox
                      name="skinPustulesLessThenTen"
                      defaultChecked={modalDefaultValues.skinPustulesLessThenTen}
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
                  label="Skin pustules: Severe &amp; >10"
                  control={
                    <Checkbox
                      name="skinPustulesGreaterThenTen"
                      defaultChecked={modalDefaultValues.skinPustulesGreaterThenTen}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">2. Diarrhoea</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Box mt={1} display="flex">
                <RadioGroup name="hasDiarrhoea" defaultValue={modalDefaultValues.hasDiarrhoea} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                    classes={{
                      label: classes.radioLabelSmall,
                    }}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                    classes={{
                      label: classes.radioLabelSmall,
                    }}
                  />
                </RadioGroup>
                <Box ml={2}>
                  <TextField
                    label="How many days?"
                    defaultValue={modalDefaultValues.diarrhoeaAffectedDays}
                    name="diarrhoeaAffectedDays"
                    variant="outlined"
                    inputRef={register({
                      min: 0
                    })}
                    size="small"
                    type="number"
                  />
                  {errors.diarrhoeaAffectedDays && errors.diarrhoeaAffectedDays.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Box>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Blood"
                control={
                  <Checkbox name="blood" defaultChecked={modalDefaultValues.blood} variant="outlined" inputRef={register} color="primary" />
                }
              />
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Restless/Irritable"
                control={
                  <Checkbox
                    name="irritable"
                    defaultChecked={modalDefaultValues.irritable}
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
                label="Sunken Eyes"
                control={
                  <Checkbox
                    name="sunkenEyes"
                    defaultChecked={modalDefaultValues.sunkenEyes}
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
                label="Skin Pinch Slowly"
                control={
                  <Checkbox
                    name="skinPinchSlowly"
                    defaultChecked={modalDefaultValues.skinPinchSlowly}
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
                label="Skin pinch very slowly"
                control={
                  <Checkbox
                    name="skinPinchVerySlowly"
                    defaultChecked={modalDefaultValues.skinPinchVerySlowly}
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
                label="Lethargic/ Unconscious"
                control={
                  <Checkbox
                    name="lethargicOrUnconsciousDueToDiarrhoea"
                    defaultChecked={modalDefaultValues.lethargicOrUnconsciousDueToDiarrhoea}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Typography variant="subtitle2">3. Low weight/ feeding problem</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Difficult feeding"
                control={
                  <Checkbox
                    name="difficultFeeding"
                    defaultChecked={modalDefaultValues.difficultFeeding}
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
                label="Breastfed"
                control={
                  <Checkbox name="breastfed" defaultChecked={modalDefaultValues.breastfed} variant="outlined" inputRef={register} color="primary" />
                }
              />
              <Grid item sm={3}>
                <TextField
                  label="How many times in 24 hours"
                  defaultValue={modalDefaultValues.feedingCountInADay || ""}
                  name="feedingCountInADay"
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Receive other food/ drinks"
                control={
                  <Checkbox
                    name="receivedOtherFoodOrDrinks"
                    defaultChecked={modalDefaultValues.receivedOtherFoodOrDrinks}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
              <Grid item sm={2}>
                <TextField
                  label="How Often? Times"
                  defaultValue={modalDefaultValues.otherFoodFeedingCount}
                  name="otherFoodFeedingCount"
                  variant="outlined"
                  inputRef={register}
                  size="small"
                />
              </Grid>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Feed by bottle"
                control={
                  <Checkbox
                    name="feedByBottle"
                    defaultChecked={modalDefaultValues.feedByBottle}
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
                label="Feed by spoon"
                control={
                  <Checkbox
                    name="feedBySpoon"
                    defaultChecked={modalDefaultValues.feedBySpoon}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
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
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Thrush in the mouth"
                control={
                  <Checkbox
                    name="thrushInTheMouth"
                    defaultChecked={modalDefaultValues.thrushInTheMouth}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Typography variant="subtitle2">4. Assess breast feeding</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Includes all 4 points of attachment</FormLabel>
                  <RadioGroup name="attachment" defaultValue={modalDefaultValues.attachment} row>
                    <FormControlLabel
                      value={YES}
                      control={<Radio color="primary" />}
                      label="Yes"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value={NO}
                      control={<Radio color="primary" />}
                      label="No"
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
                  <FormLabel component="legend">Includes all 4 points of position</FormLabel>
                  <RadioGroup name="position" defaultValue={modalDefaultValues.position} row>
                    <FormControlLabel
                      value={YES}
                      control={<Radio color="primary" />}
                      label="Yes"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value={NO}
                      control={<Radio color="primary" />}
                      label="No"
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
                  <FormLabel component="legend">Suckling Effectively</FormLabel>
                  <RadioGroup name="suckling" defaultValue={modalDefaultValues.suckling} row>
                    <FormControlLabel
                      value={YES}
                      control={<Radio color="primary" />}
                      label="Yes"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                    <FormControlLabel
                      value={NO}
                      control={<Radio color="primary" />}
                      label="No"
                      inputRef={register}
                      classes={{
                        label: classes.radioLabelSmall,
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
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
                options={MAJOR_CLASSIFICATIONS_FOR_BELOW_TWO_MONTH}
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
                size="small"
                variant="outlined"
                name="others"
                defaultValue={modalDefaultValues.others}
                placeholder="Others"
                inputRef={register}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Number of classification"
                size="small"
                defaultValue={modalDefaultValues.numberOfClassification}
                name="numberOfClassification"
                InputLabelProps={{ shrink: shrinkLabel }}
                variant="outlined"
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <Select
                placeholder="ICD Code for one major diagnosis"
                name="icdCodeForMajorDiagnosis"
                variant="outlined"
                value={icdCodeLabel}
                onChange={handleICDCodeChange.bind(this)}
                size="small"
                options={ICD_CODE_OPTIONS}
                fullWidth
              />
              {errors.icdCodeForMajorDiagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="center" className={classes.row}>
            <Grid item xs={2}>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="Gentamycin"
                control={
                  <Checkbox
                    name="gentamycin"
                    defaultChecked={modalDefaultValues.gentamycinDoses ? true : false}
                    variant="outlined"
                    color="primary"
                    onChange={handleGentamycinChecked}
                  />
                }
              />
            </Grid>
            {showGentamycinDoseList && (
              <Grid item>
                <Box>
                  <FormLabel component="legend">Gentamycin Dose</FormLabel>
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
                              defaultChecked={(modalDefaultValues.gentamycinDoses?.includes(item)) || false}
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
            )}
          </Grid>
        </Box>
        <Box className={classes.treatmentAndCounselingDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Treatment and counseling</Typography>
          </Box>
          <AddMedicineList
            medicineOptions={MEDICINE_OPTIONS_FOR_CHILD_BELOW_TWO_MONTHS}
            medicineObjectList={medicineObjectList}
            onAddMedicineObjectList={(data) => setMedicineObjectList(data)}
          />
        </Box>
        <Box className={classes.counsellingToMotherDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Counselling to mother</Typography>
          </Box>
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
                  {COUNSELLING_TO_MOTHER_FOR_CHILD_BELOW_TWO_MONTH.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.followupAndRemarkDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Follow Up, Died and Remarks</Typography>
          </Box>
          <Grid container spacing={2} alignItems="flex-end" className={classes.row}>
            <Grid item xs={12} sm={2}>
              <NepaliDate
                className="date-picker-form-control full-width"
                defaultDate={modalDefaultValues.followUpDate}
                onDateSelect={(date) => { handleFollowUpDateChange(date) }}
                labelText="Follow up date"
                dateLabelClass={classes.labelSmall}
              />
            </Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend">Result</FormLabel>
              <RadioGroup name="result" defaultValue={modalDefaultValues.result} row>
                <FormControlLabel
                  value="improved"
                  control={<Radio color="primary" />}
                  label="Improved"
                  inputRef={register}
                  classes={{
                    label: classes.radioLabelSmall,
                  }}
                />
                <FormControlLabel
                  value="same"
                  control={<Radio color="primary" />}
                  label="Same"
                  inputRef={register}
                  classes={{
                    label: classes.radioLabelSmall,
                  }}
                />
                <FormControlLabel
                  value="worse"
                  control={<Radio color="primary" />}
                  label="Worse"
                  inputRef={register}
                  classes={{
                    label: classes.radioLabelSmall,
                  }}
                />
              </RadioGroup>
            </FormControl>
            <FormControlLabel
              classes={{
                label: classes.checkboxLabelSmall,
              }}
              label="Died"
              control={
                <Checkbox
                  name="didChildDie"
                  defaultChecked={modalDefaultValues.didChildDie}
                  variant="outlined"
                  color="primary"
                  inputRef={register}
                />
              }
            />
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                name="referredTo"
                size="small"
                label="Referred To"
                variant="outlined"
                defaultValue={modalDefaultValues.referredTo}
                placeholder="Referred to"
                inputRef={register}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Remarks"
                size="small"
                defaultValue={modalDefaultValues.remarks}
                name="remarks"
                variant="outlined"
                placeholder="Remarks"
                inputRef={register}
                multiline
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <IMCIBelowTwoMonthsRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={imciRegisterBelowTwoMonthsEditFunction.bind(this)} />
    </div>
  );
}
