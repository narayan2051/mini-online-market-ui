import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../api/api";
import Select from "react-select";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { DISCHARGE_PATIENT_TYPE, OTHER, OUTCOME_CODE, TYPE_OF_CARE, TYPE_OF_SURGERY } from "../../../../utils/constants/forms/index";
import { NO, REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, YES, YES_NO_OPTIONS, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import PatientDischargeDetails from "../../components/registers/Patient-discharge-register/PatientDischargeRegister";
import styles from "./style";

export default function PatientAdmissionRegister(props) {
  const classes = styles();
  const [openDischargeModal, setOpenDischargeModal] = useState(false);
  const [inpatientNumberOptions, setInpatientNumberOptions] = useState([]);
  const [inpatientNumberLabel, setInpatientNumberLabel] = useState();
  const [showMentionOtherTypeOfCare, setShowMentionOtherTypeOfCare] = useState(false);
  const [showCauseOfDeath, setShowCauseOfDeath] = useState(false);
  const [showOtherPatientType, setShowOtherPatientType] = useState(false);
  const [dischargeDetails, setDischargeDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });

  const { register, handleSubmit, setValue, errors, reset } = useForm();

  useEffect(() => {
    register({ name: "code" }, { required: true });
    register({ name: "dateOfDischarge" }, { required: true });
    register({ name: "deathBeforeFortyEightHours" });
    register({ name: "deathAfterFortyEightHours" });
    register({ name: "fullCostExemption" });
    register({ name: "partialCostExemption" });
    register({ name: "outcome" }, { required: true });
    register({ name: "postOPInfection" }, { required: true });
    register({ name: "typeOfCare" }, { required: true });
    register({ name: "typeOfSurgery" }, { required: true });
    register({ name: "inpatientNumber" }, { required: true });
  }, [register]);

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getDischargeDetails();
  }, [sewaDartaaRegisterDate]);

  useEffect(() => {
    getAdmissionDetails();
  }, [])

  useEffect(() => {
    reset(formData);
  }, [formData]);

  const getDischargeDetails = () => {
    HMIS.get(API_URL.patientDischarge + "?fromDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&toDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          setDischargeDetails(jsondata.objectList);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getAdmissionDetails = () => {
    var inpatientNumberDartaaOptions = [];
    HMIS.get(API_URL.nonDischargePatientDetails)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          jsondata.objectList.map(item => {
            inpatientNumberDartaaOptions.push({ value: item.inpatientNumber, label: item.inpatientNumber + "(" + item.patientFirstName + " " + item.patientLastName + ")" })
          })
          setInpatientNumberOptions(inpatientNumberDartaaOptions);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getDischargeDetailsById = (id) => {
    HMIS.get(API_URL.patientDischarge + "/exclude-common-fields/" + id)
      .then(response => {
        let jsondata = response.data;
        if (jsondata.type === SUCCESS) {
          let options = inpatientNumberOptions;
          jsondata.data.dateOfDischarge = DateUtils.getDateFromMilliseconds(jsondata.data.dateOfDischarge);
          jsondata.data.deathAfterFortyEightHours = jsondata.data.deathAfterFortyEightHours ? YES : NO;
          jsondata.data.deathBeforeFortyEightHours = jsondata.data.deathBeforeFortyEightHours ? YES : NO;
          jsondata.data.fullCostExemption = jsondata.data.fullCostExemption ? YES : NO;
          jsondata.data.partialCostExemption = jsondata.data.partialCostExemption ? YES : NO;
          jsondata.data.postOPInfection = jsondata.data.postOPInfection ? YES : NO;
          let inpatientNumberDetail = { value: jsondata.data.inpatientNumber, label: jsondata.data.inpatientNumber + "(" + jsondata.data.patientFirstName + " " + jsondata.data.patientLastName + ")" };
          options.push(inpatientNumberDetail);
          setInpatientNumberOptions(options);
          setInpatientNumberLabel(inpatientNumberDetail);
          setOpenDischargeModal(true);
          setFormData(jsondata.data);
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

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

  const closePatientDischargeModal = () => {
    reset({});
    setFormData({});
    setShowOtherPatientType(false);
    setInpatientNumberLabel();
    setShowCauseOfDeath(false);
    setShowMentionOtherTypeOfCare(false);
    setOpenDischargeModal(false);
  }

  const handleDischargeDateChange = date => {
    setValue("dateOfDischarge", date);
  };

  const handleInpatientNumberChange = inpatientOptions => {
    setValue("inpatientNumber", inpatientOptions ? inpatientOptions.value : null);
    setInpatientNumberLabel(inpatientOptions);
  }

  const onSubmit = data => {
    if (formData) {
      data.id = formData.id;
    }
    data.dateOfDischarge = DateUtils.getDateMilliseconds(data.dateOfDischarge);
    data.deathAfterFortyEightHours = data.deathAfterFortyEightHours === YES;
    data.deathBeforeFortyEightHours = data.deathBeforeFortyEightHours === YES;
    data.fullCostExemption = data.fullCostExemption === YES;
    data.partialCostExemption = data.partialCostExemption === YES;
    data.postOPInfection = data.postOPInfection === YES;
    HMIS.post(API_URL.patientDischarge, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          closePatientDischargeModal();
          getDischargeDetails();
          getAdmissionDetails();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const handleCustomSelectChange = (value, name) => {
    if (name === "typeOfCare") {
      setShowMentionOtherTypeOfCare(value === OTHER)
    }
    if (name === "deathBeforeFortyEightHours") {
      setShowCauseOfDeath(value === YES);
    }
    if (name === "deathAfterFortyEightHours") {
      setShowCauseOfDeath(value === YES);
    }
    if (name === "code") {
      setShowOtherPatientType(value === OTHER);
    }
    setValue(name, value);
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          बिरामी डिस्चार्ज रजिस्टर
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
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenDischargeModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
          </Box>
        </Box>
      </Box>
      <CustomModal
        title="बिरामी डिस्चार्ज रजिस्टरमा रेकर्ड थप्नुहोस"
        showModal={openDischargeModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closePatientDischargeModal}
        maxWidth="lg"
      >
        <Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                placeholder="Inpatient Number"
                name="inpatientNumber"
                size="small"
                variant="outlined"
                options={inpatientNumberOptions}
                value={inpatientNumberLabel}
                onChange={handleInpatientNumberChange}
                isClearable
              />
              {errors.inpatientNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="डिस्चार्ज गरिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="dateOfDischarge"
                    className="date-picker-form-control input-sm full-width"
                    onDateSelect={handleDischargeDateChange}
                    placeholder="Date Of Discharge"
                    defaultDate={formData.dateOfDischarge}
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.dateOfDischarge && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Time Of Discharge"
                type="time"
                name="timeOfDischarge"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.timeOfDischarge && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="typeOfCare"
                label="Type of Care"
                size="small"
                variant="outlined"
                options={TYPE_OF_CARE}
                onChange={handleCustomSelectChange}
                value={formData.typeOfCare}
                fullWidth
              />
              {errors.typeOfCare && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showMentionOtherTypeOfCare && (
              <Grid item xs>
                <TextField
                  label="Other Care"
                  type="text"
                  size="small"
                  variant="outlined"
                  name="otherCare"
                  inputRef={register({
                    required: true
                  })}
                  fullWidth
                />
                {errors.otherCare && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            )}
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="Ward"
                type="text"
                size="small"
                variant="outlined"
                name="ward"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.ward && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Bed Number"
                type="text"
                size="small"
                variant="outlined"
                name="bedNumber"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.bedNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Name of Surgery"
                type="text"
                size="small"
                variant="outlined"
                name="nameOfSurgery"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.nameOfSurgery && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="typeOfSurgery"
                label="Type of Surgery"
                size="small"
                variant="outlined"
                options={TYPE_OF_SURGERY}
                onChange={handleCustomSelectChange}
                value={formData.typeOfSurgery}
                fullWidth
              />
              {errors.typeOfSurgery && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="postOPInfection"
                label="Post-OP Infection"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={formData.postOPInfection}
                fullWidth
              />
              {errors.postOPInfection && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="Final Diagnosis at Discharge"
                type="text"
                size="small"
                variant="outlined"
                name="finalDiagnosis"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.finalDiagnosis && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="ICD Code"
                type="text"
                size="small"
                variant="outlined"
                name="icdCode"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.icdCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="Outcome(Code)"
                size="small"
                name="outcome"
                variant="outlined"
                options={OUTCOME_CODE}
                onChange={handleCustomSelectChange}
                value={formData.outcome}
                fullWidth
              />
              {errors.outcome && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                name="deathBeforeFortyEightHours"
                label="Death Before 48 hours"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={formData.deathBeforeFortyEightHours}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="deathAfterFortyEightHours"
                label="Death After 48 hours"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={formData.deathAfterFortyEightHours}
                fullWidth
              />
            </Grid>
            {showCauseOfDeath && (
              <Grid item xs>
                <TextField
                  label="Cause Of Death"
                  type="text"
                  size="small"
                  variant="outlined"
                  name="causeOfDeath"
                  inputRef={register({
                    required: true
                  })}
                  fullWidth
                />
                {errors.causeOfDeath && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            )}
            <Grid item xs>
              <CustomSelect
                name="fullCostExemption"
                label="Cost of Exemption(Full)"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={formData.fullCostExemption}
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <CustomSelect
                name="partialCostExemption"
                label="Cost of Exemption(Partial)"
                size="small"
                variant="outlined"
                options={YES_NO_OPTIONS}
                onChange={handleCustomSelectChange}
                value={formData.partialCostExemption}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={3}>
              <TextField
                label="Total Cost Of Exempted(NRs.)"
                type="number"
                size="small"
                variant="outlined"
                name="totalCostExempted"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                fullWidth
              />
              {errors.totalCostExempted && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.totalCostExempted && errors.totalCostExempted.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs={3}>
              <CustomSelect
                name="code"
                label="Code"
                size="small"
                variant="outlined"
                options={DISCHARGE_PATIENT_TYPE}
                onChange={handleCustomSelectChange}
                value={formData.code}
                fullWidth
              />
              {errors.code && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            {showOtherPatientType && (
              <Grid item xs>
                <TextField
                  label="Other patient Type"
                  type="text"
                  size="small"
                  variant="outlined"
                  name="otherPatientType"
                  inputRef={register({
                    required: true
                  })}
                  fullWidth
                />
                {errors.otherPatientType && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Grid>
            )}
          </Grid>
        </Box>
      </CustomModal>
      <PatientDischargeDetails tableData={dischargeDetails} showActionColumn={dischargeDetails.length !== 0} onEditRow={getDischargeDetailsById.bind(this)} />
    </>
  );
}