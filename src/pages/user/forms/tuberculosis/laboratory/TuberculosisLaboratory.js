import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
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
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../../utils/constants";
import { HIV_RESULT, IMCI_MAIN_REGISTER_SERVICE_CODE, INVESTIGATION_MONTH, MUL_DARTA_NUMBERS_LIST, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, SMEAR_LAB_RESULT_OPTIONS, STATUS_KNOWN, TB_TEST_TYPE, TEST_POSITIVE_REPORT_GRADE, TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE } from "../../../../../utils/constants/forms";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import TuberculosisLaboratoryRegister from "../../../components/registers/tuberculosis/laboratory/TuberculosisLaboratoryRegister";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import styles from "../style";

export default function TuberculosisLaboratory(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showTuberculosisLaboratoryModal, setShowTuberculosisLaboratoryModal] = useState(false);
  const [tbLabRegisterData, setTbLabRegisterData] = useState([]);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [showFirstSamplePositiveReport, setShowFirstSamplePositiveReport] = useState(false);
  const [showSecondSamplePositiveReport, setShowSecondSamplePositiveReport] = useState(false);
  const [showMonthOfCompletionOfTreatment, setShowMonthOfCompletionOfTreatment] = useState(false);
  const [modalTitle, setModalTitle] = useState("क्षयरोग प्रयोगशाला रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");

  const [labRegisterDate, setLabRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });

  const districtOptions = AppMisc.getDistrictOptions();

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "dartaaNumber" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "sputumCollectionDate" }, { required: true });
    register({ name: "hivInfection" }, { required: true });
    register({ name: "tbTreatedBefore" }, { required: true });
    register({ name: "testType" }, { required: true });
    register({ name: "firstSampleTestResult" }, { required: true });
    register({ name: "secondSampleTestResult" });
    register({ name: "firstSampleTestDate" });
    register({ name: "secondSampleTestDate" });
    register({ name: "hivResult" });
  }, [register]);


  //TODO: Prastav - Refactor the below code since field is registered each time when state is changed

  useEffect(() => {
    register({ name: "investigationMonth" }, { required: showMonthOfCompletionOfTreatment });
  }, [register, showMonthOfCompletionOfTreatment])

  useEffect(() => {
    register({ name: "secondSampleTestResultGrade" }, { required: showSecondSamplePositiveReport });
  }, [register, showSecondSamplePositiveReport])

  useEffect(() => {
    register({ name: "firstSampleTestResultGrade" }, { required: showFirstSamplePositiveReport });
  }, [showFirstSamplePositiveReport])

  useEffect(() => {
    attachMulDartaaOptions();
  }, [])

  useEffect(() => {
    labRegisterDate.dateFrom && labRegisterDate.dateTo && getTbLabRegisterData();
  }, [labRegisterDate]);

  const handleLabRegisterDateFromSelect = date => {
    date &&
      setLabRegisterDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleLabRegisterDateToSelect = (date) => {
    date &&
      setLabRegisterDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  const handleCustomSelectChange = (value, name) => {
    if (name === "firstSampleTestResult") {
      setShowFirstSamplePositiveReport(value === "POSITIVE")
    }
    if (name === "secondSampleTestResult") {
      setShowSecondSamplePositiveReport(value === "POSITIVE")
    }
    setValue(name, value);
  }

  const handleTestTypeChange = value => {
    setValue("testType", value);
    setShowMonthOfCompletionOfTreatment(value === "FOLLOW_UP");
  }

  const handleSputumCollectionDate = (date) => {
    setValue("sputumCollectionDate", date);
  }

  const handleFirstSampleTestDateChange = (date) => {
    setValue("firstSampleTestDate", date);
  }

  const handleSecondSampleTestDateChange = (date) => {
    setValue("secondSampleTestDate", date);
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const getTbLabRegisterData = () => {
    HMIS.get(API_URL.tbLabRegister + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(labRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(labRegisterDate.dateTo))
      .then(response => {
        setTbLabRegisterData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const closeTuberculosisLaboratoryModal = () => {
    reset({});
    setModalDefaultValues({});
    setShowTuberculosisLaboratoryModal(false);
    setShowFirstSamplePositiveReport(false);
    setShowSecondSamplePositiveReport(false);
    setShowMonthOfCompletionOfTreatment(false);
    setModalTitle("क्षयरोग प्रयोगशाला रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setMulDartaaLabel(null);
    setAgeUnitLabel("");
  }

  const tuberculosisLaboratoryEditFunction = (id) => {
    HMIS.get(API_URL.tbLabRegister + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.firstSampleTestDate = jsondata.data.firstSampleTestDate && DateUtils.getDateFromMilliseconds(jsondata.data.firstSampleTestDate);
          jsondata.data.secondSampleTestDate = jsondata.data.secondSampleTestDate && DateUtils.getDateFromMilliseconds(jsondata.data.secondSampleTestDate);
          jsondata.data.sputumCollectionDate = DateUtils.getDateFromMilliseconds(jsondata.data.sputumCollectionDate);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          setValue("dartaaNumber", jsondata.data.dartaaNumber);
          setMulDartaaLabel(mulDartaaOptions.find(option => option.value === jsondata.data.dartaaNumber));
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
          setModalTitle(EDIT_SELECTED_RECORD);
          setModalDefaultValues(jsondata.data);
          setShowTuberculosisLaboratoryModal(true);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.firstSampleTestDate = data.firstSampleTestDate && DateUtils.getDateMilliseconds(data.firstSampleTestDate);
    data.secondSampleTestDate = data.secondSampleTestDate && DateUtils.getDateMilliseconds(data.secondSampleTestDate);
    data.sputumCollectionDate = DateUtils.getDateMilliseconds(data.sputumCollectionDate);
    data.palikaName = AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    !showMonthOfCompletionOfTreatment && delete data["investigationMonth"];
    !showFirstSamplePositiveReport && delete data["firstSampleTestResultGrade"];
    !showSecondSamplePositiveReport && delete data["secondSampleTestResultGrade"];
    HMIS.post(API_URL.tbLabRegister, data)
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        if (response.data.type === SUCCESS) {
          closeTuberculosisLaboratoryModal();
          getTbLabRegisterData();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const attachMulDartaaOptions = () => {
    var mulDartaaOptions = [];
    HMIS.get(API_URL.mulDartaaRegister + "/dartaa-numbers?sewaTypes=" + [OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, IMCI_MAIN_REGISTER_SERVICE_CODE, TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE])
      .then(response => {
        var data = response.data.objectList;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    patientDetails.dartaaNumber && setMulDartaaLabel(mulDartaaOptions.find(option => option.value === patientDetails.dartaaNumber));

    setValue("dartaaNumber", patientDetails.dartaaNumber);
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

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          क्षयरोग प्रयोगशाला रजिष्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="नमुना संकलन मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleLabRegisterDateFromSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getDaysBeforeBSDate(30)} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="नमुना संकलन मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleLabRegisterDateToSelect(date) }} labelText="दर्ता मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowTuberculosisLaboratoryModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showTuberculosisLaboratoryModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeTuberculosisLaboratoryModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="dartaaMiti"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={modalDefaultValues.dartaaMiti || true}
                    onDateSelect={handleDartaaMitiChange}
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
                name="dartaaNumber"
                variant="outlined"
                onChange={handleMulDartaaChange}
              />
              {errors.dartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="बिरामीको नाम"
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
                label="बिरामीको थर"
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
                onChange={handleCustomSelectChange}
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
          </Grid>
        </Box>
        <Box className={classes.subTitle}>
          <Typography variant="h6">खकार संकलन गरेको मिति</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs={6}>
            <Tooltip title="खकार संकलन गरेको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="sputumCollectionDate"
                  className="date-picker-form-control input-sm full-width"
                  onDateSelect={handleSputumCollectionDate}
                  placeholder="संकलन गरेको मिति"
                  defaultDate={modalDefaultValues.sputumCollectionDate}
                  hideLabel
                />
              </Box>
            </Tooltip>
            {errors.sputumCollectionDate && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
        <Box className={classes.diagnosisDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">परीक्षण सम्बन्धी विवरण</Typography>
          </Box>
          <Box className={classes.diagnosisDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <Tooltip title="खकारको परीक्षण गर्न अनुरोध गर्ने स्वास्थ्य संस्था वा उपचार केन्द्रको नाम र ठेगाना यसमा लेख्नुपर्दछ।" placement="top" arrow>
                  <TextField
                    defaultValue={modalDefaultValues.requestingTreatmentCenter}
                    label="अनुरोध गर्ने उपचार केन्द्रको नाम"
                    placeholder="अनुरोध गर्ने उपचार केन्द्रको नाम"
                    name="requestingTreatmentCenter"
                    variant="outlined"
                    inputRef={register({
                      required: true
                    })}
                    size="small"
                    fullWidth
                  />
                </Tooltip>
                {errors.requestingTreatmentCenter && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs>
                <Tooltip title="क्षयरोगको निदानका लागि शंकाष्पद विरामीको प्रयोगशला (खकार) परीक्षण गरिएको भए ओ.पि.डि. दर्ता नं. र उपचारमा रहेको क्षयरोगको विरामीको फलोअप परीक्षण गरिएको भए क्षयरोगको उपचार कार्डबाट क्षयरोग दर्ता नं. यसमा लेख्नुपर्दछ ।" placement="top" arrow>
                  <TextField
                    label="क्षयरोग/ओ.पि.डि. दर्ता नं."
                    name="opdDartaaNumber"
                    defaultValue={modalDefaultValues.opdDartaaNumber}
                    variant="outlined"
                    inputRef={register({
                      required: true
                    })}
                    size="small"
                    fullWidth
                  />
                </Tooltip>
                {errors.opdDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="एच.आई.भी. संक्रमण"
                  name="hivInfection"
                  variant="outlined"
                  options={STATUS_KNOWN}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.hivInfection}
                  size="small"
                  fullWidth
                />
                {errors.hivInfection && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="क्षयरोगको पहिला उपचार"
                  name="tbTreatedBefore"
                  variant="outlined"
                  options={STATUS_KNOWN}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.tbTreatedBefore}
                  size="small"
                  fullWidth
                />
                {errors.tbTreatedBefore && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <CustomSelect
                  label="परीक्षणको प्रकार"
                  name="testType"
                  variant="outlined"
                  options={TB_TEST_TYPE}
                  onChange={handleTestTypeChange}
                  value={modalDefaultValues.testType}
                  size="small"
                  fullWidth
                />
                {errors.testType && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              {showMonthOfCompletionOfTreatment && (
                <Grid item xs={3}>
                  <CustomReactSelect
                    label="अनुगमन महिना"
                    name="investigationMonth"
                    options={INVESTIGATION_MONTH}
                    onChange={handleCustomReactSelectChange}
                    defaultValue={modalDefaultValues.investigationMonth}
                  />
                  {errors.investigationMonth && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
            </Grid>
          </Box>
          <Box className={classes.subTitle}>
            <Typography variant="h6">माईक्रोस्कोपी विवरण</Typography>
            <Tooltip title="खकारको माईक्रोस्कोपी परीक्षण गरेको नतिजा र मिति यी फिल्डहरुमा लेख्नुपर्दछ । खकारको पहिलो नमुना जाँचको परिणाम र मिति र दोश्रो नमुना जाँचको परिणाम र मिति सम्बन्धित फिल्डहरुमा लेख्नुपर्दछ । खकार परीक्षणको नतिजा नेगेटिभ भए नतिजाको महलमा NEG लेख्नु पर्दछ, नतिजा पोजेटिभ भएमा निर्दिष्ट ग्रेडिङ्ग अनुसार खुलाउनु पर्दछ।" placement="top" arrow>
              <Help className={classes.helpIcon} fontSize="small" />
            </Tooltip>
          </Box>
          <Box className={classes.smearMicroscopyDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <CustomSelect
                  label="पहिलो नमुना जाँचको परिणाम"
                  options={SMEAR_LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleCustomSelectChange}
                  name="firstSampleTestResult"
                  value={modalDefaultValues.firstSampleTestResult}
                  size="small"
                  fullWidth
                />
                {errors.firstSampleTestResult && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              {showFirstSamplePositiveReport && (
                <Grid item xs>
                  <CustomSelect
                    label="पहिलो नमुना जाँचको परिणामको ग्रेड"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="firstSampleTestResultGrade"
                    value={modalDefaultValues.firstSampleTestResultGrade}
                    size="small"
                    fullWidth
                  />
                  {errors.firstSampleTestResultGrade && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <Tooltip title="पहिलो नमुना जाँच गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      name="firstSampleTestDate"
                      className="date-picker-form-control input-sm full-width"
                      onDateSelect={handleFirstSampleTestDateChange}
                      placeholder="पहिलो नमुना जाँच गरेको मिति"
                      defaultDate={modalDefaultValues.firstSampleTestDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="दोश्रो नमुना जाँचको परिणाम"
                  options={SMEAR_LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleCustomSelectChange}
                  name="secondSampleTestResult"
                  value={modalDefaultValues.secondSampleTestResult}
                  size="small"
                  fullWidth
                />
              </Grid>
              {showSecondSamplePositiveReport && (
                <Grid item xs>
                  <CustomSelect
                    label="दोश्रो नमुना जाँचको परिणामको ग्रेड"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="secondSampleTestResultGrade"
                    value={modalDefaultValues.secondSampleTestResultGrade}
                    size="small"
                    fullWidth
                  />
                  {errors.secondSampleTestResultGrade && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <Tooltip title="दोश्रो नमुना जाँच गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      name="secondSampleTestDate"
                      className="date-picker-form-control input-sm full-width"
                      onDateSelect={handleSecondSampleTestDateChange}
                      placeholder="दोश्रो नमुना जाँच गरेको मिति"
                      defaultDate={modalDefaultValues.secondSampleTestDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="HIV Result"
                  size="small"
                  name="hivResult"
                  value={modalDefaultValues.hivResult}
                  options={HIV_RESULT}
                  onChange={handleCustomSelectChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box className={classes.subTitle}>
              <Typography variant="h6">जाच गर्नेको</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  name="examinerName"
                  label="नाम"
                  variant="outlined"
                  defaultValue={modalDefaultValues.examinerName}
                  inputRef={register({
                    required: true
                  })}
                  size="small"
                  fullWidth
                />
                {errors.examinerName && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs>
                <TextField
                  name="examinerDesignation"
                  label="पद"
                  variant="outlined"
                  defaultValue={modalDefaultValues.examinerDesignation}
                  inputRef={register({
                    required: true
                  })}
                  size="small"
                  fullWidth
                />
                {errors.examinerDesignation && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  name="remarks"
                  label="कैफियत"
                  variant="outlined"
                  defaultValue={modalDefaultValues.remarks}
                  inputRef={register}
                  size="small"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CustomModal>
      <TuberculosisLaboratoryRegister tableData={tbLabRegisterData} showActionColumn={tbLabRegisterData.length !== 0} onEditRow={tuberculosisLaboratoryEditFunction.bind(this)} />
    </div>
  );
}
