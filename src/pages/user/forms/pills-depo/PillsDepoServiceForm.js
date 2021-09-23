import { Box, Button, Divider, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add, Add as AddIcon, Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { BETWEEN_ONE_AND_THREE, CASTE_CODES, EDIT_SELECTED_RECORD, FISCAL_YEARS, GENDER_OPTIONS, HTTP_STATUS_CODES, PATIENT_TYPES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../utils/constants";
import { MUL_DARTA_NUMBERS_LIST, NEPALI_MONTH_LIST, NEW_PATIENT, PARIWAAR_NIYOJAN_MAIN_REGISTER_SERVICE_CODE } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import PillsDepoServiceRegister from "../../components/registers/pills-depo-service-register/PillsDepoServiceRegister";
import styles from "./style";

export default function PillsDepoServiceForm() {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(Date.now())));
  const [showPillsDepoModal, setShowPillsDepoModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [pillsDepoRegisterData, setPillsDepoRegisterData] = useState([]);
  const [pillsDepoRegisterMonthlyReport, setPillsDepoRegisterMonthlyReport] = useState({});
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("पिल्स, डिपो सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [pillsDepoDetailsList, setPillsDepoDetailsList] = useState([]);
  const [customError, setCustomError] = useState({});
  const districtOptions = AppMisc.getDistrictOptions();
  const todayDate = Date.now();
  const todayFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(todayDate));
  const todayMonth = DateUtils.getNepaliMonthIndexByFiscalYear();

  useEffect(() => {
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "dartaaMiti" }, { required: true })
    register({ name: "patientType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    attachMulDartaaOptions();
  }, [register]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  };

  useEffect(() => {
    if (selectedFiscalYear) {
      let fiscalYearList = getRegisterFiscalYears();
      getPillsDepoRegisterData(fiscalYearList);
    }
  }, [selectedFiscalYear])

  function getRegisterFiscalYears() {
    let fiscalYears = []
    for (let i = 0; i < 3; i++) {
      fiscalYears.push(Array.from(selectedFiscalYear.split("_"), value => Number(value) + i).join("_"));
    }
    return fiscalYears;
  }

  const handleAddPillsDepoFields = () => {
    const values = [...pillsDepoDetailsList];
    values.push({});
    setPillsDepoDetailsList(values);
  };

  const handleRemovePillsDepoFields = index => {
    const values = [...pillsDepoDetailsList];
    values.splice(index, 1);
    setPillsDepoDetailsList(values);
  };

  const handlePillsDepoDetailsInputChange = (index, event) => {
    const values = [...pillsDepoDetailsList];
    if (event.target.name === `${"contraceptiveDevice"}~${index}`) {
      if (event.target.value === "DEPO") {
        values[index][`${"cycle"}~${index}`] = "3";
      }
    }
    values[index][event.target.name] = event.target.value;
    setPillsDepoDetailsList(values);
  };

  const handleProcurementDateChange = (date, index) => {
    const values = [...pillsDepoDetailsList];
    if (date) {
      let dateObject = DateUtils.getSeparatedDateFromBsDate(date);
      values[index][`${"procurementDate"}~${index}`] = DateUtils.getDateMilliseconds(date);
      values[index][`${"procurementDay"}~${index}`] = dateObject.day;
      if ((dateObject.month - 3) < 1) {
        values[index][`${"procurementMonth"}~${index}`] = (dateObject.month - 3) === 0 ? 12 : (dateObject.month - 3) === -1 ? 11 : 10;
      }
      else {
        values[index][`${"procurementMonth"}~${index}`] = (dateObject.month - 3);
      }
    }
    setPillsDepoDetailsList(values);
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
    HMIS.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers?sewaType=" + PARIWAAR_NIYOJAN_MAIN_REGISTER_SERVICE_CODE)
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
  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const handleRowEdit = (id) => {
    HMIS.get(API_URL.pillsDepoServiceRegister + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = jsondata.data.dartaaMiti && DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          let pillsDepoDetails = [];
          let keys = Object.keys(jsondata.data.pillsDepoDetailsByFiscalYearMap).sort();
          let index = 0;
          for (let i in keys) {
            jsondata.data.pillsDepoDetailsByFiscalYearMap[`${keys[i]}`].procurementDetails &&
              jsondata.data.pillsDepoDetailsByFiscalYearMap[`${keys[i]}`].procurementDetails.map((item) => {
                pillsDepoDetails.push({
                  [`${"contraceptiveDevice"}~${index}`]: item.contraceptiveDevice,
                  [`${"cycle"}~${index}`]: item.cycle,
                  [`${"procurementDate"}~${index}`]: item.procurementDate,
                  [`${"procurementDay"}~${index}`]: item.procurementDay,
                  [`${"procurementMonth"}~${index}`]: item.procurementMonth
                })
                index = index + 1;
              })
          }
          setPillsDepoDetailsList(pillsDepoDetails);
          setModalDefaultValues(jsondata.data);
          setModalTitle(EDIT_SELECTED_RECORD);
          setShowPillsDepoModal(true);
          setValue("mulDartaaNumber", jsondata.data.mulDartaaNumber);
          setMulDartaaLabel(mulDartaaOptions.find(option => option.value === jsondata.data.mulDartaaNumber));
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const closePillsDepoModal = () => {
    reset({});
    setModalDefaultValues({});
    setShowPillsDepoModal(false);
    setModalTitle("पिल्स, डिपो सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setPillsDepoDetailsList([]);
    setMulDartaaLabel(null);
    setShrinkLabel(undefined);
    setCustomError({});
    setAgeUnitLabel("");
  }

  const onSubmit = data => {
    let errorObject = {};
    pillsDepoDetailsList.map((item, index) => {
      !item[`${"cycle"}~${index}`] && Object.assign(errorObject, { [`${"cycle"}~${index}`]: true })
      if (item[`${"cycle"}~${index}`] > 3 || item[`${"cycle"}~${index}`] < 1) {
        Object.assign(errorObject, { [`${"cycle"}~${index}~${"length"}`]: true })
      }
      !item[`${"contraceptiveDevice"}~${index}`] && Object.assign(errorObject, { [`${"contraceptiveDevice"}~${index}`]: true })
      !item[`${"procurementDate"}~${index}`] && Object.assign(errorObject, { [`${"procurementDate"}~${index}`]: true })
    }
    )
    setCustomError(errorObject);
    if (JSON.stringify(errorObject) === "{}") {
      data.id = modalDefaultValues.id;
      data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
      data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
      data.pillsDepoDetailsByFiscalYearMap = {};
      let procurementDetails = [];
      let refillMonths = [];
      let validMonths = [];
      let previousFiscalYear;
      let currentFiscalYear;
      let dataObject = {};
      let minimumDate = pillsDepoDetailsList[0][`${"procurementDate~0"}`]
      pillsDepoDetailsList.map((item, index) => {
        if (minimumDate > item[`${"procurementDate"}~${index}`]) {
          minimumDate = item[`${"procurementDate"}~${index}`]
        }
        currentFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(item[`${"procurementDate"}~${index}`]));
        previousFiscalYear = (index > 0 && DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(pillsDepoDetailsList[index - 1][`${"procurementDate"}~${index - 1}`]))) || currentFiscalYear;
        dataObject = buildPillsDepoDetailsByFiscalYearObject(item, index, currentFiscalYear);
        if (previousFiscalYear !== currentFiscalYear) {
          procurementDetails = [];
          validMonths = [];
          refillMonths = [];
          if (data.pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`]) {
            validMonths = data.pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`].validMonths;
            refillMonths = data.pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`].refillMonths;
          }
        }
        procurementDetails.push(dataObject.current.procurementDetails);
        validMonths = validMonths.concat(dataObject.current.validMonths);
        dataObject.current.refillMonths && refillMonths.push(dataObject.current.refillMonths);
        data.pillsDepoDetailsByFiscalYearMap[`${dataObject.current.currentFiscalYear}`] = {
          procurementDetails: procurementDetails,
          validMonths: validMonths,
          refillMonths: refillMonths,
        }
        if (dataObject.next) {
          data.pillsDepoDetailsByFiscalYearMap[`${dataObject.next.nextFiscalYear}`] = {
            validMonths: dataObject.next.validMonths,
            refillMonths: [dataObject.next.refillMonths],
          }
        }
      })
      let minimumDateMonth = DateUtils.getSeparatedDateFromMilliseconds(minimumDate).month;
      data.firstProcurementFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(minimumDate));
      data.firstProcurementMonth = DateUtils.getNepaliMonthIndexByFiscalYear(minimumDateMonth);
      HMIS.post(API_URL.pillsDepoServiceRegister, data)
        .then(response => {
          if (response.data.type === SUCCESS) {
            closePillsDepoModal();
            getPillsDepoRegisterData(getRegisterFiscalYears());
          }
          AddAlertMessage({ type: response.data.type, message: response.data.message });
        })
        .catch(error => {
          AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
        });
    }
  }

  const buildPillsDepoDetailsByFiscalYearObject = (item, index, currentFiscalYear) => {
    let validMonths = [];
    let validMonthsForNextFiscalYear = [];
    let refillMonths;
    let procurementDetails = {
      cycle: item[`${"cycle"}~${index}`],
      procurementMonth: NEPALI_MONTH_LIST[item[`${"procurementMonth"}~${index}`] - 1],
      contraceptiveDevice: item[`${"contraceptiveDevice"}~${index}`],
      procurementDate: item[`${"procurementDate"}~${index}`],
      procurementDay: item[`${"procurementDay"}~${index}`],
    };
    let completionMonth = (Number(item[`${"procurementMonth"}~${index}`]) + Number(item[`${"cycle"}~${index}`]));
    for (let i = item[`${"procurementMonth"}~${index}`]; i < completionMonth; i++) {
      i < 13 ? validMonths.push(NEPALI_MONTH_LIST[i - 1]) : i === 13 ? (validMonthsForNextFiscalYear = ["SHRAWAN"]) : validMonthsForNextFiscalYear = ["SHRAWAN", "BHADAU"];
    }
    if (completionMonth < 13) {
      refillMonths = NEPALI_MONTH_LIST[completionMonth - 1];
      return {
        current: {
          currentFiscalYear: currentFiscalYear,
          validMonths: validMonths,
          refillMonths: refillMonths,
          procurementDetails: procurementDetails,
        }
      }
    }
    else {
      completionMonth === 13 ? refillMonths = "SHRAWAN" : completionMonth === 14 ? refillMonths = "BHADAU" : refillMonths = "ASWIN";
      return {
        next: {
          nextFiscalYear: (Number(currentFiscalYear.substring(0, 4)) + 1) + "_" + (Number(currentFiscalYear.substr(-2)) + 1),
          validMonths: validMonthsForNextFiscalYear,
          refillMonths: refillMonths
        },
        current: {
          currentFiscalYear: currentFiscalYear,
          validMonths: validMonths,
          procurementDetails: procurementDetails,
        }
      }
    }
  }

  const getPillsDepoRegisterData = (fiscalYearList) => {
    setPillsDepoRegisterData([]);
    setPillsDepoRegisterMonthlyReport({});
    HMIS.get(API_URL.pillsDepoServiceRegister + "/by-fiscal-years/" + "?currentFiscalYear=" + todayFiscalYear + "&currentMonth=" + todayMonth + "&fiscalYearList=" + fiscalYearList)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.pillsDepoServiceRegisterDetailsList && setPillsDepoRegisterData(jsondata.data.pillsDepoServiceRegisterDetailsList);
          jsondata.data.pillsDepoServiceRegisterMonthlyReportMap && setPillsDepoRegisterMonthlyReport(jsondata.data.pillsDepoServiceRegisterMonthlyReportMap);
        } else {
          AddAlertMessage({ type: jsondata.type, message: jsondata.message })
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleFiscalYearChange = (value, name) => {
    setSelectedFiscalYear(value);
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          पिल्स, डिपो सेवा रजिष्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2} className={classes.fiscalYearSelectContainer}>
            <CustomSelect
              label="आर्थिक वर्ष"
              size="small"
              name="fiscalYear"
              variant="outlined"
              options={FISCAL_YEARS}
              className="select-xs"
              value={selectedFiscalYear}
              onChange={handleFiscalYearChange}
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowPillsDepoModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showPillsDepoModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closePillsDepoModal}
        maxWidth="xl"
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
              <CustomSelect
                label="सेवाग्राहीको किसिम"
                size="small"
                name="patientType"
                value={modalDefaultValues.patientType || NEW_PATIENT}
                variant="outlined"
                options={PATIENT_TYPES}
                onChange={handleCustomSelectChange}
                InputLabelProps={{ shrink: shrinkLabel }}
                disabledOptionSelectable
                fullWidth
              />
              {errors.patientType && <span className="error-message">{REQUIRED_FIELD}</span>}
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
                onChange={handleCustomSelectChange.bind(this)}
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
                defaultValue={modalDefaultValues.spouseFullName}
                label="पतिको नाम र थर (एच्छिक)"
                name="spouseFullName"
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.pillsDepoDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">पिल्स, डिपो विवरण</Typography>
          </Box>
          {pillsDepoDetailsList.map((pillsDepoDetail, index) => (
            <React.Fragment key={`${pillsDepoDetail}~${index}`}>
              <Box className={classes.pillsDepoDetailsContainer}>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid item xs={2}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name={`${"contraceptiveDevice"}~${index}`}
                        onChange={event => handlePillsDepoDetailsInputChange(index, event)}
                        defaultValue={pillsDepoDetail[`${"contraceptiveDevice"}~${index}`]}
                        row
                      >
                        <FormControlLabel
                          value="PILLS"
                          control={<Radio color="primary" />}
                          label="पिल्स"
                        />
                        <FormControlLabel
                          value="DEPO"
                          control={<Radio color="primary" />}
                          label="डिपो"
                        />
                      </RadioGroup>
                    </FormControl>
                    {customError[`${"contraceptiveDevice"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                  </Grid>
                  {pillsDepoDetail[`${"contraceptiveDevice"}~${index}`] === "PILLS" &&
                    <Grid item xs={2}>
                      <Tooltip title="सेवा लिन आएको महिनामा सेवाग्राहीलाई दिएको पिल्सको साइकल संख्या लेख्नुहोस्।" placement="top" arrow>
                        <TextField
                          name={`${"cycle"}~${index}`}
                          type="number"
                          onChange={event => handlePillsDepoDetailsInputChange(index, event)}
                          label="पिल्सको साइकल संख्या"
                          placeholder="पिल्सको साइकल संख्या"
                          defaultValue={pillsDepoDetail[`${"cycle"}~${index}`]}
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </Tooltip>
                      {customError[`${"cycle"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                      {customError[`${"cycle"}~${index}~${"length"}`] && <span className="error-message">{BETWEEN_ONE_AND_THREE}</span>}
                    </Grid>
                  }
                  <Grid item xs={2}>
                    <Tooltip title="सेवा लिन आएको मिति" placement="top" arrow>
                      <Box>
                        <NepaliDate
                          name={`${"procurementDate"}~${index}`}
                          onDateSelect={(date) => { handleProcurementDateChange(date, index) }}
                          placeholder="सेवा लिन आएको मिति"
                          className="date-picker-form-control input-sm full-width"
                          defaultDate={(pillsDepoDetail[`${"procurementDate"}~${index}`]) && DateUtils.getDateFromMilliseconds(pillsDepoDetail[`${"procurementDate"}~${index}`])}
                          hideLabel
                        />
                        {customError[`${"procurementDate"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                      </Box>
                    </Tooltip>
                  </Grid>
                  {
                    (index + 1 === pillsDepoDetailsList.length) &&
                    <Grid item xs>
                      <Tooltip title="पिल्स, डिपो विवरण हटाउनुहोस्।" placement="top" arrow>
                        <IconButton aria-label="delete" onClick={() => handleRemovePillsDepoFields(index)} color="secondary">
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  }
                </Grid>
                <Divider variant="middle" className={classes.divider} />
              </Box>
            </React.Fragment>
          ))}
          <Grid container justify="center" alignItems="center" className={classes.addPillsDepoDetailsBtnContainer}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { handleAddPillsDepoFields() }}>नयाँ पिल्स, डिपो विवरण थप्नुहोस्</Button>
          </Grid>
        </Box>
      </CustomModal>
      <PillsDepoServiceRegister pillsDepoRegisterData={pillsDepoRegisterData} pillsDepoRegisterMonthlyReport={pillsDepoRegisterMonthlyReport} showActionColumn={pillsDepoRegisterData.length !== 0} onEditRow={handleRowEdit} fiscalYear={selectedFiscalYear} />
    </>
  );
}
