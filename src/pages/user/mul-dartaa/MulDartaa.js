import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../api/api";
import AddAlertMessage from "../../../components/alert/Alert";
import CustomReactSelect from "../../../components/custom-react-select/CustomReactSelect";
import CustomModal from '../../../components/modal/CustomModal';
import NepaliDate from "../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../misc/appMisc";
import { AGE_UNITS, MUL_DARTA_NUMBERS_LIST, NEW_PATIENT, PREVIOUS_PATIENT } from "../../../utils/constants/forms";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, HTTP_STATUS_CODES, LESS_THAN_FIFTY, MUL_DARTA_SEWA_TYPES, PATIENT_TYPES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS } from "../../../utils/constants/index";
import { DateUtils } from "../../../utils/dateUtils";
import { SessionStorage } from "../../../utils/storage/sessionStorage";
import MulDartaaRegister from '../components/registers/mul-dartaa-register/MulDartaaRegister';
import styles from "./style";

export default function MulDartaa() {
  const classes = styles();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showMulDartaaModal, setShowMulDartaaModal] = useState(false);
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mulDartaaRegisterDate, setMulDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [mulDartaaOptions, setMulDartaaOptions] = useState();
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [showMulDartaaSelect, setShowMuldartaaSelect] = useState(false);
  const [showOtherMulDartaaOption, setShowOtherMulDartaaOption] = useState(false);
  const [modalTitle, setModalTitle] = useState("मूल दर्ता रजिस्टरमा नयाँ रेकर्ड थप्नुहोस् ।");
  const [districtLabel, setDistrictLabel] = useState();
  const [palikaNameLabel, setPalikaNameLabel] = useState();
  const [palikaOptions, setPalikaOptions] = useState();
  const [hasDistrictSelected, setHasDistrictSelected] = useState(false);
  const [disablePatientTypeSelect, setDisablePatientTypeSelect] = useState(false);
  const [mulDartaaNumberDefaultValues, setMulDartaaNumberDefaultValues] = useState();
  const [palikaInfoData, setPalikaInfoData] = useState({});

  const [customErrors, setCustomErrors] = useState({
    dartaaNumber: false
  });
  const districtOptions = AppMisc.getDistrictOptions();

  useEffect(() => {
    register({ name: "dartaaNumber" });
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "sewaType" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "patientType" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "palikaName" }, { required: true });
    attachMulDartaaOptions();
  }, [register]);

  useEffect(() => {
    mulDartaaRegisterDate.dateFrom && mulDartaaRegisterDate.dateTo && getMulDartaaData();
  }, [mulDartaaRegisterDate]);

  useEffect(() => {
    if (mulDartaaNumberDefaultValues) {
      setShrinkLabel(true);
      setValue("dartaaNumber", mulDartaaNumberDefaultValues.dartaaNumber);
      setValue("patientFirstName", mulDartaaNumberDefaultValues.patientFirstName);
      setValue("patientLastName", mulDartaaNumberDefaultValues.patientLastName);
      setValue("age", mulDartaaNumberDefaultValues.age);
      setValue("wardNumber", mulDartaaNumberDefaultValues.wardNumber);
      setValue("gaunOrTole", mulDartaaNumberDefaultValues.gaunOrTole);
      setValue("phoneNumber", mulDartaaNumberDefaultValues.phoneNumber);
      setValue("mulDartaaOtherOption", mulDartaaNumberDefaultValues.mulDartaaOtherOption);
      setValue("cost", mulDartaaNumberDefaultValues.cost);
      setValue("sentFromOrganizationName", mulDartaaNumberDefaultValues.sentFromOrganizationName);

      setModalDefaultValues(prev => ({
        ...prev,
        casteCode: mulDartaaNumberDefaultValues.casteCode,
        ageUnit: mulDartaaNumberDefaultValues.ageUnit,
        gender: mulDartaaNumberDefaultValues.gender,
        sewaType: mulDartaaNumberDefaultValues.sewaType,
      }));
      populateDistrictAndPalikaName(mulDartaaNumberDefaultValues.district, mulDartaaNumberDefaultValues.palikaName);
    }
  }, [mulDartaaNumberDefaultValues])

  const handleMulDartaaRegisterDateFromSelect = date => {
    date &&
      setMulDartaaRegisterDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleMulDartaaRegisterDateToSelect = (date) => {
    date &&
      setMulDartaaRegisterDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  const attachMulDartaaOptions = () => {
    var mulDartaaOptions = [];
    HMIS.get(API_URL.mulDartaaRegister + "/mul-dartaa-numbers")
      .then(response => {
        var data = response.data;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const handleDartaaNumberChange = (name, value) => {
    if (value) {
      let mulDartaaNumbers = SessionStorage.getItem(MUL_DARTA_NUMBERS_LIST);
      if (mulDartaaNumbers) {
        let muldartaaNumberInfo = mulDartaaNumbers.find(obj => obj.dartaaNumber === value);
        muldartaaNumberInfo ? setMulDartaaNumberDefaultValues(muldartaaNumberInfo) : getDetailsByMulDartaaNumber(value);
      } else {
        getDetailsByMulDartaaNumber(value)
      }
    }
  };

  const getDetailsByMulDartaaNumber = (mulDartaaNumber) => {
    HMIS.get(API_URL.mulDartaaNumber + "/" + mulDartaaNumber)
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          setMulDartaaNumberDefaultValues(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const submitMulDartaaForm = (data) => {
    data.id = modalDefaultValues.id;
    HMIS.post(API_URL.mulDartaaRegister, data)
      .then(response => {
        if (response.data.type === "success") {
          closeMulDartaaModal();
          getMulDartaaData();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
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
      submitMulDartaaForm(data);
    }
  }

  const mulDartaaEditFunction = id => {
    HMIS.get(API_URL.mulDartaaRegister + "/" + id)
      .then(response => {
        setShrinkLabel(true);
        setModalDefaultValues(response.data);
        setShowMulDartaaModal(true);
        setModalTitle(EDIT_SELECTED_RECORD);
        populateDistrictAndPalikaName(response.data.district, response.data.palikaName);
        setDisablePatientTypeSelect(true);
        setValue("dartaaNumber", response.data.dartaaNumber);
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

  const closeMulDartaaModal = () => {
    setModalDefaultValues({});
    reset();
    setShowMulDartaaModal(false);
    setModalTitle("मूल दर्ता रजिस्टरमा नयाँ रेकर्ड थप्नुहोस् ।");
    setShowOtherMulDartaaOption(false);
    setCustomErrors({
      dartaaNumber: false,
    });
    setShrinkLabel(undefined);
    setDistrictLabel("");
    setPalikaNameLabel("");
    setDisablePatientTypeSelect(false);
  }

  const handleDistrictChange = (districtOption) => {
    districtOption ? setHasDistrictSelected(true) : setHasDistrictSelected(false);
    setValue("palikaName", null);
    setPalikaNameLabel("");
    setValue("district", districtOption ? districtOption.value : null);
    setDistrictLabel(districtOption ? districtOption : "");
    districtOption && setPalikaOptions(districtOption.palikas);
  }

  const handlePalikaNameChange = palikaOption => {
    setValue("palikaName", palikaOption ? palikaOption.value : null);
    setPalikaNameLabel(palikaOption ? palikaOption : "");
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", DateUtils.getDateMilliseconds(date));
  }

  const getMulDartaaData = () => {
    HMIS.get(API_URL.mulDartaaRegister + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(mulDartaaRegisterDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(mulDartaaRegisterDate.dateTo))
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleCustomReactSelectChange = (name, value, option) => {
    setValue(name, value);
    if (name === "patientType") {
      setShowMuldartaaSelect(value && value !== NEW_PATIENT);
    }
    if (name === "sewaType") {
      setShowOtherMulDartaaOption(value === "10");
      value !== "10" && setValue("mulDartaaOtherOption", "");
    }
  }

  useEffect(() => {
    if (showMulDartaaModal && !modalDefaultValues.id && (JSON.stringify(palikaInfoData) !== "{}")) {
      populateDistrictAndPalikaName(palikaInfoData.district, palikaInfoData.palikaName)
    }
  }, [showMulDartaaModal, palikaInfoData])

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

  return (
    <div>
      <Box className={classes.mulDartaaRegisterContainer} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          मूल दर्ता रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleMulDartaaRegisterDateFromSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getDaysBeforeBSDate(30)} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleMulDartaaRegisterDateToSelect(date) }} labelText="दर्ता मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowMulDartaaModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showMulDartaaModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeMulDartaaModal}
        maxWidth="lg"
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="दर्ता मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control input-sm full-width" name="dartaaMiti" defaultDate={modalDefaultValues.dartaaMiti ? DateUtils.getDateFromMilliseconds(modalDefaultValues.dartaaMiti) : true} onDateSelect={(date) => { handleDartaaMitiChange(date) }} placeholder="दर्ता मिति" hideLabel />
                {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <CustomReactSelect
              label="सेवाग्राहीको किसिम"
              name="patientType"
              defaultValue={modalDefaultValues.patientType || NEW_PATIENT}
              options={PATIENT_TYPES}
              onChange={handleCustomReactSelectChange}
              isDisabled={disablePatientTypeSelect}
            />
            {errors.patientType && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title={showMulDartaaSelect ? "कृपया पुरानो सेवाग्राहीको दर्ता नम्बर चयन गर्नुहोस्।" : "तपाईले सेवाग्राहीको किसिममा पुरानो सेवाग्राही विकल्प छनौट गर्नुभयो भने मात्र दर्ता नम्बर चयन गर्न सक्नुहुन्छ। नयाँ सेवाग्राहीको लागि दर्ता नम्बर प्रणालीले आँफै स्वचालित रूपमा सेभ गर्नेछ।"} placement="top" arrow>
              <Box>
                <CustomReactSelect
                  label="दर्ता नम्बर"
                  name="dartaaNumber"
                  options={mulDartaaOptions}
                  defaultValue={modalDefaultValues.dartaaNumber}
                  onChange={handleDartaaNumberChange}
                  isDisabled={!showMulDartaaSelect}
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
            <CustomReactSelect
              label="लिङ्ग"
              name="gender"
              size="small"
              defaultValue={modalDefaultValues.gender}
              options={GENDER_OPTIONS}
              onChange={handleCustomReactSelectChange}
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
                min: 1
              })}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
            {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.age && errors.age.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
          </Grid>
          <Grid item xs>
            <CustomReactSelect
              label="उमेर वर्ष वा महिना"
              name="ageUnit"
              defaultValue={modalDefaultValues.ageUnit || "YEAR"}
              options={AGE_UNITS}
              onChange={handleCustomReactSelectChange}
            />
            {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomReactSelect
              label="जाती"
              size="small"
              name="casteCode"
              defaultValue={modalDefaultValues.casteCode}
              options={CASTE_CODES}
              onChange={handleCustomReactSelectChange}
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
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              name="gaunOrTole"
              label="गाँउ/टोल"
              defaultValue={modalDefaultValues.gaunOrTole}
              variant="outlined"
              inputRef={register({
                required: true
              })}
              InputLabelProps={{ shrink: shrinkLabel }}
              size="small"
              fullWidth
            />
            {errors.gaunOrTole && <span className="error-message">{REQUIRED_FIELD}</span>}
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
            <CustomReactSelect
              label="सेवाको किसिम"
              name="sewaType"
              defaultValue={modalDefaultValues.sewaType}
              variant="outlined"
              options={MUL_DARTA_SEWA_TYPES}
              onChange={handleCustomReactSelectChange}
            />
            {errors.sewaType && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title={showOtherMulDartaaOption ? "" : "तपाईले सेवाको किसिममा अन्य विकल्प छनौट गर्नुभयो भने मात्र यहाँ टाइप गर्न सक्नुहुन्छ।"} placement="top" arrow>
              <TextField
                label="अन्य"
                defaultValue={modalDefaultValues.mulDartaaOtherOption}
                type="text"
                size="small"
                variant="outlined"
                name="mulDartaaOtherOption"
                inputRef={register}
                InputProps={{ readOnly: !showOtherMulDartaaOption }}
                InputLabelProps={{ shrink: showOtherMulDartaaOption && shrinkLabel }}
                fullWidth
              />
            </Tooltip>
            {errors.mulDartaaOtherOption && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              label="निशुल्क/शुल्क रु"
              defaultValue={modalDefaultValues.cost || "नि:शुल्क"}
              type="text"
              size="small"
              variant="outlined"
              name="cost"
              inputRef={register}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <Tooltip title="यदि सेवाग्राही विदेशी भए मात्र यो कोठामा चिन्ह लगाउनुहोस ।" placement="top" arrow>
              <FormControlLabel
                label="विदेशी"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.foreigner}
                    name="foreigner"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              label="प्रेषण भई आएको संस्थाको नाम"
              defaultValue={modalDefaultValues.sentFromOrganizationName}
              type="text"
              size="small"
              variant="outlined"
              name="sentFromOrganizationName"
              inputRef={register}
              InputLabelProps={{ shrink: shrinkLabel }}
              fullWidth
            />
          </Grid>
        </Grid>
      </CustomModal>
      <MulDartaaRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={mulDartaaEditFunction.bind(this)} />
    </div>
  );
}