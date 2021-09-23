import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
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
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../../utils/constants";
import { CURRENT_TREATMENT, MUL_DARTA_NUMBERS_LIST, OPD_OR_PRESUMPTIVE, PURPOSE_OF_XPERT_TEST, RIF_RESISTANCE_TEST_RESULT, STATUS_KNOWN, TEST_RESULT_MTB, XPERT_SPECIMEN_TYPE, TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE } from "../../../../../utils/constants/forms";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import TuberculosisLaboratoryXpertRegister from "../../../components/registers/tuberculosis/laboratory-xpert-register/LaboratoryXpertRegister";
import styles from "../style";

export default function LaboratoryXpert() {
  const classes = styles();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showTuberculosisLaboratoryModal, setShowTuberculosisLaboratoryModal] = useState(false);
  const [showOtherSputumTypeField, setShowOtherSputumTypeField] = useState(false);
  const [showMtbErrorCodeField, setShowMtbErrorCodeField] = useState(false);
  const [tbLabRegisterData, setTbLabRegisterData] = useState([]);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
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
    register({ name: "opdOrPresumptive" }, { required: true });
    register({ name: "sampleCollectedDate" }, { required: true });
    register({ name: "hivInfection" });
    register({ name: "tbTreatedBefore" });
    register({ name: "currentTreatmentType" }, { required: true });
    register({ name: "purposeOfTest" }, { required: true });
    register({ name: "specimenType" }, { required: true });
    register({ name: "sampleReceivedDate" });
    register({ name: "mtb" });
    register({ name: "rifResistance" });
    register({ name: "mtbResultDate" });
    register({ name: "rifResistanceResultDate" });
    attachMulDartaaOptions();
  }, [register]);

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

  useEffect(() => {
    labRegisterDate.dateFrom && labRegisterDate.dateTo && getTbXpertLabRegisterData();
  }, [labRegisterDate]);

  const handleCustomSelectChange = (value, name) => {
    if (name === "specimenType") {
      setShowOtherSputumTypeField(value === "OTHER")
    }
    if (name === "mtb") {
      setShowMtbErrorCodeField(value === "ERROR_CODE")
    }
    setValue(name, value);
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleSampleCollectionDate = date => {
    setValue("sampleCollectedDate", date);
  }

  const handleSampleReceivedDate = date => {
    setValue("sampleReceivedDate", date)
  }

  const handleMtbResultDate = date => {
    setValue("mtbResultDate", date)
  }

  const handleRifResistanceResultDate = date => {
    setValue("rifResistanceResultDate", date)
  }

  const getTbXpertLabRegisterData = () => {
    HMIS.get(API_URL.tbLabRegisterXpert + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(labRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(labRegisterDate.dateTo))
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
    setShowMtbErrorCodeField(false);
    setShowOtherSputumTypeField(false);
    setModalTitle("क्षयरोग प्रयोगशाला रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setMulDartaaLabel(null);
    setAgeUnitLabel("");
  }

  const tuberculosisXpertLaboratoryEditFunction = (id) => {
    HMIS.get(API_URL.tbLabRegisterXpert + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.sampleCollectedDate = DateUtils.getDateFromMilliseconds(jsondata.data.sampleCollectedDate);
          jsondata.data.sampleReceivedDate = jsondata.data.sampleReceivedDate && DateUtils.getDateFromMilliseconds(jsondata.data.sampleReceivedDate);
          jsondata.data.mtbResultDate = jsondata.data.mtbResultDate && DateUtils.getDateFromMilliseconds(jsondata.data.mtbResultDate);
          jsondata.data.rifResistanceResultDate = jsondata.data.rifResistanceResultDate && DateUtils.getDateFromMilliseconds(jsondata.data.rifResistanceResultDate);
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
    data.sampleCollectedDate = data.sampleCollectedDate && DateUtils.getDateMilliseconds(data.sampleCollectedDate);
    data.sampleReceivedDate = data.sampleReceivedDate && DateUtils.getDateMilliseconds(data.sampleReceivedDate);
    data.mtbResultDate = data.mtbResultDate && DateUtils.getDateMilliseconds(data.mtbResultDate);
    data.rifResistanceResultDate = data.rifResistanceResultDate && DateUtils.getDateMilliseconds(data.rifResistanceResultDate);
    data.palikaName = AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    HMIS.post(API_URL.tbLabRegisterXpert, data)
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        if (response.data.type === SUCCESS) {
          closeTuberculosisLaboratoryModal();
          getTbXpertLabRegisterData();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const attachMulDartaaOptions = () => {
    var mulDartaaOptions = [];
    HMIS.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers?sewaType=" + TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE)
      .then(response => {
        var data = response.data;
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
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          क्षयरोग प्रयोगशाला(Xpert) रजिष्टर
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
          <Typography variant="h6">सेम्पल संकलन सम्बन्धी विवरण</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              label="OPD Or Presumptive"
              name="opdOrPresumptive"
              variant="outlined"
              size="small"
              value={modalDefaultValues.opdOrPresumptive}
              options={OPD_OR_PRESUMPTIVE}
              onChange={handleCustomSelectChange}
              fullWidth
            />
            {errors.opdOrPresumptive && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="सेम्पल संकलन गरेको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="sampleCollectedDate"
                  className="date-picker-form-control input-sm full-width"
                  onDateSelect={handleSampleCollectionDate}
                  placeholder="संकलन गरेको मिति"
                  defaultDate={modalDefaultValues.sampleCollectedDate}
                  hideLabel
                />
                {errors.sampleCollectedDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
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
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <CustomSelect
                  label="Current Treatment Type"
                  name="currentTreatmentType"
                  variant="outlined"
                  options={CURRENT_TREATMENT}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.currentTreatmentType}
                  size="small"
                  fullWidth
                />
                {errors.currentTreatmentType && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs={3}>
                <CustomSelect
                  label="Purpose of Test"
                  name="purposeOfTest"
                  variant="outlined"
                  options={PURPOSE_OF_XPERT_TEST}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.purposeOfTest}
                  size="small"
                  fullWidth
                />
                {errors.purposeOfTest && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs={3}>
                <CustomSelect
                  label="Specimen Type"
                  name="specimenType"
                  variant="outlined"
                  options={XPERT_SPECIMEN_TYPE}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.specimenType}
                  size="small"
                  fullWidth
                />
                {errors.specimenType && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              {showOtherSputumTypeField && (
                <Grid item xs={3}>
                  <TextField
                    name="otherSpecimenType"
                    label="Other Specimen Type"
                    defaultValue={modalDefaultValues.otherSpecimenType}
                    variant="outlined"
                    inputRef={register({
                      required: true
                    })}
                    size="small"
                    fullWidth
                  />
                  {errors.otherSpecimenType && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
            </Grid>
          </Box>
          <Box className={classes.subTitle}>
            <Typography variant="h6">परिमाण सम्बन्धी विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="सेम्पल प्राप्त भएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="sampleReceivedDate"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={handleSampleReceivedDate}
                    placeholder="प्राप्त भएको मिति"
                    defaultDate={modalDefaultValues.sampleReceivedDate}
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="MTB"
                name="mtb"
                variant="outlined"
                options={TEST_RESULT_MTB}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.mtb}
                size="small"
                fullWidth
              />
              {errors.mtb && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showMtbErrorCodeField && (
              <Grid item xs>
                <TextField
                  name="errorOrCode"
                  label="MTB Error Code"
                  defaultValue={modalDefaultValues.errorOrCode}
                  variant="outlined"
                  inputRef={register({
                    required: true
                  })}
                  size="small"
                  fullWidth
                />
                {errors.errorOrCode && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            )}
            <Grid item xs>
              <CustomSelect
                label="RIF Resistance"
                name="rifResistance"
                variant="outlined"
                options={RIF_RESISTANCE_TEST_RESULT}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.rifResistance}
                size="small"
                fullWidth
              />
              {errors.rifResistance && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="MTB result Date" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="mtbResultDate"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={handleMtbResultDate}
                    placeholder="MTB result Date"
                    defaultDate={modalDefaultValues.mtbResultDate}
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="RIF Resistance result Date" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="rifResistanceResultDate"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={handleRifResistanceResultDate}
                    placeholder="RIF Resistance result Date"
                    defaultDate={modalDefaultValues.rifResistanceResultDate}
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                name="examinerName"
                label="Examiner Name"
                defaultValue={modalDefaultValues.examinerName}
                variant="outlined"
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
                name="examinerPost"
                label="Examiner Post"
                defaultValue={modalDefaultValues.examinerPost}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.examinerPost && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
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
      </CustomModal>
      <TuberculosisLaboratoryXpertRegister tableData={tbLabRegisterData} showActionColumn={tbLabRegisterData.length !== 0} onEditRow={tuberculosisXpertLaboratoryEditFunction.bind(this)} />
    </>
  );
}