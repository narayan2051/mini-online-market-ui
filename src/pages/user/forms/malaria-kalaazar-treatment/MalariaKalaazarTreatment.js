import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomDrawer from "../../../../components/custom-drawer/CustomDrawer";
import CustomReactSelect from "../../../../components/custom-react-select/CustomReactSelect";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES } from "../../../../utils/constants";
import { IMCI_MAIN_REGISTER_SERVICE_CODE, KALAAZAR_MEDICATIONS, KALAAZAR_TESTS, KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE, MALARIA_CATEGORY_CODES, MALARIA_KAALAZAR_REGISTER_TYPE, MALARIA_KAALAZAR_TREATMENT_REGISTER_TYPE, MALARIA_KALAAZAR_TREATMENT_OPTIONS, MALARIA_MEDICATIONS, MALARIA_TYPE, MUL_DARTA_NUMBERS_LIST, OTHER, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, RESISTIVITY_LEVEL_OPTIONS, SAMPLE_SOURCE_FOR_MALARIA_OPTIONS, SEVERE_MALARIA_PATIENT_OPTIONS } from "../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import AddMedicineList from "../../components/add-medicine-list/AddMedicineList";
import MalariaKalaazarTreatmentRegister from "../../components/registers/malaria-kalaazar-treatment/MalariaKalaazarTreatmentRegister";
import CustomRow from "./helpers/CustomRow";
import styles from "./style";

