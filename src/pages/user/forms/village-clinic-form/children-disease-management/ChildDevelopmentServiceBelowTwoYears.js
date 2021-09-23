import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GENDER_OPTIONS, GREATER_THAN_ZERO, ID, REQUIRED_FIELD, SITUATION_OPTIONS, SOMETHING_WENT_WRONG, SUCCESS, YES } from "../../../../../utils/constants";
import { BALBALIKA_POSAN_VILLAGE_CLINIC_SERVICE_CODE, BREAST_FEEDING_BEFORE_AND_ABOVE_SIX_MONTH } from "../../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import ChildDevelopmentServiceBelowTwoYearsRegister from "../../../components/registers/village-clinic-register/children-disease-management-registers/ChildDevelopmentServiceBelowTwoYearsRegister";
import styles from "./style";

export default function ChildDevelopmentServiceBelowTwoYears(props) {
  const classes = styles();
  const districtOptions = AppMisc.getDistrictOptions();
  const [showBelowTwoYearsModal, setShowBelowTwoYearsModal] = useState(false);
  const [showPatientGeneralDetail, setShowPatientGeneralDetail] = useState(false);
  const [informationAvailableForBreastFeedTillSixMonth, setInformationAvailableForBreastFeedTillSixMonth] = useState({});
  const [informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths, setInformationAvailableForBreastFeedingWithOtherFoodAfterSixMonths] = useState({});
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const { register, handleSubmit, reset, errors, setValue, unregister } = useForm();
  const [modalTitle, setModalTitle] = useState("दुई वर्षमुनिका बाल-बालिकाको वृद्धि अनुगमन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [shrinkLabel, setShrinkLabel] = useState();
  const [villageClinicDartaaNumbers, setVillageClinicDartaaNumbers] = useState([]);
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [dartaaNumber, setDartaaNumber] = useState("");

  useEffect(() => {
    register({ name: "villageClinicDartaaNumber" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "ageUnit" });
    register({ name: "district" }, { required: true });
    register({ name: "weightIncreaseByAge" }, { required: true });

    attachVillageClinicDartaaNumbers();
    getListOfChildDevelopmentBelowTwoYears(AppUtils.getUrlParam(ID));
  }, [register])

  useEffect(() => {
    props.attachDartaaNumber && attachVillageClinicDartaaNumbers();
  }, [props.attachDartaaNumber]);

  useEffect(() => {
    (informationAvailableForBreastFeedTillSixMonth.editable || (JSON.stringify(informationAvailableForBreastFeedTillSixMonth) === "{}")) ? register({ name: "onlyBreastFeedingTillSixMonths" }) : unregister("onlyBreastFeedingTillSixMonths");
  }, [register, informationAvailableForBreastFeedTillSixMonth])

  useEffect(() => {
    (informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths.editable || (JSON.stringify(informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths) === "{}")) ? register({ name: "breastFeedingWithOtherFoodAfterSixMonths" }) : unregister("breastFeedingWithOtherFoodAfterSixMonths");
  }, [register, informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths])

  useEffect(() => {
    if (dartaaNumber) {
      findDetailsOfPreviousPatient(dartaaNumber);
    }
  }, [dartaaNumber])

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const findDetailsOfPreviousPatient = (villageDartaaNumber, id) => {
    HMIS.get(API_URL.childDevelopmentServiceBelowTwoYears + "/editable-fields?communityClinicId=" + AppUtils.getUrlParam(ID) + "&villageClinicDartaaNumber=" + villageDartaaNumber + "&id=" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setShowPatientGeneralDetail(true);
          if (Boolean(id)) {
            jsondata.data.childDevelopmentServiceBelowTwoYears.id = id;
            jsondata.data.childDevelopmentServiceBelowTwoYears.palikaName = jsondata.data.childDevelopmentServiceBelowTwoYears.palikaName && AppMisc.getMunicipalityName(jsondata.data.childDevelopmentServiceBelowTwoYears.palikaName);
            setModalDefaultValues(jsondata.data.childDevelopmentServiceBelowTwoYears);
            setValue("villageClinicDartaaNumber", jsondata.data.childDevelopmentServiceBelowTwoYears.villageClinicDartaaNumber);
            setValue("ageUnit", jsondata.data.childDevelopmentServiceBelowTwoYears.ageUnit);
            setShrinkLabel(true);
            setModalTitle(EDIT_SELECTED_RECORD);
            setAgeUnitLabel(AppMisc.getAgeUnitLabel(jsondata.data.childDevelopmentServiceBelowTwoYears.ageUnit));
            setShowBelowTwoYearsModal(true);
          } else {
            delete (jsondata.data.villageClinicRegistrationRegister.id);
            updatePatientDetails(jsondata.data.villageClinicRegistrationRegister);
          }
          setInformationAvailableForBreastFeedTillSixMonth(jsondata.data.onlyBreastFeedingTillSixMonths || {});
          setInformationAvailableForBreastFeedingWithOtherFoodAfterSixMonths(jsondata.data.breastFeedingWithOtherFoodAfterSixMonths || {});
        } else {
          AddAlertMessage({ type: jsondata.type, message: jsondata.message })
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const updatePatientDetails = (patientDetails) => {
    setShrinkLabel(true);
    patientDetails.palikaName = patientDetails.palikaName && AppMisc.getMunicipalityName(patientDetails.palikaName);
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));

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
    HMIS.get(API_URL.villageClinicRegistrationRegister + "/all?sewaType=" + BALBALIKA_POSAN_VILLAGE_CLINIC_SERVICE_CODE + "&communityClinicId=" + AppUtils.getUrlParam(ID))
      .then(response => {
        var data = response.data.objectList;
        if (response.data.type === SUCCESS) {
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

  const handleVillageClinicDartaaNumberChange = (name, value) => {
    setDartaaNumber(value);
  };

  const closeBelowTwoYearsModal = () => {
    setModalDefaultValues({});
    reset();
    setShowBelowTwoYearsModal(false);
    setInformationAvailableForBreastFeedTillSixMonth({});
    setInformationAvailableForBreastFeedingWithOtherFoodAfterSixMonths({});
    setShowPatientGeneralDetail(false);
    setModalTitle("दुई वर्षमुनिका बाल-बालिकाको वृद्धि अनुगमन सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
    setShrinkLabel(undefined);
    setAgeUnitLabel("");
    setDartaaNumber("");
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.communityClinicId = AppUtils.getUrlParam(ID);
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.weightTakenNepaliMonth = DateUtils.getSeparatedDateFromBsDate(data.dartaaMiti).month;
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.childDevelopmentServiceBelowTwoYears, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getListOfChildDevelopmentBelowTwoYears(AppUtils.getUrlParam(ID));
          closeBelowTwoYearsModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListOfChildDevelopmentBelowTwoYears = communityClinicId => {
    HMIS.get(API_URL.childDevelopmentServiceBelowTwoYears + "?communityClinicId=" + communityClinicId)
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          दुई वर्षमुनिका बाल-बालिकाको वृद्धि अनुगमन सेवा
        </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowBelowTwoYearsModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showBelowTwoYearsModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeBelowTwoYearsModal}
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
              <CustomReactSelect
                label="गाउँघर क्लिनिक दर्ता नं."
                options={villageClinicDartaaNumbers}
                defaultValue={modalDefaultValues.villageClinicDartaaNumber}
                name="villageClinicDartaaNumber"
                onChange={handleVillageClinicDartaaNumberChange}
                isClearable={false}
              />
              {errors.villageClinicDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showPatientGeneralDetail && (
              <>
                <Grid item xs>
                  <TextField
                    InputProps={{ readOnly: true }}
                    label="बच्चाको नाम"
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
                    label="बच्चाको थर"
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
              </>
            )}
          </Grid>
          {showPatientGeneralDetail && (
            <>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    label="लिङ्ग"
                    name="gender"
                    defaultValue={modalDefaultValues.gender}
                    options={GENDER_OPTIONS}
                    onChange={handleCustomReactSelectChange}
                    isDisabled
                  />
                  {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <TextField
                    label="बच्चाको उमेर"
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
              </Grid>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
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
                  <CustomReactSelect
                    name="weightIncreaseByAge"
                    options={SITUATION_OPTIONS}
                    onChange={handleCustomReactSelectChange}
                    defaultValue={modalDefaultValues.weightIncreaseByAge}
                    label="तौल (उमेर अनुसार वृद्धि)"
                  />
                  {errors.weightIncreaseByAge && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Grid>
                <Grid item xs>
                  <TextField
                    name="weight"
                    label="तौल (किलोग्राममा)"
                    type="number"
                    defaultValue={modalDefaultValues.weight || ""}
                    InputLabelProps={{ shrink: shrinkLabel }}
                    variant="outlined"
                    inputRef={register({
                      min: 0
                    })}
                    size="small"
                    fullWidth
                  />
                  {errors.weight && errors.weight.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
                </Grid>
                <Grid item xs></Grid>
              </Grid>
            </>
          )}
        </Box>
        <Box className={classes.otherDetails}>
          {((JSON.stringify(informationAvailableForBreastFeedTillSixMonth) === "{}") || informationAvailableForBreastFeedTillSixMonth.editable) ? (
            <>
              <Typography>जन्मेको ६ महिना सम्म स्तनपान मात्र</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    name="onlyBreastFeedingTillSixMonths"
                    options={BREAST_FEEDING_BEFORE_AND_ABOVE_SIX_MONTH}
                    onChange={handleCustomReactSelectChange}
                    defaultValue={informationAvailableForBreastFeedTillSixMonth.value}
                    label="कृपया छान्नुहोस्"
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography>जन्मेको ६ महिना सम्म स्तनपान मात्र: {informationAvailableForBreastFeedTillSixMonth.value === YES ? "गराएको" : "नगराएको"} (मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(informationAvailableForBreastFeedTillSixMonth.date))})</Typography>
          )}
          {((JSON.stringify(informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths) === "{}") || informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths.editable) ? (
            <>
              <Typography>६ महिनापछी स्तनपान साथै ठोस, अर्धठोस र नरम खाना शुरु</Typography>
              <Grid container spacing={2} alignItems="center" className={classes.row}>
                <Grid item xs>
                  <CustomReactSelect
                    name="breastFeedingWithOtherFoodAfterSixMonths"
                    options={BREAST_FEEDING_BEFORE_AND_ABOVE_SIX_MONTH}
                    onChange={handleCustomReactSelectChange}
                    defaultValue={informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths.value}
                    label="कृपया छान्नुहोस्"
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <Box mt={1} mb={2}>
              <Typography>६ महिनापछी स्तनपान साथै ठोस, अर्धठोस र नरम खाना शुरु: {informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths.value === YES ? "गराएको" : "नगराएको"} (मिति: {AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(informationAvailableForBreastFeedingWithOtherFoodAfterSixMonths.date))})</Typography>
            </Box>
          )}
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="सल्लाह /परामर्श /रेफर"
                name="suggestions"
                defaultValue={modalDefaultValues.suggestions}
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="कैफियत"
                name="remarks"
                defaultValue={modalDefaultValues.remarks}
                variant="outlined"
                inputRef={register}
                size="small"
                fullWidth
                multiline
              />
            </Grid>
          </Grid >
        </Box>
      </CustomModal>
      <ChildDevelopmentServiceBelowTwoYearsRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={findDetailsOfPreviousPatient} />
    </>
  );

}