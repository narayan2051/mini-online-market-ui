import { Box, Button, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select as MaterialSelect, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add, Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomDrawer from "../../../../components/custom-drawer/CustomDrawer";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, FISCAL_YEARS, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../utils/constants";
import { DISEASE_DETECTED_METHODS, IMCI_MAIN_REGISTER_SERVICE_CODE, KEETJANYA_ROG_MAIN_REGISTER_SERVICE_CODE, KUSTHAROG_PATIENT_REMOVAL_OPTIONS, KUSTHAROG_PATIENT_TYPES, KUSTHAROG_SMEAR_RESULTS, KUSTHAROG_UNCOOPERATION_LEVEL, LEPROSY_MAIN_REGISTER_SERVICE_CODE, LEPROSY_TYPES, MUL_DARTA_NUMBERS_LIST, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import KusthaRogTreatmentRegister from "../../components/registers/kustharog-treatment-register/KusthaRogTreatmentRegister";
import CustomRow from "./helpers/CustomRow";
import KusthaRogClassificationModal from "./helpers/KusthaRogClassificationModal";
import styles from "./style";

export default function KusthaRogTreatment() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showKusthaRogTreatmentModal, setShowKusthaRogTreatmentModal] = useState(false);
  const [kusthaRogRegisterType, setKusthaRogRegisterType] = useState("MB");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("कुष्ठरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [treatmentDetails, setTreatmentDetails] = useState([]);
  const [registerDate, setRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [pendingApprovalData, setPendingApprovalData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [patientRemovalDateRequired, setPatientRemovalDateRequired] = useState(false);
  const [approvedStatusAndId, setApprovedStatusAndId] = useState({
    id: null,
    approvedStatus: null,
  });

  useEffect(() => {
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "leprosyType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "diseaseDetectedMethod" }, { required: true });
    register({ name: "addedTypesInRegister" }, { required: true });
    register({ name: "patientRemovalDescription" });
    register({ name: "patientRemovalDate" }, { required: patientRemovalDateRequired });
  }, [register, patientRemovalDateRequired]);

  useEffect(() => {
    attachMulDartaaOptions();
  }, [])

  useEffect(() => {
    registerDate.dateFrom && registerDate.dateTo && kusthaRogRegisterType &&
      getKusthaRogTreatmentRegisterData();
  }, [registerDate, kusthaRogRegisterType]);

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

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleDiseaseDetectedMethodChange = diseaseDetectedMethodOption => {
    setValue("diseaseDetectedMethod", diseaseDetectedMethodOption);
  };

  const handleAddedTypesInRegisterChange = addedTypesInRegisterChangeOption => {
    setValue("addedTypesInRegister", addedTypesInRegisterChangeOption);
  };

  const handlePatientRemovalDescriptionOptionsChange = patientRemovalDescriptionOption => {
    setPatientRemovalDateRequired(patientRemovalDescriptionOption === "RFT");
    setValue("patientRemovalDescription", patientRemovalDescriptionOption);
  };

  const handleKustharogRegisterTypeChange = kusthaRogRegisterOption => {
    setKusthaRogRegisterType(kusthaRogRegisterOption)
  };

  const handleLeprosyTypeChange = kusthaRogType => {
    setValue("leprosyType", kusthaRogType)
  }

  const handlePatientRemovalDateChange = (date) => {
    date !== 0 && setValue("patientRemovalDate", date);
  }

  const handleAddTreatmentDetails = () => {
    const values = [...treatmentDetails];
    values.push({});
    setTreatmentDetails(values);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConfirmationModal(false);
  }

  const handleRemoveTreatmentDetails = index => {
    const values = [...treatmentDetails];
    values.splice(index, 1);
    setTreatmentDetails(values);
  };

  const handleTreatmentDetailsInputChange = (index, event) => {
    const values = [...treatmentDetails];
    !values[index][`${"monthlyTreatmentDetails"}`] && (values[index][`${"monthlyTreatmentDetails"}`] = {});
    if ((event.target.name !== "fiscalYear") && (event.target.name !== "uncooperationLevelAtStart") && (event.target.name !== "uncooperationLevelAtEnd") && (event.target.name !== "smearResult")) {
      Object.assign(values[index][`${"monthlyTreatmentDetails"}`], { [event.target.name]: event.target.value })
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setTreatmentDetails(values);
  };

  const buildTreatmentDetailsObject = () => {
    let treatmentDetailsObject = {};
    treatmentDetails.map((item, index) => {
      Object.assign(treatmentDetailsObject, { [item.fiscalYear]: item });
      delete treatmentDetailsObject[item.fiscalYear].fiscalYear;
    })
    return treatmentDetailsObject;
  }

  const buildTreatmentDetailsListFromObject = treatmentObject => {
    let treatmentDetailsList = [];
    let treatmentObjectKeys = Object.keys(treatmentObject);
    for (let i in treatmentObjectKeys) {
      treatmentObject[treatmentObjectKeys[i]].fiscalYear = treatmentObjectKeys[i];
      treatmentDetailsList.push(treatmentObject[treatmentObjectKeys[i]]);
    }
    return treatmentDetailsList;
  }

  const handleApprovedStatusChange = (id) => {
    setShowModal(true);
    setApprovedStatusAndId({
      id: id,
      approvedStatus: true,
    });
  }

  const handleUnapprovedStatusChange = (id) => {
    setShowConfirmationModal(true);
    setApprovedStatusAndId({
      id: id,
      approvedStatus: false,
    })
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
    HMIS.get(API_URL.mulDartaaRegister + "/dartaa-numbers?sewaTypes=" + [OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, IMCI_MAIN_REGISTER_SERVICE_CODE, LEPROSY_MAIN_REGISTER_SERVICE_CODE])
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

  const getKusthaRogTreatmentRegisterData = () => {
    HMIS.get(API_URL.kusthaRogTreatment + "?dateFrom=" + DateUtils.getDateMilliseconds(registerDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(registerDate.dateTo) + "&&registerType=" + kusthaRogRegisterType)
      .then(response => {
        response.data.map(item => {
          item.treatmentDetails && (item.treatmentDetails = buildTreatmentDetailsListFromObject(item.treatmentDetails));
        })
        setMainRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const getPendingApprovalData = () => {
    HMIS.get(API_URL.getPendingApproval + "?registerType=LEPROSY")
      .then(response => {
        if (response.data.type === SUCCESS)
          setPendingApprovalData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  useEffect(() => {
    getPendingApprovalData()
  }, [])

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.patientRemovalDate = data.patientRemovalDate && DateUtils.getDateMilliseconds(data.patientRemovalDate);
    if (treatmentDetails.length) {
      data.treatmentDetails = buildTreatmentDetailsObject();
    }
    HMIS.post(API_URL.kusthaRogTreatment, data)
      .then(response => {
        response.data.type === "success" && closeKusthaRogTreatmentModal();
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        getKusthaRogTreatmentRegisterData();
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const closeKusthaRogTreatmentModal = () => {
    setModalDefaultValues({});
    reset({});
    setShowKusthaRogTreatmentModal(false);
    setPatientRemovalDateRequired(false);
    setModalTitle("कुष्ठरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
    setTreatmentDetails([]);
  }

  const kusthaRogTreatmentEditFunction = (id) => {
    HMIS.get(API_URL.kusthaRogTreatment + "/" + id)
      .then(response => {
        response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.patientRemovalDate = response.data.patientRemovalDate && DateUtils.getDateFromMilliseconds(response.data.patientRemovalDate);
        response.data.treatmentDetails && setTreatmentDetails(buildTreatmentDetailsListFromObject(response.data.treatmentDetails));

        setModalDefaultValues(response.data);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowKusthaRogTreatmentModal(true);
        setValue("mulDartaaNumber", response.data.mulDartaaNumber);
        setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          कुष्ठरोग उपचार रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <CustomSelect
              label="कुष्ठरोगको प्रकार"
              variant="outlined"
              name="kustharogRegisterType"
              options={LEPROSY_TYPES}
              value={kusthaRogRegisterType}
              onChange={handleKustharogRegisterTypeChange.bind(this)}
              size="small"
              className="select-xs"
              disabledOptionSelectable
              fullWidth
            />
          </Box>
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
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowKusthaRogTreatmentModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showKusthaRogTreatmentModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeKusthaRogTreatmentModal}
        fullScreen
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="कुष्ठरोगको प्रकार"
                variant="outlined"
                name="leprosyType"
                options={LEPROSY_TYPES}
                onChange={handleLeprosyTypeChange.bind(this)}
                size="small"
                value={modalDefaultValues.leprosyType || kusthaRogRegisterType}
                disabledOptionSelectable
                fullWidth
              />
              {errors.leprosyType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="दर्ता मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="dartaaMiti" defaultDate={modalDefaultValues.dartaaMiti || true} onDateSelect={(date) => { handleDartaaMitiChange(date) }} placeholder="दर्ता मिति" hideLabel />
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
                label="बिरामीको नाम"
                size="small"
                name="patientFirstName"
                variant="outlined"
                defaultValue={modalDefaultValues.patientFirstName}
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                InputProps={{ readOnly: true }}
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
                defaultValue={modalDefaultValues.patientLastName}
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                InputProps={{ readOnly: true }}
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
                inputRef={register({
                  required: true
                })}
                InputProps={{ readOnly: true }}
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
                InputProps={{ readOnly: true }}
                variant="outlined"
                inputRef={register({
                  required: true,
                })}
                size="small"
                fullWidth
              />
              {errors.wardNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="gaunOrTole"
                label="गाँउ/टोल"
                defaultValue={modalDefaultValues.gaunOrTole}
                InputLabelProps={{ shrink: shrinkLabel }}
                InputProps={{ readOnly: true }}
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
                name="phoneNumber"
                label="सम्पर्क नं."
                defaultValue={modalDefaultValues.phoneNumber}
                InputLabelProps={{ shrink: shrinkLabel }}
                InputProps={{ readOnly: true }}
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="अभिभावकको नाम थर"
                name="parentFirstAndLastName"
                size="small"
                variant="outlined"
                defaultValue={modalDefaultValues.parentFirstAndLastName}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.parentFirstAndLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="रोग पत्ता लागेको तरिका"
                size="small"
                name="diseaseDetectedMethod"
                options={DISEASE_DETECTED_METHODS}
                onChange={handleDiseaseDetectedMethodChange.bind(this)}
                value={modalDefaultValues.diseaseDetectedMethod}
                variant="outlined"
                fullWidth
              />
              {errors.diseaseDetectedMethod && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs={4}>
              <CustomSelect
                label="यस रजिष्टरमा थप भएको तरिका"
                size="small"
                name="addedTypesInRegister"
                options={KUSTHAROG_PATIENT_TYPES}
                onChange={handleAddedTypesInRegisterChange}
                value={modalDefaultValues.addedTypesInRegister}
                variant="outlined"
                fullWidth
              />
              {errors.addedTypesInRegister && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
        <Box className={classes.monthlyTreatmentDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">महिना/महिनाको उपचार नियमितता</Typography>
          </Box>
          {
            treatmentDetails.map((treatmentDetail, index) => (
              <React.Fragment key={`${treatmentDetail}~${index}`}>
                <Box className={classes.treatmentDetailsContainer}>
                  <Grid container spacing={1} alignItems="center" className={classes.row}>
                    <Grid item xs>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="fiscal-year-label">आ.व.</InputLabel>
                        <MaterialSelect
                          labelId="fiscal-year-label"
                          value={treatmentDetail.fiscalYear}
                          name="fiscalYear"
                          onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        >
                          <MenuItem value="">कृपया आर्थिक वर्ष छान्नुहोस्</MenuItem>
                          {FISCAL_YEARS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                        </MaterialSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="shrawan"
                        value={treatmentDetail.monthlyTreatmentDetails?.shrawan}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="श्रावण"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="bhadau"
                        value={treatmentDetail.monthlyTreatmentDetails?.bhadau}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="भदौ"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="aswin"
                        value={treatmentDetail.monthlyTreatmentDetails?.aswin}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="आश्विन"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="kartik"
                        value={treatmentDetail.monthlyTreatmentDetails?.kartik}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="कार्तिक"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="mansir"
                        value={treatmentDetail.monthlyTreatmentDetails?.mansir}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="मंसिर"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="poush"
                        value={treatmentDetail.monthlyTreatmentDetails?.poush}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="पुष"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="magh"
                        value={treatmentDetail.monthlyTreatmentDetails?.magh}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="माघ"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="falgun"
                        value={treatmentDetail.monthlyTreatmentDetails?.falgun}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="फाल्गुन"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="chaitra"
                        value={treatmentDetail.monthlyTreatmentDetails?.chaitra}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="चैत्र"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="baishakh"
                        value={treatmentDetail.monthlyTreatmentDetails?.baishakh}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="बैशाख"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="jestha"
                        value={treatmentDetail.monthlyTreatmentDetails?.jestha}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="जेठ"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        name="asar"
                        value={treatmentDetail.monthlyTreatmentDetails?.asar}
                        onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        label="असार"
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="uncooperation-label-at-start">असमर्थताको अधिकतम श्रेणी सुरुमा</InputLabel>
                        <MaterialSelect
                          labelId="uncooperation-label-at-start"
                          value={treatmentDetail.uncooperationLevelAtStart}
                          name="uncooperationLevelAtStart"
                          onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        >
                          <MenuItem value="">कृपया असमर्थताको अधिकतम श्रेणी छान्नुहोस्</MenuItem>
                          {KUSTHAROG_UNCOOPERATION_LEVEL.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                        </MaterialSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="uncooperation-label-at-end">असमर्थताको अधिकतम श्रेणी अन्त्यमा</InputLabel>
                        <MaterialSelect
                          labelId="uncooperation-label-at-end"
                          value={treatmentDetail.uncooperationLevelAtEnd}
                          name="uncooperationLevelAtEnd"
                          onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        >
                          <MenuItem value="">कृपया असमर्थताको अधिकतम श्रेणी छान्नुहोस्</MenuItem>
                          {KUSTHAROG_UNCOOPERATION_LEVEL.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                        </MaterialSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="smear-result">स्मेयर नतिजा</InputLabel>
                        <MaterialSelect
                          labelId="smear-result"
                          value={treatmentDetail.smearResult}
                          name="smearResult"
                          onChange={event => handleTreatmentDetailsInputChange(index, event)}
                        >
                          <MenuItem value="">कृपया स्मेयर नतिजा छान्नुहोस्</MenuItem>
                          {KUSTHAROG_SMEAR_RESULTS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                        </MaterialSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {
                    (index + 1 === treatmentDetails.length) &&
                    <Tooltip title="महिना/महिनाको उपचार नियमितता विवरण हटाउनुहोस्।" placement="top" arrow><Cancel className={classes.removeTreatmentDetailsContainer} onClick={() => handleRemoveTreatmentDetails(index)} fontSize="small" /></Tooltip>
                  }
                  <Divider variant="middle" className={classes.divider} />
                </Box>
              </React.Fragment>
            ))}
          {
            treatmentDetails.length < 3 &&
            <Grid container justify="center" alignItems="center" className={classes.addTreatmentDetailsBtnContainer}>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { handleAddTreatmentDetails() }}>नयाँ विवरण थप्नुहोस्</Button>
            </Grid>
          }
        </Box>
        <Box className={classes.otherDetails}>
          <Typography variant="h6" className={classes.subTitle}>अन्य विवरणहरू</Typography>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="EHF Score"
                name="ehfScore"
                variant="outlined"
                defaultValue={modalDefaultValues.ehfScore}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.ehfScore && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="यदि पि.बी कुष्टराेगी हाे भने ९ र एम.बी हाे भने १८ महिनामा बिरामीलाई RFT गर्नुपर्छ ।" placement="top" arrow>
                <Box>
                  <CustomSelect
                    label="रोगी घटाइएको विवरण"
                    options={KUSTHAROG_PATIENT_REMOVAL_OPTIONS}
                    onChange={handlePatientRemovalDescriptionOptionsChange.bind(this)}
                    value={modalDefaultValues.patientRemovalDescription}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="रोगी घटाइएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" defaultDate={modalDefaultValues.patientRemovalDate} onDateSelect={(date) => { handlePatientRemovalDateChange(date) }} placeholder="रोगी घटाइएको मिति" hideLabel />
                </Box>
              </Tooltip>
              {errors.patientRemovalDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="कैफियत"
                name="remarks"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.remarks}
                size="small"
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <KusthaRogTreatmentRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={kusthaRogTreatmentEditFunction.bind(this)} getRegisterData={getKusthaRogTreatmentRegisterData} />
      {pendingApprovalData.length !== 0 && (
        <CustomDrawer length={pendingApprovalData.length}>
          <Box p={1}>
            <TableContainer>
              <Table size="small" aria-label="collapsible table">
                <TableHead classes={{ root: "align-center" }}>
                  <TableRow>
                    <TableCell />
                    <TableCell align="left">बिरामीको नाम र थर</TableCell>
                    <TableCell align="left">उमेर</TableCell>
                    <TableCell align="left">लिङ्ग</TableCell>
                    <TableCell align="left">थप्नुहोस् / हटाउनुहोस्</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody classes={{ root: "align-center" }}>
                  {pendingApprovalData.map((row, index) => (
                    <CustomRow rowData={row} key={index} handleApprovedStatusChange={handleApprovedStatusChange.bind(this)} handleUnapprovedStatusChange={handleUnapprovedStatusChange.bind(this)} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CustomDrawer>
      )}
      <KusthaRogClassificationModal showModal={showModal} closeModal={closeModal} approvedStatusAndId={approvedStatusAndId} getPendingApprovalData={getPendingApprovalData} showConfirmationModal={showConfirmationModal} />
    </>
  );
}