export default function MalariaKalaazarTreatmentForm() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset, getValues } = useForm();
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [id, setId] = useState();
  const [approvedStatus, setApprovedStatus] = useState(false);
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showMalariaKalaazarModal, setShowMalariaKalaazarModal] = useState(false);
  const [showTreatmentAndCounseling, setShowTreatmentAndCounseling] = useState(false);
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });

  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState('औलो तथा कालाजार उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।');
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [pendingApprovalRecords, setPendingApprovalRecords] = useState([]);
  const [showMalariaReportField, setShowMalariaReportField] = useState(false);
  const [isRegisterTypeKalaazar, setIsRegisterTypeKalaazar] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [medicineObjectList, setMedicineObjectList] = useState([]);
  const [isForeigner, setIsForeigner] = useState(false);
  const [initialRegisterType, setInitialRegisterType] = useState("");
  const [hasLaboratoryRegisterId, setHasLaboratoryRegisterId] = useState(false);
  const [showOtherKaalazarTestField, setShowOtherKaalazarTestField] = useState(false);
  const [registerType, setRegisterType] = useState("ALL");

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true })
    register({ name: "specimenSource" }, { required: true });
    register({ name: "slideReceivedDate" });
    register({ name: "slideTestedDate" });
    register({ name: "rdtOrRkThirtyNineTestedDate" });
    register({ name: "treatmentStartDate" });
    register({ name: "malariaSpecies" });
    register({ name: "categoryCode" });
    register({ name: "malariaPatientFirstFollowUpDate" });
    register({ name: "dateOfDeath" });
    register({ name: "nationalityOfDeadPatient" });
    register({ name: "treatmentTypes" }, { required: true, validate: value => value.length > 0 });
    register({ name: "registerType" }, { required: true });
    register({ name: "resistivity" }, { required: showMalariaReportField });
    register({ name: "kalaazarTest" });
    register({ name: "severeMalariaCaseType" });
  }, [register, showMalariaReportField]);

  useEffect(() => {
    attachMulDartaaOptions();
  }, [])

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getMalariaKalaazarTreatmentRegisterData();
  }, [sewaDartaaRegisterDate, registerType]);

  useEffect(() => {
    getUnApprovedRecords();
  }, []);

  const getUnApprovedRecords = () => {
    HMIS.get(API_URL.malariaKalaazarLaboratoryRegister + "/get-pending-approval-records?registerType=MALARIA").then(response => {
      setPendingApprovalRecords(response.data.objectList);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });

  }

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

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleCustomReactSelectChange = (name, value) => {
    if (name === "kalaazarTest") {
      setShowOtherKaalazarTestField(value === OTHER)
    }
    setValue(name, value);
  }

  const handleRegisterSelectChange = (name, value) => {
    initialRegisterType !== value && setMedicineObjectList([]);
    setShowMalariaReportField(value === "MALARIA");
    setIsRegisterTypeKalaazar(value === "KALAAZAR");
    setShowTreatmentAndCounseling(value !== "");
    setMedicineOptions(value === "MALARIA" ? MALARIA_MEDICATIONS : value === "KALAAZAR" ? KALAAZAR_MEDICATIONS : []);
    setValue(name, value);
  }

  const handleSlideReceivedDateChange = date => {
    setValue("slideReceivedDate", date);
  }

  const handleSlideTestedDateChange = date => {
    setValue("slideTestedDate", date);
  }
  const handleRdtOrRkThirtyNineTestedDateChange = date => {
    setValue("rdtOrRkThirtyNineTestedDate", date);
  }
  const handleTreatmentStartDateChange = date => {
    setValue("treatmentStartDate", date);
  }

  const handleMalariaFirstFollowUpChange = date => {
    setValue("malariaPatientFirstFollowUpDate", date);
  }

  const handleDateOfDeathChange = date => {
    setValue("dateOfDeath", date);
  }

  const handleApprovedStatusChange = (id) => {
    setId(id);
    setApprovedStatus(true);
    setConfirmationModalTitle("के तपाई यो रेकर्ड उपचार रजिष्टरमा थप्न चाहनुहुन्छ ?");
    setShowApprovalModal(true);
  }

  const handleUnapprovedStatusChange = (id) => {
    setId(id);
    setConfirmationModalTitle("के तपाई यो रेकर्ड उपचार रजिष्टरबाट हटाउन चाहनुहुन्छ ?");
    setShowApprovalModal(true);
  }

  const closeModal = () => {
    setId();
    setApprovedStatus(false);
    setShowApprovalModal(false);
  }

  const submitApprovedStatus = () => {
    let postData = {
      id: id,
      approved: approvedStatus,
    }

    HMIS.post(API_URL.malariaKalaazarLaboratoryRegister + "/update-approval-status", postData)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getUnApprovedRecords();
          getMalariaKalaazarTreatmentRegisterData();
          setShowApprovalModal(false);
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    setIsForeigner(patientDetails.foreigner);

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
    HMIS.get(API_URL.mulDartaaRegister + "/dartaa-numbers?sewaTypes=" + [OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, IMCI_MAIN_REGISTER_SERVICE_CODE, KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE])
      .then(response => {
        var data = response.data.objectList;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const handleMulDartaaChange = (name, value, mulDartaaOption) => {
    let mulDartaaNumbers = SessionStorage.getItem(MUL_DARTA_NUMBERS_LIST);
    if (mulDartaaNumbers) {
      let muldartaaNumberInfo = mulDartaaNumbers.find(obj => obj.dartaaNumber === mulDartaaOption.value);
      muldartaaNumberInfo ? updatePatientDetails(muldartaaNumberInfo) : getDetailsByMulDartaaNumber(mulDartaaOption.value);
    } else {
      getDetailsByMulDartaaNumber(mulDartaaOption.value)
    }
  };

  const handleRegisterTypeChange = (name, value) => {
    setRegisterType(value);
  }

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
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.slideReceivedDate = data.slideReceivedDate && DateUtils.getDateMilliseconds(data.slideReceivedDate);
    data.slideTestedDate = data.slideTestedDate && DateUtils.getDateMilliseconds(data.slideTestedDate);
    data.rdtOrRkThirtyNineTestedDate = data.rdtOrRkThirtyNineTestedDate && DateUtils.getDateMilliseconds(data.rdtOrRkThirtyNineTestedDate);
    data.treatmentStartDate = data.treatmentStartDate && DateUtils.getDateMilliseconds(data.treatmentStartDate);
    data.malariaPatientFirstFollowUpDate = data.malariaPatientFirstFollowUpDate && DateUtils.getDateMilliseconds(data.malariaPatientFirstFollowUpDate);
    data.dateOfDeath = data.dateOfDeath && DateUtils.getDateMilliseconds(data.dateOfDeath);
    data.medicineDetailList = medicineObjectList;
    data.foreigner = isForeigner;

    if (data.registerType !== "MALARIA") {
      delete data.malariaSpecies;
      delete data.malariaDensity;
      delete data.malariaStage;
      delete data.malariaPatientFirstFollowUpDate;
      delete data.severeMalariaCaseType;
      delete data.resistivity;
    }
    if (data.registerType !== "KALAAZAR") {
      delete data.isKalaazarPositive;
      delete data.kalaazarTest;
    }

    HMIS.post(API_URL.malariaAndKalaazar, data)
      .then(response => {
        response.data.type === "success" && closeMalariaKalaazarModal();
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        getMalariaKalaazarTreatmentRegisterData();
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const getMalariaKalaazarTreatmentRegisterData = () => {
    HMIS.get(API_URL.malariaAndKalaazar + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo) + "&registerType=" + registerType)
      .then(response => {
        if (response.data.type === SUCCESS)
          setMainRegisterData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const malariaKalaazarTreatmentEditFunction = (id) => {
    HMIS.get(API_URL.malariaAndKalaazar + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = jsondata.data.dartaaMiti && DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          jsondata.data.slideReceivedDate = jsondata.data.slideReceivedDate && DateUtils.getDateFromMilliseconds(jsondata.data.slideReceivedDate);
          jsondata.data.slideTestedDate = jsondata.data.slideTestedDate && DateUtils.getDateFromMilliseconds(jsondata.data.slideTestedDate);
          jsondata.data.rdtOrRkThirtyNineTestedDate = jsondata.data.rdtOrRkThirtyNineTestedDate && DateUtils.getDateFromMilliseconds(jsondata.data.rdtOrRkThirtyNineTestedDate);
          jsondata.data.treatmentStartDate = jsondata.data.treatmentStartDate && DateUtils.getDateFromMilliseconds(jsondata.data.treatmentStartDate);
          jsondata.data.malariaPatientFirstFollowUpDate = jsondata.data.malariaPatientFirstFollowUpDate && DateUtils.getDateFromMilliseconds(jsondata.data.malariaPatientFirstFollowUpDate);
          jsondata.data.dateOfDeath = jsondata.data.dateOfDeath && DateUtils.getDateFromMilliseconds(jsondata.data.dateOfDeath);
          jsondata.data.medicineDetailList && jsondata.data.medicineDetailList.length && setMedicineObjectList(jsondata.data.medicineDetailList);
          setModalDefaultValues(jsondata.data);
          setInitialRegisterType(jsondata.data.registerType);
          setIsRegisterTypeKalaazar(jsondata.data.registerType === "KALAAZAR");
          setHasLaboratoryRegisterId(Boolean(jsondata.data.malariaKalaazarLaboratoryRegisterId));
          setShrinkLabel(true);
          setModalTitle(EDIT_SELECTED_RECORD);
          setShowMalariaKalaazarModal(true);
          setValue("mulDartaaNumber", jsondata.data.mulDartaaNumber);
          setValue("treatmentTypes", jsondata.data.treatmentTypes);
          setValue("malariaSpecies", jsondata.data.malariaSpecies);
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const closeMalariaKalaazarModal = () => {
    reset({});
    setModalDefaultValues({});
    setShowMalariaKalaazarModal(false);
    setShowMalariaReportField(false);
    setIsRegisterTypeKalaazar(false);
    setShowTreatmentAndCounseling(false);
    setModalTitle("औलो तथा कालाजार उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setAgeUnitLabel("");
    setMedicineObjectList([]);
    setHasLaboratoryRegisterId(false);
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          औलो तथा कालाजार रोगको उपचार रजिष्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Grid item>
              <CustomReactSelect
                label="रजिष्टर"
                name="typeOfRegister"
                options={MALARIA_KAALAZAR_TREATMENT_REGISTER_TYPE}
                onChange={handleRegisterTypeChange}
                defaultValue={registerType}
                className={classes.registerTypeSelect}
                isClearable={false}
              />
            </Grid>
          </Box>
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowMalariaKalaazarModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showMalariaKalaazarModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeMalariaKalaazarModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="dartaaMiti" defaultDate={modalDefaultValues.dartaaMiti || true} onDateSelect={(date) => { handleDartaaMitiChange(date) }} placeholder="दर्ता मिति" hideLabel />
                  {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <CustomReactSelect
                label="मुल दर्ता नं."
                options={mulDartaaOptions}
                defaultValue={modalDefaultValues.mulDartaaNumber}
                name="mulDartaaNumber"
                onChange={handleMulDartaaChange}
                isClearable={false}
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
              <CustomReactSelect
                label="जाति कोड"
                name="casteCode"
                defaultValue={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCustomReactSelectChange}
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
                onChange={handleCustomReactSelectChange}
                isDisabled
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
              <CustomReactSelect
                name="district"
                label="जिल्ला"
                options={districtOptions}
                onChange={handleCustomReactSelectChange}
                defaultValue={modalDefaultValues.district}
                isDisabled
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
            <Grid item xs={2}>
              <TextField
                label="घरमुलिको नाम "
                size="small"
                name="gharmulikoName"
                variant="outlined"
                defaultValue={modalDefaultValues.gharmulikoName}
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <CustomReactSelect
                label="स्रोत"
                name="specimenSource"
                defaultValue={modalDefaultValues.specimenSource}
                options={SAMPLE_SOURCE_FOR_MALARIA_OPTIONS}
                onChange={handleCustomReactSelectChange}
              />
              {errors.specimenSource && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={2}>
              <CustomReactSelect
                name="registerType"
                label="औलो वा कालाजार"
                options={MALARIA_KAALAZAR_REGISTER_TYPE.filter(obj => obj.value !== "LEPROSY")}
                onChange={handleRegisterSelectChange}
                defaultValue={modalDefaultValues.registerType || registerType}
                isDisabled={hasLaboratoryRegisterId}
              />
              {errors.registerType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showMalariaReportField && (
              <div>
                <Grid item xs={2}>
                  <CustomReactSelect
                    label="रिसेप्टिभिटी"
                    name="resistivity"
                    defaultValue={modalDefaultValues.resistivity}
                    options={RESISTIVITY_LEVEL_OPTIONS}
                    onChange={handleCustomReactSelectChange}
                  />
                  {errors.resistivity && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="औलोको घनत्व"
                    size="small"
                    name="malariaDensity"
                    variant="outlined"
                    defaultValue={modalDefaultValues.malariaDensity}
                    inputRef={register}
                    InputLabelProps={{ shrink: shrinkLabel }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <CustomReactSelect
                    label="सिकिस्त औलोको रोगीको प्रकार"
                    name="severeMalariaCaseType"
                    defaultValue={modalDefaultValues.severeMalariaCaseType}
                    options={SEVERE_MALARIA_PATIENT_OPTIONS}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </div>
            )}
            <Grid item xs={2}>
              <CustomReactSelect
                label="निदान विधी"
                defaultValue={modalDefaultValues.treatmentTypes || []}
                onChange={handleCustomReactSelectChange}
                name="treatmentTypes"
                options={!isRegisterTypeKalaazar ? (MALARIA_KALAAZAR_TREATMENT_OPTIONS.filter(obj => obj.value !== "RK_39").map((option, index) => option)) : MALARIA_KALAAZAR_TREATMENT_OPTIONS.map((option, index) => option)}
                isMulti
              />
              {errors.treatmentTypes && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={2}>
              <CustomReactSelect
                label="वर्गिकरण"
                name="categoryCode"
                defaultValue={modalDefaultValues.categoryCode}
                options={MALARIA_CATEGORY_CODES}
                onChange={handleCustomReactSelectChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="औलो तथा कालाजार रोग लागेको बिरामी महिला भए गर्भवती भए/नभएको यकिन गरेर, यदि गर्भवती भएमा मात्र यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="गर्भवती"
                  control={<Checkbox name="pregnant"
                    defaultChecked={modalDefaultValues.pregnant}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="Kala-Azar Treatment Failure Case भएमा यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                <FormControlLabel
                  label="के.ए.टी.एफ."
                  control={<Checkbox name="katf" defaultChecked={modalDefaultValues.katf} variant="outlined" inputRef={register} color="primary" />}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.otherDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">{isRegisterTypeKalaazar ? "कालाजार" : "औलो"} उपचार सम्बन्धी विवरणहरू</Typography>
          </Box>
          {showMalariaReportField && (
            <div>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    label="औलोको किसिम"
                    defaultValue={modalDefaultValues.malariaSpecies || []}
                    onChange={handleCustomReactSelectChange}
                    name="malariaSpecies"
                    options={MALARIA_TYPE}
                    isMulti
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    label="औलोको अवस्था"
                    size="small"
                    name="malariaStage"
                    variant="outlined"
                    defaultValue={modalDefaultValues.malariaStage}
                    inputRef={register}
                    InputLabelProps={{ shrink: shrinkLabel }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <Tooltip title="औलो (pf) बिरामीको पहिलो फलोअप मिति" placement="top" arrow>
                    <Box>
                      <NepaliDate className="date-picker-form-control input-sm full-width" name="malariaPatientFirstFollowUpDate" defaultDate={modalDefaultValues.malariaPatientFirstFollowUpDate} onDateSelect={(date) => { handleMalariaFirstFollowUpChange(date) }} placeholder="औलो बिरामीको पहिलो फलोअप मिति" hideLabel />
                    </Box>
                  </Tooltip>
                </Grid>
                <Grid item xs>
                  <TextField
                    label="औलो (pf) बिरामीको पहिलो फलोअप नतिजा"
                    size="small"
                    name="malariaPatientFirstFollowUpResult"
                    variant="outlined"
                    defaultValue={modalDefaultValues.malariaPatientFirstFollowUpResult}
                    inputRef={register}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </div>
          )}
          {isRegisterTypeKalaazar && (
            <div>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    label="कालाजारको परीक्षण"
                    name="kalaazarTest"
                    defaultValue={modalDefaultValues.kalaazarTest}
                    options={KALAAZAR_TESTS}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item xs>
                  {showOtherKaalazarTestField && (
                    <TextField
                      label="अन्य परीक्षणको विधि"
                      size="small"
                      name="otherKalaazarTest"
                      variant="outlined"
                      defaultValue={modalDefaultValues.otherKalaazarTest}
                      inputRef={register}
                      InputLabelProps={{ shrink: shrinkLabel }}
                      fullWidth
                    />
                  )}
                </Grid>
              </Grid>
            </div>
          )}
          {
            showTreatmentAndCounseling &&
            <Box className={classes.treatmentAndCounselingDetails}>
              <Box className={classes.subTitle}>
                <Typography variant="h6">Treatment and counseling</Typography>
              </Box>
              <AddMedicineList
                medicineOptions={medicineOptions}
                medicineObjectList={medicineObjectList}
                onAddMedicineObjectList={(data) => setMedicineObjectList(data)}
              />
            </Box>
          }
          <Box className={classes.subTitle}>
            <Typography variant="h6">अन्य विवरणहरू</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="स्लाईड आएको मिति (प्रयोगशालामा परीक्षणको लागि स्लाइड आइपुगेको मिति)" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="slideReceivedDate" defaultDate={modalDefaultValues.slideReceivedDate} onDateSelect={(date) => { handleSlideReceivedDateChange(date) }} placeholder="स्लाईड आएको मिति" hideLabel />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="स्लाईड जाचेको मिति (प्रयोगशालामा स्लाइड जाँचेको मिति)" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="slideTestedDate" defaultDate={modalDefaultValues.slideTestedDate} onDateSelect={(date) => { handleSlideTestedDateChange(date) }} placeholder="स्लाईड जाचेको मिति" hideLabel />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="RDT/RK39 बाट जाचेको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="rdtOrRkThirtyNineTestedDate" defaultDate={modalDefaultValues.rdtOrRkThirtyNineTestedDate} onDateSelect={(date) => { handleRdtOrRkThirtyNineTestedDateChange(date) }} placeholder="RDT/RK39 बाट जाचेको मिति" hideLabel />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="उपचार सुरु गरेको मिति " placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="treatmentStartDate" defaultDate={modalDefaultValues.treatmentStartDate} onDateSelect={(date) => { handleTreatmentStartDateChange(date) }} placeholder="उपचार सुरु गरेको मिति " hideLabel />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="उपचारमा रहेको अवधिमा औलो तथा कालाजार रोगको बिरामी उक्त रोगको कारणले मृत्यु भएमा मृत्यु भएको मिति लेख्नुपर्दछ।" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="dateOfDeath" defaultDate={modalDefaultValues.dateOfDeath} onDateSelect={(date) => { handleDateOfDeathChange(date) }} placeholder="मृत्यु भएको मिति" hideLabel />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="कैफियत"
                size="small"
                name="remarks"
                variant="outlined"
                defaultValue={modalDefaultValues.remarks}
                inputRef={register}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <MalariaKalaazarTreatmentRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={malariaKalaazarTreatmentEditFunction.bind(this)} getMalariaKalaazarTreatmentRegisterData={getMalariaKalaazarTreatmentRegisterData} />

      {pendingApprovalRecords.length !== 0 &&
        <CustomDrawer length={pendingApprovalRecords.length}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="left">Full Name</TableCell>
                  <TableCell align="left">Age</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody classes={{ root: "align-center" }}>
                {pendingApprovalRecords.map((row, index) => (
                  <CustomRow rowData={row} key={index} handleApprovedStatusChange={handleApprovedStatusChange.bind(this)} handleUnapprovedStatusChange={handleUnapprovedStatusChange.bind(this)} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomDrawer>
      }
      <CustomModal
        title={confirmationModalTitle}
        onModalSubmit={submitApprovedStatus}
        showModal={showApprovalModal}
        onModalClose={closeModal}
        submitButtonText={YES}
      >
        <Typography variant="caption" component="em" color="secondary">नोट : एक पटक विवरण थपेपछि वा हटाएपछि तपाईं यस कार्यलाई पूर्ववत गर्न सक्नुहुन्न।</Typography>
      </CustomModal>
    </div>
  )
}