import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, ID, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../../utils/constants";
import { PRATHAAMIK_UPACHAR_VILLAGE_CLINIC_SERVICE_CODE, VILLAGE_DARTA_NUMBERS_LIST } from "../../../../../utils/constants/forms";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import PrathaamikUpacharSewaRegister from "../../../components/registers/village-clinic-register/prathaamik-upachar-sewa-register/PrathaamikUpacharSewaRegister";
import styles from "./style";

export default function PrathaamikUpacharSewa(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();

  const [showModal, setShowModal] = useState(false);
  const [registerData, setRegisterData] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [modalTitle, setModalTitle] = useState("प्राथामिक/सामान्य उपचार सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [villageClinicDartaaNumberLabel, setVillageClinicDartaaNumberLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const { register, setValue, handleSubmit, reset, errors } = useForm();

  const villageClinicId = AppUtils.getUrlParam(ID);

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });

    attachVillageClinicDartaaNumbers();
    getRegisterDataFromClinicId();
  }, [register])

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const getRegisterDataFromClinicId = () => {
    HMIS.get(API_URL.prathaamikUpacharSewaRegister + "/clinicId/" + villageClinicId)
      .then(response => {
        setRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
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
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all?sewaType=" + PRATHAAMIK_UPACHAR_VILLAGE_CLINIC_SERVICE_CODE + "&communityClinicId=" + villageClinicId)
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

  const handleEditFunction = id => {
    HMIS.get(API_URL.prathaamikUpacharSewaRegister + "/" + id).then(response => {
      response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
      setModalDefaultValues(response.data)
      setShrinkLabel(true);
      setModalTitle(EDIT_SELECTED_RECORD);
      setShowModal(true);
      setValue("villageClinicDartaaNumber", response.data.villageClinicDartaaNumber);
      setVillageClinicDartaaNumberLabel(villageClinicDartaaNumbers.find(option => option.value === response.data.villageClinicDartaaNumber));
      setValue("ageUnit", response.data.ageUnit);
      setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.communityClinicId = modalDefaultValues.communityClinicId || villageClinicId;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.prathaamikUpacharSewaRegister, data).then(response => {
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
    setShowModal(false);
    setModalTitle("प्राथामिक/सामान्य उपचार सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setVillageClinicDartaaNumberLabel("");
    setAgeUnitLabel("");
  }

  return (<div>
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
      <Typography variant="h5">प्राथामिक/सामान्य उपचार सेवा</Typography>
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
      </Box>
      <Box className={classes.treatmentDetails}>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="मुख्य समस्या"
              name="majorProblems"
              variant="outlined"
              defaultValue={modalDefaultValues.majorProblems}
              inputRef={register}
              size="small"
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="उपचार/परामर्श/रेफर"
              name="treatmentDetails"
              defaultValue={modalDefaultValues.treatmentDetails}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
    <PrathaamikUpacharSewaRegister tableData={registerData} showActionColumn={registerData.length !== 0} onEditRow={handleEditFunction} />
  </div>
  )
}