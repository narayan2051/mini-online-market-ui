import { Box, Button, Checkbox, FormControlLabel, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../misc/appMisc";
import { MUL_DARTA_NUMBERS_LIST, ORGANIZATION_TYPE, PARIWAAR_NIYOJAN_MAIN_REGISTER_SERVICE_CODE, SERVICE_PROVIDERS } from "../../../../utils/constants/forms/index";
import { EDIT_SELECTED_RECORD, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import { SessionStorage } from "../../../../utils/storage/sessionStorage";
import PariwaarNiyojanPermanentRegister from "../../../user/components/registers/pariwaar-niyojan-permanent-register/PariwaarNiyojanPermanentRegister";
import MulDartaaSelect from "../../components/mul-dartaa-select/MulDartaaSelect";
import styles from "./style";

export default function PariwaarNiyojanPermanent() {
  const classes = styles();
  const [mulDartaaOptions, setMulDartaaOptions] = useState([]);
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [modalTitle, setModalTitle] = useState("परिवार नियोजन स्थायी (बन्ध्याकरण) सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [showPariwaarNiyojanModal, setShowPariwaarNiyojanModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [postData, setPostData] = useState({});
  const [registerDate, setRegisterDate] = useState({ fromDate: null, toDate: null });
  const [pariwaarNiyojanPermanentData, setPariwaarNiyojanPermanentData] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [serviceProvidedInCamp, setServiceProvidedInCamp] = useState(false);

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "typeOfServiceProviderOrganization" }, { required: true });
    register({ name: "serviceOperatedLocation" }, { required: true });
    attachMulDartaaOptions();
  }, [register]);

  const handleRegisterDateFromSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        fromDate: date
      }));
  }
  const handleRegisterDateToSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        toDate: date
      }));
  }

  useEffect(() => {
    registerDate.fromDate && registerDate.toDate &&
      getPariwaarNiyojanRegisterData();
  }, [registerDate]);

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  };

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleServiceOperatedLocationChange = value => {
    setServiceProvidedInCamp(value === "CAMP");
    setValue("serviceOperatedLocation", value);
  };

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

  const closePariwaarNiyojanModal = () => {
    setModalDefaultValues({});
    reset({});
    setPostData({});
    setShowPariwaarNiyojanModal(false);
    setModalTitle("परिवार नियोजन स्थायी (बन्ध्याकरण) सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const PariwaarNiyojanEditFunction = id => {
    HMIS.get(API_URL.pariwaarNiyojan + "/" + id)
      .then(response => {
        response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);

        setModalDefaultValues(response.data);
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowPariwaarNiyojanModal(true);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const buildPostData = (data) => {
    setPostData((prev) => ({
      ...prev,
      ["mulDartaaDetails"]: data
    }))
  }

  useEffect(() => {
    postData.mulDartaaDetails && submitData();
  }, [postData])

  const submitData = () => {
    let data = {};
    Object.assign(data, postData, postData.mulDartaaDetails)
    delete data["mulDartaaDetails"];
    data.id = modalDefaultValues.id;
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    HMIS.post(API_URL.pariwaarNiyojan, data)
      .then(response => {
        AddAlertMessage({ type: response.data.type, message: response.data.message });
        if (response.data.type === SUCCESS) {
          getPariwaarNiyojanRegisterData();
          closePariwaarNiyojanModal();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const onSubmit = data => {
    setPostData(data);
    setSubmitStatus(true);
  };

  const getPariwaarNiyojanRegisterData = () => {
    HMIS.get(API_URL.pariwaarNiyojan + "/fromDateRange?dateFrom=" + DateUtils.getDateMilliseconds(registerDate.fromDate)
      + "&&dateTo=" + DateUtils.getDateMilliseconds(registerDate.toDate)).then(response => {
        setPariwaarNiyojanPermanentData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          परिवार नियोजन स्थायी (बन्ध्याकरण) सेवा रजिस्टर
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
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowPariwaarNiyojanModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showPariwaarNiyojanModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closePariwaarNiyojanModal}
        maxWidth="xl"
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="सेवा प्रदान गरेको दिनको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate className="date-picker-form-control input-sm full-width" name="dartaaMiti" defaultDate={modalDefaultValues.dartaaMiti || true} onDateSelect={(date) => { handleDartaaMitiChange(date) }} placeholder="सेवा प्रदान गरेको दिनको मिति" hideLabel />
                  {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            {mulDartaaOptions.length > 0 && (
              <MulDartaaSelect
                mulDartaaOptions={mulDartaaOptions}
                defaultValues={modalDefaultValues}
                submitStatus={submitStatus}
                onSubmit={(data) => buildPostData(data)}
                onSubmitStatusChange={data => setSubmitStatus(data)}
              />
            )}
          </Grid>
        </Box>
        <Box className={classes.serviceDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">परिवार नियोजन स्थायी (बन्ध्याकरण) सेवा सम्बन्धी विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="सेवा प्रदायक संस्थाको किसिम"
                variant="outlined"
                name="typeOfServiceProviderOrganization"
                options={ORGANIZATION_TYPE}
                value={modalDefaultValues.typeOfServiceProviderOrganization}
                onChange={handleCustomSelectChange}
                size="small"
                fullWidth
              />
              {errors.typeOfServiceProviderOrganization && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="सेवा प्रदायक संस्थाको नाम"
                name="nameOfServiceProviderOrganization"
                variant="outlined"
                defaultValue={modalDefaultValues.nameOfServiceProviderOrganization}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.nameOfServiceProviderOrganization && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="जिवित बच्चा (छोरा) संख्या"
                name="totalLivingSon"
                variant="outlined"
                type="number"
                defaultValue={modalDefaultValues.totalLivingSon || ""}
                inputRef={register({
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.totalLivingSon && errors.totalLivingSon.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="जिवित बच्चा (छोरी) संख्या"
                name="totalLivingDaughter"
                type="number"
                variant="outlined"
                defaultValue={modalDefaultValues.totalLivingDaughter || ""}
                inputRef={register({
                  min: 0
                })}
                size="small"
                fullWidth
              />
              {errors.totalLivingDaughter && errors.totalLivingDaughter.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="रेफर गर्नेको नाम"
                name="referredBy"
                variant="outlined"
                defaultValue={modalDefaultValues.referredBy}
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.serviceDetails}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="सेवा संचालन स्थान"
                variant="outlined"
                name="serviceOperatedLocation"
                options={SERVICE_PROVIDERS}
                value={modalDefaultValues.serviceOperatedLocation}
                onChange={handleServiceOperatedLocationChange}
                size="small"
                fullWidth
              />
              {errors.serviceOperatedLocation && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {serviceProvidedInCamp && (
              <Grid item xs>
                <TextField
                  label="शिविर संचालन स्थान"
                  name="campOperatedLocation"
                  variant="outlined"
                  defaultValue={modalDefaultValues.campOperatedLocation}
                  inputRef={register}
                  size="small"
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs>
              <TextField
                label="बन्ध्याकरण गर्ने चिकित्सकको नाम"
                name="sterilizingDoctorFirstName"
                variant="outlined"
                defaultValue={modalDefaultValues.sterilizingDoctorFirstName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.sterilizingDoctorFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="बन्ध्याकरण गर्ने चिकित्सकको थर"
                name="sterilizingDoctorLastName"
                variant="outlined"
                defaultValue={modalDefaultValues.sterilizingDoctorLastName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.sterilizingDoctorLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="बन्ध्याकरण सेवा यदी सुत्केरी भएको २४ घण्टा भित्र लिएको भएमा यसमा चेक (✓) गर्नुहोस्।" placement="top" arrow>
                <FormControlLabel
                  classes={{
                    label: classes.checkboxLabelSmall,
                  }}
                  label="सुत्केरी भएको २४ घण्टा भित्र"
                  control={
                    <Checkbox
                      name="within24HoursOfDelivery"
                      defaultChecked={modalDefaultValues.within24HoursOfDelivery}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />
                  }
                />
              </Tooltip>
            </Grid>
            {!serviceProvidedInCamp && (<Grid item xs></Grid>)}
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="कैफियत"
                name="remarks"
                variant="outlined"
                defaultValue={modalDefaultValues.remarks}
                inputRef={register}
                size="small"
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <PariwaarNiyojanPermanentRegister tableData={pariwaarNiyojanPermanentData} showActionColumn={pariwaarNiyojanPermanentData.length !== 0} onEditRow={PariwaarNiyojanEditFunction.bind(this)} />
    </Box>
  );
}