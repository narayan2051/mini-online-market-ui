import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import CustomSelect from '../../../../../components/custom-select/CustomSelect';
import Select from "react-select";
import CustomModal from '../../../../../components/modal/CustomModal';
import NepaliDate from '../../../../../components/nepali-datepicker/NepaliDatePicker';
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from '../../../../../utils/constants';
import { DateUtils } from '../../../../../utils/dateUtils';
import PresumptiveTbRegister from '../../../components/registers/tuberculosis/presumptive-tb/PresumptiveTbRegister';
import styles from "../style";
import { SessionStorage } from '../../../../../utils/storage/sessionStorage';
import { IMCI_MAIN_REGISTER_SERVICE_CODE, MUL_DARTA_NUMBERS_LIST, OUT_PATIENT_MAIN_REGISTER_SERVICE_CODE, REQUESTED_FOR_DIAGNOSIS, SCREENED_BY, TB_DIAGNOSIS, TREATMENT_STATUS, TUBERCULOSIS_MAIN_REGISTER_SERVICE_CODE } from '../../../../../utils/constants/forms';
import HMIS, { API_URL } from '../../../../../api/api';
import AddAlertMessage from '../../../../../components/alert/Alert';
import { AppMisc } from '../../../../../misc/appMisc';

export default function PresumptiveTb() {
  const classes = styles();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const districtOptions = AppMisc.getDistrictOptions();
  const [showPresumptiveTbModal, setShowPresumptiveTbModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("सम्भावित क्षयरोग रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [presumptiveTbRegisterTableData, setPresumptiveTbRegisterTableData] = useState([]);
  const [registerDate, setRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [showReferringHospitalField, setShowReferringHospitalField] = useState(false);

  useEffect(() => {
    register({ name: "dartaaNumber" }, { required: true });
    register({ name: "screenedDate" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "screenedBy" }, { required: true });
    register({ name: "testType" }, { required: true });
    register({ name: "tbDiagnosis" }, { required: true });
    register({ name: "treatmentStatus" }, { required: true });
    attachMulDartaaOptions();
  }, [register]);

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

  const handleScreenedDateChange = date => {
    date &&
      setValue("screenedDate", date);
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    patientDetails.dartaaNumber && setMulDartaaLabel(mulDartaaOptions.find(option => option.value === patientDetails.dartaaNumber));

    setValue("dartaaNumber", patientDetails.dartaaNumber);
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

  const handleCustomSelectChange = (value, name) => {
    if (name === "treatmentStatus") {
      setShowReferringHospitalField(value === "REFERRED")
    }
    setValue(name, value);
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

  const closePresumptiveTbModal = () => {
    setModalDefaultValues({});
    reset({});
    setMulDartaaLabel(null);
    setShowPresumptiveTbModal(false);
    setShowReferringHospitalField(false);
    setModalTitle("सम्भावित क्षयरोग रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setAgeUnitLabel("");
  }

  useEffect(() => {
    registerDate.dateFrom && registerDate.dateTo && getPresumptiveTbRegisterData();
  }, [registerDate]);

  const getPresumptiveTbRegisterData = () => {
    HMIS.get(API_URL.presumptiveTuberculosis + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(registerDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(registerDate.dateTo))
      .then(response => {
        if (response.data.type === SUCCESS)
          setPresumptiveTbRegisterTableData(response.data.objectList);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.screenedDate = data.screenedDate && DateUtils.getDateMilliseconds(data.screenedDate);

    HMIS.post(API_URL.presumptiveTuberculosis, data)
      .then(response => {
        response.data.type === SUCCESS && closePresumptiveTbModal();
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        closePresumptiveTbModal();
        getPresumptiveTbRegisterData();
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const presumptiveTbTableEditFunction = (id) => {
    HMIS.get(API_URL.presumptiveTuberculosis + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.screenedDate = DateUtils.getDateFromMilliseconds(jsondata.data.screenedDate);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          setValue("screenedDate", jsondata.data.screenedDate);
          setValue("dartaaNumber", jsondata.data.dartaaNumber);
          setMulDartaaLabel(mulDartaaOptions.find(option => option.value === jsondata.data.dartaaNumber));
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
          setModalTitle(EDIT_SELECTED_RECORD);
          setModalDefaultValues(jsondata.data);
          setShowPresumptiveTbModal(true);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          सम्भावित क्षयरोग रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
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
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowPresumptiveTbModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <PresumptiveTbRegister tableData={presumptiveTbRegisterTableData} showActionColumn={presumptiveTbRegisterTableData.length !== 0} onEditRow={presumptiveTbTableEditFunction.bind(this)} />
      <CustomModal
        title={modalTitle}
        showModal={showPresumptiveTbModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closePresumptiveTbModal}
        fullScreen
      >
        <Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="जाँच गरिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="screenedDate"
                    onDateSelect={(date) => { handleScreenedDateChange(date) }}
                    placeholder="जाँच गरिएको मिति"
                    hideLabel
                    defaultDate={modalDefaultValues.screenedDate || true}
                  />
                  {errors.screenedDate && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                size="small"
                placeholder="दर्ता नं."
                options={mulDartaaOptions}
                value={mulDartaaLabel}
                name="dartaaNumber"
                variant="outlined"
                onChange={handleMulDartaaChange}
              />
              {errors.dartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
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
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                name="gaunOrTole"
                label="गाँउ/टोल"
                defaultValue={modalDefaultValues.gaunOrTole}
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
          </Grid>
        </Box>
        <Box mt={3}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">अन्य विवरणहरू</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="screenedBy"
                label="जाँच गरिएको विधि"
                options={SCREENED_BY}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.screenedBy}
                variant="outlined"
                size="small"
                fullWidth
              />
              {errors.screenedBy && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="tbDiagnosis"
                label="क्षयरोगको निदान"
                options={TB_DIAGNOSIS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.tbDiagnosis}
                variant="outlined"
                size="small"
                fullWidth
              />
              {errors.tbDiagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="referringLabName"
                label="प्रयोगशालाको नाम"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                defaultValue={modalDefaultValues.referringLabName}
                size="small"
                fullWidth
              />
              {errors.referringLabName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="प्रयोगशालाको ठेगाना"
                name="referringLabAddress"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                defaultValue={modalDefaultValues.referringLabAddress}
                size="small"
                fullWidth
              />
              {errors.referringLabAddress && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="testType"
                label="निदानको लागि अनुरोध"
                options={REQUESTED_FOR_DIAGNOSIS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.testType}
                variant="outlined"
                size="small"
                fullWidth
              />
              {errors.testType && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="treatmentStatus"
                label="उपचार स्थिति"
                options={TREATMENT_STATUS}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.treatmentStatus}
                variant="outlined"
                size="small"
                fullWidth
              />
              {errors.treatmentStatus && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showReferringHospitalField && (
              <>
                <Grid item xs>
                  <TextField
                    label="प्रेषण गरेको स्वास्थ्य संस्थाको नाम"
                    name="referringHealthFacilityName"
                    variant="outlined"
                    inputRef={register({
                      required: true
                    })}
                    defaultValue={modalDefaultValues.referringHealthFacilityName}
                    size="small"
                    fullWidth
                  />
                  {errors.referringHealthFacilityName && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              </>
            )}
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
    </>
  )
}