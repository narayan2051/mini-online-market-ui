import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon, Help as HelpIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../../api/api";
import AddAlertMessage from "../../../../../../components/alert/Alert";
import CustomSelect from "../../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { CASTE_CODES, REQUIRED_FIELD, SOMETHING_WENT_WRONG, GREATER_THAN_ZERO } from "../../../../../../utils/constants";
import { DateUtils } from "../../../../../../utils/dateUtils";
import MotherDeathDetailRegister from "../../../../components/registers/FCHV/death-description-register/mother-death-detail-register/MotherDeathDetailRegister";
import styles from "../style.js";
import { OTHER } from "../../../../../../utils/constants/forms";

export default function MotherDeathDetails(props) {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [registerVolunteerId, setRegisterVolunteerId] = useState();
  const [showOtherPlaceOfDeliveryInput, setShowOtherPlaceOfDeliveryInput] = useState(false);
  const [showOtherPlaceOfDeathInput, setShowOtherPlaceOfDeathInput] = useState(false);


  useEffect(() => {
    register({ name: "deathDate" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    buildFemaleVolunteerOptions();
  }, [register]);

  useEffect(() => {
    registerVolunteerId &&
      getMothersDeathDataByVolunteerName();
  }, [registerVolunteerId])


  const handleModalClose = () => {
    setModalDefaultValues({});
    reset();
    setShowModal(false);
  }

  const handleDeathDateChange = date => {
    setValue("deathDate", date);
  }

  const handleVolunteerNameChange = id => {
    setValue("womenVolunteerId", id);
  }

  const handleRegisterVolunteerChange = volunteerId => {
    setRegisterVolunteerId(volunteerId);
  }

  const handleCasteCodeChange = casteCode => {
    setValue("casteCode", casteCode);
  };

  const handlePlaceOfDeliveryChange = placeOfDelivery => {
    setShowOtherPlaceOfDeliveryInput(placeOfDelivery === "OTHER");
  }

  const handleDeathLocationChange = deathLocation => {
    setShowOtherPlaceOfDeathInput(deathLocation === "OTHER");
  }

  const handleEditFunction = id => {
    HMIS.get(API_URL.motherDeathDetails + "/" + id).then(response => {
      response.data.deathDate = response.data.deathDate && DateUtils.getDateFromMilliseconds(response.data.deathDate);
      setModalDefaultValues(response.data);
      setShowModal(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const buildFemaleVolunteerOptions = () => {
    HMIS.get(API_URL.mahilaSwasthyaSwamSewikaDetailRegister).then(response => {
      let options = [];
      for (let i = 0; i < response.data.length; i++) {
        let option = {
          label: response.data[i].fullName,
          value: response.data[i].id
        }
        options.push(option);
      }
      setFemaleVolunteersName(options);

    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.deathDate = data.deathDate && DateUtils.getDateMilliseconds(data.deathDate);
    HMIS.post(API_URL.motherDeathDetails, data).then(response => {
      if (response.data.type === "success") {
        handleModalClose();
        getMothersDeathDataByVolunteerName();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const getMothersDeathDataByVolunteerName = () => {
    HMIS.get(API_URL.motherDeathDetails + "/volunteerId?volunteerId=" + registerVolunteerId).then(response => {
      setTableData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5">मातृ मृत्यु विवरण</Typography>
          <Tooltip title="गर्भवती अवस्था, प्रसव अवस्था तथा सुत्केरी भएको ४२ दिनभित्र मृत्यु भएका महिलाका लागि मात्र यो रजिस्टर प्रयोग गर्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={2} className={classes.volunteerSelectContainer}>
            <CustomSelect
              label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
              variant="outlined"
              options={femaleVolunteersName}
              onChange={handleRegisterVolunteerChange.bind(this)}
              size="small"
              className="select-xs"
              disabledOptionSelectable
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title="मातृ मृत्यु विवरण"
        maxWidth="lg"
        showModal={showModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={handleModalClose}
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
                variant="outlined"
                name="womenVolunteerId"
                options={femaleVolunteersName}
                onChange={handleVolunteerNameChange}
                value={modalDefaultValues.womenVolunteerId || registerVolunteerId}
                size="small"
                fullWidth
              />
              {errors.womenVolunteerId && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="मृतक महिलाको नाम"
                size="small"
                name="patientFirstName"
                variant="outlined"
                defaultValue={modalDefaultValues.patientFirstName}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="मृतक महिलाको थर"
                size="small"
                name="patientLastName"
                variant="outlined"
                defaultValue={modalDefaultValues.patientLastName}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.patientLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="मृतक महिलाको जाति कोड"
                name="casteCode"
                variant="outlined"
                size="small"
                value={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCasteCodeChange.bind(this)}
                fullWidth
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="मृतक महिलाको उमेर"
                size="small"
                name="age"
                variant="outlined"
                defaultValue={modalDefaultValues.age}
                inputRef={register({
                  required: true,
                  min: 1
                })}
                type="number"
                fullWidth
              />
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.age && errors.age.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
            <Grid item xs>
              <Tooltip title="मृतक महिलाको मृत्‍यु भएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="deathDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleDeathDateChange(date) }}
                    defaultDate={modalDefaultValues.deathDate}
                    placeholder="मृतक महिलाको मृत्‍यु भएको मिति"
                    hideLabel
                  />
                  {errors.deathDate && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
        </Box>
        <Box className={classes.deathDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">मृतक महिलाको विवरण</Typography>
          </Box>
          <Box className={classes.deathDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">मृत्यू हुँदाको अवस्था</FormLabel>
                  <RadioGroup name="deathSituation" defaultValue={modalDefaultValues.deathSituation} row>
                    <FormControlLabel
                      value="PREGNANT"
                      control={<Radio color="primary" />}
                      label="गर्भवती"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="CHILDBIRTH"
                      control={<Radio color="primary" />}
                      label="प्रशुती"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="MATERNITY"
                      control={<Radio color="primary" />}
                      label="सुत्केरी"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">प्रसुती भएको स्थान</FormLabel>
                  <RadioGroup name="placeOfDelivery" onChange={(event) => { handlePlaceOfDeliveryChange(event.target.value) }} defaultValue={modalDefaultValues.placeOfDelivery} row>
                    <FormControlLabel
                      value="HOME"
                      control={<Radio color="primary" />}
                      label="घर"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="HEALTH_OFFICE"
                      control={<Radio color="primary" />}
                      label="संस्था"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value={OTHER}
                      control={<Radio color="primary" />}
                      label="अन्य"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
                {
                  showOtherPlaceOfDeliveryInput &&
                  <TextField
                    name="otherPlaceOfDelivery"
                    inputRef={register}
                    type="text"
                    defaultValue={modalDefaultValues.otherPlaceOfDelivery}
                    variant="outlined"
                    size="small"
                    label="स्थान"
                    placeholder="स्थान"
                  />
                }
              </Grid>
              <Grid item xs>
                <FormControl component="fieldset">
                  <FormLabel component="legend">मृत्यु भएको स्थान</FormLabel>
                  <RadioGroup name="deathLocation" onChange={(event) => { handleDeathLocationChange(event.target.value) }} defaultValue={modalDefaultValues.deathLocation} row>
                    <FormControlLabel
                      value="HOME"
                      control={<Radio color="primary" />}
                      label="घर"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="HEALTH_OFFICE"
                      control={<Radio color="primary" />}
                      label="संस्था"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value={OTHER}
                      control={<Radio color="primary" />}
                      label="अन्य"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
                {
                  showOtherPlaceOfDeathInput &&
                  <TextField
                    name="otherPlaceOfDeath"
                    inputRef={register}
                    type="text"
                    defaultValue={modalDefaultValues.otherPlaceOfDeath}
                    variant="outlined"
                    size="small"
                    label="स्थान"
                    placeholder="स्थान"
                  />
                }
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  name="remarks"
                  variant="outlined"
                  label="कैफियत"
                  defaultValue={modalDefaultValues.remarks}
                  inputRef={register}
                  size="small"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CustomModal>
      <MotherDeathDetailRegister tableData={tableData} showActionColumn={tableData.length !== 0} onEditRow={handleEditFunction} />
    </>
  );
}