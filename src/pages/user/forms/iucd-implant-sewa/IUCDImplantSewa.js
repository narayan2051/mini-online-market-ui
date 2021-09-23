import { Box, Button, Checkbox, FormControlLabel, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../utils/constants";
import { CURRENT_OFFICE, IUCD_IMPLANT_CONDITION_DURING_TOOL_PLACEMENT, PARIWAAR_NIYOJAN_MAIN_REGISTER_SERVICE_CODE, MUL_DARTA_NUMBERS_LIST, PLACED_ORGANIZATION, SEWA_TYPES } from "../../../../utils/constants/forms";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import IUCDImplantRegister from "../../components/registers/iucd-implant-register/IUCDImplantRegister";
import styles from "./style";

export default function IUCDImplantSewa() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [openIucdImplantModal, setOpenIucdImplantModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [sewaTypeRegister, setSewaTypeRegister] = useState("iucd");
  const [registerData, setRegisterData] = useState([]);
  const [isCurrentOffice, setIsCurrentOffice] = useState(false);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("आइ.यु.सि.डी तथा इम्प्लाण्ट सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [registerDate, setRegisterDate] = useState({
    fromDate: null,
    toDate: null
  });

  useEffect(() => {
    register({ name: "mulDartaaNumber" }, { required: true });
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "sewaType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "conditionDuringToolPlacement" }, { required: true });
    register({ name: "placedOrganization" }, { required: true });
    register({ name: "lastDateToBeEffective" }, { required: true });
    register({ name: "toolPlacementDate" }, { required: true });
    register({ name: "dateOfWithdrawal" });
    attachMulDartaaOptions();
  }, [register]);


  useEffect(() => {
    registerDate.fromDate && registerDate.toDate && sewaTypeRegister &&
      getIUCDImplantDataFromDartaaMitiAndSewaType();
  }, [sewaTypeRegister, registerDate]);

  const closeIucdImplantModal = () => {
    setModalDefaultValues({});
    reset();
    setOpenIucdImplantModal(false);
    setModalTitle("आइ.यु.सि.डी तथा इम्प्लाण्ट सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel("");
    setAgeUnitLabel("");
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleSewaTypeRegisterChange = sewaType => {
    setSewaTypeRegister(sewaType);
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const handleLastDateToBeEffectiveChange = date => {
    setValue("lastDateToBeEffective", date);
  }

  const handleToolPlacementDateChange = date => {
    setValue("toolPlacementDate", date);

  }
  const handleDateOfWithdrawalChange = date => {
    setValue("dateOfWithdrawal", date);
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

  const IUCDImplantEditFunction = id => {
    HMIS.get(API_URL.iucdImplantSewaRegister + "/" + id).then(response => {
      response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
      response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
      response.data.lastDateToBeEffective = response.data.lastDateToBeEffective && DateUtils.getDateFromMilliseconds(response.data.lastDateToBeEffective);
      response.data.toolPlacementDate = response.data.toolPlacementDate && DateUtils.getDateFromMilliseconds(response.data.toolPlacementDate);
      response.data.dateOfWithdrawal = response.data.dateOfWithdrawal && DateUtils.getDateFromMilliseconds(response.data.dateOfWithdrawal);
      setModalDefaultValues(response.data);
      setOpenIucdImplantModal(true);
      setShrinkLabel(true);
      setModalTitle(EDIT_SELECTED_RECORD);
      setValue("mulDartaaNumber", response.data.mulDartaaNumber);
      setMulDartaaLabel(mulDartaaOptions.find(option => option.value === response.data.mulDartaaNumber));
      setValue("ageUnit", response.data.ageUnit);
      setAgeUnitLabel(AppMisc.getAgeUnitLabel(response.data.ageUnit));
    })
  }

  const handleRegisterDateFromSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        fromDate: date
      }));
  }

  const handleRegisterDateToSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        toDate: date
      }));
  }

  const handlePlacedOrganizationChange = value => {
    value === CURRENT_OFFICE && setValue("placedOtherOrganizationName", null);
    setValue("placedOrganization", value);
    setIsCurrentOffice(value !== CURRENT_OFFICE);
  }

  const getIUCDImplantDataFromDartaaMitiAndSewaType = () => {
    HMIS.get(API_URL.iucdImplantSewaRegister + "/dartaaMiti?fromDate=" + DateUtils.getDateMilliseconds(registerDate.fromDate) + "&&toDate=" + DateUtils.getDateMilliseconds(registerDate.toDate) + "&&sewaType=" + sewaTypeRegister)
      .then(response => {
        setRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.lastDateToBeEffective = data.lastDateToBeEffective && DateUtils.getDateMilliseconds(data.lastDateToBeEffective);
    data.toolPlacementDate = data.toolPlacementDate && DateUtils.getDateMilliseconds(data.toolPlacementDate);
    data.dateOfWithdrawal = data.dateOfWithdrawal && DateUtils.getDateMilliseconds(data.dateOfWithdrawal);

    HMIS.post(API_URL.iucdImplantSewaRegister, data)
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        if (response.data.type === "success") {
          closeIucdImplantModal();
          getIUCDImplantDataFromDartaaMitiAndSewaType();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };
  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          आइ.यु.सि.डी तथा इम्प्लाण्ट सेवा रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2} minWidth={150}>
            <CustomSelect
              label="सेवाको प्रकार"
              variant="outlined"
              name="sewaTypeRegister"
              options={SEWA_TYPES}
              value={sewaTypeRegister}
              onChange={handleSewaTypeRegisterChange}
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenIucdImplantModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openIucdImplantModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeIucdImplantModal}
        maxWidth="lg"
      >
        <Box className={classes.generalInfo}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">Patient Details</Typography>
          </Box>
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
                label="सेवाको प्रकार"
                variant="outlined"
                name="sewaType"
                options={SEWA_TYPES}
                onChange={handleCustomSelectChange}
                size="small"
                value={modalDefaultValues.sewaType || sewaTypeRegister}
                disabledOptionSelectable
                fullWidth
              />
              {errors.sewaType && <span className="error-message">{REQUIRED_FIELD}</span>}
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
            <Grid item xs>
              <TextField
                label="पतिको नाम र थर"
                name="husbandName"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.husbandName}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <FormControlLabel
                classes={{
                  label: classes.checkboxLabelSmall,
                }}
                label="नयाँ प्रयोगकर्ता"
                control={
                  <Checkbox
                    name="newPatient"
                    defaultChecked={modalDefaultValues.newPatient}
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />
                }
              />
            </Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
        <Box className={classes.iucdImplantDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">साधन सम्बन्धी विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="साधन राख्दाको अवस्था"
                name="conditionDuringToolPlacement"
                variant="outlined"
                options={IUCD_IMPLANT_CONDITION_DURING_TOOL_PLACEMENT}
                onChange={handleCustomSelectChange}
                value={modalDefaultValues.conditionDuringToolPlacement}
                size="small"
                fullWidth
              />
              {errors.conditionDuringToolPlacement && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="प्रभावकारी रहने आन्तिम मिति" placement="top" arrow>
                <Box>
                  <NepaliDate name="lastDateToBeEffective" defaultDate={modalDefaultValues.lastDateToBeEffective} className="date-picker-form-control input-sm full-width" onDateSelect={(date) => { handleLastDateToBeEffectiveChange(date) }} placeholder="प्रभावकारी रहने आन्तिम मिति" hideLabel />
                </Box>
              </Tooltip>
              {errors.lastDateToBeEffective && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="साधन राख्ने स्वास्थ्यकर्मीको नाम"
                name="healthWorkerName"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                defaultValue={modalDefaultValues.healthWorkerName}
                size="small"
                fullWidth
              />
              {errors.healthWorkerName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="साधन राख्ने स्वास्थ्यकर्मीको पद"
                name="healthWorkerPost"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                defaultValue={modalDefaultValues.healthWorkerPost}
                size="small"
                fullWidth
              />
              {errors.healthWorkerPost && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="राखिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate name="toolPlacementDate" defaultDate={modalDefaultValues.toolPlacementDate} className="date-picker-form-control input-sm full-width" onDateSelect={(date) => { handleToolPlacementDateChange(date) }} placeholder="राखिएको मिति" hideLabel />
                </Box>
              </Tooltip>
              {errors.toolPlacementDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="राखिएको संस्था"
                name="placedOrganization"
                variant="outlined"
                options={PLACED_ORGANIZATION}
                onChange={handlePlacedOrganizationChange}
                value={modalDefaultValues.placedOrganization}
                size="small"
                fullWidth
              />
              {errors.placedOrganization && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title={isCurrentOffice ? "" : "तपाईले राखिएको संस्था मा अन्य विकल्प छनौट गर्नुभयो भने मात्र यहाँ टाइप गर्न सक्नुहुन्छ।"} placement="top" arrow>
                <TextField
                  label="संस्थाको नाम"
                  name="placedOtherOrganizationName"
                  variant="outlined"
                  inputRef={register}
                  defaultValue={modalDefaultValues.placedOtherOrganizationName}
                  InputProps={{ readOnly: !isCurrentOffice }}
                  size="small"
                  fullWidth
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="झिकेको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate name="dateOfWithdrawal" defaultDate={modalDefaultValues.dateOfWithdrawal} className="date-picker-form-control input-sm full-width" onDateSelect={(date) => { handleDateOfWithdrawalChange(date) }} placeholder="झिकेको मिति" hideLabel />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="झिक्नुको कारण"
                name="reasonForWithdrawal"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.reasonForWithdrawal}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="साधन झिक्ने स्वास्थ्यकर्मीको नाम"
                name="healthWorkerFullNameWhoWithdrawal"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.healthWorkerFullNameWhoWithdrawal}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="साधन झिक्ने स्वास्थ्यकर्मीको पद"
                name="healthWorkerPostWhoWithdrawal"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.healthWorkerPostWhoWithdrawal}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="कैफियत"
                size="small"
                name="remarks"
                variant="outlined"
                inputRef={register}
                defaultValue={modalDefaultValues.remarks}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <IUCDImplantRegister tableData={registerData} showActionColumn={registerData.length !== 0} onEditRow={IUCDImplantEditFunction.bind(this)} />
    </div>
  );
}
