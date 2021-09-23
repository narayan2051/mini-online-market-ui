import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, NO, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES } from "../../../../utils/constants";
import { AGE_UNITS, DISCHARGE_PATIENT_TYPE, EMERGENCY_SERVICE_OUTCOME_OPTIONS, ICD_CODE_OPTIONS, OTHER } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import EmergencyServiceRegister from "../../components/registers/emergency-service-register/EmergencyServiceRegister";
import styles from "./style";

export default function EmergencyService() {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [showEmergencyServiceModal, setShowEmergencyServiceModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("कुष्ठरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [registerDate, setRegisterDate] = useState({ dateFrom: null, dateTo: null });
  const [icdCodeLabel, setIcdCodeLabel] = useState();
  const districtOptions = AppMisc.getDistrictOptions();
  const [districtLabel, setDistrictLabel] = useState();
  const [hasDistrictSelected, setHasDistrictSelected] = useState(false);
  const [palikaOptions, setPalikaOptions] = useState();
  const [palikaNameLabel, setPalikaNameLabel] = useState();
  const [showOtherPatientType, setShowOtherPatientType] = useState(false);
  const [emergencyServiceTableData, setEmergencyServiceTableData] = useState([]);

  useEffect(() => {
    register({ name: "district" }, { required: true });
    register({ name: "palikaName" }, { required: true });
    register({ name: "dateOfAdmission" }, { required: true });
    register({ name: "dateOfDischarge" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "code" }, { required: true });
    register({ name: "outcomeCode" }, { required: true });
    register({ name: "icdCode" }, { required: true });
  }, [register]);

  useEffect(() => {
    registerDate.dateFrom && registerDate.dateTo &&
      getRegisterData();
  }, [registerDate]);

  useEffect(() => {
    reset(modalDefaultValues);
    if (modalDefaultValues.district && modalDefaultValues.palikaName && modalDefaultValues.icdCode) {
      let district = districtOptions.find(obj => obj.value === modalDefaultValues.district);
      let palika = district.palikas.find(obj => obj.value === modalDefaultValues.palikaName);
      let icdCode = ICD_CODE_OPTIONS.find(obj => obj.options.find(options => options.value === modalDefaultValues.icdCode));
      handleDistrictChange(district);
      handlePalikaNameChange(palika);
      handleICDCodeChange(icdCode);
    }
  }, [modalDefaultValues]);

  const handleRegisterDateFromSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleRegisterDateToSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  const handleDateOfAdmissionChange = date => {
    setValue("dateOfAdmission", date);
  }

  const handleCustomSelectChange = (value, name) => {
    if (name === "code") {
      setShowOtherPatientType(value === OTHER);
    }
    setValue(name, value);
  }

  const handleDateOfDischargeChange = date => {
    setValue("dateOfDischarge", date);
  }

  const handleDistrictChange = (districtOption) => {
    districtOption ? setHasDistrictSelected(true) : setHasDistrictSelected(false);
    setValue("palikaName", null);
    setPalikaNameLabel("");
    setValue("district", districtOption ? districtOption.value : null);
    setDistrictLabel(districtOption ? districtOption : "");
    districtOption &&
      setPalikaOptions(districtOption.palikas);
  }

  const handlePalikaNameChange = palikaOption => {
    setValue("palikaName", palikaOption ? palikaOption.value : null);
    setPalikaNameLabel(palikaOption ? palikaOption : "");
  }

  function handleICDCodeChange(icdCode) {
    setValue("icdCode", icdCode.value);
    setIcdCodeLabel(icdCode ? icdCode : "");
  }

  const getRegisterData = () => {
    HMIS.get(API_URL.emergencyServiceRegistration + "?fromDate=" + DateUtils.getDateMilliseconds(registerDate.dateFrom) + "&&toDate=" + DateUtils.getDateMilliseconds(registerDate.dateTo))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setEmergencyServiceTableData(jsondata.objectList);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const emergencyDetailEditFunction = (id) => {
    HMIS.get(API_URL.emergencyServiceRegistration + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dateOfAdmission = DateUtils.getDateFromMilliseconds(jsondata.data.dateOfAdmission);
          jsondata.data.dateOfDischarge = DateUtils.getDateFromMilliseconds(jsondata.data.dateOfDischarge);
          jsondata.data.policeCase = jsondata.data.policeCase ? YES : NO;
          setModalTitle(EDIT_SELECTED_RECORD);
          setShowEmergencyServiceModal(true);
          setModalDefaultValues(jsondata.data);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    if (modalDefaultValues) {
      data.id = modalDefaultValues.id;
    }
    data.dateOfAdmission = data.dateOfAdmission && DateUtils.getDateMilliseconds(data.dateOfAdmission);
    data.dateOfDischarge = data.dateOfDischarge && DateUtils.getDateMilliseconds(data.dateOfDischarge);
    HMIS.post(API_URL.emergencyServiceRegistration, data)
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        if (response.data.type === SUCCESS) {
          closeEmergencyServiceModal();
          getRegisterData();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const closeEmergencyServiceModal = () => {
    reset();
    setShowEmergencyServiceModal(false);
    setShowOtherPatientType(false);
    setModalTitle("कुष्ठरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setModalDefaultValues({});
    setDistrictLabel("");
    setAgeUnitLabel("");
    setIcdCodeLabel("");
    setPalikaNameLabel("");
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          आकस्मिक सेवा रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterDateFromSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getDaysBeforeBSDate(30)} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterDateToSelect(date) }} labelText="दर्ता मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowEmergencyServiceModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showEmergencyServiceModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeEmergencyServiceModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="dateOfAdmission"
                    defaultDate={modalDefaultValues.dateOfAdmission}
                    onDateSelect={handleDateOfAdmissionChange}
                    placeholder="दर्ता मिति"
                    hideLabel
                  />
                  {errors.dateOfAdmission && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                type="time"
                label="दर्ता भएको समय"
                name="timeOfAdmission"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                size="small"
              />
              {errors.timeOfAdmission && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बिरामीको नाम"
                size="small"
                name="patientFirstName"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बिरामीको थर"
                size="small"
                name="patientLastName"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
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
                options={CASTE_CODES}
                value={modalDefaultValues.casteCode}
                onChange={handleCustomSelectChange}
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
                options={GENDER_OPTIONS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.gender}
                variant="outlined"
                fullWidth
              />
              {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बिरामीको उमेर"
                size="small"
                name="age"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                InputProps={{
                  endAdornment: <InputAdornment position="start">{ageUnitLabel}</InputAdornment>,
                }}
                fullWidth
              />
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="उमेर वर्ष वा महिना"
                name="ageUnit"
                size="small"
                variant="outlined"
                options={AGE_UNITS}
                value={modalDefaultValues.ageUnit}
                onChange={handleCustomSelectChange}
                disabledOptionSelectable
                fullWidth
              />
              {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                value={districtLabel}
                onChange={handleDistrictChange}
                placeholder="जिल्ला"
                options={districtOptions}
                name="district"
                isClearable
              />
              {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                name="palikaName"
                placeholder="नगर/गाउँपालिका"
                options={palikaOptions}
                value={palikaNameLabel}
                onChange={handlePalikaNameChange}
                isDisabled={!hasDistrictSelected}
                isClearable
              />
              {errors.palikaName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="वडा नं"
                type="number"
                size="small"
                variant="outlined"
                name="wardNumber"
                inputRef={register({
                  required: true,
                  min: 1
                })}
                fullWidth
              />
              {errors.wardNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.wardNumber && errors.wardNumber.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                name="gaunOrTole"
                label="गाँउ/टोल"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.gaunOrTole && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="guardianPhoneNumber"
                label="अभिभावकको सम्पर्क नं."
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="अभिभावकको नाम थर"
                name="guardianName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.guardianName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">बिरामी सम्बन्धित विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="प्रेषण गरी पठाउने स्वास्थ्य संस्थाको नाम"
                name="referringHospitalName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.referringHospitalName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="सेवाग्राही आफैँ वा अन्य स्वास्थ्य संस्थाबाट प्रेषण भई आएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="आफैँ आएको"
                  control={
                    <Checkbox
                      name="selfSourceOfAdmission"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.selfSourceOfAdmission}
                    />
                  }
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={6}>
              <TextField
                label="आकस्मिक विभाग/कक्षमा आउँदाको अवस्था"
                name="signsAndSymptoms"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.signsAndSymptoms && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="यदि स्वास्थ्य संस्थामा विरामी ल्याउँदा मृत अवस्थामा ल्याइएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="मृत अवस्थामा ल्याइएको"
                  control={
                    <Checkbox
                      name="broughtDead"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.broughtDead}
                    />
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="चिकित्सकले लेखिदिएको आवश्यक पर्ने अनुसन्धानमूलक परीक्षणको विवरण"
                name="investigation"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.investigation && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="स्वास्थ्यकर्मी वा चिकित्सकले गरेको निदानको विवरण"
                name="diagnosis"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.diagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="बिरामीलाई गरिएको उपचार र दिइएको औषधिको विवरण"
                name="treatmentOrMedicinePrescribed"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.treatmentOrMedicinePrescribed && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                name="icdCode"
                className="select-sm"
                classNamePrefix="react-select"
                placeholder="ICD Code"
                value={icdCodeLabel}
                onChange={handleICDCodeChange.bind(this)}
                options={ICD_CODE_OPTIONS}
              />
              {errors.icdCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="यदि आकस्मिक विभाग/कक्षमा भर्ना भएको बिरामीलाई observation मा राखिएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="बिरामीलाई observation मा राखिएको"
                  control={
                    <Checkbox
                      name="observation"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.observation}
                    />
                  }
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">अन्य जानकारी</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="Discharge भएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="dateOfDischarge"
                    onDateSelect={handleDateOfDischargeChange}
                    placeholder="Discharge भएको मिति"
                    defaultDate={modalDefaultValues.dateOfDischarge}
                    hideLabel
                  />
                  {errors.dateOfDischarge && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                type="time"
                label="बिरामी Discharge भएको समय"
                name="timeOfDischarge"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                size="small"
              />
              {errors.timeOfDischarge && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="बिरामीको Discharge हुँदाको अवस्था"
                size="small"
                name="outcomeCode"
                options={EMERGENCY_SERVICE_OUTCOME_OPTIONS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.outcomeCode}
                variant="outlined"
                fullWidth
              />
              {errors.outcomeCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={3}>
              <Tooltip title="यदि उपचारको क्रममा बिरामीको मृत्यू भएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="उपचारको क्रममा बिरामीको मृत्यू भएको"
                  control={
                    <Checkbox
                      name="diedDuringTreatment"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.diedDuringTreatment}
                    />
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs={9}>
              <TextField
                label="बिरामी मृत्यु हुनुको कारण"
                name="causeOfDeath"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.causeOfDeath && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="यदि आकस्मिक कक्षवाट Discharge भएको बिरामीले पूर्ण शुल्क छुट पाएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="पूर्ण शुल्क छुट पाएको"
                  control={
                    <Checkbox
                      name="fullCostExemption"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.fullCostExemption}
                    />
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="यदि आकस्मिक कक्षवाट Discharge भएको बिरामीले आंशिक शुल्क छुट पाएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="आंशिक शुल्क छुट पाएको"
                  control={
                    <Checkbox
                      name="partialCostExemption"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.partialCostExemption}
                    />
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                label="कति रकम वरावरको सेवा छुट पाएको ?"
                name="totalCostExempted"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                multiline
              />
              {errors.totalCostExempted && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={3}>
              <CustomSelect
                name="code"
                label="Code"
                size="small"
                variant="outlined"
                options={DISCHARGE_PATIENT_TYPE}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.code}
                fullWidth
              />
              {errors.code && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showOtherPatientType && (
              <Grid item xs>
                <TextField
                  label="Other patient Type"
                  type="text"
                  size="small"
                  variant="outlined"
                  name="otherPatientType"
                  inputRef={register({
                    required: true
                  })}
                  fullWidth
                />
                {errors.otherPatientType && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="Discharge भएको बिरामी police case भई आएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="police case भई आएको"
                  control={
                    <Checkbox
                      name="policeCase"
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                      defaultChecked={modalDefaultValues.policeCase}
                    />
                  }
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <EmergencyServiceRegister tableData={emergencyServiceTableData} showActionColumn={emergencyServiceTableData.length !== 0} onEditRow={emergencyDetailEditFunction.bind(this)} getRegisterData={getRegisterData} />
    </div>
  );
}
