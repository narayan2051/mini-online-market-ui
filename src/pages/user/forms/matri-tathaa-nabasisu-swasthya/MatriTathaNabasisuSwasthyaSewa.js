import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon, Cancel } from "@material-ui/icons";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomReactSelect from "../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../utils/constants";
import { CHILD_CONDITION, CONGENITAL_ANOMALIES, GRANTED, HIV_STATUS, MOTHER_SITUATION, MUL_DARTA_NUMBERS_LIST, NEPALI_MONTHS, NOT_GRANTED, OTHER_LOCATION, SAFE_MOTHERHOOD_MAIN_REGISTER_SERVICE_CODE, SON_OR_DAUGHTER } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import MatriTathaNabasisuSwasthyaSewaRegister from "../../components/registers/matri-tatha-nabasisu-swasthya-register/MatriTathaNabasisuSwasthyaSewaRegister";
import styles from "./style";

export default function MatriTathaNabasisuSwasthyaSewa() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, setValue, handleSubmit, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showMatriTathaNabasisuSwasthyaModal, setShowMatriTathaNabasisuSwasthyaModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("मातृ तथा नवशिशु स्वास्थ्य सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [aliveChildrenDetails, setAliveChildrenDetails] = useState([]);
  const [customError, setCustomError] = useState({});

  const [registerDate, setRegisterDate] = useState({
    fromDate: null,
    toDate: null
  });

  useEffect(() => {
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });

    register({ name: "lmpDate" }, { required: true });
    register({ name: "firstMeetDate" }, { required: true });
    register({ name: "fourthMonthDate" });
    register({ name: "fifthMonthDate" });
    register({ name: "sixthMonthDate" });
    register({ name: "seventhMonthDate" });
    register({ name: "eighthMonthDate" });
    register({ name: "ninthMonthDate" });
    register({ name: "protocolDate" });
    register({ name: "wormMedicineDate" });

    register({ name: "ectopicPregnancyTestMonth" });
    register({ name: "ectopicPregnancyPrasutiTestMonth" });
    register({ name: "abortionComplicationTestMonth" });
    register({ name: "hyperTensionPregnancyTestMonth" });
    register({ name: "hyperTensionPrasutiTestMonth" });
    register({ name: "hyperTensionSutkeriTestMonth" });
    register({ name: "severePrasutiTestMonth" });
    register({ name: "severeSutkeriTestMonth" });
    register({ name: "eclampsiaPregnancyTestMonth" });
    register({ name: "eclampsiaPrasutiTestMonth" });
    register({ name: "eclampsiaSutkeriMonth" });
    register({ name: "gravidarumPregnancyTestMonth" });
    register({ name: "gravidarumPrasutiTestMonth" });
    register({ name: "gravidarumSutkeriTestMonth" });
    register({ name: "aphPregnancyTestMonth" });
    register({ name: "prolongedPrasutiTestMonth" });
    register({ name: "obstructedPrasutiTestMonth" });
    register({ name: "rupturedTestMonth" });
    register({ name: "rupturedPrasutiTestMonth" });
    register({ name: "rupturedSutkeriTestMonth" });
    register({ name: "pphSutkeriTestMonth" });
    register({ name: "retainedPrasutiTestMonth" });
    register({ name: "retainedSutkeriTestMonth" });
    register({ name: "pueperalPrasutiTestMonth" });
    register({ name: "pueperalSutkeriTestMonth" });
    register({ name: "severePregnancyTestMonth" });
    register({ name: "motherDeathSituation" });
    register({ name: "hivStatusValue" });
    register({ name: "partnerHivStatus" });

    register({ name: "hivTestDate" });
    register({ name: "artStartedDate" });
    register({ name: "bharnaGardakoMiti" });
    register({ name: "sutkeriJachFirstTime" });
    register({ name: "sutkeriJachSecondTime" });
    register({ name: "sutkeriJachThirdTime" });
    register({ name: "sutkeriJachThapTime" });
    register({ name: "protocalWiseThirdTime" });
    register({ name: "vitaminADate" });
    register({ name: "ironFolicAcidChakkiDate" });
    register({ name: "garbhawatiAwasthamaRagatDiyekoMiti" });
    register({ name: "prasutiAwasthamaRagatDiyekoMiti" });
    register({ name: "sutkeriAwasthamaRagatDiyekoMiti" });
    register({ name: "prasutiGardakoMiti" });
    register({ name: "dischargeDate" });
    register({ name: "motherDeathDate" });
    register({ name: "childDeathDate" });

    attachMulDartaaOptions();
  }, [register]);

  const handleAddAliveChildrenDetails = () => {
    const values = [...aliveChildrenDetails];
    values.push({});
    setAliveChildrenDetails(values);
  }

  const buildAliveChildrenDetailsForSubmit = () => {
    let childrenDetails = [];
    aliveChildrenDetails.map((aliveChildrenDetail, index) => {
      childrenDetails.push({
        gender: aliveChildrenDetail[`${"gender"}~${index}`],
        weightInGrams: aliveChildrenDetail[`${"weightInGrams"}~${index}`],
        nabhiMalamkoPrayog: aliveChildrenDetail[`${"nabhiMalamkoPrayog"}~${index}`] || false,
        childSituation: aliveChildrenDetail[`${"childSituation"}~${index}`],
        congenitalAnomalies: aliveChildrenDetail[`${"congenitalAnomalies"}~${index}`],
        nawashishulaiDiyekoUpachar: aliveChildrenDetail[`${"nawashishulaiDiyekoUpachar"}~${index}`]
      })
    })
    return childrenDetails;
  }

  const buildAliveChildrenDetailsForDisplay = (details) => {
    let childrenDetails = []
    details.map((childrenDetail, index) => {
      childrenDetails.push({
        [`${"gender"}~${index}`]: childrenDetail.gender,
        [`${"weightInGrams"}~${index}`]: childrenDetail.weightInGrams,
        [`${"nabhiMalamkoPrayog"}~${index}`]: childrenDetail.nabhiMalamkoPrayog,
        [`${"childSituation"}~${index}`]: childrenDetail.childSituation,
        [`${"congenitalAnomalies"}~${index}`]: childrenDetail.congenitalAnomalies,
        [`${"nawashishulaiDiyekoUpachar"}~${index}`]: childrenDetail.nawashishulaiDiyekoUpachar
      })
      setAliveChildrenDetails(childrenDetails);
    })
  }

  useEffect(() => {
    registerDate.fromDate && registerDate.toDate &&
      getListOfMatriTathaNawasisuSwasthyaSewa();
  }, [registerDate]);

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const handleRegisterFromDateChange = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        fromDate: date
      }));
  }

  const handleRegisterToDateChange = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        toDate: date
      }));
  }

  const lmpDateChange = (date) => {
    let dateAfterNineMonths = DateUtils.getMonthsAfterBSDate(9, date);
    setValue("eddDate", date ? DateUtils.getDaysAfterBSDate(7, dateAfterNineMonths) : "");
    setValue("lmpDate", date);
  }

  const fourthMonthDateChange = (date) => {
    setValue("fourthMonthDate", date);
  }

  const fifthMonthDateChange = (date) => {
    setValue("fifthMonthDate", date);
  }

  const sixthMonthDateChange = (date) => {
    setValue("sixthMonthDate", date);
  }

  const seventhMonthDateChange = (date) => {
    setValue("seventhMonthDate", date);
  }

  const eighthMonthDateChange = (date) => {
    setValue("eighthMonthDate", date);
  }

  const ninthMonthDateChange = (date) => {
    setValue("ninthMonthDate", date);
  }

  const protocolDateChange = (date) => {
    setValue("protocolDate", date);
  }

  const wormMedicineDateChange = (date) => {
    setValue("wormMedicineDate", date);
  }

  const hivTestDateChange = (date) => {
    setValue("hivTestDate", date);
  }

  const artStartedDateChange = (date) => {
    setValue("artStartedDate", date);
  }

  const bharnaGardakoMitiChange = (date) => {
    setValue("bharnaGardakoMiti", date);
  }

  const prasutiGardakoMitiChange = (date) => {
    setValue("prasutiGardakoMiti", date);
  }

  const sutkeriJachFirstTimeChange = (date) => {
    setValue("sutkeriJachFirstTime", date);
  }

  const sutkeriJachSecondTimeChange = (date) => {
    setValue("sutkeriJachSecondTime", date);
  }

  const sutkeriJachThirdTimeChange = (date) => {
    setValue("sutkeriJachThirdTime", date);
  }

  const sutkeriJachThapTimeChange = (date) => {
    setValue("sutkeriJachThapTime", date);
  }

  const protocalWiseThirdTimeChange = (date) => {
    setValue("protocalWiseThirdTime", date);
  }

  const vitaminADateChange = (date) => {
    setValue("vitaminADate", date);
  }

  const ironFolicAcidChakkiDateChange = (date) => {
    setValue("ironFolicAcidChakkiDate", date);
  }

  const garbhawatiAwasthamaRagatDiyekoMitiChange = (date) => {
    setValue("garbhawatiAwasthamaRagatDiyekoMiti", date);
  }

  const prasutiAwasthamaRagatDiyekoMitiChange = (date) => {
    setValue("prasutiAwasthamaRagatDiyekoMiti", date);
  }

  const sutkeriAwasthamaRagatDiyekoMitiChange = (date) => {
    setValue("sutkeriAwasthamaRagatDiyekoMiti", date);
  }

  const dischargeDateChange = (date) => {
    setValue("dischargeDate", date);
  }

  const motherDeathDateChange = (date) => {
    setValue("motherDeathDate", date);
  }

  const childDeathDateChange = (date) => {
    setValue("childDeathDate", date);
  }

  const handleAliveChildrenDetailsInputChange = (index, event) => {
    const values = [...aliveChildrenDetails];
    if (event.target.name === `${"nabhiMalamkoPrayog"}~${index}`) {
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setAliveChildrenDetails(values);
  }

  const handleRemoveAliveChildrenDetails = index => {
    const values = [...aliveChildrenDetails];
    values.splice(index, 1);
    setAliveChildrenDetails(values);
  };

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
    setValue("firstMeetDate", DateUtils.getDateFromMilliseconds(patientDetails.dartaaMiti))

    setModalDefaultValues(prev => ({
      ...prev,
      casteCode: patientDetails.casteCode,
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

  const handleMulDartaaChange = (name, value, mulDartaaOption) => {
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

  const getListOfMatriTathaNawasisuSwasthyaSewa = () => {
    HMIS.get(API_URL.matriTathaNawasisuSwasthyaSewaRegister + "/first-meet-date?fromDate=" + DateUtils.getDateMilliseconds(registerDate.fromDate) + "&&toDate=" + DateUtils.getDateMilliseconds(registerDate.toDate))
      .then(response => {
        setMainRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const onSubmit = data => {
    let errorObject = {};
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.villageClinicSurakshitMatrittoObjectId = modalDefaultValues.villageClinicSurakshitMatrittoObjectId;
    if (aliveChildrenDetails.length) {
      aliveChildrenDetails.map((aliveChildrenDetail, index) => {
        !aliveChildrenDetail[`${"gender"}~${index}`] && Object.assign(errorObject, { [`${"gender"}~${index}`]: true });
        !aliveChildrenDetail[`${"weightInGrams"}~${index}`] && Object.assign(errorObject, { [`${"weightInGrams"}~${index}`]: true });
        !aliveChildrenDetail[`${"childSituation"}~${index}`] && Object.assign(errorObject, { [`${"childSituation"}~${index}`]: true });
      })
      setCustomError(errorObject);
      data.nawasisuDetailsList = buildAliveChildrenDetailsForSubmit();
    }

    data.lmpDate = data.lmpDate && DateUtils.getDateMilliseconds(data.lmpDate);
    data.eddDate = data.eddDate && DateUtils.getDateMilliseconds(data.eddDate);
    data.firstMeetDate = data.firstMeetDate && DateUtils.getDateMilliseconds(data.firstMeetDate);
    data.fourthMonthDate = data.fourthMonthDate && DateUtils.getDateMilliseconds(data.fourthMonthDate);
    data.fifthMonthDate = data.fifthMonthDate && DateUtils.getDateMilliseconds(data.fifthMonthDate);
    data.sixthMonthDate = data.sixthMonthDate && DateUtils.getDateMilliseconds(data.sixthMonthDate);
    data.seventhMonthDate = data.seventhMonthDate && DateUtils.getDateMilliseconds(data.seventhMonthDate);
    data.eighthMonthDate = data.eighthMonthDate && DateUtils.getDateMilliseconds(data.eighthMonthDate);
    data.ninthMonthDate = data.ninthMonthDate && DateUtils.getDateMilliseconds(data.ninthMonthDate);
    data.protocolDate = data.protocolDate && DateUtils.getDateMilliseconds(data.protocolDate);
    data.wormMedicineDate = data.wormMedicineDate && DateUtils.getDateMilliseconds(data.wormMedicineDate);

    data.hivTestDate = data.hivTestDate && DateUtils.getDateMilliseconds(data.hivTestDate);
    data.artStartedDate = data.artStartedDate && DateUtils.getDateMilliseconds(data.artStartedDate);
    data.bharnaGardakoMiti = data.bharnaGardakoMiti && DateUtils.getDateMilliseconds(data.bharnaGardakoMiti);
    data.sutkeriJachFirstTime = data.sutkeriJachFirstTime && DateUtils.getDateMilliseconds(data.sutkeriJachFirstTime);
    data.sutkeriJachSecondTime = data.sutkeriJachSecondTime && DateUtils.getDateMilliseconds(data.sutkeriJachSecondTime);
    data.sutkeriJachThirdTime = data.sutkeriJachThirdTime && DateUtils.getDateMilliseconds(data.sutkeriJachThirdTime);
    data.sutkeriJachThapTime = data.sutkeriJachThapTime && DateUtils.getDateMilliseconds(data.sutkeriJachThapTime);
    data.protocalWiseThirdTime = data.protocalWiseThirdTime && DateUtils.getDateMilliseconds(data.protocalWiseThirdTime);
    data.vitaminADate = data.vitaminADate && DateUtils.getDateMilliseconds(data.vitaminADate);
    data.ironFolicAcidChakkiDate = data.ironFolicAcidChakkiDate && DateUtils.getDateMilliseconds(data.ironFolicAcidChakkiDate);
    data.garbhawatiAwasthamaRagatDiyekoMiti = data.garbhawatiAwasthamaRagatDiyekoMiti && DateUtils.getDateMilliseconds(data.garbhawatiAwasthamaRagatDiyekoMiti);
    data.prasutiAwasthamaRagatDiyekoMiti = data.prasutiAwasthamaRagatDiyekoMiti && DateUtils.getDateMilliseconds(data.prasutiAwasthamaRagatDiyekoMiti);
    data.sutkeriAwasthamaRagatDiyekoMiti = data.sutkeriAwasthamaRagatDiyekoMiti && DateUtils.getDateMilliseconds(data.sutkeriAwasthamaRagatDiyekoMiti);
    data.prasutiGardakoMiti = data.prasutiGardakoMiti && DateUtils.getDateMilliseconds(data.prasutiGardakoMiti);
    data.dischargeDate = data.dischargeDate && DateUtils.getDateMilliseconds(data.dischargeDate);
    data.motherDeathDate = data.motherDeathDate && DateUtils.getDateMilliseconds(data.motherDeathDate);
    data.childDeathDate = data.childDeathDate && DateUtils.getDateMilliseconds(data.childDeathDate);
    let totalBloodParimaan = (Number(data.garbhawatiAwasthaParimaan) || 0) + (Number(data.prasutiAwasthaParimaan) || 0) + (Number(data.sutkariAwasthaParimaan) || 0);
    if (totalBloodParimaan) {
      data.totalBloodParimaan = totalBloodParimaan;
    }

    // TODO : Sandeep - Select value should be something while submitting form to backend
    // if there is no value selected on select value should be something like ""
    if (!data.motherDeathSituation) {
      data.motherDeathSituation = "";
    }

    if (!data.tdKhopSewa) {
      data.tdKhopSewa = {};
    }
    JSON.stringify(errorObject) === "{}" &&
      HMIS.post(API_URL.matriTathaNawasisuSwasthyaSewaRegister, data)
        .then(response => {
          response.data.type === "success" && closeMatriTathaNabasisuSwasthyaModal();
          AddAlertMessage({
            type: response.data.type,
            message: response.data.message
          });
          getListOfMatriTathaNawasisuSwasthyaSewa();
        })
        .catch(error => {
          AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
        });
  };

  const closeMatriTathaNabasisuSwasthyaModal = () => {
    setModalDefaultValues({});
    reset();
    setShowMatriTathaNabasisuSwasthyaModal(false);
    setModalTitle("मातृ तथा नवशिशु स्वास्थ्य सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
    setAliveChildrenDetails([]);
    setCustomError({});
  }

  const matriTathaNawasisuEditFunction = id => {
    HMIS.get(API_URL.matriTathaNawasisuSwasthyaSewaRegister + "/" + id)
      .then(response => {
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.lmpDate = response.data.lmpDate && DateUtils.getDateFromMilliseconds(response.data.lmpDate);
        response.data.eddDate = response.data.eddDate && DateUtils.getDateFromMilliseconds(response.data.eddDate);
        response.data.firstMeetDate = response.data.firstMeetDate && DateUtils.getDateFromMilliseconds(response.data.firstMeetDate);
        response.data.fourthMonthDate = response.data.fourthMonthDate && DateUtils.getDateFromMilliseconds(
          response.data.fourthMonthDate
        );
        response.data.fifthMonthDate = response.data.fifthMonthDate && DateUtils.getDateFromMilliseconds(response.data.fifthMonthDate);
        response.data.sixthMonthDate = response.data.sixthMonthDate && DateUtils.getDateFromMilliseconds(response.data.sixthMonthDate);
        response.data.seventhMonthDate = response.data.seventhMonthDate && DateUtils.getDateFromMilliseconds(
          response.data.seventhMonthDate
        );
        response.data.eighthMonthDate = response.data.eighthMonthDate && DateUtils.getDateFromMilliseconds(
          response.data.eighthMonthDate
        );
        response.data.ninthMonthDate = response.data.ninthMonthDate && DateUtils.getDateFromMilliseconds(response.data.ninthMonthDate);
        response.data.protocolDate = response.data.protocolDate && DateUtils.getDateFromMilliseconds(response.data.protocolDate);
        response.data.wormMedicineDate = response.data.wormMedicineDate && DateUtils.getDateFromMilliseconds(
          response.data.wormMedicineDate
        );
        response.data.tdFirstTimeDate = response.data.tdFirstTimeDate && DateUtils.getDateFromMilliseconds(
          response.data.tdFirstTimeDate
        );
        response.data.tdSecondTimeDate = response.data.tdSecondTimeDate && DateUtils.getDateFromMilliseconds(
          response.data.tdSecondTimeDate
        );
        response.data.tdTwoPluseDate = response.data.tdTwoPluseDate && DateUtils.getDateFromMilliseconds(response.data.tdTwoPluseDate);
        response.data.hivTestDate = response.data.hivTestDate && DateUtils.getDateFromMilliseconds(response.data.hivTestDate);
        response.data.artStartedDate = response.data.artStartedDate && DateUtils.getDateFromMilliseconds(response.data.artStartedDate);
        response.data.bharnaGardakoMiti = response.data.bharnaGardakoMiti && DateUtils.getDateFromMilliseconds(
          response.data.bharnaGardakoMiti
        );
        response.data.prasutiGardakoMiti = response.data.prasutiGardakoMiti && DateUtils.getDateFromMilliseconds(
          response.data.prasutiGardakoMiti
        );
        response.data.sutkeriJachFirstTime = response.data.sutkeriJachFirstTime && DateUtils.getDateFromMilliseconds(
          response.data.sutkeriJachFirstTime
        );
        response.data.sutkeriJachSecondTime = response.data.sutkeriJachSecondTime && DateUtils.getDateFromMilliseconds(
          response.data.sutkeriJachSecondTime
        );
        response.data.sutkeriJachThirdTime = response.data.sutkeriJachThirdTime && DateUtils.getDateFromMilliseconds(
          response.data.sutkeriJachThirdTime
        );
        response.data.sutkeriJachThapTime = response.data.sutkeriJachThapTime && DateUtils.getDateFromMilliseconds(
          response.data.sutkeriJachThapTime
        );
        response.data.protocalWiseThirdTime = response.data.protocalWiseThirdTime && DateUtils.getDateFromMilliseconds(
          response.data.protocalWiseThirdTime
        );
        response.data.bhitaminADate = response.data.bhitaminADate && DateUtils.getDateFromMilliseconds(response.data.bhitaminADate);
        response.data.ironFolicAcidChakkiDate = response.data.ironFolicAcidChakkiDate && DateUtils.getDateFromMilliseconds(
          response.data.ironFolicAcidChakkiDate
        );
        response.data.garbhawatiAwasthamaRagatDiyekoMiti = response.data.garbhawatiAwasthamaRagatDiyekoMiti && DateUtils.getDateFromMilliseconds(
          response.data.garbhawatiAwasthamaRagatDiyekoMiti
        );
        response.data.prasutiAwasthamaRagatDiyekoMiti = response.data.prasutiAwasthamaRagatDiyekoMiti && DateUtils.getDateFromMilliseconds(
          response.data.prasutiAwasthamaRagatDiyekoMiti
        );
        response.data.sutkeriAwasthamaRagatDiyekoMiti = response.data.sutkeriAwasthamaRagatDiyekoMiti && DateUtils.getDateFromMilliseconds(
          response.data.sutkeriAwasthamaRagatDiyekoMiti
        );
        response.data.dischargeDate = response.data.dischargeDate && DateUtils.getDateFromMilliseconds(response.data.dischargeDate);
        response.data.motherDeathDate = response.data.motherDeathDate && DateUtils.getDateFromMilliseconds(
          response.data.motherDeathDate
        );
        response.data.childDeathDate = response.data.childDeathDate && DateUtils.getDateFromMilliseconds(response.data.childDeathDate);
        response.data.vitaminADate = response.data.vitaminADate && DateUtils.getDateFromMilliseconds(response.data.vitaminADate);
        response.data.nawasisuDetailsList?.length && buildAliveChildrenDetailsForDisplay(response.data.nawasisuDetailsList);
        delete response.data.nawasisuDetailsList;
        setModalDefaultValues(response.data);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowMatriTathaNabasisuSwasthyaModal(true);
        setValue("mulDartaaNumber", response.data.mulDartaaNumber);
        setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
        setValue("ageUnit", response.data.ageUnit);
        setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }


  return (
    <div>
      <Box>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
          <Typography variant="h5">मातृ तथा नवशिशु स्वास्थ्य सेवा रजिष्टर</Typography>
          <Box display="flex" alignItems="center">
            <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
              <Tooltip title="पहिलो भेट मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control width-sm"
                    onDateSelect={(date) => { handleRegisterFromDateChange(date) }}
                    labelText="पहिलो भेट मिति"
                    defaultDate={DateUtils.getDaysBeforeBSDate(30)}
                    hideLabel
                  />
                </Box>
              </Tooltip>
              <Typography variant="subtitle2">देखी</Typography>
              <Tooltip title="पहिलो भेट मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterToDateChange(date) }} labelText="पहिलो भेट मिति" defaultDate hideLabel />
                </Box>
              </Tooltip>
              <Typography variant="subtitle2">सम्म</Typography>
            </Box>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowMatriTathaNabasisuSwasthyaModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
          </Box>
        </Box>
        <CustomModal
          title={modalTitle}
          showModal={showMatriTathaNabasisuSwasthyaModal}
          onModalSubmit={handleSubmit(onSubmit)}
          onModalClose={closeMatriTathaNabasisuSwasthyaModal}
          fullScreen
        >
          <Box className={classes.generalInfo}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item sm>
                <CustomReactSelect
                  isDisabled={Boolean(modalDefaultValues.villageClinicSurakshitMatrittoObjectId)}
                  label="मुल दर्ता नं."
                  value={mulDartaaLabel}
                  name="mulDartaaNumber"
                  options={mulDartaaOptions}
                  onChange={handleMulDartaaChange}
                  isClearable={false}
                />
                {errors.mulDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs>
                <TextField
                  InputProps={{ readOnly: true }}
                  label="महिलाको नाम"
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
                  label="महिलाको थर"
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
                <TextField
                  label="महिलाको उमेर"
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
                  inputRef={register}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
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
              <Grid item xs>
                <TextField
                  label="पतिको नाम, थर"
                  name="husbandFullName"
                  defaultValue={modalDefaultValues.husbandFullName}
                  variant="outlined"
                  inputRef={register({
                    required: true
                  })}
                  InputLabelProps={{ shrink: shrinkLabel }}
                  size="small"
                  fullWidth
                />
                {errors.husbandFullName && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs></Grid>
            </Grid>
          </Box>
          <Box className={classes.lmpAndEddInfo}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">Gravida Para LMP and EDD</Typography>
            </Box>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs>
                <TextField
                  label="Gravida"
                  name="gravida"
                  type="number"
                  size="small"
                  defaultValue={modalDefaultValues.gravida}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: shrinkLabel
                  }}
                  inputRef={register({
                    required: true,
                    min: 0
                  })}
                  fullWidth
                />
                {errors.gravida && <span className="error-message">{REQUIRED_FIELD}</span>}
                {errors.gravida && errors.gravida.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  label="Para"
                  name="para"
                  size="small"
                  type="number"
                  defaultValue={modalDefaultValues.para}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: shrinkLabel
                  }}
                  inputRef={register({
                    required: true,
                    min: 0
                  })}
                  fullWidth
                />
                {errors.para && <span className="error-message">{REQUIRED_FIELD}</span>}
                {errors.para && errors.para.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs={12} sm={3} className="position-relative">
                <Tooltip title="आखिरी रजस्वला भएको पहिलो दिनको मिति (LMP)" placement="top" arrow>
                  <Box>
                    <NepaliDate
                      name="lmpDate"
                      className="date-picker-form-control input-sm full-width"
                      placeholder="LMP"
                      defaultDate={modalDefaultValues.lmpDate}
                      onDateSelect={(date) => { lmpDateChange(date) }}
                      hideLabel
                    />
                  </Box>
                </Tooltip>
                {errors.lmpDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs={12} sm={3} className="position-relative">
                <TextField
                  label="EDD Date"
                  name="eddDate"
                  size="small"
                  defaultValue={modalDefaultValues.eddDate}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputRef={register({
                    required: true
                  })}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                {errors.eddDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.ancDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">गर्भवती जाँच (ANC) विवरण</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <Typography variant="inherit">पहिलो भेट भएको मिति</Typography>
                <TextField
                  name="firstMeetDate"
                  size="small"
                  defaultValue={modalDefaultValues.firstMeetDate}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputRef={register({
                    required: true
                  })}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                {errors.firstMeetDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="fourthMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.fourthMonthDate}
                      onDateSelect={(date) => { fourthMonthDateChange(date) }}
                      labelText="चौथो महिना"
                      dateLabelClass={classes.labelSmall}

                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnFourthMonth || ""}
                    name="ironFolicOnFourthMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnFourthMonth && errors.ironFolicOnFourthMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="fifthMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.fifthMonthDate}
                      onDateSelect={(date) => { fifthMonthDateChange(date) }}
                      labelText="पाचौ महिना"
                      dateLabelClass={classes.labelSmall}
                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnFifthMonth || ""}
                    name="ironFolicOnFifthMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnFifthMonth && errors.ironFolicOnFifthMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="sixthMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.sixthMonthDate}
                      onDateSelect={(date) => { sixthMonthDateChange(date) }}
                      labelText="छैठौ महिना"
                      dateLabelClass={classes.labelSmall}
                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnSixthMonth || ""}
                    name="ironFolicOnSixthMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnSixthMonth && errors.ironFolicOnSixthMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="seventhMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.seventhMonthDate}
                      onDateSelect={(date) => { seventhMonthDateChange(date) }}
                      labelText="सातौ महिना"
                      dateLabelClass={classes.labelSmall}
                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnSeventhMonth || ""}
                    name="ironFolicOnSeventhMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnSeventhMonth && errors.ironFolicOnSeventhMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="eighthMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.eighthMonthDate}
                      onDateSelect={(date) => { eighthMonthDateChange(date) }}
                      labelText="आठौ महिना"
                      dateLabelClass={classes.labelSmall}
                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnEighthMonth || ""}
                    name="ironFolicOnEighthMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnEighthMonth && errors.ironFolicOnEighthMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center" className={classes.row}>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="ninthMonthDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.ninthMonthDate}
                      onDateSelect={(date) => { ninthMonthDateChange(date) }}
                      labelText="नवौ महिना"
                      dateLabelClass={classes.labelSmall}
                    />
                  </Box>
                  <TextField
                    type="number"
                    size="small"
                    label="आयरन फोलिक"
                    defaultValue={modalDefaultValues.ironFolicOnNinthMonth || ""}
                    name="ironFolicOnNinthMonth"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicOnNinthMonth && errors.ironFolicOnNinthMonth.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="flex-end">
                  <Box mr={1}>
                    <NepaliDate
                      name="protocolDate"
                      className="date-picker-form-control input-sm full-width"
                      defaultDate={modalDefaultValues.protocolDate}
                      onDateSelect={(date) => { protocolDateChange(date) }}
                      labelText="४ पटक(प्रोटोकल)"
                      dateLabelClass={classes.labelSmall}

                    />
                  </Box>
                  <TextField
                    type="number"
                    label="आयरन फोलिक"
                    size="small"
                    defaultValue={modalDefaultValues.ironFolicTotalCount || ""}
                    name="ironFolicTotalCount"
                    variant="outlined"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register({
                      min: 0
                    })}
                  />
                  {errors.ironFolicTotalCount && errors.ironFolicTotalCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <NepaliDate
                  name="wormMedicineDate"
                  className="date-picker-form-control input-sm full-width"
                  defaultDate={modalDefaultValues.wormMedicineDate}
                  onDateSelect={(date) => { wormMedicineDateChange(date) }}
                  labelText="जुकाको औषधी"
                  dateLabelClass={classes.labelSmall}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.hivAndSyphlisDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">HIV र Syphlis परिक्षण</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid container item xs={12} md={6} alignItems="flex-end">
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.counseling === true} inputRef={register} name="counseling" color="primary" />
                  }
                  label="Counseling"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.hivTesting === true} inputRef={register} name="hivTesting" color="primary" />
                  }
                  label="HIV Testing"
                />
                <Box ml={2}>
                  <Tooltip title="HIV Test Date" placement="top" arrow>
                    <Box>
                      <NepaliDate
                        name="hivTestDate"
                        defaultDate={modalDefaultValues.hivTestDate}
                        onDateSelect={(date) => { hivTestDateChange(date) }}
                        placeholder="HIV Test Date"
                        dateLabelClass={classes.labelSmall}
                        hideLabel
                      />
                    </Box>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid container item xs={12} md={6} alignItems="flex-end">
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.resultReceived === true} inputRef={register} name="resultReceived" color="primary" />
                  }
                  label="Result Received"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.hivStatus === true} inputRef={register} name="hivStatus" color="primary" />
                  }
                  label="HIV Status Received"
                />
                <Grid item xs>
                  <CustomReactSelect
                    label="HIV Status"
                    options={HIV_STATUS}
                    name="hivStatusValue"
                    defaultValue={modalDefaultValues.hivStatusValue}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid container item xs={12} md={6} spacing={2}>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.partnerHivStatusKnown === true} inputRef={register} name="partnerHivStatusKnown" color="primary" />
                    }
                    label="Partner HIV Status Known"
                  />
                </Grid>
                <Grid item xs>
                  <CustomReactSelect
                    label="Partner HIV Status"
                    options={HIV_STATUS}
                    name="partnerHivStatus"
                    defaultValue={modalDefaultValues.partnerHivStatus}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.partnerReferred === true} inputRef={register} name="partnerReferred" color="primary" />
                    }
                    label=" Partner Referred"
                  />
                </Grid>
              </Grid>
              <Grid container item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.syphilisTested === true} inputRef={register} name="syphilisTested" color="primary" />
                  }
                  label="Syphilis Tested"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.syphilisPositive === true} inputRef={register} name="syphilisPositive" color="primary" />
                  }
                  label="Syphilis Positive"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.syphilisTreated === true} inputRef={register} name="syphilisTreated" color="primary" />
                  }
                  label="Syphilis Treated"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <FormControlLabel
                control={
                  <Checkbox defaultChecked={modalDefaultValues.artStarted === true} inputRef={register} name="artStarted" color="primary" />
                }
                label="ART started"
              />
              <Box className={classes.artStartedDateContainer} display="flex" alignItems="center">
                <NepaliDate
                  name="artStartedDate"
                  defaultDate={modalDefaultValues.artStartedDate}
                  onDateSelect={(date) => { artStartedDateChange(date) }}
                  labelText="ART started Date:"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Grid>
          </Box>
          <Box className={classes.pregnancyComplexityDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">गर्भ, प्रसुती र सुत्केरी जटिलता</Typography>
            </Box>
            <Box className={classes.pregnancyComplexityContainer}>
              <Typography variant="subtitle2">Ectopic Pregnancy</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.ectopicPregnancyTest === true} name="ectopicPregnancyTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="ectopicPregnancyTestMonth"
                    defaultValue={modalDefaultValues.ectopicPregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.ectopicPregnancyPrasutiTest === true} name="ectopicPregnancyPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="ectopicPregnancyPrasutiTestMonth"
                    defaultValue={modalDefaultValues.ectopicPregnancyPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Abortion Complication</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.abortionComplicationTest === true} name="abortionComplicationTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="abortionComplicationTestMonth"
                    defaultValue={modalDefaultValues.abortionComplicationTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Hypertension</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.hyperTensionTest === true} name="hyperTensionTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="hyperTensionPregnancyTestMonth"
                    defaultValue={modalDefaultValues.hyperTensionPregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.hyperTensionPrasutiTest === true} name="hyperTensionPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="hyperTensionPrasutiTestMonth"
                    defaultValue={modalDefaultValues.hyperTensionPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.hyperTensionSutkeriTest === true} name="hyperTensionSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="hyperTensionSutkeriTestMonth"
                    defaultValue={modalDefaultValues.hyperTensionSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Severe/Pre-eclampsia</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.severeTest === true} name="severeTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="severePregnancyTestMonth"
                    defaultValue={modalDefaultValues.severePregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.severePrasutiTest === true} name="severePrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="severePrasutiTestMonth"
                    defaultValue={modalDefaultValues.severePrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.severeSutkeriTest === true} name="severeSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    label="महिना"
                    options={NEPALI_MONTHS}
                    name="severeSutkeriTestMonth"
                    defaultValue={modalDefaultValues.severeSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Eclampsia</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.eclampsiaTest === true} name="eclampsiaTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="eclampsiaPregnancyTestMonth"
                    defaultValue={modalDefaultValues.eclampsiaPregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.eclampsiaPrasutiTest === true} name="eclampsiaPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="eclampsiaPrasutiTestMonth"
                    defaultValue={modalDefaultValues.eclampsiaPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.eclampsiaSutkeriTest === true} name="eclampsiaSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="eclampsiaSutkeriMonth"
                    defaultValue={modalDefaultValues.eclampsiaSutkeriMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Hyp. gravidarum</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.gravidarumTest === true} name="gravidarumTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="gravidarumPregnancyTestMonth"
                    defaultValue={modalDefaultValues.gravidarumPregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.gravidarumPrasutiTest === true} name="gravidarumPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="gravidarumPrasutiTestMonth"
                    defaultValue={modalDefaultValues.gravidarumPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.gravidarumSutkeriTest === true} name="gravidarumSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="gravidarumSutkeriTestMonth"
                    defaultValue={modalDefaultValues.gravidarumSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">APH</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.aphPregnancyTest === true} name="aphPregnancyTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="aphPregnancyTestMonth"
                    defaultValue={modalDefaultValues.aphPregnancyTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Prolonged labour</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.prolongedPrasutiTest === true} name="prolongedPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="prolongedPrasutiTestMonth"
                    defaultValue={modalDefaultValues.prolongedPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Obstructed Labor</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.obstructedPrasutiTest === true} name="obstructedPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="obstructedPrasutiTestMonth"
                    defaultValue={modalDefaultValues.obstructedPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Ruptured uterus</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.rupturedTest === true} name="rupturedTest" inputRef={register} color="primary" />
                    }
                    label="गर्भवती जाँच"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="rupturedTestMonth"
                    defaultValue={modalDefaultValues.rupturedTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.rupturedPrasutiTest === true} name="rupturedPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="rupturedPrasutiTestMonth"
                    defaultValue={modalDefaultValues.rupturedPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.rupturedSutkeriTest === true} name="rupturedSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="rupturedSutkeriTestMonth"
                    defaultValue={modalDefaultValues.rupturedSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">PPH</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.pphSutkeriTest === true} name="pphSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="pphSutkeriTestMonth"
                    defaultValue={modalDefaultValues.pphSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Retained placenta</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.retainedPrasutiTest === true} name="retainedPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="retainedPrasutiTestMonth"
                    defaultValue={modalDefaultValues.retainedPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.retainedSutkeriTest === true} name="retainedSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="retainedSutkeriTestMonth"
                    defaultValue={modalDefaultValues.retainedSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">Pueperal Sepsis</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.pueperalPrasutiTest === true} name="pueperalPrasutiTest" inputRef={register} color="primary" />
                    }
                    label="प्रसुती"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="pueperalPrasutiTestMonth"
                    defaultValue={modalDefaultValues.pueperalPrasutiTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox defaultChecked={modalDefaultValues.pueperalSutkeriTest === true} name="pueperalSutkeriTest" inputRef={register} color="primary" />
                    }
                    label="सुत्केरी"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomReactSelect
                    options={NEPALI_MONTHS}
                    label="महिना"
                    name="pueperalSutkeriTestMonth"
                    defaultValue={modalDefaultValues.pueperalSutkeriTestMonth}
                    onChange={handleCustomReactSelectChange}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="अन्य जटिलता"
                    rows="3"
                    inputRef={register}
                    name="aanyaJatilata"
                    variant="outlined"
                    defaultValue={modalDefaultValues.aanyaJatilata}
                    multiline
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="गर्भवतीको जाँचेको बेलामा दिएको उपचार/सल्लाह"
                    rows="3"
                    inputRef={register}
                    name="jachekoBelamaDiyekoSallaha"
                    variant="outlined"
                    defaultValue={modalDefaultValues.jachekoBelamaDiyekoSallaha}
                    className={classes.fullWidth}
                    multiline
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">भर्ना गर्दाको मिति, समय र अवस्था</Typography>
              <Grid container spacing={2} alignItems="center" className={classNames("position-relative", classes.row)}>
                <Grid item>
                  <NepaliDate
                    name="bharnaGardakoMiti"
                    className="date-picker-form-control input-sm full-width"
                    placeholder="भर्ना गर्दाको मिति"
                    defaultDate={modalDefaultValues.bharnaGardakoMiti}
                    onDateSelect={(date) => { bharnaGardakoMitiChange(date) }}
                    hideLabel
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="time"
                    label="समय"
                    size="small"
                    defaultValue={modalDefaultValues.bharnaGardakoTime}
                    variant="outlined"
                    name="bharnaGardakoTime"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="अवस्था र स्थिति"
                    size="small"
                    name="bharnaGardakoAwastha"
                    variant="outlined"
                    defaultValue={modalDefaultValues.bharnaGardakoAwastha}
                    inputRef={register}
                    rows="1"
                    multiline
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">प्रसुती गर्दाको मिति, समय र स्थान</Typography>
              <Grid container spacing={2} alignItems="center" className={classNames("position-relative", classes.row)}>
                <Grid item>
                  <NepaliDate
                    name="prasutiGardakoMiti"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={modalDefaultValues.prasutiGardakoMiti}
                    onDateSelect={(date) => { prasutiGardakoMitiChange(date) }}
                    placeholder="प्रसुती गर्दाको मिति"
                    hideLabel
                  />
                </Grid>
                <Grid item>
                  <TextField
                    type="time"
                    label="समय"
                    size="small"
                    defaultValue={modalDefaultValues.prasutiGardakoTime}
                    variant="outlined"
                    name="prasutiGardakoTime"
                    InputLabelProps={{ shrink: shrinkLabel }}
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">स्थान</FormLabel>
                    <Box display="flex">
                      <RadioGroup name="sthan" defaultValue={modalDefaultValues.sthan} className={classes.placeRadioGroup}>
                        <FormControlLabel
                          label="यस संस्था"
                          control={<Radio value="currentOffice" color="primary" />}
                          inputRef={register}
                        />
                        <FormControlLabel
                          label="अरु संस्था"
                          control={<Radio value="otherOffice" color="primary" />}
                          inputRef={register}
                        />
                        <FormControlLabel
                          label="घर"
                          control={<Radio value="ghar" color="primary" />}
                          inputRef={register}
                        />
                        <FormControlLabel
                          label="अरु स्थान"
                          control={<Radio value={OTHER_LOCATION} color="primary" />}
                          inputRef={register}
                        />
                      </RadioGroup>
                      <TextField
                        name="officeName"
                        label="अरु संस्था भए संस्थाको नाम उल्लेख गर्नुहोस।"
                        variant="outlined"
                        size="small"
                        defaultValue={modalDefaultValues.officeName}
                        className={classes.otherPlaceName}
                        placeholder="अरु संस्था भए संस्थाको नाम उल्लेख गर्नुहोस।"
                        inputRef={register}
                        multiline
                      />
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box className={classes.childHealthDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">बच्चाको अवस्थिति, प्रसूतिको प्रकार र प्रसुती गराउने स्वास्थ्यकर्मी</Typography>
            </Box>
            <Box className={classes.childHealthDetailsContainer}>
              <Typography variant="subtitle2">बच्चाको अवस्थिति</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <RadioGroup name="bachchakoAwasthiti" defaultValue={modalDefaultValues.bachchakoAwasthiti} row>
                  <FormControlLabel
                    label="Cephalic"
                    control={<Radio value="cephalic" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="Breech"
                    control={<Radio value="breech" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="Shoulder"
                    control={<Radio value="shoulder" color="primary" />}
                    inputRef={register}
                  />
                </RadioGroup>
              </Grid>
              <Typography variant="subtitle2">प्रसूतिको प्रकार</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <RadioGroup name="prasutikoPrakar" defaultValue={modalDefaultValues.prasutikoPrakar} row>
                  <FormControlLabel
                    label="Spontaneous"
                    control={<Radio value="spontaneous" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="Vacuum"
                    control={<Radio value="vacuum" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="Forceps"
                    control={<Radio value="forceps" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="CS"
                    control={<Radio value="cs" color="primary" />}
                    inputRef={register}
                  />
                </RadioGroup>
              </Grid>
              <Typography variant="subtitle2">प्रसुती गराउने स्वास्थ्यकर्मी</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <RadioGroup name="prasutiGarauneStaff" defaultValue={modalDefaultValues.prasutiGarauneStaff} row>
                  <FormControlLabel
                    label="दक्ष प्रसूतीकर्मी"
                    control={<Radio value="dakhsaPrasutikarmi" color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="दक्ष प्रसूतीकर्मी बाहेक अन्य"
                    control={<Radio value="anyaPrasutikarmi" color="primary" />}
                    inputRef={register}
                  />
                </RadioGroup>
              </Grid>
              <Typography variant="subtitle2">प्रसुती गराउने स्वास्थ्यकर्मी</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="मुख्य प्रसूती गराउने स्वास्थ्यकर्मीहरुको नाम"
                    variant="outlined"
                    name="swasthyaKarmiName"
                    defaultValue={modalDefaultValues.swasthyaKarmiName}
                    inputRef={register}
                    multiline
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="प्रसुतिको बेलामा दिएको उपचार/सल्लाह"
                    variant="outlined"
                    name="prasutikoBelamaDiyekoUpachar"
                    defaultValue={modalDefaultValues.prasutikoBelamaDiyekoUpachar}
                    inputRef={register}
                    multiline
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2">जिवित नवशिशुको विवरण</Typography>
              {aliveChildrenDetails.map((aliveChildrenDetail, index) => (
                <div>
                  <Box className={classes.aliveChildrenDetailsContainer}>
                    <Grid container spacing={2} alignItems="center" className={classes.row}>
                      <Grid item xs>
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel id="gender-label">छोरा वा छोरी</InputLabel>
                          <MaterialSelect
                            labelId="gender-label"
                            value={aliveChildrenDetail[`${"gender"}~${index}`]}
                            name={`${"gender"}~${index}`}
                            onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                          >
                            <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                            {SON_OR_DAUGHTER.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                          </MaterialSelect>
                        </FormControl>
                        {customError[`${"gender"}~${index}`] && (<span className="error-message">{REQUIRED_FIELD}</span>)}
                      </Grid>
                      <Grid item xs>
                        <TextField
                          type="number"
                          size="small"
                          label="तौल(ग्राममा)"
                          name={`${"weightInGrams"}~${index}`}
                          defaultValue={aliveChildrenDetail[`${"weightInGrams"}~${index}`]}
                          onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                          variant="outlined"
                          fullWidth
                        />
                        {customError[`${"weightInGrams"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                      </Grid>
                      <Grid item xs>
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel id="child-condition-label">नवशिशुको अवस्था</InputLabel>
                          <MaterialSelect
                            labelId="child-condition-label"
                            value={aliveChildrenDetail[`${"childSituation"}~${index}`]}
                            name={`${"childSituation"}~${index}`}
                            onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                          >
                            <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                            {CHILD_CONDITION.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                          </MaterialSelect>
                        </FormControl>
                        {customError[`${"childSituation"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                      </Grid>
                      <Grid item xs>
                        <FormControl variant="outlined" size="small" fullWidth>
                          <InputLabel>Congenital Anomalies</InputLabel>
                          <MaterialSelect
                            multiple
                            value={aliveChildrenDetail[`${"congenitalAnomalies"}~${index}`] || []}
                            name={`${"congenitalAnomalies"}~${index}`}
                            onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                          >
                            <MenuItem value="">कृपया छान्नुहोस </MenuItem>
                            {CONGENITAL_ANOMALIES.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                          </MaterialSelect>
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControlLabel
                          label="नाभी मलामको प्रयोग"
                          control={
                            <Checkbox
                              defaultChecked={aliveChildrenDetail[`${"nabhiMalamkoPrayog"}~${index}`]}
                              name={`${"nabhiMalamkoPrayog"}~${index}`}
                              color="primary"
                              onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                            />}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center" className={classes.row}>
                      <Grid item xs>
                        <TextField
                          label="नवशिशुलाई दिएको उपचार/सल्लाह"
                          size="small"
                          variant="outlined"
                          name={`${"nawashishulaiDiyekoUpachar"}~${index}`}
                          defaultValue={aliveChildrenDetail[`${"nawashishulaiDiyekoUpachar"}~${index}`]}
                          onChange={event => handleAliveChildrenDetailsInputChange(index, event)}
                          multiline
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    {
                      (index + 1 === aliveChildrenDetails.length) &&
                      <Tooltip title="महिना/महिनाको उपचार नियमितता विवरण हटाउनुहोस्।" placement="top" arrow><Cancel className={classes.removeAliveDetailsContainer} onClick={() => handleRemoveAliveChildrenDetails(index)} fontSize="small" /></Tooltip>
                    }
                    <Divider variant="middle" className={classes.divider} />
                  </Box>
                </div>
              ))}
              <Box mt={2} className={classes.aliveChildrenDetailsContainer}>
                <Grid container justify="center" alignItems="center" className={classes.addAliveChildDetailsContainer}>
                  <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { handleAddAliveChildrenDetails() }}>नयाँ विवरण थप्नुहोस्</Button>
                </Grid>
                <Typography variant="subtitle2">मृत जन्म</Typography>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <FormControlLabel
                    label="Fresh"
                    control={<Checkbox name="fresh" defaultChecked={modalDefaultValues.fresh} inputRef={register} color="primary" />}
                    inputRef={register}
                  />
                  <FormControlLabel
                    label="Macerated"
                    control={<Checkbox name="macerated" defaultChecked={modalDefaultValues.macerated} color="primary" />}
                    inputRef={register}
                  />
                  <TextField
                    type="number"
                    label="मृत जन्म(संख्या)"
                    className={classes.mritaJanmaSankhya}
                    defaultValue={modalDefaultValues.mritaJanmaSankhya || ""}
                    name="mritaJanmaSankhya"
                    size="small"
                    inputRef={register({
                      min: 0
                    })}
                    variant="outlined"
                  />
                  {errors.mritaJanmaSankhya && errors.mritaJanmaSankhya.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box className={classes.pncDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">सुत्केरी जाँच (PNC) को विवरण</Typography>
            </Box>
            <Box className={classes.pncDetailsContainer}>
              <Typography variant="subtitle2">सुत्केरी जाँच</Typography>
              <Grid container spacing={2} alignItems="center" className="position-relative">
                <Grid item xs>
                  <NepaliDate name="sutkeriJachFirstTime" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.sutkeriJachFirstTime} onDateSelect={(date) => { sutkeriJachFirstTimeChange(date) }} labelText="प्रथम पटक (जन्मेको २४ घण्टा भित्र)" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                  <NepaliDate name="sutkeriJachSecondTime" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.sutkeriJachSecondTime} onDateSelect={(date) => { sutkeriJachSecondTimeChange(date) }} labelText="दोस्रो पटक(जन्मेको ३ दिन भित्र)" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                  <NepaliDate name="sutkeriJachThirdTime" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.sutkeriJachThirdTime} onDateSelect={(date) => { sutkeriJachThirdTimeChange(date) }} labelText="तेस्रो पटक(जन्मेको ७ दिन भित्र" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                  <NepaliDate name="sutkeriJachThapTime" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.sutkeriJachThapTime} onDateSelect={(date) => { sutkeriJachThapTimeChange(date) }} labelText="थप पटक" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                  <NepaliDate name="protocalWiseThirdTime" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.protocalWiseThirdTime} onDateSelect={(date) => { protocalWiseThirdTimeChange(date) }} labelText="प्रोटोकल अनुसार ३ पटक" dateLabelClass={classes.labelSmall} />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classNames("position-relative", classes.row)}>
                <Grid item xs>
                  <NepaliDate name="vitaminADate" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.vitaminADate} onDateSelect={(date) => { vitaminADateChange(date) }} labelText="भिटामिन ए" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                  <NepaliDate name="ironFolicAcidChakkiDate" className="date-picker-form-control full-width" defaultDate={modalDefaultValues.ironFolicAcidChakkiDate} onDateSelect={(date) => { ironFolicAcidChakkiDateChange(date) }} labelText="४५ आयरन फोलिक यसिड चक्की" dateLabelClass={classes.labelSmall} />
                </Grid>
                <Grid item xs>
                </Grid>
                <Grid item xs>
                </Grid>
                <Grid item xs>
                </Grid>
              </Grid>
              <Typography variant="subtitle2">प्रसुती पछिको परिवार नियोजन</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <FormControlLabel
                  label="TSA"
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.tsa === true} name="tsa" inputRef={register} color="primary" />
                  }
                  inputRef={register}
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.tla === true} name="tla" inputRef={register} color="primary" />
                  }
                  label="TLA"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.perm === true} name="perm" inputRef={register} color="primary" />
                  }
                  label="Perm"
                />
              </Grid>
            </Box>
          </Box>
          <Box className={classes.bloodDonationDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">रगत दिएको अवस्था र परिमाण</Typography>
            </Box>
            <Box className={classes.bloodDonationDetailsContainer}>
              <Grid container spacing={2} alignItems="center" className={classNames("position-relative", classes.row)}>
                <Grid item xs>
                  <Typography variant="subtitle2">गर्भवती अवस्था</Typography>
                  <Box display="flex">
                    <TextField
                      label="परिमाण"
                      type="number"
                      size="small"
                      name="garbhawatiAwasthaParimaan"
                      defaultValue={modalDefaultValues.garbhawatiAwasthaParimaan || ""}
                      variant="outlined"
                      inputRef={register({
                        min: 0
                      })}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    {errors.garbhawatiAwasthaParimaan && errors.garbhawatiAwasthaParimaan.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                    <NepaliDate
                      name="garbhawatiAwasthamaRagatDiyekoMiti"
                      className="date-picker-form-control input-sm"
                      defaultDate={modalDefaultValues.garbhawatiAwasthamaRagatDiyekoMiti}
                      onDateSelect={(date) => { garbhawatiAwasthamaRagatDiyekoMitiChange(date) }}
                      hideLabel
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle2">प्रसुती अवस्था</Typography>
                  <Box display="flex">
                    <TextField
                      label="परिमाण"
                      type="number"
                      size="small"
                      name="prasutiAwasthaParimaan"
                      defaultValue={modalDefaultValues.prasutiAwasthaParimaan || ""}
                      variant="outlined"
                      inputRef={register({
                        min: 0
                      })}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    {errors.prasutiAwasthaParimaan && errors.prasutiAwasthaParimaan.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                    <NepaliDate
                      name="prasutiAwasthamaRagatDiyekoMiti"
                      className="date-picker-form-control input-sm"
                      defaultDate={modalDefaultValues.prasutiAwasthamaRagatDiyekoMiti}
                      onDateSelect={(date) => { prasutiAwasthamaRagatDiyekoMitiChange(date) }}
                      hideLabel
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle2">सुत्केरी अवस्था</Typography>
                  <Box display="flex">
                    <TextField
                      label="परिमाण"
                      type="number"
                      size="small"
                      name="sutkariAwasthaParimaan"
                      defaultValue={modalDefaultValues.sutkariAwasthaParimaan || ""}
                      variant="outlined"
                      inputRef={register({
                        min: 0
                      })}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                    {errors.sutkariAwasthaParimaan && errors.sutkariAwasthaParimaan.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                    <NepaliDate
                      name="sutkeriAwasthamaRagatDiyekoMiti"
                      className="date-picker-form-control input-sm"
                      defaultDate={modalDefaultValues.sutkeriAwasthamaRagatDiyekoMiti}
                      onDateSelect={(date) => { sutkeriAwasthamaRagatDiyekoMitiChange(date) }}
                      hideLabel
                    />
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="subtitle2">सुत्केरीको बेलामा दिएको उपचार/चरण:</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Box mt={2} width={1}>
                  <TextField
                    label="सुत्केरीको बेलामा दिएको उपचार/चरण"
                    variant="outlined"
                    name="sutkeriBelamaDiyekoUpacharCharan"
                    defaultValue={modalDefaultValues.sutkeriBelamaDiyekoUpacharCharan}
                    inputRef={register}
                    multiline
                    fullWidth
                  />
                </Box>
              </Grid>
            </Box>
          </Box>
          <Box className={classes.dischargeDetails}>
            <Box className={classes.subTitle}>
              <Typography variant="h6">डिस्चार्ज गरेको मिति, समय, आमाको अवस्था</Typography>
            </Box>
            <Box className={classes.dischargeDetailsContainer}>
              <Grid container spacing={2} alignItems="center" className={classNames("position-relative", classes.row)}>
                <Grid item xs>
                  <NepaliDate
                    name="dischargeDate"
                    className="date-picker-form-control input-sm"
                    defaultDate={modalDefaultValues.dischargeDate}
                    onDateSelect={(date) => { dischargeDateChange(date) }}
                    placeholder="डिस्चार्ज गरेको मिति"
                    hideLabel
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    type="time"
                    size="small"
                    label="डिस्चार्ज गरेको समय"
                    defaultValue={modalDefaultValues.dischargeTime}
                    name="dischargeTime"
                    variant="outlined"
                    inputRef={register}
                    InputLabelProps={{ shrink: shrinkLabel }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    type="number"
                    size="small"
                    label="बसेको अवधि"
                    defaultValue={modalDefaultValues.basekoAwadhi || ""}
                    name="basekoAwadhi"
                    variant="outlined"
                    inputRef={register({
                      min: 0
                    })}
                    InputLabelProps={{ shrink: shrinkLabel }}
                  />
                  {errors.basekoAwadhi && errors.basekoAwadhi.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
                </Grid>
                <Grid item xs></Grid>
                <Grid item xs></Grid>
              </Grid>
              <Typography variant="subtitle2">आमाको अवस्था</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.recovered === true} name="recovered" inputRef={register} color="primary" />
                  }
                  label="Recovered"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.notImproved === true} name="notImproved" inputRef={register} color="primary" />
                  }
                  label="Not Improved"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.referredOut === true} name="referredOut" inputRef={register} color="primary" />
                  }
                  label="Referred Out"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.lama === true} name="lama" inputRef={register} color="primary" />
                  }
                  label="LAMA"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.absconded === true} name="absconded" inputRef={register} color="primary" />
                  }
                  label="Absconded"
                />
                <FormControlLabel
                  control={
                    <Checkbox defaultChecked={modalDefaultValues.died === true} name="died" inputRef={register} color="primary" />
                  }
                  label="Died"
                />
              </Grid>
            </Box>
            <Box className={classes.childDeathDetails}>
              <Box className={classes.subTitle}>
                <Typography variant="h6">मातृ र नवशिशु मृत्युको मिति र कारण</Typography>
              </Box>
              <Box className={classes.childDeathDetailsContainer}>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid container item xs={12} sm={7} spacing={2}>
                    <Typography variant="subtitle2">मातृ मृत्यु/कारण</Typography>
                    <Grid container item xs={12} spacing={2} className="position-relative">
                      <Grid item xs={12} sm={4}>
                        <NepaliDate
                          name="motherDeathDate"
                          className="date-picker-form-control input-sm full-width"
                          defaultDate={modalDefaultValues.motherDeathDate}
                          onDateSelect={(date) => { motherDeathDateChange(date) }}
                          placeholder="मातृ मृत्यु मिति"
                          hideLabel
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <CustomReactSelect
                          options={MOTHER_SITUATION}
                          onChange={handleCustomReactSelectChange}
                          defaultValue={modalDefaultValues.motherDeathSituation}
                          label="मातृ मृत्यु अवस्था"
                          name="motherDeathSituation"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          placeholder="मातृ मृत्युको कारण"
                          variant="outlined"
                          name="motherDeathReason"
                          size="small"
                          defaultValue={modalDefaultValues.motherDeathReason}
                          inputRef={register}
                          multiline
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <Typography variant="subtitle2">नवशिशु मृत्यु/कारण</Typography>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <NepaliDate
                          name="childDeathDate"
                          className="date-picker-form-control input-sm full-width"
                          defaultDate={modalDefaultValues.childDeathDate}
                          onDateSelect={(date) => { childDeathDateChange(date) }}
                          placeholder="नवशिशु मृत्यु मिति"
                          hideLabel
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          placeholder="नवशिशु मृत्युको कारण"
                          variant="outlined"
                          size="small"
                          name="childDeathReason"
                          defaultValue={modalDefaultValues.childDeathReason}
                          inputRef={register}
                          multiline
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box className={classes.pregnancyTravelCostDetails}>
              <Box className={classes.subTitle}>
                <Typography variant="h6">गर्भवती जाँच र यातायात खर्च</Typography>
              </Box>
              <Box className={classes.pregnancyTravelCostDetailsContainer}>
                <Grid container spacing={2} alignItems="center" className={classes.row}>
                  <Grid item xs>
                    <Typography variant="subtitle2">गर्भवती उत्प्रेरणा खर्च</Typography>
                    <RadioGroup name="utpreranaaKharcha" defaultValue={modalDefaultValues.utpreranaaKharcha} row>
                      <FormControlLabel
                        label="पाएको"
                        control={<Radio value={GRANTED} color="primary" />}
                        inputRef={register}
                      />
                      <FormControlLabel
                        label="नपाएको"
                        control={<Radio value={NOT_GRANTED} color="primary" />}
                        inputRef={register}
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">यातायात खर्च</Typography>
                    <RadioGroup name="yatayatKharcha" defaultValue={modalDefaultValues.yatayatKharcha} row>
                      <FormControlLabel
                        label="पाएको"
                        control={<Radio value={GRANTED} color="primary" />}
                        inputRef={register}
                      />
                      <FormControlLabel
                        label="नपाएको"
                        control={<Radio value={NOT_GRANTED} color="primary" />}
                        inputRef={register}
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">नपाएको भए कारण</Typography>
                    <TextField
                      placeholder="नपाएको भए कारण"
                      variant="outlined"
                      name="kharchaNapayekoKaran"
                      defaultValue={modalDefaultValues.kharchaNapayekoKaran}
                      inputRef={register}
                      size="small"
                      multiline
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2">कैफियत</Typography>
                    <TextField
                      placeholder="कैफियत"
                      variant="outlined"
                      name="remarks"
                      size="small"
                      defaultValue={modalDefaultValues.remarks}
                      inputRef={register}
                      multiline
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </CustomModal>
        <MatriTathaNabasisuSwasthyaSewaRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={matriTathaNawasisuEditFunction.bind(this)} />
      </Box>
    </div>
  );
}