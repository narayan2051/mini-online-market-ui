import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../utils/constants";
import { AGE_UNITS, IMCI_MAIN_REGISTER_SERVICE_CODE, KALAAZAR_REPORT, KALAAZAR_TESTS, KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE, KUSTHAROG_SPECIMEN_TYPES, LEPROSY_MAIN_REGISTER_SERVICE_CODE, MALARIA_KAALAZAR_REGISTER_TYPE, MALARIA_KALAAZAR_TREATMENT_OPTIONS, MALARIA_TYPE, MUL_DARTA_NUMBERS_LIST, OTHER, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, SAMPLE_SOURCE_FOR_MALARIA_OPTIONS } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import MalariaKustharogKalaazarLabRegister from "../../components/registers/malaria-kustharog-kalaazar-lab/MalariaKustharogKalaazarLabRegister";
import styles from "./style";

export default function MalariaKustharogKalaazarLab(props) {
  const classes = styles();
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const districtOptions = AppMisc.getDistrictOptions();
  const [registerType, setRegisterType] = useState("MALARIA");
  const [showMalariaKalaazarModal, setShowMalariaKalaazarModal] = useState(false);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState('औलो तथा कालाजार प्रयोगशाला रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।');
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showMalariaReportField, setShowMalariaReportField] = useState(true);
  const [showKalaazarReportField, setShowKalaazarRelatedField] = useState(false);
  const [showKustharogReportField, setShowKustharogReportField] = useState(false);
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [multipleSelectOptions, setMultipleSelectOptions] = useState([]);
  const [showKalaazarTests, setShowKalaazarTests] = useState(false);
  const [treatmentTypes, setTreatmentTypes] = useState([]);
  const [showOtherKalaazarTestsField, setShowOtherKalaazarTestsField] = useState(false);
  const [registerTypeFromSelect, setRegisterTypeFromSelect] = useState();
  const [isTreatmentTypesEmpty, setIsTreatmentTypesEmpty] = useState(false);
  const [isForeigner, setIsForeigner] = useState(false);

  const { register, handleSubmit, setValue, errors, reset, getValues } = useForm();

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

  const handleRegisterTypeChange = options => {
    setRegisterType(options);
  }

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
    register({ name: "malariaSpecies" });
    register({ name: "testReportSubmittedDate" });
    register({ name: "registerType" }, { required: true });
    register({ name: "ell" });
    register({ name: "elr" });
    register({ name: "l1" });
    register({ name: "l2" });
    register({ name: "kalaazarTest" });
  }, [register]);

  useEffect(() => {
    register({ name: "isKalaazarPositive" }, { required: showKalaazarReportField });
  }, [register, showKalaazarReportField])

  useEffect(() => {
    attachMulDartaaOptions();
  }, [])

  useEffect(() => {
    setMulDartaaLabel(mulDartaaOptions.find(option => option.value === modalDefaultValues.mulDartaaNumber));
    reset(modalDefaultValues);
  }, [modalDefaultValues]);

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.slideReceivedDate = data.slideReceivedDate && DateUtils.getDateMilliseconds(data.slideReceivedDate);
    data.slideTestedDate = data.slideTestedDate && DateUtils.getDateMilliseconds(data.slideTestedDate);
    data.testReportSubmittedDate = data.testReportSubmittedDate && DateUtils.getDateMilliseconds(data.testReportSubmittedDate);
    data.isKalaazarPositive = data.isKalaazarPositive && data.isKalaazarPositive === "POSITIVE";
    data.treatmentTypes = treatmentTypes;
    data.foreigner = isForeigner;

    if (data.registerType !== "LEPROSY") {
      delete data.ell;
      delete data.elr;
      delete data.l1;
      delete data.l2;
    }
    if (data.registerType !== "MALARIA") {
      delete data.malariaSpecies;
      delete data.malariaDensity;
      delete data.malariaStage;
    }
    if (data.registerType !== "KALAAZAR") {
      delete data.isKalaazarPositive;
      delete data.kalaazarTest;
    }
    treatmentTypes.includes("RK_39") && delete data.kalaazarTest;
    treatmentTypes.length ? (
      HMIS.post(API_URL.malariaKalaazarLaboratoryRegister, data)
        .then(response => {
          if (response.data.type === SUCCESS) {
            closeMalariaKalaazarModal();
            getMalariaKalaazarLabRegisterData();
          }
          AddAlertMessage({ type: response.data.type, message: response.data.message });
        })
        .catch(error => {
          AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
        })
    ) : setIsTreatmentTypesEmpty(true);
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleTreatmentTypeChange = event => {
    setTreatmentTypes(event.target.value);
    setShowKalaazarTests((registerTypeFromSelect === "KALAAZAR") && !event.target.value.includes("RK_39"))
  };

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    setIsForeigner(patientDetails.foreigner);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);

    setModalDefaultValues((prev) => ({
      ...prev,
      mulDartaaNumber: patientDetails.dartaaNumber,
      patientFirstName: patientDetails.patientFirstName,
      patientLastName: patientDetails.patientLastName,
      age: patientDetails.age,
      ageUnit: patientDetails.ageUnit,
      palikaName: patientDetails.palikaName,
      wardNumber: patientDetails.wardNumber,
      gaunOrTole: patientDetails.gaunOrTole,
      phoneNumber: patientDetails.phoneNumber,
      casteCode: patientDetails.casteCode,
      district: patientDetails.district,
      gender: patientDetails.gender,
      // TODO : Asim - Code needs to be refactored.
      registerType: getValues().registerType,
      dartaaMiti: getValues().dartaaMiti,
      treatmentTypes: getValues().treatmentTypes,
      specimenSource: getValues().specimenSource,
      isKalaazarPositive: getValues().isKalaazarPositive,
      malariaSpecies: getValues().malariaSpecies,
      slideReceivedDate: getValues().slideReceivedDate,
      slideTestedDate: getValues().slideTestedDate,
      testReportSubmittedDate: getValues().testReportSubmittedDate,
      kalaazarTest: getValues().kalaazarTest,
      ell: getValues().ell,
      elr: getValues().elr,
      l1: getValues().l1,
      l2: getValues().l2,
    }))
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

  const handleMulDartaaChange = (mulDartaaOption) => {
    let mulDartaaNumbers = SessionStorage.getItem(MUL_DARTA_NUMBERS_LIST);
    if (mulDartaaNumbers) {
      let muldartaaNumberInfo = mulDartaaNumbers.find(obj => obj.dartaaNumber === mulDartaaOption.value);
      muldartaaNumberInfo ? updatePatientDetails(muldartaaNumberInfo) : getDetailsByMulDartaaNumber(mulDartaaOption.value);
    } else {
      getDetailsByMulDartaaNumber(mulDartaaOption.value)
    }
  };

  const attachMulDartaaOptions = () => {
    let mulDartaaOptions = [];
    HMIS.get(API_URL.mulDartaaRegister + "/dartaa-numbers?sewaTypes=" + [OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, IMCI_MAIN_REGISTER_SERVICE_CODE, KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE, LEPROSY_MAIN_REGISTER_SERVICE_CODE])
      .then(response => {
        var data = response.data.objectList;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const handleCustomSelectChange = (value, name) => {
    // TODO: Prastav - Show mul dartaa options only related to the selected registerType. If registerType is selected as LEPROSY, show only patients registered for LEPROSY and same logic for Malaria/Kalaazar as well. May be replacing customSelect with CustomReactSelect with filter prop help you.
    if (name === "registerType") {
      let specificTreatmentTypes = treatmentTypes;
      if (value === "MALARIA") {
        specificTreatmentTypes = specificTreatmentTypes.filter(item => item !== "RK_39");
        setMultipleSelectOptions(MALARIA_KALAAZAR_TREATMENT_OPTIONS.filter(obj => obj.value === "MICROSCOPY" || obj.value === "RDT"))
      }
      else if (value === "LEPROSY") {
        specificTreatmentTypes = ["MICROSCOPY"];
        setMultipleSelectOptions(MALARIA_KALAAZAR_TREATMENT_OPTIONS.filter(obj => obj.value === "MICROSCOPY"))
      }
      else {
        specificTreatmentTypes = specificTreatmentTypes.filter(item => item !== "RDT");
        setMultipleSelectOptions(MALARIA_KALAAZAR_TREATMENT_OPTIONS.filter(obj => obj.value === "MICROSCOPY" || obj.value === "RK_39"))
      }
      setTreatmentTypes(specificTreatmentTypes);
      setRegisterTypeFromSelect(value);
      setShowKalaazarTests(value === "KALAAZAR" && !specificTreatmentTypes.includes("RK_39"));
      setShowMalariaReportField(value === "MALARIA");
      setShowKustharogReportField(value === "LEPROSY");
      setShowKalaazarRelatedField(value === "KALAAZAR");
    }
    if (name === "kalaazarTest") {
      setShowOtherKalaazarTestsField(value === OTHER)
    }
    setValue(name, value);
  }

  const handleSlideReceivedDateChange = date => {
    setValue("slideReceivedDate", date);
  }

  const handleSlideTestedDateChange = date => {
    setValue("slideTestedDate", date);
  }

  const handleTestReportSubmittedDateChange = date => {
    setValue("testReportSubmittedDate", date);
  }

  const handleMalariaSpeciesChange = (event) => {
    setValue("malariaSpecies", event.target.value);
  }

  useEffect(() => {
    if (sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo) {
      getMalariaKalaazarLabRegisterData();
    }
  }, [sewaDartaaRegisterDate, registerType]);

  const getMalariaKalaazarLabRegisterData = () => {
    HMIS.get(API_URL.malariaKalaazarLaboratoryRegister + "?fromDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&toDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo) + "&registerType=" + registerType)
      .then(response => {
        if (response.data.type === SUCCESS) {
          setMainRegisterData(response.data.objectList);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getDetailsById = (id) => {
    HMIS.get(API_URL.malariaKalaazarLaboratoryRegister + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.palikaName = AppMisc.getMunicipalityName(jsondata.data.palikaName);
          jsondata.data.dartaaMiti = DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.slideReceivedDate = jsondata.data.slideReceivedDate && DateUtils.getDateFromMilliseconds(jsondata.data.slideReceivedDate);
          jsondata.data.slideTestedDate = jsondata.data.slideTestedDate && DateUtils.getDateFromMilliseconds(jsondata.data.slideTestedDate);
          jsondata.data.testReportSubmittedDate = jsondata.data.testReportSubmittedDate && DateUtils.getDateFromMilliseconds(jsondata.data.testReportSubmittedDate);
          jsondata.data.isKalaazarPositive = jsondata.data.isKalaazarPositive !== null ? (jsondata.data.isKalaazarPositive ? "POSITIVE" : "NEGATIVE") : null;
          setModalTitle("औलो तथा कालाजार प्रयोगशाला रजिस्टरमा रेकर्ड सम्पादन गर्नुहोस।");
          setTreatmentTypes(jsondata.data.treatmentTypes);
          setModalDefaultValues(jsondata.data);
          setShowMalariaKalaazarModal(true);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closeMalariaKalaazarModal = () => {
    reset({});
    setModalDefaultValues({});
    setIsTreatmentTypesEmpty(false);
    setTreatmentTypes([]);
    setShowMalariaKalaazarModal(false);
    setShowKalaazarTests(false);
    setModalTitle("औलो तथा कालाजार प्रयोगशाला रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setMulDartaaLabel(null);
    setShrinkLabel(undefined);
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          औलो, कुष्ठ र कालाजार रोगको प्रयोगशाला रजिष्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Grid item>
              <CustomSelect
                variant="outlined"
                name="typeOfRegister"
                options={MALARIA_KAALAZAR_REGISTER_TYPE}
                onChange={handleRegisterTypeChange.bind(this)}
                value={registerType}
                size="small"
                className="select-xs"
                disabledOptionSelectable
                fullWidth
              />
            </Grid>
          </Box>
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control width-sm"
                  onDateSelect={handleSewaDartaaRegisterDateFromSelect}
                  labelText="दर्ता मिति"
                  defaultDate={DateUtils.getDaysBeforeBSDate(30)}
                  hideLabel
                />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control width-sm"
                  onDateSelect={handleSewaDartaaRegisterDateToSelect}
                  labelText="दर्ता मिति"
                  defaultDate
                  hideLabel
                />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowMalariaKalaazarModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
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
              <CustomSelect
                variant="outlined"
                name="registerType"
                label="औलो, कुष्ठ वा कालाजार"
                options={MALARIA_KAALAZAR_REGISTER_TYPE}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.registerType || registerType}
                size="small"
                className="select-xs"
                disabledOptionSelectable
                fullWidth
              />
              {errors.registerType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="dartaaMiti"
                    defaultDate={modalDefaultValues.dartaaMiti || true}
                    onDateSelect={handleDartaaMitiChange}
                    placeholder="दर्ता मिति"
                    hideLabel
                  />
                  {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: true }}
                label="बिरामीको नाम"
                size="small"
                name="patientFirstName"
                variant="outlined"
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
                disabled
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
                value={modalDefaultValues.gender}
                options={GENDER_OPTIONS}
                onChange={handleCustomSelectChange}
                variant="outlined"
                disabled
                fullWidth
              />
              {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बिरामीको उमेर"
                size="small"
                name="age"
                InputProps={{ readOnly: true }}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="ageUnit"
                label="उमेर वर्ष वा महिना"
                options={AGE_UNITS}
                disabled
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.ageUnit}
                variant="outlined"
                size="small"
                fullWidth
              />
              {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
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
                variant="outlined"
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: shrinkLabel }}
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
                variant="outlined"
                inputRef={register}
                size="small"
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="gaunOrTole"
                label="गाँउ/टोल"
                variant="outlined"
                inputRef={register}
                size="small"
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                name="phoneNumber"
                label="सम्पर्क नं."
                variant="outlined"
                inputRef={register}
                size="small"
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="अविभावकको नाम"
                size="small"
                name="gharmulikoName"
                variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="स्रोत"
                name="specimenSource"
                variant="outlined"
                size="small"
                value={modalDefaultValues.specimenSource}
                options={SAMPLE_SOURCE_FOR_MALARIA_OPTIONS}
                onChange={handleCustomSelectChange}
                fullWidth
              />
              {errors.specimenSource && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>परीक्षण विधी</InputLabel>
                <MaterialSelect
                  multiple
                  value={treatmentTypes}
                  onChange={handleTreatmentTypeChange}
                  name="treatmentTypes"
                >
                  <MenuItem disabled>कृपया छान्नुहोस </MenuItem>
                  {multipleSelectOptions.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
              {isTreatmentTypesEmpty && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showKalaazarTests ? (
              <Grid item xs>
                <CustomSelect
                  label="कालाजारको परीक्षण"
                  name="kalaazarTest"
                  variant="outlined"
                  size="small"
                  value={modalDefaultValues.kalaazarTest}
                  options={KALAAZAR_TESTS}
                  onChange={handleCustomSelectChange}
                  fullWidth
                />
              </Grid>
            ) : <Grid item xs></Grid>}
          </Grid>
        </Box>
        <Box className={classes.otherDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">प्रयोगशालामा प्राप्त गरेको, जाचेको र पठाएको मिति</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="स्लाईड आएको मिति (प्रयोगशालामा परीक्षणको लागि स्लाइड आइपुगेको मिति)" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="slideReceivedDate"
                    defaultDate={modalDefaultValues.slideReceivedDate}
                    onDateSelect={handleSlideReceivedDateChange}
                    placeholder="स्लाईड आएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="स्लाईड जाचेको मिति (प्रयोगशालामा स्लाइड जाँचेको मिति)" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="slideTestedDate"
                    defaultDate={modalDefaultValues.slideTestedDate}
                    onDateSelect={handleSlideTestedDateChange}
                    placeholder="स्लाईड जाचेको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="नतिजा उपचार केन्द्रमा पठाएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="testReportSubmittedDate"
                    defaultDate={modalDefaultValues.testReportSubmittedDate}
                    onDateSelect={handleTestReportSubmittedDateChange}
                    placeholder="नतिजा उपचार केन्द्रमा पठाएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.otherDetails}>
          {showMalariaReportField && (
            <div>
              <Box className={classes.subTitle}>
                <Typography variant="h6">औलोको परिणाम</Typography>
              </Box>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel>औलोको जात</InputLabel>
                    <MaterialSelect
                      multiple
                      defaultValue={modalDefaultValues.malariaSpecies || []}
                      onChange={handleMalariaSpeciesChange}
                      name="malariaSpecies"
                    >
                      <MenuItem disabled>कृपया छान्नुहोस </MenuItem>
                      {MALARIA_TYPE.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
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
              </Grid>
            </div>
          )}
          {showKalaazarReportField && (
            <div>
              <Box className={classes.subTitle}>
                <Typography variant="h6">कालाजारको परिणाम</Typography>
              </Box>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomSelect
                    label="कालाजार रिपोर्ट"
                    name="isKalaazarPositive"
                    variant="outlined"
                    size="small"
                    value={modalDefaultValues.isKalaazarPositive}
                    options={KALAAZAR_REPORT}
                    onChange={handleCustomSelectChange}
                    fullWidth
                  />
                  {errors.isKalaazarPositive && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                {showOtherKalaazarTestsField ? (
                  <Grid item xs>
                    <TextField
                      label="अन्य परीक्षणको विधि"
                      size="small"
                      name="otherKalaazarTest"
                      variant="outlined"
                      inputRef={register}
                      InputLabelProps={{ shrink: shrinkLabel }}
                      fullWidth
                    />
                  </Grid>
                ) : (<Grid item xs></Grid>)}
                <Grid item xs></Grid>
              </Grid>
            </div>
          )}
          {showKustharogReportField && (
            <div>
              <Box className={classes.subTitle}>
                <Typography variant="h6">कुष्ठ रोगको परिणाम</Typography>
              </Box>
              <Box className={classes.subTitle}>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid item xs>
                    <CustomSelect
                      label="EL(L)"
                      name="ell"
                      variant="outlined"
                      size="small"
                      value={modalDefaultValues.ell}
                      options={KUSTHAROG_SPECIMEN_TYPES}
                      onChange={handleCustomSelectChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <CustomSelect
                      label="EL(R)"
                      name="elr"
                      variant="outlined"
                      size="small"
                      value={modalDefaultValues.elr}
                      options={KUSTHAROG_SPECIMEN_TYPES}
                      onChange={handleCustomSelectChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <CustomSelect
                      label="L1"
                      name="l1"
                      variant="outlined"
                      size="small"
                      value={modalDefaultValues.l1}
                      options={KUSTHAROG_SPECIMEN_TYPES}
                      onChange={handleCustomSelectChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <CustomSelect
                      label="L2"
                      name="l2"
                      variant="outlined"
                      size="small"
                      value={modalDefaultValues.l2}
                      options={KUSTHAROG_SPECIMEN_TYPES}
                      onChange={handleCustomSelectChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          )}
        </Box>
        <Grid container>
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
      </CustomModal>
      <MalariaKustharogKalaazarLabRegister tableData={mainRegisterData} onEditRow={getDetailsById.bind(this)} />
    </div>
  );
}