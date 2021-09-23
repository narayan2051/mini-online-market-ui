import { Box, Button, Divider, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select as MaterialSelect, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add, Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../../misc/appMisc";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, HTTP_STATUS_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { AGE_UNITS, CONTACT_INVESTIGATION_OUTCOME, DS_OR_DRTB, MUL_DARTA_NUMBERS_LIST, PRESUMPTIVE_TB_TYPE } from "../../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import { SessionStorage } from "../../../../../utils/storage/sessionStorage";
import ContactInvestigationRegister from "../../../components/registers/tuberculosis/contact-investigation/ContactInvestigationRegister";
import styles from "../style";

export default function ContactInvestigation() {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [childernNumberInFamily, setChildrenNumberInFamily] = useState(0);
  const [adultNumberInFamily, setAdultNumberInFamily] = useState(0);
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]);
  const [openContactInvestigationModal, setOpenContactInvestigationModal] = useState(false);
  const [contactInvestigationData, setContactInvestigationData] = useState([]);
  const [shrinkLabel, setShrinkLabel] = useState();
  const [modalTitle, setModalTitle] = useState("क्षयरोग सम्पर्क अनुशन्धान रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [mulDartaaLabel, setMulDartaaLabel] = useState();
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [showPresumptiveTBType, setShowPresumptiveTBType] = useState(false);
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });

  const [customError, setCustomError] = useState({});

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
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "dartaaNumber" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "dsOrDRTB" }, { required: true })
    attachMulDartaaOptions();
  }, [register])


  const handleAddFamilyDetails = () => {
    const values = [...familyDetails];
    values.push({});
    setFamilyDetails(values);
  };

  const handleRemoveFamilyDetails = index => {
    const values = [...familyDetails];
    values.splice(index, 1);
    setFamilyDetails(values);
  };

  const handleFamilyDetailsInputChange = (index, event) => {
    if (event.target.name === `presumptiveTB~${index}`) {
      setShowPresumptiveTBType(event.target.value === YES)
    }
    const values = [...familyDetails];
    values[index][event.target.name] = event.target.value;
    setFamilyDetails(values);
  };

  const handleStartDateChange = (date, index) => {
    let startDate = date && DateUtils.getDateMilliseconds(date);
    const values = [...familyDetails];
    values[index][`startDate~${index}`] = startDate;
    setFamilyDetails(values);
  }

  const handleTwoMonthDateChange = (date, index) => {
    let twoMonthDate = date && DateUtils.getDateMilliseconds(date);
    const values = [...familyDetails];
    values[index][`twoMonthDate~${index}`] = twoMonthDate;
    setFamilyDetails(values);
  }

  const handleThreeMonthDateChange = (date, index) => {
    let threeMonthDate = date && DateUtils.getDateMilliseconds(date);
    const values = [...familyDetails];
    values[index][`threeMonthDate~${index}`] = threeMonthDate;
    setFamilyDetails(values);
  }

  const handleOutcomeDateChange = (date, index) => {
    let outcomeDate = date && DateUtils.getDateMilliseconds(date);
    const values = [...familyDetails];
    values[index][`outcomeDate~${index}`] = outcomeDate;
    setFamilyDetails(values);
  }

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getListOfTuberculosisContactInvestigationDetails();
  }, [sewaDartaaRegisterDate]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const getListOfTuberculosisContactInvestigationDetails = () => {
    HMIS.get(API_URL.contactInvestigation + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&dateTo=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setContactInvestigationData(jsondata.objectList);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
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
    HMIS.get(API_URL.tbTreatmentRegister + "/get-for-current-fiscal-year")
      .then(response => {
        var data = response.data.objectList;
        SessionStorage.setItem(MUL_DARTA_NUMBERS_LIST, data);
        data.forEach(item => {
          mulDartaaOptions.push({ "value": item.dartaaNumber, "label": item.dartaaNumber + " (" + item.patientFirstName + " " + item.patientLastName + ")" });
        });
        setMulDartaaOptions(mulDartaaOptions);
      })
  }

  const handleContactInvestigationEdit = (id) => {
    let dataList = [];

    HMIS.get(API_URL.contactInvestigation + "/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.data.dartaaMiti = jsondata.data.dartaaMiti && DateUtils.getDateFromMilliseconds(jsondata.data.dartaaMiti);
          jsondata.data.palikaName = jsondata.data.palikaName && AppMisc.getMunicipalityName(jsondata.data.palikaName);
          setValue("dartaaNumber", jsondata.data.dartaaNumber);

          jsondata.data.contactInvestigationAndTBPTFamilyMemberDetailList?.map((item, index) => {
            dataList.push({
              [`${"age"}~${index}`]: item.age,
              [`${"ageUnit"}~${index}`]: item.ageUnit,
              [`${"firstName"}~${index}`]: item.firstName,
              [`${"lastName"}~${index}`]: item.lastName,
              [`${"gender"}~${index}`]: item.gender,
              [`${"presumptiveTB"}~${index}`]: item.presumptiveTB,
              [`${"presumptiveTBType"}~${index}`]: item.presumptiveTBType,
              [`${"tbDiagnosed"}~${index}`]: item.tbDiagnosed,
              [`${"nameOfHealthFacility"}~${index}`]: item.nameOfHealthFacility,
              [`${"eligibleForTBPT"}~${index}`]: item.eligibleForTBPT,
              [`${"startDate"}~${index}`]: item.startDate && DateUtils.getDateFromMilliseconds(item.startDate),
              [`${"startWeight"}~${index}`]: item.startWeight,
              [`${"startNumberOfTablets"}~${index}`]: item.startNumberOfTablets,
              [`${"twoMonthDate"}~${index}`]: item.twoMonthDate && DateUtils.getDateFromMilliseconds(item.twoMonthDate),
              [`${"twoMonthWeight"}~${index}`]: item.twoMonthWeight,
              [`${"twoMonthNumberOfTablets"}~${index}`]: item.twoMonthNumberOfTablets,
              [`${"threeMonthDate"}~${index}`]: item.threeMonthDate && DateUtils.getDateFromMilliseconds(item.threeMonthDate),
              [`${"threeMonthWeight"}~${index}`]: item.threeMonthWeight,
              [`${"threeMonthNumberOfTablets"}~${index}`]: item.threeMonthNumberOfTablets,
              [`${"outcome"}~${index}`]: item.outcome,
              [`${"outcomeDate"}~${index}`]: item.outcomeDate && DateUtils.getDateFromMilliseconds(item.outcomeDate),
              [`${"remarks"}~${index}`]: item.remarks,
            })
          })
          setFamilyDetails(dataList)
          setMulDartaaLabel(mulDartaaOptions.find(option => option.value === jsondata.data.dartaaNumber));
          setValue("ageUnit", jsondata.data.ageUnit);
          setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.ageUnit));
          setModalTitle(EDIT_SELECTED_RECORD);
          setModalDefaultValues(jsondata.data);
          setAdultNumberInFamily(jsondata.data.numberOfAdultsInFamily);
          setChildrenNumberInFamily(jsondata.data.numberOfChildrenInFamily);
          setOpenContactInvestigationModal(true);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
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
    setValue("dartaaMiti", date);
  }

  const onSubmit = (data) => {
    let errorObject = {};

    familyDetails.map((item, index) => {
      !item[`${"firstName"}~${index}`] && Object.assign(errorObject, { [`${"firstName"}~${index}`]: true })
      !item[`${"lastName"}~${index}`] && Object.assign(errorObject, { [`${"lastName"}~${index}`]: true })
      !item[`${"age"}~${index}`] && Object.assign(errorObject, { [`${"age"}~${index}`]: true })
      !item[`${"ageUnit"}~${index}`] && Object.assign(errorObject, { [`${"ageUnit"}~${index}`]: true })
      !item[`${"gender"}~${index}`] && Object.assign(errorObject, { [`${"gender"}~${index}`]: true })
    })

    setCustomError(errorObject);

    let dataList = [];

    if (JSON.stringify(errorObject) === "{}") {

      data.contactInvestigationAndTBPTFamilyMemberDetailList = familyDetails;
      data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);
      data.palikaName = AppMisc.getMunicipalityValueFromLabel(data.palikaName);
      data.id = modalDefaultValues.id;

      data.contactInvestigationAndTBPTFamilyMemberDetailList?.map((item, index) => {
        dataList.push({
          age: item[`${"age"}~${index}`],
          ageUnit: item[`${"ageUnit"}~${index}`],
          firstName: item[`${"firstName"}~${index}`],
          lastName: item[`${"lastName"}~${index}`],
          gender: item[`${"gender"}~${index}`],
          presumptiveTB: item[`${"presumptiveTB"}~${index}`],
          presumptiveTBType: item[`${"presumptiveTBType"}~${index}`],
          tbDiagnosed: item[`${"tbDiagnosed"}~${index}`],
          nameOfHealthFacility: item[`${"nameOfHealthFacility"}~${index}`],
          eligibleForTBPT: item[`${"eligibleForTBPT"}~${index}`],
          startDate: item[`${"startDate"}~${index}`],
          startWeight: item[`${"startWeight"}~${index}`],
          startNumberOfTablets: item[`${"startNumberOfTablets"}~${index}`],
          twoMonthDate: item[`${"twoMonthDate"}~${index}`],
          twoMonthWeight: item[`${"twoMonthWeight"}~${index}`],
          twoMonthNumberOfTablets: item[`${"twoMonthNumberOfTablets"}~${index}`],
          threeMonthDate: item[`${"threeMonthDate"}~${index}`],
          threeMonthWeight: item[`${"threeMonthWeight"}~${index}`],
          threeMonthNumberOfTablets: item[`${"threeMonthNumberOfTablets"}~${index}`],
          outcome: item[`${"outcome"}~${index}`],
          outcomeDate: item[`${"outcomeDate"}~${index}`],
          remarks: item[`${"remarks"}~${index}`],
        })
      })

      data.contactInvestigationAndTBPTFamilyMemberDetailList = dataList;

      HMIS.post(API_URL.contactInvestigation, data)
        .then(response => {
          response.data.type === SUCCESS && closeContactInvestigationModal();
          AddAlertMessage({ type: response.data.type, message: response.data.message });
          getListOfTuberculosisContactInvestigationDetails();
        })
        .catch(error => {
          AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
        });

    }
  }

  const closeContactInvestigationModal = () => {
    setModalDefaultValues({});
    setCustomError({});
    reset({});
    setFamilyDetails([]);
    setChildrenNumberInFamily(0);
    setAdultNumberInFamily(0);
    setShowPresumptiveTBType(false);
    setOpenContactInvestigationModal(false);
    setModalTitle("सम्पर्क परिक्षण तथा क्षयरोग प्रतिरोधात्मक उपचार रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setMulDartaaLabel(null);
    setAgeUnitLabel("");
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          सम्पर्क परिक्षण तथा क्षयरोग प्रतिरोधात्मक उपचार रजिस्टर
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
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenContactInvestigationModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openContactInvestigationModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeContactInvestigationModal}
        hideSubmitBtn={familyDetails.length === 0}
        fullScreen
      >
        {familyDetails.length === 0 && (
          <Box mb={2}>
            <Typography variant="caption" color="error">[ नोट: विवरण बुझाउनुअघि परिवारका सदस्यहरुको विवरण अनिवार्य राख्नुपर्दछ ]</Typography>
          </Box>
        )}
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
                name="dartaaNumber"
                variant="outlined"
                onChange={handleMulDartaaChange}
              />
              {errors.dartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
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
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="numberOfChildrenInFamily"
                label="परिवारमा बालबलिकाको संख्या"
                type="number"
                onChange={(event) => setChildrenNumberInFamily(event.target.value)}
                defaultValue={modalDefaultValues.numberOfChildrenInFamily}
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.numberOfChildrenInFamily && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.numberOfChildrenInFamily && errors.numberOfChildrenInFamily.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                name="numberOfAdultsInFamily"
                label="परिवारमा वयस्क संख्या"
                type="number"
                onChange={event => setAdultNumberInFamily(event.target.value)}
                defaultValue={modalDefaultValues.numberOfAdultsInFamily}
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.numberOfAdultsInFamily && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.numberOfAdultsInFamily && errors.numberOfAdultsInFamily.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                name="investigatorName"
                label="अन्वेषकको नाम"
                defaultValue={modalDefaultValues.investigatorName}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.investigatorName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="DS or DRTB"
                name="dsOrDRTB"
                variant="outlined"
                size="small"
                value={modalDefaultValues.dsOrDRTB}
                options={DS_OR_DRTB}
                onChange={handleCustomSelectChange}
                fullWidth
              />
              {errors.dsOrDRTB && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
        {familyDetails.map((familyDetail, index) => (
          <React.Fragment key={`${familyDetail}~${index}`}>
            <Box className={classes.familyDetailsContainer}>
              <Grid container spacing={1} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <TextField
                    name={`firstName~${index}`}
                    label="नाम"
                    defaultValue={familyDetail[`firstName~${index}`]}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {customError[`${"firstName"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`lastName~${index}`}
                    label="थर"
                    defaultValue={familyDetail[`lastName~${index}`]}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {customError[`${"lastName"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`age~${index}`}
                    label="उमेर"
                    type="number"
                    defaultValue={familyDetail[`age~${index}`]}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {customError[`${"age"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="age-unit-label">उमेर बर्ष वा महिना</InputLabel>
                    <MaterialSelect
                      labelId="age-unit-label"
                      value={familyDetail[`ageUnit~${index}`] || ""}
                      name={`ageUnit~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {AGE_UNITS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                  {customError[`${"ageUnit"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="gender-label">लिङ्ग</InputLabel>
                    <MaterialSelect
                      labelId="gender-label"
                      value={familyDetail[`gender~${index}`] || ""}
                      name={`gender~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {GENDER_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                  {customError[`${"gender"}~${index}`] && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="presumptiveTB-label">Presumptive TB</InputLabel>
                    <MaterialSelect
                      labelId="presumptiveTB-label"
                      value={familyDetail[`presumptiveTB~${index}`] || ""}
                      name={`presumptiveTB~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {YES_NO_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                </Grid>
                {showPresumptiveTBType && (
                  <Grid item xs>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <InputLabel id="presumptive-TB-type-label">Presumptive TB Type</InputLabel>
                      <MaterialSelect
                        labelId="presumptive-TB-type-label"
                        value={familyDetail[`presumptiveTBType~${index}`] || ""}
                        name={`presumptiveTBType~${index}`}
                        onChange={event => handleFamilyDetailsInputChange(index, event)}
                      >
                        <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                        {PRESUMPTIVE_TB_TYPE.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                      </MaterialSelect>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="TB-Diagnosed">TB Diagnosed</InputLabel>
                    <MaterialSelect
                      labelId="TB-Diagnosed"
                      value={familyDetail[`tbDiagnosed~${index}`] || ""}
                      name={`tbDiagnosed~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {YES_NO_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`nameOfHealthFacility~${index}`}
                    label="स्वास्थ्य सुविधा को नाम"
                    defaultValue={familyDetail[`nameOfHealthFacility~${index}`]}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="Eligible-for-TBPT">Eligible For TBPT</InputLabel>
                    <MaterialSelect
                      labelId="Eligible-for-TBPT"
                      value={familyDetail[`eligibleForTBPT~${index}`] || ""}
                      name={`eligibleForTBPT~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {YES_NO_OPTIONS.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <Tooltip title="सुरुको मिति" placement="top" arrow>
                    <Box>
                      <NepaliDate
                        name={`startDate~${index}`}
                        className="date-picker-form-control input-sm full-width"
                        placeholder="सुरुको मिति"
                        defaultDate={familyDetail[`startDate~${index}`]}
                        onDateSelect={(date) => handleStartDateChange(date, index)}
                        hideLabel
                      />
                    </Box>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <TextField
                    name={`startWeight~${index}`}
                    label="सुरुको तौल"
                    type="number"
                    defaultValue={familyDetail[`startWeight~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`startNumberOfTablets~${index}`}
                    label="सुरुमा उपलब्ध गराइएको टेवलेट संख्या"
                    type="number"
                    defaultValue={familyDetail[`startNumberOfTablets~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <Tooltip title="दुई महिना पछिको मिति" placement="top" arrow>
                    <Box>
                      <NepaliDate
                        name={`twoMonthDate~${index}`}
                        className="date-picker-form-control input-sm full-width"
                        placeholder="दुई महिना पछिको मिति"
                        defaultDate={familyDetail[`twoMonthDate~${index}`]}
                        onDateSelect={(date) => handleTwoMonthDateChange(date, index)}
                        hideLabel
                      />
                    </Box>
                  </Tooltip>
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`twoMonthWeight~${index}`}
                    label="दुई महिना पछिको तौल"
                    type="number"
                    defaultValue={familyDetail[`twoMonthWeight~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`twoMonthNumberOfTablets~${index}`}
                    label="दुई महिना पछि उपलब्ध गराइएको टेवलेट संख्या"
                    type="number"
                    defaultValue={familyDetail[`twoMonthNumberOfTablets~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <Tooltip title="तीन महिना पछिको मिति" placement="top" arrow>
                    <Box>
                      <NepaliDate
                        name={`threeMonthDate~${index}`}
                        className="date-picker-form-control input-sm full-width"
                        placeholder="तीन महिना पछिको मिति"
                        defaultDate={familyDetail[`threeMonthDate~${index}`]}
                        onDateSelect={(date) => handleThreeMonthDateChange(date, index)}
                        hideLabel
                      />
                    </Box>
                  </Tooltip>
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`threeMonthWeight~${index}`}
                    label="तीन महिना पछिको तौल"
                    type="number"
                    defaultValue={familyDetail[`threeMonthWeight~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <TextField
                    name={`threeMonthNumberOfTablets~${index}`}
                    label="तीन महिना पछि उपलब्ध गराइएको टेवलेट संख्या"
                    type="number"
                    defaultValue={familyDetail[`threeMonthNumberOfTablets~${index}`] || ""}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs>
                  <FormControl variant="outlined" size="small" fullWidth>
                    <InputLabel id="Contact-investigation-outcome">Contact Investigation Outcome</InputLabel>
                    <MaterialSelect
                      labelId="Contact-investigation-outcome"
                      value={familyDetail[`outcome~${index}`] || ""}
                      name={`outcome~${index}`}
                      onChange={event => handleFamilyDetailsInputChange(index, event)}
                    >
                      <MenuItem value="">कृपया छान्नुहोस्</MenuItem>
                      {CONTACT_INVESTIGATION_OUTCOME.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                    </MaterialSelect>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <Tooltip title="परिमाण आएको मिति" placement="top" arrow>
                    <Box>
                      <NepaliDate
                        name={`outcomeDate~${index}`}
                        className="date-picker-form-control input-sm full-width"
                        placeholder="परिमाण आएको मिति"
                        defaultDate={familyDetail[`outcomeDate~${index}`]}
                        onDateSelect={(date) => handleOutcomeDateChange(date, index)}
                        hideLabel
                      />
                    </Box>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <TextField
                    name={`remarks~${index}`}
                    label="कैफियत"
                    defaultValue={familyDetail[`remarks~${index}`]}
                    onChange={event => handleFamilyDetailsInputChange(index, event)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                  />
                </Grid>
              </Grid>
              {
                (index + 1 === familyDetails.length) &&
                <Tooltip title="परिवार विवरण हटाउनुहोस्।" placement="top" arrow><Cancel className={classes.removeFamilyDetailsContainer} onClick={() => handleRemoveFamilyDetails(index)} fontSize="small" /></Tooltip>
              }
              <Divider variant="middle" className={classes.divider} />
            </Box>
          </React.Fragment>
        ))
        }
        {
          familyDetails.length < (Number(childernNumberInFamily) + Number(adultNumberInFamily)) &&
          <Grid container justify="center" alignItems="center" className={classes.addTreatmentDetailsBtnContainer}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { handleAddFamilyDetails() }}>नयाँ विवरण थप्नुहोस्</Button>
          </Grid>
        }
      </CustomModal>
      <ContactInvestigationRegister tableData={contactInvestigationData} onEditRow={handleContactInvestigationEdit.bind(this)} />
    </>
  );
}