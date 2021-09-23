import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomReactSelect from "../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, PATIENT_TYPES, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../utils/constants";
import { FREE_SERVICE_CODE, ICD_CODE_OPTIONS, MUL_DARTA_NUMBERS_LIST, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import OutPatientRegister from "../../components/registers/out-patient-register/OutPatientRegister";
import styles from "./style";

export default function OutPatient() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [openOutPatientModal, setOpenOutPatientModal] = useState(false);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("बहिरङ्ग सेवा रजिष्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [icdCodeLabel, setIcdCodeLabel] = useState();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const [registerData, setRegisterData] = useState([]);
  const [registerDate, setRegisterDate] = useState({
    fromDate: null,
    toDate: null
  });

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "patientType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "freeServiceCode" });
    register({ name: "icdCode" }, { required: true });
    attachMulDartaaOptions();
  }, [register]);

  useEffect(() => {
    registerDate.fromDate && registerDate.toDate &&
      getRegisterData();
  }, [registerDate])

  const closeOutPatientModal = () => {
    setModalDefaultValues({});
    reset();
    setOpenOutPatientModal(false);
    setModalTitle("बहिरङ्ग सेवा रजिष्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
    setIcdCodeLabel("");
  };

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.outPatient, data)
      .then(response => {
        if (response.data.type === "success") {
          closeOutPatientModal();
          getRegisterData();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  function handleRegisterFromDateSelect(date) {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        fromDate: date
      }));
  }
  function handleRegisterToDateSelect(date) {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        toDate: date
      }));
  }

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  function handleFreeServiceCodeChange(freeServiceCode) {
    setValue("freeServiceCode", freeServiceCode);
  }

  function handleICDCodeChange(icdCode) {
    setValue("icdCode", icdCode.value);
    setIcdCodeLabel(icdCode ? icdCode : "");
  }

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
    HMIS.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers?sewaType=" + OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE)
      .then(response => {
        var data = response.data;
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

  const getRegisterData = () => {
    HMIS.get(API_URL.outPatient + "/dartaaMiti?fromDate=" + DateUtils.getDateMilliseconds(registerDate.fromDate) + "&&toDate=" + DateUtils.getDateMilliseconds(registerDate.toDate)).then(response => {
      setRegisterData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  function outPatientEditFunction(id) {
    HMIS.get(API_URL.outPatient + "/" + id).then(response => {
      response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
      response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
      setModalDefaultValues(response.data);
      setShrinkLabel(true);
      setModalTitle(EDIT_SELECTED_RECORD);
      setOpenOutPatientModal(true);
      setValue("mulDartaaNumber", response.data.mulDartaaNumber);
      setValue("icdCode", response.data.icdCode);
      setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
      setIcdCodeLabel(AppMisc.getIcdCodeObject(response.data.icdCode));
      setValue("ageUnit", response.data.ageUnit);
      setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">बहिरङ्ग सेवा रजिष्टर</Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterFromDateSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getDaysBeforeBSDate(30)} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterToDateSelect(date) }} labelText="दर्ता मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenOutPatientModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openOutPatientModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeOutPatientModal}
        maxWidth="lg"
      >
        <Box className={classes.opdInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="dartaaMiti"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={date => {
                      handleDartaaMitiChange(date);
                    }}
                    placeholder="दर्ता मिति"
                    defaultDate={modalDefaultValues.dartaaMiti || true}
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
              <CustomReactSelect
                name="patientType"
                label="दर्ताको प्रकार"
                options={PATIENT_TYPES}
                onChange={handleCustomReactSelectChange}
                defaultValue={modalDefaultValues.patientType || "NEW_PATIENT"}
                isDisabled={Boolean(modalDefaultValues.id)}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="सेवाग्राहीको नाम"
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="सेवाग्राहीको थर"
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
              <CustomReactSelect
                label="जाति कोड"
                name="casteCode"
                defaultValue={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCustomReactSelectChange}
                isDisabled
                fullWidth
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomReactSelect
                label="लिङ्ग"
                name="gender"
                defaultValue={modalDefaultValues.gender}
                options={GENDER_OPTIONS}
                onChange={handleCustomReactSelectChange}
                fullWidth
                isDisabled
              />
              {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="उमेर"
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
              <CustomReactSelect
                name="district"
                label="जिल्ला"
                options={districtOptions}
                onChange={handleCustomReactSelectChange}
                defaultValue={modalDefaultValues.district}
                isDisabled
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
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
              <Tooltip title="बिरामीको रोग निदान गर्ने क्रममा एक्स-रे, प्रयोगशाला वा अन्य जाचँ गरेको ब्यहोरा परीक्षण यसमा लेख्नुपर्दछ ।" placement="top" arrow>
                <TextField
                  label="अनुसन्धान मूलक परीक्षण"
                  name="researchOrientedTest"
                  variant="outlined"
                  defaultValue={modalDefaultValues.researchOrientedTest}
                  inputRef={register}
                  size="small"
                  multiline
                  fullWidth
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <CustomReactSelect
                label="नि:शुल्क सेवा कोड"
                name="freeServiceCode"
                defaultValue={modalDefaultValues.freeServiceCode}
                options={FREE_SERVICE_CODE}
                onChange={handleCustomReactSelectChange}
              />
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="प्रेषण भई आएको संस्थाको नाम"
                name="dispatchedFromOrganizationName"
                variant="outlined"
                defaultValue={
                  modalDefaultValues.dispatchedFromOrganizationName
                }
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="सम्भावित निदान"
                name="provisionalDiagnosis"
                variant="outlined"
                defaultValue={modalDefaultValues.provisionalDiagnosis}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
                multiline
              />
              {errors.provisionalDiagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="बहिरङ्ग सेवा अन्तर्गत उपचारको क्रममा गरिएको सानोतिनो सर्जिकल प्रक्रिया यसमा लेख्नुपर्दछ।">
                <TextField
                  label="Surgical Procedure"
                  name="surgicalProcedure"
                  variant="outlined"
                  defaultValue={modalDefaultValues.surgicalProcedure}
                  inputRef={register}
                  size="small"
                  fullWidth
                  multiline
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                label="सिकायत र निदान"
                name="complaintOrDiagnosis"
                variant="outlined"
                defaultValue={modalDefaultValues.complaintOrDiagnosis}
                inputRef={register}
                size="small"
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="प्रेषण भई गएको संस्थाको नाम"
                name="dispatchedOrganizationName"
                variant="outlined"
                defaultValue={
                  modalDefaultValues.dispatchedOrganizationName
                }
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="उपचार र सल्लाह"
                name="treatmentAndAdvice"
                variant="outlined"
                defaultValue={modalDefaultValues.treatmentAndAdvice}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
                multiline
              />
              {errors.treatmentAndAdvice && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="सेवाग्राही यदी लैङ्गिक हिंसा बाट पीडित भई सेवा लिन आएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  label="लैङ्गिक हिंसा"
                  control={
                    <Checkbox
                      name="genderViolence"
                      defaultChecked={modalDefaultValues.genderViolence}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Tooltip>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
      </CustomModal>
      <OutPatientRegister tableData={registerData} showActionColumn={registerData.length !== 0} onEditRow={outPatientEditFunction.bind(this)} />
    </div>
  );
}
