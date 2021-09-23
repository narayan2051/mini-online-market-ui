import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomDrawer from "../../../../../components/custom-drawer/CustomDrawer";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import { AppMisc } from "../../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, NO, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, UNKNOWN, YES, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { DST_STATUS, IMCI_MAIN_REGISTER_SERVICE_CODE, LAB_RESULT_OPTIONS, MUL_DARTA_NUMBERS_LIST, NEGATIVE, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, POSITIVE, SMOKING_STATUS, tbTreatmentOutcomeOptions, TB_PATIENT_ENTRY_CATEGORIES, TB_ROG_OPTIONS, TB_TREATMENT_REFER, TB_TREATMENT_REGIMEN, TEST_POSITIVE_REPORT_GRADE, TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE } from "../../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import TuberculosisTreatmentRegister from "../../../components/registers/tuberculosis/treatment/TuberculosisTreatmentRegister";
import styles from "../style";
import CustomRow from "./helpers/CustomRow";

export default function TuberculosisTreatment() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [openTuberculosisTreatmentModal, setOpenTuberculosisTreatmentModal] = useState(false);
  const [tbTreatmentRegisterData, setTbTreatmentRegisterData] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("क्षयरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [pendingApprovalData, setPendingApprovalData] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [confirmationModalTitle, setConfirmationModalTitle] = useState();
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [id, setId] = useState();
  const [approvedStatus, setApprovedStatus] = useState(false);
  const [showGradeAtStart, setShowGradeAtStart] = useState(false);
  const [showGradeAfterTwoMonth, setShowGradeAfterTwoMonth] = useState(false);
  const [showGradeAfterThreeMonth, setShowGradeAfterThreeMonth] = useState(false);
  const [showGradeAfterFiveMonth, setShowGradeAfterFiveMonth] = useState(false);
  const [showGradeAtLast, setShowGradeAtLast] = useState(false);

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
    setShowGradeAtStart(false);
    setShowGradeAfterTwoMonth(false);
    setShowGradeAfterThreeMonth(false);
    setShowGradeAfterFiveMonth(false);
    setShowGradeAtLast(false);
  }

  const submitApprovedStatus = () => {
    HMIS.post(API_URL.tbLabRegister + "/update-approval-status?id=" + id + "&approved=" + approvedStatus)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getPendingApprovalData();
          getListOfTuberculosisTreatmentObject();
          setShowApprovalModal(false);
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "diseaseType" }, { required: true });
    register({ name: "treatmentStartedDate" }, { required: true });
    register({ name: "patientEntryCategory" }, { required: true });
    register({ name: "referredBy" }, { required: true });
    register({ name: "transferIn" });
    register({ name: "patientUnderCbDot" });
    register({ name: "movedToSecondLine" });
    register({ name: "testedDateAtStart" });
    register({ name: "testedDateAfterTwoMonth" });
    register({ name: "testedDateAfterThreeMonth" });
    register({ name: "testedDateAfterFiveMonth" });
    register({ name: "testedDateAtLast" });
    register({ name: "testResultAtStart" });
    register({ name: "testResultAfterTwoMonth" });
    register({ name: "testResultAfterThreeMonth" });
    register({ name: "testResultAfterFiveMonth" });
    register({ name: "testResultAtLast" });
    register({ name: "treatmentRegimen" }, { required: true });
    register({ name: "dstStatus" });
    register({ name: "smokingStatusAtStart" });
    register({ name: "smokingStatusTwoMonth" });
    register({ name: "smokingStatusFiveMonth" });
    register({ name: "smokingStatusLastMonth" });
    register({ name: "smokingStatusAtStartInsideHome" });
    register({ name: "smokingStatusTwoMonthInsideHome" });
    register({ name: "smokingStatusFiveMonthInsideHome" });
    register({ name: "smokingStatusLastMonthInsideHome" });
    register({ name: "treatmentOutcome" });
    register({ name: "treatmentOutcomeDate" });

    attachMulDartaaOptions();
  }, [register]);

  useEffect(() => {
    register({ name: "gradeAtStart" }, { required: showGradeAtStart });
  }, [register, showGradeAtStart])

  useEffect(() => {
    register({ name: "gradeAfterTwoMonth" }, { required: showGradeAfterTwoMonth });
  }, [register, showGradeAfterTwoMonth])

  useEffect(() => {
    register({ name: "gradeAfterThreeMonth" }, { required: showGradeAfterThreeMonth });
  }, [register, showGradeAfterThreeMonth])

  useEffect(() => {
    register({ name: "gradeAfterFiveMonth" }, { required: showGradeAfterFiveMonth });
  }, [register, showGradeAfterFiveMonth])

  useEffect(() => {
    register({ name: "gradeAtLast" }, { required: showGradeAtLast });
  }, [register, showGradeAtLast])

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getListOfTuberculosisTreatmentObject();
  }, [sewaDartaaRegisterDate]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const getListOfTuberculosisTreatmentObject = () => {
    HMIS.get(API_URL.tbTreatmentRegister + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&dateTo=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setTbTreatmentRegisterData(jsondata.objectList);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  useEffect(() => {
    getPendingApprovalData()
  }, [])

  const getPendingApprovalData = () => {
    HMIS.get(API_URL.tbLabRegister + "/get-pending-approval-records")
      .then(response => {
        if (response.data.type === SUCCESS)
          setPendingApprovalData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const onSubmit = data => {
    !showGradeAtStart && delete data.gradeAtStart;
    !showGradeAfterTwoMonth && delete data.gradeAfterTwoMonth;
    !showGradeAfterThreeMonth && delete data.gradeAfterThreeMonth;
    !showGradeAfterFiveMonth && delete data.gradeAfterFiveMonth;
    !showGradeAtLast && delete data.gradeAtLast;
    let postdata = {
      id: modalDefaultValues.id,
      dartaaMiti: data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti),
      dartaaNumber: data.mulDartaaNumber,
      patientFirstName: data.patientFirstName,
      patientLastName: data.patientLastName,
      casteCode: data.casteCode,
      gender: data.gender,
      age: data.age,
      ageUnit: data.ageUnit,
      district: data.district,
      palikaName: data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName),
      wardNumber: data.wardNumber,
      gaunOrTole: data.gaunOrTole,
      phoneNumber: data.phoneNumber,
      patientUnderCbDot: data.patientUnderCbDot,
      movedToSecondLine: data.movedToSecondLine,
      presan: data.presan,
      diseaseType: data.diseaseType,
      treatmentStartedDate: data.treatmentStartedDate && DateUtils.getDateMilliseconds(data.treatmentStartedDate),
      patientEntryCategory: data.patientEntryCategory,
      transferIn: data.transferIn,
      tbHivKriyakalap: {
        hivInfection: data.hivInfection,
        art: data.art,
        cpt: data.cpt
      },
      referredBy: data.referredBy,
      dstStatus: data.dstStatus,
      treatmentRegimen: data.treatmentRegimen,
      smokingStatusAtStart: data.smokingStatusAtStart,
      smokingStatusAtStartInsideHome: data.smokingStatusAtStartInsideHome,
      smokingStatusTwoMonth: data.smokingStatusTwoMonth,
      smokingStatusTwoMonthInsideHome: data.smokingStatusTwoMonthInsideHome,
      smokingStatusFiveMonth: data.smokingStatusFiveMonth,
      smokingStatusFiveMonthInsideHome: data.smokingStatusFiveMonthInsideHome,
      smokingStatusLastMonth: data.smokingStatusLastMonth,
      smokingStatusLastMonthInsideHome: data.smokingStatusLastMonthInsideHome,
      durationAndTestDetailsMap: {
        "AT_START": {
          testName: data.testName,
          testResult: data.testResultAtStart,
          labNumber: data.labNumberAtStart,
          grade: data.gradeAtStart,
          testedDate: data.testedDateAtStart && DateUtils.getDateMilliseconds(data.testedDateAtStart)
        },
        "AFTER_TWO_MONTHS": {
          testName: data.testNameAfterTwoMonth,
          testResult: data.testResultAfterTwoMonth,
          labNumber: data.labNumberAfterTwoMonth,
          grade: data.gradeAfterTwoMonth,
          testedDate: data.testedDateAfterTwoMonth && DateUtils.getDateMilliseconds(data.testedDateAfterTwoMonth)
        },
        "AFTER_THREE_MONTHS": {
          testName: data.testNameAfterThreeMonth,
          testResult: data.testResultAfterThreeMonth,
          labNumber: data.labNumberAfterThreeMonth,
          grade: data.gradeAfterThreeMonth,
          testedDate: data.testedDateAfterThreeMonth && DateUtils.getDateMilliseconds(data.testedDateAfterThreeMonth)
        },
        "AFTER_FIVE_MONTHS": {
          testName: data.testNameAfterFiveMonth,
          testResult: data.testResultAfterFiveMonth,
          labNumber: data.labNumberAfterFiveMonth,
          grade: data.gradeAfterFiveMonth,
          testedDate: data.testedDateAfterFiveMonth && DateUtils.getDateMilliseconds(data.testedDateAfterFiveMonth)
        },
        "AT_LAST": {
          testName: data.testNameAtLast,
          testResult: data.testResultAtLast,
          labNumber: data.labNumberAtLast,
          grade: data.gradeAtLast,
          testedDate: data.testedDateAtLast && DateUtils.getDateMilliseconds(data.testedDateAtLast)
        }
      },
      treatmentOutcomeAndDate: {
        treatmentOutcome: data.treatmentOutcome,
        treatmentOutcomeDate: data.treatmentOutcomeDate && DateUtils.getDateMilliseconds(data.treatmentOutcomeDate)
      },
      remarks: data.remarks
    }

    HMIS.post(API_URL.tbTreatmentRegister, postdata)
      .then(response => {
        response.data.type === "success" && closeTuberculosisTreatmentModal();
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        getListOfTuberculosisTreatmentObject();
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };
  const handleTreatmentStartedDateChange = date => {
    setValue("treatmentStartedDate", date)
  }

  const handleTreatmentOutcomeDateChange = date => {
    setValue("treatmentOutcomeDate", date);
  }

  const handleTestDateChangeAtStart = date => {
    setValue("testedDateAtStart", date);
  }

  const handleTestDateChangeAfterTwoMonth = date => {
    setValue("testedDateAfterTwoMonth", date);
  }

  const handleTestDateChangeAfterThreeMonth = date => {
    setValue("testedDateAfterThreeMonth", date);
  }

  const handleTestDateChangeAfterFiveMonth = date => {
    setValue("testedDateAfterFiveMonth", date);
  }

  const handleTestDateChangeAtLast = date => {
    setValue("testedDateAtLast", date);
  }

  const handleTestResultAtStart = (value, name) => {
    setShowGradeAtStart(value === POSITIVE)
    setValue(name, value);
  }

  const handleTestResultAfterTwoMonth = (value, name) => {
    setShowGradeAfterTwoMonth(value === POSITIVE)
    setValue(name, value);
  }

  const handleTestResultAfterThreeMonth = (value, name) => {
    setShowGradeAfterThreeMonth(value === POSITIVE)
    setValue(name, value);
  }

  const handleTestResultAfterFiveMonth = (value, name) => {
    setShowGradeAfterFiveMonth(value === POSITIVE)
    setValue(name, value);
  }

  const handleTestResultAtLast = (value, name) => {
    setShowGradeAtLast(value === POSITIVE)
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

  const closeTuberculosisTreatmentModal = () => {
    setModalDefaultValues({});
    reset({});
    setOpenTuberculosisTreatmentModal(false);
    setModalTitle("क्षयरोग उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel(null);
    setAgeUnitLabel("");
  }

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const tuberculosisTreatmentEditFunction = (id) => {
    HMIS.get(API_URL.tbTreatmentRegister + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = jsondata.data.dartaaMiti && DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          jsondata.data.treatmentStartedDate = jsondata.data.treatmentStartedDate && DateUtils.getDateFromMilliseconds(jsondata.data.treatmentStartedDate);
          if (jsondata.data.durationAndTestDetailsMap) {
            jsondata.data.durationAndTestDetailsMap["AT_START"] && (jsondata.data.durationAndTestDetailsMap["AT_START"].testedDate = jsondata.data.durationAndTestDetailsMap["AT_START"].testedDate && DateUtils.getDateFromMilliseconds(jsondata.data.durationAndTestDetailsMap["AT_START"].testedDate));
            jsondata.data.durationAndTestDetailsMap["AFTER_TWO_MONTHS"] && (jsondata.data.durationAndTestDetailsMap["AFTER_TWO_MONTHS"].testedDate = jsondata.data.durationAndTestDetailsMap["AFTER_TWO_MONTHS"].testedDate && DateUtils.getDateFromMilliseconds(jsondata.data.durationAndTestDetailsMap["AFTER_TWO_MONTHS"].testedDate));
            jsondata.data.durationAndTestDetailsMap["AFTER_THREE_MONTHS"] && (jsondata.data.durationAndTestDetailsMap["AFTER_THREE_MONTHS"].testedDate = jsondata.data.durationAndTestDetailsMap["AFTER_THREE_MONTHS"].testedDate && DateUtils.getDateFromMilliseconds(jsondata.data.durationAndTestDetailsMap["AFTER_THREE_MONTHS"].testedDate));
            jsondata.data.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"] && (jsondata.data.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"].testedDate = jsondata.data.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"].testedDate && DateUtils.getDateFromMilliseconds(jsondata.data.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"].testedDate));
            jsondata.data.durationAndTestDetailsMap["AT_LAST"] && (jsondata.data.durationAndTestDetailsMap["AT_LAST"].testedDate = jsondata.data.durationAndTestDetailsMap["AT_LAST"].testedDate && DateUtils.getDateFromMilliseconds(jsondata.data.durationAndTestDetailsMap["AT_LAST"].testedDate));
          }
          if (jsondata.data.treatmentOutcomeAndDate) {
            jsondata.data.treatmentOutcomeAndDate.treatmentOutcomeDate = jsondata.data.treatmentOutcomeAndDate?.treatmentOutcomeDate && DateUtils.getDateFromMilliseconds(jsondata.data.treatmentOutcomeAndDate.treatmentOutcomeDate);
          }

          setShrinkLabel(true);
          setModalDefaultValues(jsondata.data);
          setModalTitle(EDIT_SELECTED_RECORD);
          setOpenTuberculosisTreatmentModal(true);
          setValue("mulDartaaNumber", jsondata.data.dartaaNumber);
          setMulDartaaLabel(mulDartaaOptions.find(option => option.value === jsondata.data.dartaaNumber));
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          क्षयरोग उपचार रजिष्टर
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenTuberculosisTreatmentModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openTuberculosisTreatmentModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeTuberculosisTreatmentModal}
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
        <Box className={classes.treatmentDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">रोगको किसिम तथा प्रेषण/निदान</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="Referred by"
                variant="outlined"
                name="referredBy"
                options={TB_TREATMENT_REFER}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.referredBy || ""}
                size="small"
                fullWidth
              />
              {errors.referredBy && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="रोगको किसिम "
                options={TB_ROG_OPTIONS}
                variant="outlined"
                onChange={handleCustomSelectChange}
                name="diseaseType"
                value={modalDefaultValues.diseaseType}
                size="small"
                fullWidth
              />
              {errors.diseaseType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="उपचार सुरु गरेको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="treatmentStartedDate"
                    className="date-picker-form-control input-sm full-width"
                    placeholder="उपचार सुरु गरेको मिति"
                    defaultDate={modalDefaultValues.treatmentStartedDate}
                    onDateSelect={handleTreatmentStartedDateChange}
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.treatmentStartedDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="बिरामी दर्ता वर्गिकरण"
                options={TB_PATIENT_ENTRY_CATEGORIES}
                variant="outlined"
                onChange={handleCustomSelectChange}
                name="patientEntryCategory"
                value={modalDefaultValues.patientEntryCategory || ""}
                size="small"
                fullWidth
              />
              {errors.patientEntryCategory && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="Transfer In"
                variant="outlined"
                name="transferIn"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.transferIn || ""}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={2}>
              <CustomSelect
                label="Treatment Regimen"
                options={TB_TREATMENT_REGIMEN}
                variant="outlined"
                onChange={handleCustomSelectChange}
                name="treatmentRegimen"
                value={modalDefaultValues.treatmentRegimen || ""}
                size="small"
                fullWidth
              />
              {errors.treatmentRegimen && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Box className={classes.subTitle}>
            <Typography variant="h6">टि. बि./एचआइभी कृयाकलाप</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">HIV Infection Status</FormLabel>
                <RadioGroup name="hivInfection" defaultValue={modalDefaultValues.tbHivKriyakalap && modalDefaultValues.tbHivKriyakalap.hivInfection} row>
                  <FormControlLabel
                    value={POSITIVE}
                    control={<Radio color="primary" />}
                    label="Positive"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NEGATIVE}
                    control={<Radio color="primary" />}
                    label="Negative"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={UNKNOWN}
                    control={<Radio color="primary" />}
                    label="Unknown"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend">ART</FormLabel>
                <RadioGroup name="art" defaultValue={modalDefaultValues.tbHivKriyakalap && modalDefaultValues.tbHivKriyakalap.art} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend">CPT</FormLabel>
                <RadioGroup name="cpt" defaultValue={modalDefaultValues.tbHivKriyakalap && modalDefaultValues.tbHivKriyakalap.cpt} row>
                  <FormControlLabel
                    value={YES}
                    control={<Radio color="primary" />}
                    label="Yes"
                    inputRef={register}
                  />
                  <FormControlLabel
                    value={NO}
                    control={<Radio color="primary" />}
                    label="No"
                    inputRef={register}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
        </Box>
        <Box className={classes.labTestDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">उपचार अवधिमा खकार परिक्षणको प्रकार, नतिजा (माइक्रोस्कोपी कल्चर/जिन एक्सपर्ट) र मिति</Typography>
          </Box>
          <Box className={classes.duringTreatmentDetailsContainer}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">1. क्षयरोग निदान गर्दाको समयमा</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <RadioGroup name="testName" defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_START"]?.testName} row>
                    <Tooltip title="Smear" placement="top" arrow>
                      <FormControlLabel
                        value="SMEAR"
                        control={<Radio color="primary" />}
                        label="S"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="Xpert MTB/RIF" placement="top" arrow>
                      <FormControlLabel
                        value="XPERT"
                        control={<Radio color="primary" />}
                        label="X"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="LPA" placement="top" arrow>
                      <FormControlLabel
                        value="LPA"
                        control={<Radio color="primary" />}
                        label="L"
                        inputRef={register}
                      />
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="Result"
                  options={LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleTestResultAtStart}
                  name="testResultAtStart"
                  size="small"
                  value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_START"]?.testResult || ""}
                  fullWidth
                />
              </Grid>
              {showGradeAtStart && (
                <Grid item xs>
                  <CustomSelect
                    label="Grade"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="gradeAtStart"
                    size="small"
                    value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_START"]?.grade || ""}
                    fullWidth
                  />
                  {errors.gradeAtStart && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <TextField
                  label="Lab Number"
                  type="number"
                  placeholder="ल्याब नं."
                  name="labNumberAtStart"
                  variant="outlined"
                  defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_START"]?.labNumber}
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.labNumberAtStart && errors.labNumberAtStart.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <Tooltip title="परीक्षण गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      name="testedDateAtStart"
                      placeholder="परीक्षण गरेको मिति"
                      onDateSelect={handleTestDateChangeAtStart}
                      defaultDate={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_START"]?.testedDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
            <Box className={classes.subTitle}>
              <Typography variant="h6">2. २ महिनाको परिक्षण, नतिजा र मिति</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <RadioGroup name="testNameAfterTwoMonth" defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_TWO_MONTHS"]?.testName} row>
                    <Tooltip title="Smear" placement="top" arrow>
                      <FormControlLabel
                        value="SMEAR"
                        control={<Radio color="primary" />}
                        label="S"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="Xpert MTB/RIF" placement="top" arrow>
                      <FormControlLabel
                        value="XPERT"
                        control={<Radio color="primary" />}
                        label="X"
                        inputRef={register}
                      />
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="Result"
                  options={LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleTestResultAfterTwoMonth}
                  value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_TWO_MONTHS"]?.testResult || ""}
                  name="testResultAfterTwoMonth"
                  size="small"
                  fullWidth
                />
              </Grid>
              {showGradeAfterTwoMonth && (
                <Grid item xs>
                  <CustomSelect
                    label="Grade"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="gradeAfterTwoMonth"
                    size="small"
                    value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_TWO_MONTHS"]?.grade || ""}
                    fullWidth
                  />
                  {errors.gradeAfterTwoMonth && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <TextField
                  label="Lab Number"
                  type="number"
                  placeholder="ल्याब नं."
                  name="labNumberAfterTwoMonth"
                  variant="outlined"
                  defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_TWO_MONTHS"]?.labNumber}
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.labNumberAfterTwoMonth && errors.labNumberAfterTwoMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <Tooltip title="परीक्षण गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      name="testedDateAfterTwoMonth"
                      placeholder="परीक्षण गरेको मिति"
                      onDateSelect={handleTestDateChangeAfterTwoMonth}
                      defaultDate={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_TWO_MONTHS"]?.testedDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
            <Box className={classes.subTitle}>
              <Typography variant="h6">3. ३ महिनाको परिक्षण, नतिजा र मिति</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <RadioGroup name="testNameAfterThreeMonth" defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_THREE_MONTHS"]?.testName} row>
                    <Tooltip title="Smear" placement="top" arrow>
                      <FormControlLabel
                        value="SMEAR"
                        control={<Radio color="primary" />}
                        label="S"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="Xpert MTB/RIF" placement="top" arrow>
                      <FormControlLabel
                        value="XPERT"
                        control={<Radio color="primary" />}
                        label="X"
                        inputRef={register}
                      />
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="Result"
                  options={LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleTestResultAfterThreeMonth}
                  name="testResultAfterThreeMonth"
                  value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_THREE_MONTHS"]?.testResult || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              {showGradeAfterThreeMonth && (
                <Grid item xs>
                  <CustomSelect
                    label="Grade"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="gradeAfterThreeMonth"
                    size="small"
                    value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_THREE_MONTHS"]?.grade || ""}
                    fullWidth
                  />
                  {errors.gradeAfterThreeMonth && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <TextField
                  label="Lab Number"
                  type="number"
                  placeholder="ल्याब नं."
                  name="labNumberAfterThreeMonth"
                  variant="outlined"
                  defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_THREE_MONTHS"]?.labNumber}
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  fullWidth
                />
                {errors.labNumberAfterThreeMonth && errors.labNumberAfterThreeMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <Tooltip title="परीक्षण गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      name="testedDateAfterThreeMonth"
                      placeholder="परीक्षण गरेको मिति"
                      onDateSelect={handleTestDateChangeAfterThreeMonth}
                      defaultDate={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_THREE_MONTHS"]?.testedDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
            <Box className={classes.subTitle}>
              <Typography variant="h6">4. ५ महिनाको परिक्षण, नतिजा र मिति</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <RadioGroup name="testNameAfterFiveMonth" defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"]?.testName} row>
                    <Tooltip title="Smear" placement="top" arrow>
                      <FormControlLabel
                        value="SMEAR"
                        control={<Radio color="primary" />}
                        label="S"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="Xpert MTB/RIF" placement="top" arrow>
                      <FormControlLabel
                        value="XPERT"
                        control={<Radio color="primary" />}
                        label="X"
                        inputRef={register}
                      />
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="Result"
                  options={LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleTestResultAfterFiveMonth}
                  name="testResultAfterFiveMonth"
                  value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"]?.testResult || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              {showGradeAfterFiveMonth && (
                <Grid item xs>
                  <CustomSelect
                    label="Grade"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="gradeAfterFiveMonth"
                    size="small"
                    value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"]?.grade || ""}
                    fullWidth
                  />
                  {errors.gradeAfterFiveMonth && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <TextField
                  label="Lab Number"
                  type="number"
                  placeholder="ल्याब नं."
                  name="labNumberAfterFiveMonth"
                  variant="outlined"
                  inputRef={register({
                    min: 0
                  })}
                  defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"]?.labNumber}
                  size="small"
                  fullWidth
                />
                {errors.labNumberAfterFiveMonth && errors.labNumberAfterFiveMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <Tooltip title="परीक्षण गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      name="testedDateAfterFiveMonth"
                      placeholder="परीक्षण गरेको मिति"
                      onDateSelect={handleTestDateChangeAfterFiveMonth}
                      defaultDate={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AFTER_FIVE_MONTHS"]?.testedDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
            <Box className={classes.subTitle}>
              <Typography variant="h6">5. उपचारको अन्तिम महिनाको परिक्षण, नतिजा र मिति</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <RadioGroup name="testNameAtLast" defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_LAST"]?.testName} row>
                    <Tooltip title="Smear" placement="top" arrow>
                      <FormControlLabel
                        value="SMEAR"
                        control={<Radio color="primary" />}
                        label="S"
                        inputRef={register}
                      />
                    </Tooltip>
                    <Tooltip title="Xpert MTB/RIF" placement="top" arrow>
                      <FormControlLabel
                        value="XPERT"
                        control={<Radio color="primary" />}
                        label="X"
                        inputRef={register}
                      />
                    </Tooltip>
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <CustomSelect
                  label="Result"
                  options={LAB_RESULT_OPTIONS}
                  variant="outlined"
                  onChange={handleTestResultAtLast}
                  name="testResultAtLast"
                  value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_LAST"]?.testResult || ""}
                  size="small"
                  fullWidth
                />
              </Grid>
              {showGradeAtLast && (
                <Grid item xs>
                  <CustomSelect
                    label="Grade"
                    options={TEST_POSITIVE_REPORT_GRADE}
                    variant="outlined"
                    onChange={handleCustomSelectChange}
                    name="gradeAtLast"
                    size="small"
                    value={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_LAST"]?.grade || ""}
                    fullWidth
                  />
                  {errors.gradeAtLast && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              )}
              <Grid item xs>
                <TextField
                  label="Lab Number"
                  type="number"
                  placeholder="ल्याब नं."
                  name="labNumberAtLast"
                  variant="outlined"
                  inputRef={register({
                    min: 0
                  })}
                  defaultValue={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_LAST"]?.labNumber}
                  size="small"
                  fullWidth
                />
                {errors.labNumberAtLast && errors.labNumberAtLast.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <Tooltip title="परीक्षण गरेको मिति" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      className="date-picker-form-control input-sm full-width"
                      name="testedDateAtLast"
                      placeholder="परीक्षण गरेको मिति"
                      onDateSelect={handleTestDateChangeAtLast}
                      defaultDate={modalDefaultValues.durationAndTestDetailsMap && modalDefaultValues.durationAndTestDetailsMap["AT_LAST"]?.testedDate}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.treatmentResultAndDate}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">उपचार नतिजा र मिति (Treatment Outcome)</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="उपचारको नतिजा"
                variant="outlined"
                options={tbTreatmentOutcomeOptions}
                onChange={handleCustomSelectChange}
                name="treatmentOutcome"
                value={modalDefaultValues.treatmentOutcomeAndDate?.treatmentOutcome || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <NepaliDate
                name="treatmentOutcomeDate"
                className="date-picker-form-control input-sm full-width"
                defaultDate={modalDefaultValues.treatmentOutcomeAndDate?.treatmentOutcomeDate || ""}
                onDateSelect={handleTreatmentOutcomeDateChange}
                placeholder="मिति"
                hideLabel
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="DST Status"
                options={DST_STATUS}
                variant="outlined"
                onChange={handleCustomSelectChange}
                name="dstStatus"
                value={modalDefaultValues.dstStatus || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomReactSelect
                label="Moved to 2nd Line"
                name="movedToSecondLine"
                options={YES_NO_OPTIONS}
                onChange={handleCustomReactSelectChange}
                defaultValue={modalDefaultValues.movedToSecondLine}
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="Patient Under CB DOT"
                variant="outlined"
                name="patientUnderCbDot"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.patientUnderCbDot || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="कैफियत"
                type="text"
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
        <Box className={classes.treatmentResultAndDate}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">धुम्रपान क्रियाकलाप सम्बन्धि विवरण</Typography>
          </Box>
          <Box className={classes.subTitle}>
            <Typography variant="h6">धुम्रपानको अवस्था</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(उपचारको सुरुमा)"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                name="smokingStatusAtStart"
                value={modalDefaultValues.smokingStatusAtStart || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(२ महिना)"
                variant="outlined"
                options={SMOKING_STATUS}
                onChange={handleCustomSelectChange}
                name="smokingStatusTwoMonth"
                value={modalDefaultValues.smokingStatusTwoMonth || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(५ महिना)"
                variant="outlined"
                options={SMOKING_STATUS}
                onChange={handleCustomSelectChange}
                name="smokingStatusFiveMonth"
                value={modalDefaultValues.smokingStatusFiveMonth || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(अन्तिम महिना)"
                variant="outlined"
                options={SMOKING_STATUS}
                onChange={handleCustomSelectChange}
                name="smokingStatusLastMonth"
                value={modalDefaultValues.smokingStatusLastMonth || ""}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Box className={classes.subTitle}>
            <Typography variant="h6">धुम्रपानको अवस्था(घरभित्र)</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(उपचारको सुरुमा)"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                name="smokingStatusAtStartInsideHome"
                value={modalDefaultValues.smokingStatusAtStartInsideHome || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(२ महिना)"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                name="smokingStatusTwoMonthInsideHome"
                value={modalDefaultValues.smokingStatusTwoMonthInsideHome || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(५ महिना)"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                name="smokingStatusFiveMonthInsideHome"
                value={modalDefaultValues.smokingStatusFiveMonthInsideHome || ""}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="धुम्रपान गर्ने बानी(अन्तिम महिना)"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                name="smokingStatusLastMonthInsideHome"
                value={modalDefaultValues.smokingStatusLastMonthInsideHome || ""}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <TuberculosisTreatmentRegister tableData={tbTreatmentRegisterData} showActionColumn={tbTreatmentRegisterData.length !== 0} onEditRow={tuberculosisTreatmentEditFunction.bind(this)} getRegisterData={getListOfTuberculosisTreatmentObject} />
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
  );
}
