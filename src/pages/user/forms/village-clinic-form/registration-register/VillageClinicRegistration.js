import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from '../../../../../components/modal/CustomModal';
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { AGE_UNITS, NEW_PATIENT, PREVIOUS_PATIENT, VALID_AGE_FOR_CHILDREN, VILLAGE_DARTA_NUMBERS_LIST } from "../../../../../utils/constants/forms";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, HTTP_STATUS_CODES, ID, LESS_THAN_FIFTY, PATIENT_TYPES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, VILLAGE_CLINIC_SERVICE_TYPES } from "../../../../../utils/constants/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import VillageClinicRegistrationRegister from "../../../components/registers/village-clinic-register/village-clinic-registration-register/VillageClinicRegistrationRegister";
import styles from "./style";

export default function VillageClinicRegistration(props) {
  const classes = styles();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [openVillageClinicRegistrationModal, setOpenVillageClinicRegistrationModal] = useState(false);
  const { register, handleSubmit, setValue, errors, reset, getValues } = useForm();
  const [dartaaNumberOptions, setDartaaNumberOptions] = useState();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showDartaaNumberSelect, setShowDartaaNumberSelect] = useState(false);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("गाउँघर क्लिनिक दर्ता रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [districtLabel, setDistrictLabel] = useState();
  const [palikaNameLabel, setPalikaNameLabel] = useState();
  const [dartaaNumberLabel, setDartaaNumberLabel] = useState();
  const [palikaOptions, setPalikaOptions] = useState();
  const [hasDistrictSelected, setHasDistrictSelected] = useState(false);
  const [disablePatientTypeSelect, setDisablePatientTypeSelect] = useState(false);
  const [dartaaNumberDefaultValues, setDartaaNumberDefaultValues] = useState();
  const [palikaInfoData, setPalikaInfoData] = useState({});

  const communityClinicId = AppUtils.getUrlParam(ID);

  const [customErrors, setCustomErrors] = useState({
    dartaaNumber: false,
  });
  const districtOptions = AppMisc.getDistrictOptions();

  useEffect(() => {
    register({ name: "dartaaNumber" });
    register({ name: "sewaType" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "patientType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "palikaName" }, { required: true });
    attachDartaaNumberOptions();
    getListFromClinicId();
  }, [register]);

  useEffect(() => {
    if (dartaaNumberDefaultValues) {
      setShrinkLabel(true);
      setValue("dartaaNumber", dartaaNumberDefaultValues.dartaaNumber);
      setValue("patientFirstName", dartaaNumberDefaultValues.patientFirstName);
      setValue("patientLastName", dartaaNumberDefaultValues.patientLastName);
      (dartaaNumberDefaultValues.ageUnit === "YEAR") && setValue("age", dartaaNumberDefaultValues.age);
      setValue("ageUnit", dartaaNumberDefaultValues.ageUnit);
      setValue("palikaName", dartaaNumberDefaultValues.palikaName);
      setValue("wardNumber", dartaaNumberDefaultValues.wardNumber);
      setValue("gaunOrTole", dartaaNumberDefaultValues.gaunOrTole);
      setValue("phoneNumber", dartaaNumberDefaultValues.phoneNumber);

      setModalDefaultValues(prev => ({
        ...prev,
        casteCode: dartaaNumberDefaultValues.casteCode,
        gender: dartaaNumberDefaultValues.gender,
        sewaType: dartaaNumberDefaultValues.sewaType,
        ageUnit: dartaaNumberDefaultValues.ageUnit,
      }));

      dartaaNumberDefaultValues.dartaaNumber && setDartaaNumberLabel(dartaaNumberOptions.find(option => option.value === dartaaNumberDefaultValues.dartaaNumber));
      populateDistrictAndPalikaName(dartaaNumberDefaultValues.district, dartaaNumberDefaultValues.palikaName);
    }
  }, [dartaaNumberDefaultValues])

  const attachDartaaNumberOptions = () => {
    var dartaaNumberOptions = [];
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all-less-then-or-equals-village-clinic-service-start-date?communityClinicId=" + communityClinicId)
      .then(response => {
        if (response.data.type === SUCCESS) {
          var data = response.data.objectList;
          SessionStorage.setItem(VILLAGE_DARTA_NUMBERS_LIST, data);
          data.forEach(item => {
            dartaaNumberOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
          });
          setDartaaNumberOptions(dartaaNumberOptions);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleDartaaNumberChange = mulDartaa => {
    let dartaaNumbers = SessionStorage.getItem(VILLAGE_DARTA_NUMBERS_LIST);
    if (dartaaNumbers) {
      let dartaaNumberInfo = dartaaNumbers.find(obj => obj.dartaaNumber === mulDartaa.value);
      dartaaNumberInfo ? setDartaaNumberDefaultValues(dartaaNumberInfo) : getDetailsByVillageDartaaNumber(mulDartaa.value);
    } else {
      getDetailsByVillageDartaaNumber(mulDartaa.value)
    }
  };

  const getDetailsByVillageDartaaNumber = (dartaaNumber) => {
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/dartaaNumber?dartaaNumber=" + dartaaNumber)
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          setDartaaNumberDefaultValues(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListFromClinicId = () => {
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/clinicId/" + communityClinicId)
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          setMainRegisterData(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const postVillageClinicRegistrationData = (data) => {
    HMIS.post(API_URL.villageClinicRegistrationRegister, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          props.attachDartaaNumber(true);
          closeVillageClinicRegistrationModal();
          getListFromClinicId();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const submitVillageClinicMainRegister = (data) => {
    data.id = modalDefaultValues.id;
    data.dartaaMiti = props.villageClinicServiceDate;
    data.communityClinicId = modalDefaultValues.communityClinicId || communityClinicId;
    if (data.sewaType === "2") {
      if ((data.age >= 2 && data.ageUnit === "YEAR") || (data.age >= 24 && data.ageUnit === "MONTH")) {
        AddAlertMessage({ type: "error", message: "पोषण सेवा २ बर्ष मुनिका बच्चाहरुका लागि मात्र उपलब्ध छ। कृपया २ बर्ष भन्दा कम उमेर प्रविष्ट गर्नुहोस्।" })
      } else {
        postVillageClinicRegistrationData(data);
      }
    } else {
      postVillageClinicRegistrationData(data);
    }
  }

  const onSubmit = data => {
    if (data.patientType === PREVIOUS_PATIENT && !data.dartaaNumber) {
      setCustomErrors({
        dartaaNumber: true,
      });
    } else {
      setCustomErrors({
        dartaaNumber: false,
      })
      submitVillageClinicMainRegister(data);
    }
  }

  const villageClinicRegistrationEditFunction = id => {
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/" + id)
      .then(response => {
        setModalDefaultValues(response.data);
        setOpenVillageClinicRegistrationModal(true);
        setShrinkLabel(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        populateDistrictAndPalikaName(response.data.district, response.data.palikaName);
        setDisablePatientTypeSelect(true);
        setValue("dartaaNumber", response.data.dartaaNumber);
        setDartaaNumberLabel(dartaaNumberOptions.find(option => option.value === response.data.dartaaNumber));
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const populateDistrictAndPalikaName = (districtName, palikaName) => {
    let districtObject = districtOptions.find(options => options.value === districtName);
    let palikaObject = districtObject.palikas.find(options => options.value === palikaName);
    handleDistrictChange(districtObject);
    handlePalikaNameChange(palikaObject);
  }


  const closeVillageClinicRegistrationModal = () => {
    setModalDefaultValues({});
    reset();
    setOpenVillageClinicRegistrationModal(false);
    setModalTitle("गाउँघर क्लिनिक दर्ता रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setCustomErrors({
      dartaaNumber: false,
    });
    setShrinkLabel(undefined);
    setDistrictLabel("");
    setPalikaNameLabel("");
    setDisablePatientTypeSelect(false);
    setDartaaNumberLabel("");
    setDartaaNumberDefaultValues();
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handlePatientTypeChange = patientType => {
    setValue("patientType", patientType);
    setShowDartaaNumberSelect(patientType !== NEW_PATIENT);
  }

  const handleDistrictChange = (districtOption) => {
    districtOption ? setHasDistrictSelected(true) : setHasDistrictSelected(false);
    setValue("palikaName", null);
    setPalikaNameLabel("");
    setValue("district", districtOption ? districtOption.value : null);
    setDistrictLabel(districtOption ? districtOption : "");
    districtOption &&
      setPalikaOptions(districtOption.palikas);
  }

  const handlePalikaNameChange = palikaOption => {
    setValue("palikaName", palikaOption ? palikaOption.value : null);
    setPalikaNameLabel(palikaOption ? palikaOption : "");
  }

  useEffect(() => {
    if (openVillageClinicRegistrationModal && !modalDefaultValues.id && (JSON.stringify(palikaInfoData) !== "{}")) {
      populateDistrictAndPalikaName(palikaInfoData.district, palikaInfoData.palikaName)
    }
  }, [openVillageClinicRegistrationModal, palikaInfoData])

  useEffect(() => {
    getHealthClientAndPalikaInfoData();
  }, [])

  const getHealthClientAndPalikaInfoData = () => {
    HMIS.get(API_URL.healthClientAndPalikaInfo)
      .then(response => {
        if (response.data.type === SUCCESS) {
          setPalikaInfoData(response.data.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const isAgeValidForImci = (age) => {
    if (getValues().sewaType !== "1") {
      return true;
    } else {
      if (getValues().ageUnit === "YEAR") {
        return (age < 5);
      } else if (getValues().ageUnit === "MONTH") {
        return (age <= 59);
      } else {
        return (age <= 1770);
      }
    }
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          गाउँघर क्लिनिक दर्ता रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="गाउँघर क्लिनिक संचालन भएको मिति" placement="top" arrow>
            <Typography variant="body2">
              मिति: {props.villageClinicInfo.villageClinicServiceDate ? DateUtils.getDateFromMilliseconds(props.villageClinicInfo.villageClinicServiceDate) : "-"}
            </Typography>
          </Tooltip>
          <Box mx={2}></Box>
          <Typography variant="body2">
            गाउँघर क्लिनिक संचालन हुने स्थान: {props.villageClinicInfo.villageClinicLocation || "-"}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenVillageClinicRegistrationModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openVillageClinicRegistrationModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeVillageClinicRegistrationModal}
        maxWidth="lg"
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              label="सेवाग्राहीको किसिम"
              size="small"
              name="patientType"
              value={modalDefaultValues.patientType || NEW_PATIENT}
              variant="outlined"
              options={PATIENT_TYPES}
              onChange={handlePatientTypeChange.bind(this)}
              InputLabelProps={{ shrink: true }}
              disabled={disablePatientTypeSelect}
              disabledOptionSelectable
              fullWidth
            />
            {errors.patientType && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title={showDartaaNumberSelect ? "कृपया पुरानो सेवाग्राहीको दर्ता नम्बर चयन गर्नुहोस्।" : "तपाईले सेवाग्राहीको किसिममा पुरानो सेवाग्राही विकल्प छनौट गर्नुभयो भने मात्र दर्ता नम्बर चयन गर्न सक्नुहुन्छ। नयाँ सेवाग्राहीको लागि दर्ता नम्बर प्रणालीले आँफै स्वचालित रूपमा सेभ गर्नेछ।"} placement="top" arrow>
              <Box>
                <Select
                  className="select-sm"
                  classNamePrefix="react-select"
                  placeholder="कृपया दर्ता नम्बर चयन गर्नुहोस्।"
                  name="dartaaNumber"
                  size="small"
                  variant="outlined"
                  options={dartaaNumberOptions}
                  value={dartaaNumberLabel}
                  onChange={handleDartaaNumberChange}
                  isDisabled={!showDartaaNumberSelect}
                />
              </Box>
            </Tooltip>
            {customErrors.dartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              label="सेवाग्राहीको नाम"
              defaultValue={modalDefaultValues.patientFirstName}
              type="text"
              size="small"
              variant="outlined"
              name="patientFirstName"
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
              label="सेवाग्राहीको थर"
              defaultValue={modalDefaultValues.patientLastName}
              type="text"
              size="small"
              variant="outlined"
              name="patientLastName"
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
              label="लिङ्ग"
              name="gender"
              size="small"
              value={modalDefaultValues.gender}
              variant="outlined"
              options={GENDER_OPTIONS}
              onChange={handleCustomSelectChange}
              disabledOptionSelectable
              fullWidth
            />
            {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="उमेर"
              size="small"
              type="number"
              variant="outlined"
              name="age"
              defaultValue={modalDefaultValues.age}
              inputRef={register({
                required: true,
                min: 1,
                validate: value => isAgeValidForImci(value)
              })}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
            {errors.age && errors.age.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.age && errors.age.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            {errors.age && errors.age.type === "validate" && (<span className="error-message">{VALID_AGE_FOR_CHILDREN}</span>)}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="उमेर वर्ष वा महिना"
              name="ageUnit"
              size="small"
              value={modalDefaultValues.ageUnit || "YEAR"}
              variant="outlined"
              options={AGE_UNITS}
              onChange={handleCustomSelectChange}
              disabledOptionSelectable
              fullWidth
            />
            {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="जाती"
              size="small"
              name="casteCode"
              value={modalDefaultValues.casteCode}
              variant="outlined"
              options={CASTE_CODES}
              onChange={handleCustomSelectChange}
              disabledOptionSelectable
              fullWidth
            />
            {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Select
              className="select-sm"
              classNamePrefix="react-select"
              value={districtLabel}
              onChange={handleDistrictChange}
              placeholder="जिल्ला"
              options={districtOptions}
              name="district"
              isClearable
            />
            {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Select
              className="select-sm"
              classNamePrefix="react-select"
              name="palikaName"
              placeholder="नगर/गाउँपालिका"
              options={palikaOptions}
              value={palikaNameLabel}
              onChange={handlePalikaNameChange}
              isDisabled={!hasDistrictSelected}
              isClearable
            />
            {errors.palikaName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="वडा नं"
              defaultValue={modalDefaultValues.wardNumber}
              type="number"
              size="small"
              variant="outlined"
              name="wardNumber"
              inputRef={register({
                required: true,
                min: 1,
                max: 50
              })}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
            {errors.wardNumber && errors.wardNumber.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.wardNumber && errors.wardNumber.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            {errors.wardNumber && errors.wardNumber.type === "max" && (<span className="error-message">{LESS_THAN_FIFTY}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              name="gaunOrTole"
              label="गाँउ/टोल"
              defaultValue={modalDefaultValues.gaunOrTole}
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: shrinkLabel }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="सम्पर्क नम्बर"
              defaultValue={modalDefaultValues.phoneNumber}
              type="text"
              size="small"
              variant="outlined"
              name="phoneNumber"
              inputRef={register}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="सेवाको किसिम"
              name="sewaType"
              size="small"
              value={modalDefaultValues.sewaType}
              variant="outlined"
              options={VILLAGE_CLINIC_SERVICE_TYPES}
              onChange={handleCustomSelectChange}
              disabledOptionSelectable
              fullWidth
            />
            {errors.sewaType && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="सेवाग्राही यदी लैङ्गिक हिंसा बाट पीडित भई सेवा लिन आएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
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
        </Grid>
      </CustomModal>

      <VillageClinicRegistrationRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={villageClinicRegistrationEditFunction} />
    </div>
  );
};