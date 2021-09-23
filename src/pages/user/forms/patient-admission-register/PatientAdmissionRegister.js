import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AGE_UNITS, INPATIENT_NUMBERS_LIST, NEW_PATIENT, SOURCE_OF_ADMISSION } from "../../../../utils/constants/forms/index";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, LESS_THAN_FIFTY, NO, PATIENT_TYPES, PROVINCE_DISTRICT_PALIKA_LIST, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import PatientAdmissionDetails from "../../components/registers/Patient-admission-register/PatientAdmissionRegister";
import styles from "./style";

export default function PatientAdmissionRegister(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [admissionDetails, setAdmissionDetails] = useState([]);
  const [inpatientNumberOptions, setInpatientNumberOptions] = useState();
  const [inpatientNumberLabel, setInpatientNumberLabel] = useState();
  const [disablePatientTypeSelect, setDisablePatientTypeSelect] = useState(false);
  const [openAdmissionModal, setOpenAdmissionModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [inpatientNumberSelect, setInpatientNumberSelect] = useState(false);
  const [provinceSelected, setProvinceSelected] = useState(false);
  const [districtSelected, setDistrictSelected] = useState(false);
  const [provinceLabel, setProvinceLabel] = useState();
  const [districtLabel, setDistrictLabel] = useState();
  const [palikaNameLabel, setPalikaNameLabel] = useState();
  const [districtOptions, setDistrictOptions] = useState();
  const [palikaOptions, setPalikaOptions] = useState();
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("बिरामी भर्ना रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।")
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });

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

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getAdmissionDetails();
  }, [sewaDartaaRegisterDate]);

  const handleInpatientNumberChange = inpatientNumber => {
    let inpatientNumbers = SessionStorage.getItem(INPATIENT_NUMBERS_LIST);
    if (inpatientNumbers) {
      let patientInfo = inpatientNumbers.find(obj => obj.inpatientNumber === inpatientNumber.value);
      patientInfo ? updatePatientDetails(patientInfo) : getDetailsByInpatientNumber(inpatientNumber.value);
    } else {
      getDetailsByInpatientNumber(inpatientNumber.value)
    }
  };

  useEffect(() => {
    register({ name: "casteCode" }, { required: true });
    register({ name: "dateOfAdmission" }, { required: true });
    register({ name: "patientType" }, { required: true });
    register({ name: "policeCase" }, { required: true });
    register({ name: "sourceOfAdmission" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "province" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "palikaName" }, { required: true });
    register({ name: "inpatientNumber" });
  }, [register]);

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    setModalDefaultValues({
      patientType: "PREVIOUS_PATIENT",
      inpatientNumber: patientDetails.inpatientNumber,
      patientFirstName: patientDetails.patientFirstName,
      patientLastName: patientDetails.patientLastName,
      casteCode: patientDetails.casteCode,
      age: patientDetails.age,
      ageUnit: patientDetails.ageUnit,
      gender: patientDetails.gender,
      province: patientDetails.province,
      district: patientDetails.district,
      palikaName: patientDetails.palikaName,
      wardNumber: patientDetails.wardNumber,
      guardianName: patientDetails.guardianName,
      guardianPhoneNumber: patientDetails.guardianPhoneNumber,
      policeCase: patientDetails.policeCase ? YES : NO,
    })
  }

  useEffect(() => {
    if (modalDefaultValues.province && modalDefaultValues.district && modalDefaultValues.palikaName) {
      let province = PROVINCE_DISTRICT_PALIKA_LIST.find(option => option.value === modalDefaultValues.province);
      let district = province.districts.find(option => option.value === modalDefaultValues.district);
      let palika = district.palikas.find(option => option.value === modalDefaultValues.palikaName);
      handleProvinceChange(province);
      handleDistrictChange(district);
      handlePalikaNameChange(palika);
      setInpatientNumberLabel(inpatientNumberOptions.find(option => option.value === modalDefaultValues.inpatientNumber));
    }
    reset(modalDefaultValues);
  }, [modalDefaultValues])

  const onSubmit = data => {
    if (modalDefaultValues.id) {
      data.id = modalDefaultValues.id;
    }
    data.dateOfAdmission = data.dateOfAdmission && DateUtils.getDateMilliseconds(data.dateOfAdmission);
    data.policeCase = data.policeCase === YES;
    HMIS.post(API_URL.patientAdmission, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getAdmissionDetails();
          closePatientAdmissionModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleProvinceChange = provinceOption => {
    provinceOption ? setProvinceSelected(true) : setProvinceSelected(false);
    setValue("province", provinceOption ? provinceOption.value : null);
    setValue("district", null);
    setValue("palikaName", null);
    setProvinceLabel(provinceOption ? provinceOption : null);
    setDistrictLabel(null);
    setPalikaNameLabel(null);
    provinceOption &&
      setDistrictOptions(provinceOption.districts);
  }

  const handleDistrictChange = (districtOption) => {
    districtOption ? setDistrictSelected(true) : setDistrictSelected(false);
    setValue("district", districtOption ? districtOption.value : null);
    setValue("palikaName", null);
    setPalikaNameLabel(null);
    setDistrictLabel(districtOption ? districtOption : "");
    districtOption &&
      setPalikaOptions(districtOption.palikas);
  }

  const handlePalikaNameChange = palikaOption => {
    setValue("palikaName", palikaOption ? palikaOption.value : null);
    setPalikaNameLabel(palikaOption ? palikaOption : "");
  }

  const getDetailsByInpatientNumber = (inpatientNumber) => {
    HMIS.get(API_URL.patientAdmission + "/inpatient-number/" + inpatientNumber)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.policeCase = jsondata.data.policeCase ? YES : NO;
          jsondata.data.dateOfAdmission = DateUtils.getDateFromMilliseconds(jsondata.data.dateOfAdmission);
          updatePatientDetails(jsondata.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const admissionEditFunction = (id) => {
    HMIS.get(API_URL.patientAdmission + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dateOfAdmission = DateUtils.getDateFromMilliseconds(jsondata.data.dateOfAdmission);
          jsondata.data.policeCase = jsondata.data.policeCase ? YES : NO;
          setShrinkLabel(true);
          setModalTitle(EDIT_SELECTED_RECORD);
          setOpenAdmissionModal(true);
          setModalDefaultValues(jsondata.data);
          setDisablePatientTypeSelect(true);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getAdmissionDetails = () => {
    var inpatientNumberDartaaOptions = [];
    HMIS.get(API_URL.patientAdmission + "?fromDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&&toDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setAdmissionDetails(jsondata.objectList);
          SessionStorage.setItem(INPATIENT_NUMBERS_LIST, jsondata.objectList);
          jsondata.objectList.forEach(item => {
            inpatientNumberDartaaOptions.push({ "value": item.inpatientNumber, "label": item.inpatientNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
          });
          setInpatientNumberOptions(inpatientNumberDartaaOptions);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closePatientAdmissionModal = () => {
    reset({});
    setOpenAdmissionModal(false);
    setModalDefaultValues({});
    setShrinkLabel(undefined);
    setDisablePatientTypeSelect(false);
    setModalTitle("बिरामी भर्ना रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setInpatientNumberLabel("");
    setProvinceLabel("");
    setDistrictLabel("");
    setPalikaNameLabel("");
  }

  const handleDateChange = date => {
    setValue("dateOfAdmission", date);
  };

  const handleCustomSelectChange = (value, name) => {
    if (name === "patientType") {
      setInpatientNumberSelect(value !== NEW_PATIENT);
    }
    setValue(name, value);
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          बिरामी भर्ना रजिस्टर
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
          <Box>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenAdmissionModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
          </Box>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openAdmissionModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closePatientAdmissionModal}
        maxWidth="lg"
      >
        <Box className={classes.patientAdmissionRegister}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="सेवाग्राहीको किसिम"
                size="small"
                name="patientType"
                variant="outlined"
                options={PATIENT_TYPES}
                onChange={handleCustomSelectChange}
                disabled={disablePatientTypeSelect}
                value={modalDefaultValues.patientType}
                disabledOptionSelectable
                fullWidth
              />
              {errors.patientType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title={inpatientNumberSelect ? "कृपया पुरानो सेवाग्राहीको दर्ता नम्बर चयन गर्नुहोस्।" : "तपाईले सेवाग्राहीको किसिममा पुरानो सेवाग्राही विकल्प छनौट गर्नुभयो भने मात्र दर्ता नम्बर चयन गर्न सक्नुहुन्छ। नयाँ सेवाग्राहीको लागि दर्ता नम्बर प्रणालीले आँफै स्वचालित रूपमा सेभ गर्नेछ।"} placement="top" arrow>
                <Box>
                  <Select
                    className="select-sm"
                    classNamePrefix="react-select"
                    placeholder="दर्ता नम्बर"
                    name="inpatientNumber"
                    size="small"
                    variant="outlined"
                    options={inpatientNumberOptions}
                    value={inpatientNumberLabel}
                    onChange={handleInpatientNumberChange}
                    isDisabled={!inpatientNumberSelect}
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="भर्ना गरिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="dateOfAdmission"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={handleDateChange}
                    placeholder="Date Of Admission"
                    defaultDate={modalDefaultValues.dateOfAdmission}
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.dateOfAdmission && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Time Of Admission"
                type="time"
                name="timeOfAdmission"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                InputLabelProps={{ shrink: shrinkLabel }}
              />
              {errors.timeOfAdmission && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="First and Middle Name"
                type="text"
                name="patientFirstName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
                InputLabelProps={{ shrink: shrinkLabel }}
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Family Name"
                type="text"
                name="patientLastName"
                size="small"
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
                name="casteCode"
                label="जाति कोड"
                size="small"
                value={modalDefaultValues.casteCode}
                variant="outlined"
                options={CASTE_CODES}
                onChange={handleCustomSelectChange}
                fullWidth
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="सेवाग्राहीको उमेर खुलाउनुहोस" placement="top" arrow>
                <TextField
                  label="उमेर"
                  type="number"
                  size="small"
                  variant="outlined"
                  name="age"
                  inputRef={register({
                    required: true,
                    min: 1
                  })}
                  InputLabelProps={{ shrink: shrinkLabel }}
                  fullWidth
                />
              </Tooltip>
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.age && errors.age.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="उमेर वर्ष वा महिना"
                name="ageUnit"
                size="small"
                variant="outlined"
                options={AGE_UNITS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.ageUnit}
                fullWidth
              />
              {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="लिङ्ग"
                size="small"
                name="gender"
                variant="outlined"
                options={GENDER_OPTIONS}
                value={modalDefaultValues.gender}
                onChange={handleCustomSelectChange}
                fullWidth
              />
              {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                placeholder="प्रदेशको नाम"
                name="province"
                size="small"
                variant="outlined"
                options={PROVINCE_DISTRICT_PALIKA_LIST}
                value={provinceLabel}
                onChange={handleProvinceChange}
                isClearable
              />
              {errors.province && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                placeholder="जिल्लाको नाम"
                name="district"
                size="small"
                variant="outlined"
                options={districtOptions}
                value={districtLabel}
                onChange={handleDistrictChange}
                isDisabled={!provinceSelected}
                isClearable
              />
              {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                placeholder="पालिकाको नाम"
                name="palikaName"
                size="small"
                variant="outlined"
                options={palikaOptions}
                value={palikaNameLabel}
                onChange={handlePalikaNameChange}
                isDisabled={!districtSelected || !provinceSelected}
                isClearable
              />
              {errors.palikaName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="वडा नं."
                type="number"
                size="small"
                variant="outlined"
                name="wardNumber"
                inputRef={register({ required: true, min: 1, max: 50 })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.wardNumber && errors.wardNumber.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
              {errors.wardNumber && errors.wardNumber.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
              {errors.wardNumber && errors.wardNumber.type === "max" && (<span className="error-message">{LESS_THAN_FIFTY}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="गाउँ/टोल"
                type="text"
                size="small"
                variant="outlined"
                name="gaunOrTole"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.gaunTole && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="अविभावकको नाम"
                type="text"
                size="small"
                variant="outlined"
                name="guardianName"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.guardianName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>

          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="अविभावकको सम्पर्क नं."
                type="text"
                size="small"
                variant="outlined"
                name="guardianPhoneNumber"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.guardianPhoneNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="sourceOfAdmission"
                label="Source of Admission"
                size="small"
                variant="outlined"
                options={SOURCE_OF_ADMISSION}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.sourceOfAdmission}
                fullWidth
              />
              {errors.sourceOfAdmission && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Ward"
                name="ward"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
              />
              {errors.ward && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Name of Surgery"
                name="nameOfSurgery"
                size="small"
                variant="outlined"
                inputRef={register}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                label="Investigation"
                name="investigation"
                size="small"
                variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="Provisional Diagnosis"
                name="provisionalDiagnosis"
                size="small"
                variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="policeCase"
                label="Police Case"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.policeCase}
                fullWidth
              />
              {errors.policeCase && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Remarks"
                name="remarks"
                size="small"
                variant="outlined"
                inputRef={register}
                InputLabelProps={{ shrink: shrinkLabel }}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <PatientAdmissionDetails tableData={admissionDetails} showActionColumn={admissionDetails.length !== 0} onEditRow={admissionEditFunction.bind(this)} getAdmissionDetails={getAdmissionDetails} />
    </>
  );
}
