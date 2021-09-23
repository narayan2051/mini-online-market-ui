import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, ID, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { ORDINAL_NUMBERS, SAFE_MOTHERHOOD_VILLAGE_CLINIC_SERVICE_CODE, VILLAGE_DARTA_NUMBERS_LIST } from "../../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import SurakshitMatrittoSewaRegister from "../../../components/registers/village-clinic-register/surakshit-matritto-sewa-register/SurakshitMatrittoSewaRegister";
import styles from "./style";

export default function SurakshitMatrittoSewa(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const [showModal, setShowModal] = useState(false);
  const [registerData, setRegisterData] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [modalTitle, setModalTitle] = useState("सुरक्षित मातृत्व सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [totalIronFolicCount, setTotalIronFolicCount] = useState();
  const [showPatientGeneralDetail, setShowPatientGeneralDetail] = useState(false);
  const [dartaaNumber, setDartaaNumber] = useState("");
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const { register, setValue, handleSubmit, reset, errors, unregister } = useForm();
  const [gravidaDetailInformation, setGravidaDetailInformation] = useState({});
  const [parityDetailInformation, setParityDetailInformation] = useState({});
  const [lmpDateDetailInformation, setLmpDateDetailInformation] = useState({});
  const [vitaminADetailInformation, setVitaminADetailInformation] = useState({});
  const [wormDetailInformation, setWormDetailInformation] = useState({});
  const [previousCheckDetail, setPreviousCheckDetail] = useState([]);

  const communityClinicId = AppUtils.getUrlParam(ID);

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "wormMedicine" });
    register({ name: "vitaminADistribution" })
    attachVillageClinicDartaaNumbers();
    getRegisterDataFromClinicId();
  }, [register])

  useEffect(() => {
    ((JSON.stringify(lmpDateDetailInformation) === "{}") || lmpDateDetailInformation.editable) ? register({ name: "lmpDate" }, { required: true }) : unregister("lmpDate");
  }, [register, lmpDateDetailInformation])

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

  useEffect(() => {
    if (dartaaNumber) {
      findPatientDetails(dartaaNumber);
    }
  }, [dartaaNumber])

  const findPatientDetails = (patientDartaaNumber, id) => {
    HMIS.get(API_URL.surakshitMatrittoSewaRegister + "/editable-fields?communityClinicId=" + communityClinicId + "&villageClinicDartaaNumber=" + patientDartaaNumber + "&id=" + (id || ""))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setShowPatientGeneralDetail(true);
          setGravidaDetailInformation(jsondata.data.gravidaDetail || {});
          setParityDetailInformation(jsondata.data.parityDetail || {});
          setLmpDateDetailInformation(jsondata.data.lmpDetail || {});
          setVitaminADetailInformation(jsondata.data.vitaminADetail || {});
          setWormDetailInformation(jsondata.data.wormMedicineDetail || {});
          setPreviousCheckDetail(jsondata.data.surakshitMatrittoPreviousCheckDetail || []);
          if (id) {
            jsondata.data.surakshitMatrittoSewaRegister.id = id;
            jsondata.data.surakshitMatrittoSewaRegister.palikaName = jsondata.data.surakshitMatrittoSewaRegister.palikaName && AppMisc.getMunicipalityName(jsondata.data.surakshitMatrittoSewaRegister.palikaName);
            setModalDefaultValues(jsondata.data.surakshitMatrittoSewaRegister);
            setValue("villageClinicDartaaNumber", jsondata.data.surakshitMatrittoSewaRegister.villageClinicDartaaNumber);
            setValue("ageUnit", jsondata.data.surakshitMatrittoSewaRegister.ageUnit);
            setShrinkLabel(true);
            setModalTitle(EDIT_SELECTED_RECORD);
            setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.surakshitMatrittoSewaRegister.ageUnit));
            setShowModal(true);
          } else {
            delete (jsondata.data.villageClinicRegistrationRegister.id);
            updatePatientDetails(jsondata.data.villageClinicRegistrationRegister);
          }
        } else {
          AddAlertMessage({ type: jsondata.type, message: jsondata.message })
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));

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
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all?sewaType=" + SAFE_MOTHERHOOD_VILLAGE_CLINIC_SERVICE_CODE + "&communityClinicId=" + communityClinicId)
      .then(response => {
        var data = response.data.objectList;
        if (response.data.type === SUCCESS) {
          SessionStorage.setItem(VILLAGE_DARTA_NUMBERS_LIST, data);
          data.forEach(item => {
            villageClinicDartaaNumbers.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
          });
          setVillageClinicDartaaNumbers(villageClinicDartaaNumbers);
          props.afterAttachDartaaNumber(false);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleVillageClinicDartaaNumberChange = (name, value) => {
    setDartaaNumber(value)
  };

  const getRegisterDataFromClinicId = () => {
    HMIS.get(API_URL.surakshitMatrittoSewaRegister + "/clinicId/" + communityClinicId)
      .then(response => {
        setRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.communityClinicId = modalDefaultValues.communityClinicId || communityClinicId;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.lmpDate = data.lmpDate && DateUtils.getDateMilliseconds(data.lmpDate);
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.surakshitMatrittoSewaRegister, data).then(response => {
      if (response.data.type === "success") {
        closeModal();
        getRegisterDataFromClinicId();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const closeModal = () => {
    setModalDefaultValues({});
    reset();
    setDartaaNumber("");
    setShowModal(false);
    setModalTitle("सुरक्षित मातृत्व सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setAgeUnitLabel("");
    setTotalIronFolicCount();
    setWormDetailInformation({});
    setPreviousCheckDetail([]);
    setGravidaDetailInformation({});
    setLmpDateDetailInformation({});
    setVitaminADetailInformation({});
    setParityDetailInformation({});
    setShowPatientGeneralDetail(false);
  }

  const handleMenstruationDateChange = date => {
    setValue("lmpDate", date);
  }

  const handleCustomSelectChange = (name, value) => {
    setValue(name, value);
  }

  const getOrdinalNumberLabel = (number) => {
    return ORDINAL_NUMBERS.find(obj => obj.value === number)?.label || number;
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">सुरक्षित मातृत्व सेवा</Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeModal}
        maxWidth="lg"
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
              <CustomReactSelect
                label="गाउँघर क्लिनिक दर्ता नं."
                options={villageClinicDartaaNumbers}
                defaultValue={modalDefaultValues.villageClinicDartaaNumber}
                name="villageClinicDartaaNumber"
                onChange={handleVillageClinicDartaaNumberChange}
                isClearable={false}
              />
              {errors.villageClinicDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showPatientGeneralDetail && (
              <div>
                <Grid item xs>
                  <TextField
                    InputProps={{ readOnly: true }}
                    label="गर्भवतीको नाम"
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
                    label="गर्भवतीको थर"
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
              </div>
            )}
          </Grid>
          {showPatientGeneralDetail && (
            <div>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    label="जाति कोड"
                    name="casteCode"
                    defaultValue={modalDefaultValues.casteCode}
                    options={CASTE_CODES}
                    onChange={handleCustomSelectChange}
                    isDisabled
                  />
                  {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <CustomReactSelect
                    label="लिङ्ग"
                    name="gender"
                    defaultValue={modalDefaultValues.gender}
                    options={GENDER_OPTIONS}
                    onChange={handleCustomSelectChange}
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
                <Grid item xs>
                  <CustomReactSelect
                    name="district"
                    label="जिल्ला"
                    options={districtOptions}
                    onChange={handleCustomSelectChange}
                    defaultValue={modalDefaultValues.district}
                    isDisabled
                  />
                  {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
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
            </div>
          )}
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            {((JSON.stringify(gravidaDetailInformation) === "{}") || gravidaDetailInformation.editable) ? (
              <Grid item xs>
                <TextField
                  type="number"
                  label="Gravida"
                  name="gravida"
                  defaultValue={gravidaDetailInformation.value}
                  variant="outlined"
                  inputRef={register({
                    min: 0,
                    required: true
                  })}
                  size="small"
                  fullWidth
                />
                {errors.gravida && errors.gravida.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                {errors.gravida && errors.gravida.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
              </Grid>
            ) : (
              <Grid item xs>
                <Typography variant="subtitle2">Gravida : {gravidaDetailInformation.value} (रजिस्टरमा थपिएको मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(gravidaDetailInformation.date))})</Typography>
              </Grid>
            )}
            {((JSON.stringify(parityDetailInformation) === "{}") || parityDetailInformation.editable) ? (
              <Grid item xs>
                <TextField
                  label="Parity"
                  type="number"
                  name="para"
                  defaultValue={parityDetailInformation.value}
                  variant="outlined"
                  inputRef={register({
                    min: 0,
                    required: true
                  })}
                  size="small"
                  fullWidth
                />
                {errors.para && errors.para.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                {errors.para && errors.para.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
              </Grid>
            ) : (
              <Grid item xs>
                <Typography variant="subtitle2">Parity : {parityDetailInformation.value} (रजिस्टरमा थपिएको मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(parityDetailInformation.date))})</Typography>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            {((JSON.stringify(lmpDateDetailInformation) === "{}") || lmpDateDetailInformation.editable) ? (
              <Grid item xs>
                <Tooltip title="आखिरी रजस्वला भएको पहिलो (LMP) मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      variant="outlined"
                      name="lmpDate"
                      defaultDate={lmpDateDetailInformation.value && DateUtils.getDateFromMilliseconds(Number(lmpDateDetailInformation.value))}
                      onDateSelect={handleMenstruationDateChange}
                      placeholder="LMP मिति"
                      hideLabel
                    />
                  </Box>
                </Tooltip>
                {errors.lmpDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            ) : (
              <Grid item xs>
                <Typography variant="subtitle2">LMP मिति : {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(Number(lmpDateDetailInformation.value)))} (रजिस्टरमा थपिएको मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(lmpDateDetailInformation.date))})</Typography>
              </Grid>
            )}
            {((JSON.stringify(vitaminADetailInformation) === "{}") || vitaminADetailInformation.editable) ? (
              <Grid item xs>
                <CustomReactSelect
                  label="भिटामिन ए वितरण गरेको"
                  name="vitaminADistribution"
                  defaultValue={vitaminADetailInformation.value}
                  options={YES_NO_OPTIONS}
                  onChange={handleCustomSelectChange}
                />
              </Grid>
            ) : (
              <Grid item xs>
                <Typography variant="subtitle2">भिटामिन ए वितरण गरेको : {vitaminADetailInformation.value === "YES" ? "छ" : "छैन"} (रजिस्टरमा थपिएको मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(vitaminADetailInformation.date))})</Typography>
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            {((JSON.stringify(wormDetailInformation) === "{}") || wormDetailInformation.editable) ? (
              <Grid item xs>
                <CustomReactSelect
                  label="जुकाको औषधी वितरण गरेको"
                  name="wormMedicine"
                  defaultValue={wormDetailInformation.value}
                  options={YES_NO_OPTIONS}
                  onChange={handleCustomSelectChange}
                />
              </Grid>
            ) : (
              <Grid item xs>
                <Typography variant="subtitle2">जुकाको औषधी वितरण गरेको : {wormDetailInformation.value === "YES" ? "छ" : "छैन"} (रजिस्टरमा थपिएको मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(wormDetailInformation.date))})</Typography>
              </Grid>
            )}
            <Grid item xs></Grid>
          </Grid>
        </Box>
        <Box className={classes.pregnancyServiceDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">गर्भवती सेवा तथा जाँच विवरण</Typography>
          </Box>

          <Grid container spacing={2} alignItems="center" className={classes.row}>
            {previousCheckDetail.length !== 0 && previousCheckDetail.map((row, index) => (
              <Grid item xs={6} key={index}>
                <Typography variant="subtitle2">{(row.pregnancyCheckTimes && ("गर्भवती जाँच पटक: " + getOrdinalNumberLabel(row.pregnancyCheckTimes) + ", ")) || ""} {(row.pregnancyCheckMonth) && ("गर्भवती जाँच महिना: " + getOrdinalNumberLabel(row.pregnancyCheckMonth) + ", ") || ""} {(row.ironChakki && ("आईरान चक्की: " + AppUtils.replaceWithNepaliDigit(row.ironChakki) + " वटा, ") || "")} {((row.ironChakki || row.pregnancyCheckMonth || row.pregnancyCheckTimes) && ("जाँचेको मिति: " + AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.serviceTakenDate)))) || ""}</Typography>
              </Grid>
            ))}
          </Grid>
          <Box className={classes.pregnancyServiceDetailsContainer}>
            <Typography variant="subtitle2">गर्भवती जाँच</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  label="महिना"
                  type="number"
                  name="pregnancyTestMonth"
                  defaultValue={modalDefaultValues.pregnancyTestMonth || ""}
                  variant="outlined"
                  inputRef={register({ min: 0 })}
                  size="small"
                  fullWidth
                />
                {errors.pregnancyTestMonth && errors.pregnancyTestMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  label="पटक"
                  name="pregnancyTestCount"
                  defaultValue={modalDefaultValues.pregnancyTestCount || ""}
                  variant="outlined"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.pregnancyTestCount && errors.pregnancyTestCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
              </Grid>
            </Grid>
            <Typography variant="subtitle2">आईरान चक्की वितरण</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  label="आईरान चक्की"
                  type="number"
                  name="ironChakki"
                  defaultValue={modalDefaultValues.ironChakki || ""}
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="गर्भवती महिलाको अवस्था"
                  name="pregnantWomenSituation"
                  defaultValue={modalDefaultValues.pregnantWomenSituation}
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs>
              </Grid>
            </Grid>
            <Typography variant="subtitle2">सुत्केरी सेवा</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  label="सुत्केरी भएको(....)औं दिन"
                  name="deliveryDays"
                  defaultValue={modalDefaultValues.deliveryDays || ""}
                  variant="outlined"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.deliveryDays && errors.deliveryDays.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  label="वितरण गरेको आइरन चक्की संख्या"
                  name="ironFolicTotalCount"
                  defaultValue={modalDefaultValues.ironFolicTotalCount || ""}
                  variant="outlined"
                  onChange={(event) => setTotalIronFolicCount(event.target.value || undefined)}
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.ironFolicTotalCount && errors.ironFolicTotalCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  label="सुत्केरी महिलाको अवस्था"
                  name="sutkeriWomenCondition"
                  defaultValue={modalDefaultValues.sutkeriWomenCondition}
                  variant="outlined"
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>

            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  label="उपचार/सल्लाह/परामर्श/प्रेषण"
                  name="treatmentAdvice"
                  variant="outlined"
                  defaultValue={modalDefaultValues.treatmentAdvice}
                  inputRef={register}
                  size="small"
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs>
                <TextField
                  label="कैफियत"
                  name="remarks"
                  defaultValue={modalDefaultValues.remarks}
                  variant="outlined"
                  inputRef={register({
                    required: Number(totalIronFolicCount) < 45
                  })}
                  size="small"
                  fullWidth
                />
                {errors.remarks && <span className="error-message">आइरन चक्की संख्या ४५ भन्दा कम हुनुको कारण खुलाउनुहोस ।</span>}
              </Grid>
              <Grid item xs></Grid>
            </Grid>
          </Box>
        </Box>
      </CustomModal>
      <SurakshitMatrittoSewaRegister tableData={registerData} showActionColumn={registerData.length !== 0} onEditRow={findPatientDetails} />
    </div>
  )
}