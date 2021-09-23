import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
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
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../utils/constants";
import { MUL_DARTA_NUMBERS_LIST, SAFE_ABORTION_ACCEPTED_FP_METHODS_CODES, SAFE_ABORTION_CAC_PAC, SAFE_ABORTION_PAC_CLIENTS_DIAGNOSIS_CODES, SAFE_ABORTION_PROCEDURE_CODES, SAFE_ABORTION_REFERRED_FROM_CODES, SAFE_MOTHERHOOD_MAIN_REGISTER_SERVICE_CODE } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import SafeAbortionServiceRegister from "../../components/registers/safe-abortion-service-register/SafeAbortionServiceRegister";
import styles from "./style";

export default function SafeAbortionService(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const [showSafeAbortionModal, setShowSafeAbortionModal] = useState(false);
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [safeAbortionRegisterData, setSafeAbortionRegisterData] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("सुरक्षित गर्भपतन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [registerDate, setRegisterDate] = useState({ fromDate: null, toDate: null });

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "procedureCode" });
    register({ name: "pacClientsDiagnosis" });
    register({ name: "acceptedFpMethod" });
    register({ name: "referredFrom" });
    register({ name: "cacOrPacOutcome" });
    register({ name: "painManagementGiven" });
    attachMulDartaaOptions();
  }, [register]);

  const handleRegisterDateFromSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        fromDate: date
      }));
  }
  const handleRegisterDateToSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        toDate: date
      }));
  }

  useEffect(() => {
    registerDate.fromDate && registerDate.toDate &&
      getRegisterData();
  }, [registerDate])

  const getRegisterData = () => {
    HMIS.get(API_URL.safeAbortionServiceRegister + "/dartaaMiti?fromDate=" + DateUtils.getDateMilliseconds(registerDate.fromDate)
      + "&&toDate=" + DateUtils.getDateMilliseconds(registerDate.toDate)).then(response => {
        setSafeAbortionRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
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
    HMIS.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers?sewaType=" + SAFE_MOTHERHOOD_MAIN_REGISTER_SERVICE_CODE)
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

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.safeAbortionServiceRegister, data).then(response => {
      if (response.data.type === "success") {
        setShowSafeAbortionModal(false);
        getRegisterData();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });

  }

  const closeSafeAbortionModal = () => {
    reset();
    setModalDefaultValues({});
    setShowSafeAbortionModal(false);
    setModalTitle("सुरक्षित गर्भपतन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setMulDartaaLabel(null);
    setAgeUnitLabel("");
    setShrinkLabel(undefined);
  }

  const handleRowEdit = id => {
    HMIS.get(API_URL.safeAbortionServiceRegister + "/" + id).then(response => {
      response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
      response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
      setModalDefaultValues(response.data);
      setShrinkLabel(true);
      setModalTitle(EDIT_SELECTED_RECORD);
      setShowSafeAbortionModal(true);
      setValue("mulDartaaNumber", response.data.mulDartaaNumber);
      setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
      setValue("ageUnit", response.data.ageUnit);
      setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  return (<div>
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
      <Typography variant="h5">
        सुरक्षित गर्भपतन सेवा रजिष्टर
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
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowSafeAbortionModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
      </Box>
    </Box>
    <CustomModal
      title={modalTitle}
      showModal={showSafeAbortionModal}
      onModalSubmit={handleSubmit(onSubmit)}
      onModalClose={closeSafeAbortionModal}
      fullScreen
    >
      <Box className={classes.generalInfo}>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="सेवा प्रदान गरेको मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control input-sm full-width" name="dartaaMiti" defaultDate={modalDefaultValues.dartaaMiti || true} onDateSelect={(date) => { handleDartaaMitiChange(date) }} placeholder="सेवा प्रदान गरेको मिति" hideLabel />
                {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
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
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="सेवाग्राही महिलाले पूरा गरेको शैक्षिक योग्यता यस फिल्डमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                name="education"
                label="Education"
                variant="outlined"
                defaultValue={modalDefaultValues.education}
                size="small"
                fullWidth
                inputRef={register({
                  required: true
                })}
              />
            </Tooltip>
            {errors.education && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="सेवाग्राही महिलावाट जन्मेकामध्ये हाल जीवित बच्चाहरूको संख्या यस फिल्डमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                name="numberOfLivingChildren"
                label="No of living children"
                variant="outlined"
                type="number"
                defaultValue={modalDefaultValues.numberOfLivingChildren}
                size="small"
                fullWidth
                inputRef={register({
                  required: true,
                  min: 0
                })}
              />
            </Tooltip>
            {errors.numberOfLivingChildren && errors.numberOfLivingChildren.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.numberOfLivingChildren && errors.numberOfLivingChildren.type === "min" && <span className="error-message">{GREATER_THAN_ZERO}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="सेवाग्राही महिलाको गर्भको अवधि पछिल्लो पटक महिनाबारी भएको दिनका आधारमा गणना गरी यस फिल्डमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                name="gestationByLmp"
                type="number"
                label="Gestation By LMP"
                placeholder="in weeks"
                variant="outlined"
                defaultValue={modalDefaultValues.gestationByLmp}
                size="small"
                fullWidth
                inputRef={register({
                  required: true,
                  min: 0
                })}
              />
            </Tooltip>
            {errors.gestationByLmp && errors.gestationByLmp.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            {errors.gestationByLmp && errors.gestationByLmp.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
          </Grid>
          <Grid item xs>
            <Tooltip title="सेवाग्राही महिलाको गर्भको अवधि पाठेघरको उचाइको जाँचको (Bi-manual Exam) आधारमा गणना गरी यस फिल्डमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                name="gestationOnExamination"
                type="number"
                label="Gestation On Examination"
                placeholder="in weeks"
                variant="outlined"
                defaultValue={modalDefaultValues.gestationOnExamination}
                size="small"
                fullWidth
                inputRef={register({
                  required: true,
                  min: 0
                })}
              />
            </Tooltip>
            {errors.gestationOnExamination && errors.gestationOnExamination.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            {errors.gestationOnExamination && errors.gestationOnExamination.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="Procedure Code"
              name="procedureCode"
              variant="outlined"
              size="small"
              value={modalDefaultValues.procedureCode}
              options={SAFE_ABORTION_PROCEDURE_CODES}
              onChange={handleCustomSelectChange}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="Pain Management Given"
              name="painManagementGiven"
              variant="outlined"
              size="small"
              value={modalDefaultValues.painManagementGiven}
              options={YES_NO_OPTIONS}
              onChange={handleCustomSelectChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.abortionDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">Surgical/Medical Abortion and PAC Clients</Typography>
        </Box>
        <Box className={classes.abortionClientDetailsContainer}>
          <Typography variant="subtitle2">Surgical Abortion (Medical Vacuum Aspiration) Clients Complication</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Tooltip title="सर्जिकल गर्भपतन गरिएका सेवाग्राहीलाई तत्कालीन जटिलता भई १ पिन्ट भन्दा बढी रगत दिनुपर्ने भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Heavy bleeding requiring blood transfusion"
                  control={<Checkbox name="saHeavyBleedingRequiringTransfusion"
                    defaultChecked={modalDefaultValues.saHeavyBleedingRequiringTransfusion}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="सर्जिकल गर्भपतन गरिएका सेवाग्राहीलाई तत्कालीन जटिलता (Uterine/Intra-uterine injury) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Uterine/Intra-abdominal injury requiring laprotomy"
                  control={<Checkbox name="saUterineOrIntraAbdominalInjuryRequiringLaprotomy"
                    defaultChecked={modalDefaultValues.saUterineOrIntraAbdominalInjuryRequiringLaprotomy}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={4}>
              <Tooltip title="सर्जिकल गर्भपतन सेवाग्राहीलाई फलोअप भेटमा आउँदाको जटिलता (Infection requiring hospitalization/IV antibiotics) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Infection requiring hospitalization/IV antibiotics"
                  control={<Checkbox name="saInfectionRequiringHospitalizationOrIvAntibiotics"
                    defaultChecked={modalDefaultValues.saInfectionRequiringHospitalizationOrIvAntibiotics}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={4}>
              <Tooltip title="सर्जिकल गर्भपतन सेवाग्राहीलाई फलोअप भेटमा आउँदाको जटिलता (Incomplete evacuation requiring repeat procedure) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Ongoing pregnancy"
                  control={<Checkbox name="saOnGoingPregnancy"
                    defaultChecked={modalDefaultValues.saOnGoingPregnancy}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
          <Typography variant="subtitle2">Medical Abortion (MA) Clients Status of abortion follow-up</Typography>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <RadioGroup name="statusOfAbortionFollowUp" defaultValue={modalDefaultValues.statusOfAbortionFollowUp} row>
                <FormControlLabel
                  value="COMPLETED"
                  control={<Radio color="primary" />}
                  label="Complete"
                  inputRef={register}
                  classes={{
                    label: classes.radioLabelSmall,
                  }}
                />
                <FormControlLabel
                  value="NOT_COMPLETED"
                  control={<Radio color="primary" />}
                  label="Not Complete"
                  inputRef={register}
                  classes={{
                    label: classes.radioLabelSmall,
                  }}
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <Typography variant="subtitle2">Medical Abortion (MA) Clients Complications</Typography>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="मेडिकल गर्भपतन गराएका सेवाग्राही फलोअप भेटमा आउँदाको जटिलता (Heavy Bleeding requiring blood transfusion) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Heavy bleeding requiring blood transfusion"
                  control={<Checkbox name="maHeavyBleedingRequiringTransfusion"
                    defaultChecked={modalDefaultValues.maHeavyBleedingRequiringTransfusion}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="मेडिकल गर्भपतन गराएका सेवाग्राही फलोअप भेटमा आउँदाको जटिलता (Infection requiring hospitalization/IV antibiotics) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Infection requiring hospitalization/IV antibiotics"
                  control={<Checkbox name="maInfectionRequiringHospitalizationOrIvAntibiotics"
                    defaultChecked={modalDefaultValues.maInfectionRequiringHospitalizationOrIvAntibiotics}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="मेडिकल गर्भपतन गराएका सेवाग्राही फलोअप भेटमा आउँदाको जटिलता (Incomplete evacuation requiring repeat procedure) भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="Ongoing pregnancy"
                  control={<Checkbox name="maOnGoingPregnancy"
                    defaultChecked={modalDefaultValues.maOnGoingPregnancy}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Typography variant="subtitle2">PAC clients (From outside)</Typography>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="pacClientsDiagnosis"
                label="Diagnosis (1-3)"
                options={SAFE_ABORTION_PAC_CLIENTS_DIAGNOSIS_CODES}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.pacClientsDiagnosis}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs></Grid>
          </Grid>
          <Typography variant="subtitle2">All clients</Typography>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="acceptedFpMethod"
                label="Accepted FP Methods (1-7)"
                options={SAFE_ABORTION_ACCEPTED_FP_METHODS_CODES}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.acceptedFpMethod}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="referredFrom"
                label="Referred from (1-3)"
                options={SAFE_ABORTION_REFERRED_FROM_CODES}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.referredFrom}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="cacOrPacOutcome"
                label="Outcome of CAC/PAC"
                options={SAFE_ABORTION_CAC_PAC}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.cacOrPacOutcome}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={classes.serviceProviderDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">Details of service provider</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              name="serviceProviderName"
              label="Name"
              variant="outlined"
              defaultValue={modalDefaultValues.serviceProviderName}
              inputRef={register({
                required: true
              })}
              size="small"
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
            {errors.serviceProviderName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              name="serviceProviderListedNumber"
              label="Listed no"
              variant="outlined"
              defaultValue={modalDefaultValues.serviceProviderListedNumber}
              inputRef={register({
                required: true
              })}
              size="small"
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
            {errors.serviceProviderListedNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              name="remarks"
              label="Remarks"
              variant="outlined"
              defaultValue={modalDefaultValues.remarks}
              inputRef={register}
              size="small"
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
    <SafeAbortionServiceRegister tableData={safeAbortionRegisterData} showActionColumn={safeAbortionRegisterData.length !== 0} onEditRow={handleRowEdit} />
  </div>
  );
}
