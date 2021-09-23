import { Box, Button, FormControl, FormControlLabel, Checkbox, Grid, InputAdornment, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { BETWEEN_ONE_AND_THREE, CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, ID, PATIENT_TYPES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { NEPALI_MONTH_LIST, NEW_PATIENT, PARIWAAR_NIYOJAN_VILLAGE_CLINIC_SERVICE_CODE, PREVIOUS_PATIENT, VILLAGE_DARTA_NUMBERS_LIST } from "../../../../../utils/constants/forms";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import PariwaarNiyojanSewaRegister from "../../../components/registers/village-clinic-register/pariwaar-niyojan-sewa/PariwaarNiyojanSewaRegister";
import styles from "./style";

export default function PariwaarNiyojanSewa(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const [showModal, setShowModal] = useState(false);
  const [registerData, setRegisterData] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const { register, setValue, handleSubmit, reset, errors } = useForm();
  const [showPillsCycleField, setShowPillsCycleField] = useState(false);
  const [modalTitle, setModalTitle] = useState("परिवार नियोजन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [isPreviousPatient, setIsPreviousPatient] = useState(false);
  const [villageDartaaNumber, setVillegeDartaaNumber] = useState("");
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [villageClinicDartaaNumberLabel, setVillageClinicDartaaNumberLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [disablePatientTypeSelect, setDisablePatientTypeSelect] = useState(false);
  const [pillsDepoDetailsList, setPillsDepoDetailsList] = useState([]);
  const [previousPatientDetail, setPreviousPatientDetail] = useState({});
  const [onlyCondom, setOnlyCondom] = useState(false);
  const [customError, setCustomError] = useState({});
  const [patientType, setPatientType] = useState("");
  const [clinicIndex, setClinicIndex] = useState("");
  const villageClinicId = AppUtils.getUrlParam(ID);

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "patientType" }, { required: true });
  }, [register])

  useEffect(() => {
    register({ name: "procurementDate" }, { required: ((pillsDepoDetailsList.length === 0) && !onlyCondom) });
    register({ name: "contraceptiveDevice" }, { required: ((pillsDepoDetailsList.length === 0) && !onlyCondom) });
  }, [register, pillsDepoDetailsList, onlyCondom])

  useEffect(() => {
    attachVillageClinicDartaaNumbers();
  }, []);

  useEffect(() => {
    props.villageClinicServiceDate && getRegisterDataFromClinicId();
  }, [props.villageClinicServiceDate])

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

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

  useEffect(() => {
    if (isPreviousPatient && villageDartaaNumber) {
      getPreviousPatientUserDetail();
    }
  }, [isPreviousPatient, villageDartaaNumber])

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const getRegisterDataFromClinicId = () => {
    HMIS.get(API_URL.pillsDepoServiceRegister + "/village-clinic/" + villageClinicId + "/" + DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)))
      .then(response => {
        setRegisterData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getPreviousPatientUserDetail = () => {
    HMIS.get(API_URL.pillsDepoServiceRegister + "/village-clinic?villageClinicDartaaNumber=" + villageDartaaNumber)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setPreviousPatientDetail(jsondata.data);
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
    patientDetails.dartaaNumber && setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === patientDetails.dartaaNumber));

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
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all?sewaType=" + PARIWAAR_NIYOJAN_VILLAGE_CLINIC_SERVICE_CODE + "&communityClinicId=" + villageClinicId)
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

  const handleVillageClinicDartaaNumberChange = (villageDartaaNumberOption) => {
    setVillegeDartaaNumber(villageDartaaNumberOption.value);
    let villageClinicDartaaNumbers = SessionStorage.getItem(VILLAGE_DARTA_NUMBERS_LIST);

    if (villageClinicDartaaNumbers) {
      let villageClinicDartaaNumberInfo = villageClinicDartaaNumbers.find(obj => obj.dartaaNumber === villageDartaaNumberOption.value);
      villageClinicDartaaNumberInfo ? updatePatientDetails(villageClinicDartaaNumberInfo) : getDetailsByVillageClinicDartaaNumber(villageDartaaNumberOption.value);
    } else {
      getDetailsByVillageClinicDartaaNumber(villageDartaaNumberOption.value)
    }
  };

  const getDetailsByVillageClinicDartaaNumber = (villageClinicDartaaNumber) => {
    HMIS.get(API_URL.villageClinicDartaaNumber + "?dartaaNumber=" + villageClinicDartaaNumber + "&communityClinicId=" + villageClinicId)
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          updatePatientDetails(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const buildPostDataForPreviousPatient = (data) => {
    let postdata = previousPatientDetail || {};
    postdata.villageClinicId = villageClinicId;
    let currentFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate));
    let currentMonth = DateUtils.getSeparatedDateFromMilliseconds(props.villageClinicServiceDate).month - 3;
    currentMonth === 0 ? currentMonth = 12 : currentMonth === -1 ? currentMonth = 11 : currentMonth === -2 && (currentMonth = 10);
    !(postdata.pillsDepoDetailsByFiscalYearMap) && (postdata.pillsDepoDetailsByFiscalYearMap = {});
    if (!(postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear])) {
      postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear] = { validMonths: [], refillMonths: [], procurementDetails: [] }
    }
    else {
      if (!(postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].procurementDetails)) {
        postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].procurementDetails = [];
      }
      if (!(postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].validMonths)) {
        postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].validMonths = [];
      }
      if (!(postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].refillMonths)) {
        postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].refillMonths = [];
      }
    }
    if (!onlyCondom) {
      (!postdata.firstProcurementFiscalYear) && (postdata.firstProcurementFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)));
      (!postdata.firstProcurementMonth) && (postdata.firstProcurementMonth = DateUtils.getNepaliMonthIndexByFiscalYear(DateUtils.getSeparatedDateFromMilliseconds(props.villageClinicServiceDate).month));
      data.contraceptiveDevice === "DEPO" && (data.cycle = 3);
      let validMonths = getValidMonth(currentMonth, data.cycle);
      data.procurementDate = data.procurementDate && DateUtils.getDateMilliseconds(data.procurementDate);
      let completionMonth = currentMonth + Number(data.cycle);
      postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].validMonths = postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].validMonths.concat(validMonths.validMonths);
      (completionMonth < 13) && postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].refillMonths.push(NEPALI_MONTH_LIST[completionMonth - 1]);
      postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].procurementDetails?.push({
        cycle: data.cycle,
        procurementMonth: NEPALI_MONTH_LIST[currentMonth - 1],
        contraceptiveDevice: data.contraceptiveDevice,
        procurementDate: data.procurementDate,
        procurementDay: DateUtils.getSeparatedDateFromMilliseconds(data.procurementDate).day,
        condomCount: data.condomCount,
        villageClinicId: villageClinicId,
        villageClinicPatientType: data.patientType,
        villageClinicRemarks: data.remarks
      })
      if ((validMonths.validMonthsForNextFiscalYear.length !== 0)) {
        let nextFiscalYear = (Number(currentFiscalYear.substring(0, 4)) + 1) + "_" + (Number(currentFiscalYear.substr(-2)) + 1);
        let refillMonths;
        completionMonth === 13 ? refillMonths = ["SHRAWAN"] : completionMonth === 14 ? refillMonths = ["BHADAU"] : refillMonths = ["ASWIN"];
        postdata.pillsDepoDetailsByFiscalYearMap[`${nextFiscalYear}`] = {
          validMonths: validMonths.validMonthsForNextFiscalYear,
          refillMonths: refillMonths,
        }
        Object.assign(postdata.pillsDepoDetailsByFiscalYearMap[`${nextFiscalYear}`], { validMonths: validMonths.validMonthsForNextFiscalYear, refillMonths: refillMonths })
      }
    } else {
      postdata.pillsDepoDetailsByFiscalYearMap[currentFiscalYear].procurementDetails?.push({
        contraceptiveDevice: "CONDOM_ONLY",
        condomCount: data.condomCount,
        villageClinicId: villageClinicId,
        villageClinicPatientType: data.patientType,
        procurementDate: props.villageClinicServiceDate,
        procurementDay: DateUtils.getSeparatedDateFromMilliseconds(props.villageClinicServiceDate).day,
        procurementMonth: NEPALI_MONTH_LIST[currentMonth - 1],
        villageClinicRemarks: data.remarks
      })
    }
    return postdata;
  }

  const buildPostDataForNewPatient = (data) => {
    data.id = modalDefaultValues.id;
    data.villageClinicId = villageClinicId;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = props.villageClinicServiceDate;
    let currentFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate));
    let currentMonth = DateUtils.getSeparatedDateFromMilliseconds(props.villageClinicServiceDate).month - 3;
    currentMonth === 0 ? currentMonth = 12 : currentMonth === -1 ? currentMonth = 11 : currentMonth === -2 && (currentMonth = 10);
    data.pillsDepoDetailsByFiscalYearMap = {};
    if (!onlyCondom) {
      data.contraceptiveDevice === "DEPO" && (data.cycle = 3);
      let validMonths = getValidMonth(currentMonth, data.cycle);
      data.firstProcurementFiscalYear = data.procurementDate && DateUtils.getFiscalYearFromDate(data.procurementDate);
      data.firstProcurementMonth = NEPALI_MONTH_LIST[currentMonth - 1];
      data.dartaaMiti = data.procurementDate && DateUtils.getDateMilliseconds(data.procurementDate);
      let completionMonth = currentMonth + Number(data.cycle);
      data.pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`] = {
        validMonths: validMonths.validMonths,
        refillMonths: completionMonth < 13 ? [NEPALI_MONTH_LIST[completionMonth - 1]] : [],
        procurementDetails: [
          {
            cycle: data.cycle,
            procurementMonth: NEPALI_MONTH_LIST[currentMonth - 1],
            contraceptiveDevice: data.contraceptiveDevice,
            procurementDate: data.dartaaMiti,
            procurementDay: DateUtils.getSeparatedDateFromMilliseconds(data.dartaaMiti).day,
            condomCount: data.condomCount,
            villageClinicPatientType: data.patientType,
            villageClinicId: villageClinicId,
            villageClinicRemarks: data.remarks,
          }
        ]
      }
      if ((validMonths.validMonthsForNextFiscalYear.length !== 0) || completionMonth === 13) {
        let nextFiscalYear = (Number(currentFiscalYear.substring(0, 4)) + 1) + "_" + (Number(currentFiscalYear.substr(-2)) + 1);
        let refillMonths;
        completionMonth === 13 ? refillMonths = ["SHRAWAN"] : completionMonth === 14 ? refillMonths = ["BHADAU"] : refillMonths = ["ASWIN"];
        data.pillsDepoDetailsByFiscalYearMap[`${nextFiscalYear}`] = {
          validMonths: validMonths.validMonthsForNextFiscalYear,
          refillMonths: refillMonths,
        }
      }
    } else {
      data.pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`] = {
        procurementDetails: [
          {
            contraceptiveDevice: "CONDOM_ONLY",
            condomCount: data.condomCount,
            villageClinicId: villageClinicId,
            villageClinicPatientType: data.patientType,
            procurementDate: data.dartaaMiti,
            procurementDay: DateUtils.getSeparatedDateFromMilliseconds(data.dartaaMiti).day,
            procurementMonth: NEPALI_MONTH_LIST[currentMonth - 1],
            villageClinicRemarks: data.remarks
          }
        ]
      }
    }
    delete (data.cycle);
    delete (data.contraceptiveDevice);
    delete (data.procurementDate);
    delete (data.patientType);
    delete (data.remarks);
    return data;
  }

  const onSubmit = data => {
    let postdata = {};
    let errorObject = {};
    if (JSON.stringify(previousPatientDetail) !== "{}") {
      postdata = buildPostDataForPreviousPatient(data);
    } else if (modalDefaultValues.id && pillsDepoDetailsList.length) {
      pillsDepoDetailsList.map((item, index) => {
        if (item[`${"contraceptiveDevice"}~${index}`] !== "CONDOM_ONLY") {
          !item[`${"cycle"}~${index}`] && Object.assign(errorObject, { [`${"cycle"}~${index}`]: true })
          if (item[`${"cycle"}~${index}`] > 3 || item[`${"cycle"}~${index}`] < 1) {
            Object.assign(errorObject, { [`${"cycle"}~${index}~${"length"}`]: true })
          }
          !item[`${"contraceptiveDevice"}~${index}`] && Object.assign(errorObject, { [`${"contraceptiveDevice"}~${index}`]: true })
          !item[`${"procurementDate"}~${index}`] && Object.assign(errorObject, { [`${"procurementDate"}~${index}`]: true })
        } else {
          !item[`${"condomCount"}~${index}`] && Object.assign(errorObject, { [`${"condomCount"}~${index}`]: true })
        }
      }
      )
      setCustomError(errorObject);
      if (JSON.stringify(errorObject) === "{}") {
        postdata = buildPostDataForEdit(data);
      }
    } else {
      postdata = buildPostDataForNewPatient(data);
    }
    (JSON.stringify(errorObject) === "{}") &&
      HMIS.post(API_URL.pariwaarNiyojanSewaRegister, postdata).then(response => {
        if (response.data.type === SUCCESS) {
          getRegisterDataFromClinicId();
          closeModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getValidMonth = (month, cycle) => {
    let validMonths = [];
    let validMonthsForNextFiscalYear = [];
    for (let i = month; i < (month + Number(cycle)); i++) {
      i < 13 ? validMonths.push(NEPALI_MONTH_LIST[i - 1]) : i === 13 ? (validMonthsForNextFiscalYear = ["SHRAWAN"]) : validMonthsForNextFiscalYear = ["SHRAWAN", "BHADAU"];
    }
    return { validMonths: validMonths, validMonthsForNextFiscalYear: validMonthsForNextFiscalYear };
  }

  const handleCheckboxChange = (event) => {
    setOnlyCondom(event.target.checked);
  }

  const handleCustomReactSelectChange = (name, value) => {
    setIsPreviousPatient(value === PREVIOUS_PATIENT);
    (value === NEW_PATIENT) && setPreviousPatientDetail({});
    setValue(name, value);
    setPatientType(value);
  }

  const closeModal = () => {
    setModalDefaultValues({});
    setPillsDepoDetailsList([]);
    setIsPreviousPatient(false);
    setVillegeDartaaNumber("");
    setPreviousPatientDetail({});
    reset({});
    setShowModal(false);
    setShowPillsCycleField(false);
    setModalTitle("परिवार नियोजन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setVillageClinicDartaaNumberLabel("");
    setAgeUnitLabel("");
    setDisablePatientTypeSelect(false);
    setOnlyCondom(false);
    setPatientType("");
    setClinicIndex("");
  }

  const handlePillsOrDepoInputChange = (e) => {
    setShowPillsCycleField(e.target.value === "PILLS");
    setValue("contraceptiveDevice", e.target.value);
  }

  const handleRowEdit = id => {
    HMIS.get(API_URL.pillsDepoServiceRegister + "/" + id).then(response => {
      if (response.data.type === SUCCESS) {
        let jsondata = response.data;
        jsondata.data.dartaaMiti = jsondata.data.dartaaMiti && DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
        jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
        let pillsDepoDetails = jsondata.data.pillsDepoDetailsByFiscalYearMap;
        setModalDefaultValues(jsondata.data);
        buildPillsDepoDetailList(pillsDepoDetails);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowModal(true);
        setValue("villageClinicDartaaNumber", jsondata.data.villageClinicDartaaNumber);
        setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === jsondata.data.villageClinicDartaaNumber));
        setValue("ageUnit", jsondata.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
        setDisablePatientTypeSelect(true);
      }
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  const buildPostDataForEdit = (data) => {
    let pillsDepoObject = data;
    pillsDepoObject.id = modalDefaultValues.id;
    pillsDepoObject.villageClinicId = villageClinicId;
    pillsDepoObject.isExistingVillageClinicProcurement = true;
    pillsDepoObject.palikaName = pillsDepoObject.palikaName && AppMisc.getMunicipalityValueFromLabel(pillsDepoObject.palikaName);
    pillsDepoObject.dartaaMiti = pillsDepoDetailsList[0][[`${"procurementDate"}~0`]];
    let pillsDepoDetailsByFiscalYearMap = {};
    let procurementDetails = [];
    let refillMonths = [];
    let validMonths = [];
    let previousFiscalYear;
    let currentFiscalYear;
    let dataObject = {};
    let minimumDate;
    pillsDepoDetailsList.map((item, index) => {
      currentFiscalYear = DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(item[`${"procurementDate"}~${index}`]));
      previousFiscalYear = (index > 0 && DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(pillsDepoDetailsList[index - 1][`${"procurementDate"}~${index - 1}`]))) || currentFiscalYear;
      if (previousFiscalYear !== currentFiscalYear) {
        procurementDetails = [];
        validMonths = [];
        refillMonths = [];
        if (pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`]) {
          validMonths = pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`].validMonths;
          refillMonths = pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`].refillMonths;
        }
      }
      if (item[`${"contraceptiveDevice"}~${index}`] !== "CONDOM_ONLY") {
        if ((minimumDate > item[`${"procurementDate"}~${index}`]) || !minimumDate) {
          minimumDate = item[`${"procurementDate"}~${index}`]
        }
        dataObject = buildPillsDepoDetailsByFiscalYearObject(item, index, currentFiscalYear);
        procurementDetails.push(dataObject.current.procurementDetails);
        validMonths = validMonths.concat(dataObject.current.validMonths);
        dataObject.current.refillMonths && refillMonths.push(dataObject.current.refillMonths);
        pillsDepoDetailsByFiscalYearMap[`${dataObject.current.currentFiscalYear}`] = {
          procurementDetails: procurementDetails,
          validMonths: validMonths,
          refillMonths: refillMonths,
        }
        if (dataObject.next) {
          pillsDepoDetailsByFiscalYearMap[`${dataObject.next.nextFiscalYear}`] = {
            validMonths: dataObject.next.validMonths,
            refillMonths: [dataObject.next.refillMonths],
          }
        }
      } else {
        procurementDetails.push({
          contraceptiveDevice: "CONDOM_ONLY",
          condomCount: item[`${"condomCount"}~${index}`],
          villageClinicId: item[`${"villageClinicId"}~${index}`],
          villageClinicPatientType: item[`${"villageClinicPatientType"}~${index}`],
          procurementDate: item[`${"procurementDate"}~${index}`],
          villageClinicRemarks: item[`${"villageClinicRemarks"}~${index}`],
          procurementMonth: !Number(item[`${"procurementMonth"}~${index}`]) ? item[`${"procurementMonth"}~${index}`] : NEPALI_MONTH_LIST[item[`${"procurementMonth"}~${index}`] - 1],
          procurementDay: item[`${"procurementDay"}~${index}`]
        })
        pillsDepoDetailsByFiscalYearMap[`${currentFiscalYear}`] = {
          procurementDetails: procurementDetails,
          validMonths: validMonths,
          refillMonths: refillMonths,
        }
      }
    })
    pillsDepoObject.firstProcurementFiscalYear = minimumDate && DateUtils.getFiscalYearFromDate(DateUtils.getDateFromMilliseconds(minimumDate));
    pillsDepoObject.firstProcurementMonth = minimumDate && DateUtils.getNepaliMonthIndexByFiscalYear(DateUtils.getSeparatedDateFromMilliseconds(minimumDate).month);
    pillsDepoObject.pillsDepoDetailsByFiscalYearMap = pillsDepoDetailsByFiscalYearMap;
    return pillsDepoObject;
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
      condomCount: item[`${"condomCount"}~${index}`],
      villageClinicId: item[`${"villageClinicId"}~${index}`],
      villageClinicPatientType: item[`${"villageClinicPatientType"}~${index}`],
      villageClinicRemarks: item[`${"villageClinicRemarks"}~${index}`]
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

  const handlePillsDepoDetailsInputChange = (index, event) => {
    const values = [...pillsDepoDetailsList];
    if (!onlyCondom) {
      if (event.target.name === `${"contraceptiveDevice"}~${index}`) {
        if (event.target.value === "DEPO") {
          values[index][`${"cycle"}~${index}`] = "3";
        }
      }
      values[index][event.target.name] = event.target.value;
    } else {
      values[index][`${"contraceptiveDevice"}~${index}`] = "CONDOM_ONLY";
      delete values[index][`${"cycle"}~${index}`];
      values[index][event.target.name] = event.target.value;
    }
    setPillsDepoDetailsList(values);
  };

  useEffect(() => {
    if (onlyCondom && (clinicIndex !== "") && pillsDepoDetailsList.length) {
      let values = [...pillsDepoDetailsList];
      values[clinicIndex][`${"contraceptiveDevice"}~${clinicIndex}`] = "CONDOM_ONLY"
      values[clinicIndex][`${"condomCount"}~${clinicIndex}`] = "";
      setPillsDepoDetailsList(values);
    }
  }, [onlyCondom])

  const buildPillsDepoDetailList = (pillsDepoDetails) => {
    let list = [];
    let index = 0;
    let keys = Object.keys(pillsDepoDetails).sort();
    for (let i in keys) {
      pillsDepoDetails[keys[i]].procurementDetails?.map((item) => {
        list.push({
          [`${"contraceptiveDevice"}~${index}`]: item.contraceptiveDevice,
          [`${"cycle"}~${index}`]: item.cycle,
          [`${"procurementDate"}~${index}`]: item.procurementDate,
          [`${"procurementDay"}~${index}`]: item.procurementDay,
          [`${"procurementMonth"}~${index}`]: NEPALI_MONTH_LIST.indexOf(item.procurementMonth) + 1,
          [`${"condomCount"}~${index}`]: item.condomCount,
          [`${"villageClinicPatientType"}~${index}`]: item.villageClinicPatientType,
          [`${"villageClinicId"}~${index}`]: item.villageClinicId,
          [`${"villageClinicRemarks"}~${index}`]: item.villageClinicRemarks
        });
        if (item.villageClinicId === villageClinicId) {
          setClinicIndex(index);
          setOnlyCondom(item.contraceptiveDevice === "CONDOM_ONLY");
          setPatientType(item.villageClinicPatientType);
        }
        index++;
      })
    }
    setPillsDepoDetailsList(list);
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">परिवार नियोजन सेवा</Typography>
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
              <CustomReactSelect
                name="patientType"
                options={PATIENT_TYPES}
                onChange={handleCustomReactSelectChange}
                defaultValue={patientType}
                label="सेवा दर्ताको प्रकार"
                isDisabled={disablePatientTypeSelect}
              />
              {errors.patientType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="गाउँघर क्लिनिक दर्ता नं."
                options={villageClinicDartaaNumbers}
                value={villageClinicDartaaNumberLabel}
                name="villageClinicDartaaNumber"
                variant="outlined"
                onChange={handleVillageClinicDartaaNumberChange}
              />
              {errors.villageClinicDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
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
                label="सेवाग्राहीको उमेर"
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
                  readOnly: true
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
            <Grid item xs={2}>
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
        </Box>
        <Box className={classes.PariwaarNiyojanSaadhanDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">परिवार नियोजनको साधन विवरण</Typography>
          </Box>
          {(!pillsDepoDetailsList.length) ? (
            <div>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <FormControlLabel
                    classes={{
                      label: classes.checkboxLabelSmall,
                    }}
                    label="कन्डम मात्र लिन आएको"
                    control={
                      <Checkbox
                        defaultChecked={modalDefaultValues.convulsion}
                        variant="outlined"
                        onChange={handleCheckboxChange}
                        color="primary"
                      />
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                {!onlyCondom && (
                  <div>
                    <Grid item xs={2}>
                      <FormControl component="fieldset">
                        <RadioGroup
                          name="contraceptiveDevice"
                          onChange={handlePillsOrDepoInputChange}
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
                      {errors.contraceptiveDevice && <span className="error-message">{REQUIRED_FIELD}</span>}
                    </Grid>
                    {showPillsCycleField && (
                      <Grid item xs>
                        <Tooltip title="सेवा लिन आएको महिनामा सेवाग्राहीलाई दिएको पिल्सको साइकल संख्या लेख्नुहोस्।" placement="top" arrow>
                          <TextField
                            name="cycle"
                            type="number"
                            label="पिल्सको साइकल संख्या"
                            placeholder="पिल्सको साइकल संख्या"
                            variant="outlined"
                            inputRef={register({
                              required: true,
                              min: 1,
                              max: 3
                            })}
                            size="small"
                            fullWidth
                          />
                        </Tooltip>
                        {errors.cycle && errors.cycle.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
                        {errors.cycle && (errors.cycle.type === "min" || errors.cycle.type === "max") && (<span className="error-message">{BETWEEN_ONE_AND_THREE}</span>)}
                      </Grid>
                    )}
                    <Grid item xs>
                      <TextField
                        label="आएको मिति"
                        name="procurementDate"
                        variant="outlined"
                        inputRef={register}
                        defaultValue={props.villageClinicServiceDate && DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)}
                        size="small"
                        InputProps={{ readOnly: true }}
                        fullWidth
                      />
                    </Grid>
                  </div>
                )}
                <Grid item xs>
                  <TextField
                    label="कण्डम(गोटा)"
                    type="number"
                    name="condomCount"
                    variant="outlined"
                    inputRef={register({
                      min: 0,
                      required: onlyCondom
                    })}
                    size="small"
                    fullWidth
                  />
                  {errors.condomCount && errors.condomCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                  {errors.condomCount && errors.condomCount.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <TextField
                    label="कैफियत"
                    name="remarks"
                    variant="outlined"
                    inputRef={register}
                    size="small"
                    fullWidth
                    multiline
                  />
                </Grid>
              </Grid>
            </div>
          ) :
            <div>
              <Box className={classes.pillsDepoDetailsContainer}>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid item xs>
                    <FormControlLabel
                      classes={{
                        label: classes.checkboxLabelSmall,
                      }}
                      label="कन्डम मात्र लिन आएको"
                      control={
                        <Checkbox
                          checked={onlyCondom}
                          variant="outlined"
                          onChange={handleCheckboxChange}
                          color="primary"
                        />
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  {!onlyCondom && (
                    <div>
                      <Grid item xs={2}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            name={`${"contraceptiveDevice"}~${clinicIndex}`}
                            onChange={event => handlePillsDepoDetailsInputChange(clinicIndex, event)}
                            defaultValue={pillsDepoDetailsList[clinicIndex][`${"contraceptiveDevice"}~${clinicIndex}`]}
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
                        {customError[`${"contraceptiveDevice"}~${clinicIndex}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                      </Grid>
                      {pillsDepoDetailsList[clinicIndex][`${"contraceptiveDevice"}~${clinicIndex}`] === "PILLS" &&
                        <Grid item xs={2}>
                          <Tooltip title="सेवा लिन आएको महिनामा सेवाग्राहीलाई दिएको पिल्सको साइकल संख्या लेख्नुहोस्।" placement="top" arrow>
                            <TextField
                              name={`${"cycle"}~${clinicIndex}`}
                              type="number"
                              onChange={event => handlePillsDepoDetailsInputChange(clinicIndex, event)}
                              label="पिल्सको साइकल संख्या"
                              placeholder="पिल्सको साइकल संख्या"
                              defaultValue={pillsDepoDetailsList[clinicIndex][`${"cycle"}~${clinicIndex}`]}
                              variant="outlined"
                              size="small"
                              fullWidth
                            />
                          </Tooltip>
                          {customError[`${"cycle"}~${clinicIndex}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                          {customError[`${"cycle"}~${clinicIndex}~${"length"}`] && <span className="error-message">{BETWEEN_ONE_AND_THREE}</span>}
                        </Grid>
                      }
                      <Grid item xs={2}>
                        <TextField
                          label="सेवा लिन आएको मिति"
                          name={`${"procurementDate"}~${clinicIndex}`}
                          variant="outlined"
                          onChange={(event) => handleProcurementDateChange(event.target.value, clinicIndex)}
                          defaultValue={props.villageClinicServiceDate && DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)}
                          size="small"
                          InputProps={{ readOnly: true }}
                          fullWidth
                        />
                      </Grid>
                    </div>
                  )}
                  <Grid item xs>
                    <TextField
                      label="कण्डम(गोटा)"
                      type="number"
                      name={`${"condomCount"}~${clinicIndex}`}
                      value={pillsDepoDetailsList[clinicIndex][`${"condomCount"}~${clinicIndex}`]}
                      onChange={event => handlePillsDepoDetailsInputChange(clinicIndex, event)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                    {customError[`${"condomCount"}~${clinicIndex}`] && (<span className="error-message">{REQUIRED_FIELD}</span>)}
                  </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid item xs>
                    <TextField
                      label="कैफियत"
                      name={`${"villageClinicRemarks"}~${clinicIndex}`}
                      variant="outlined"
                      defaultValue={pillsDepoDetailsList[clinicIndex][`${"villageClinicRemarks"}~${clinicIndex}`]}
                      onChange={event => handlePillsDepoDetailsInputChange(clinicIndex, event)}
                      size="small"
                      fullWidth
                      multiline
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          }
        </Box>
      </CustomModal>
      <PariwaarNiyojanSewaRegister tableData={registerData} showActionColumn={registerData.length !== 0} onEditRow={handleRowEdit} />
    </div>
  )
}