import { Box, Button, Grid, TextField, Tooltip, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { GREATER_THAN_ZERO, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import MothersGroupMeetingRegister from "../../../components/registers/FCHV/mothers-group-meeting-register/MotherGroupMeetingRegister";
import styles from "../style";

export default function MothersGroupMeeting() {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [mothersGroupMeetingData, setMothersGroupMeetingData] = useState([]);
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [registerVolunteerId, setRegisterVolunteerId] = useState();

  useEffect(() => {
    register({ name: "meetingDate" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    buildFemaleVolunteerOptions();
  }, [register])

  useEffect(() => {
    registerVolunteerId &&
      getMothersGroupMeetingDataByVolunteerName();
  }, [registerVolunteerId])

  const handleModalClose = () => {
    setModalDefaultValues({});
    reset();
    setOpenModal(false);
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

  const handleEditFunction = id => {
    HMIS.get(API_URL.mothersGroupMeeting + "/" + id).then(response => {
      response.data.meetingDate = response.data.meetingDate && DateUtils.getDateFromMilliseconds(response.data.meetingDate);
      setModalDefaultValues(response.data);
      setOpenModal(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.meetingDate = data.meetingDate && DateUtils.getDateMilliseconds(data.meetingDate);
    HMIS.post(API_URL.mothersGroupMeeting, data).then(response => {
      if (response.data.type === "success") {
        handleModalClose();
        getMothersGroupMeetingDataByVolunteerName();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const handleMeetingDateChange = date => {
    setValue("meetingDate", date);
  }

  const getMothersGroupMeetingDataByVolunteerName = () => {
    HMIS.get(API_URL.mothersGroupMeeting + "/volunteerId?volunteerId=" + registerVolunteerId).then(response => {
      setMothersGroupMeetingData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const handleVolunteerNameChange = volunteerId => {
    setValue("womenVolunteerId", volunteerId);
  }

  const handleRegisterVolunteerChange = volunteerId => {
    setRegisterVolunteerId(volunteerId);
  }

  return (<>
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
      <Typography variant="h5">
        आमा समुहको बैठक
      </Typography>
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
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
      </Box>
    </Box>
    <CustomModal
      title="आमा समुहको बैठक विवरण"
      maxWidth="md"
      showModal={openModal}
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
            <Tooltip title="बैठक मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  name="meetingDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleMeetingDateChange(date) }}
                  defaultDate={modalDefaultValues.meetingDate || true}
                  placeholder="बैठक मिति"
                  hideLabel
                />
                {errors.meetingDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              name="participantNumber"
              label="सहभागी संख्या"
              variant="outlined"
              inputRef={register({
                required: true,
                min: 1
              })}
              defaultValue={modalDefaultValues.participantNumber}
              size="small"
              fullWidth
            />
            {errors.participantNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.shrawanCount && errors.shrawanCount.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs={8}>
            <TextField
              name="discussedTopics"
              label="छलफल गरेका विषयहरु"
              variant="outlined"
              defaultValue={modalDefaultValues.discussedTopics}
              inputRef={register({
                required: true
              })}
              size="small"
              fullWidth
              multiline
            />
            {errors.discussedTopics && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs={4}>
            <TextField
              name="participantStaffName"
              variant="outlined"
              label="सहभागी स्वास्थ्यकर्मीको नाम"
              defaultValue={modalDefaultValues.participantStaffName}
              inputRef={register({
                required: true
              })}
              size="small"
              fullWidth
              multiline
            />
            {errors.participantStaffName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="गाउँघर क्लिनिक सन्चालन भएको बेला स्वास्थ्यकर्मीको उपस्थिती भए मात्र यो कोठामा चिन्ह लगाउनुहोस ।" placement="top" arrow>
              <FormControlLabel
                label="गाउँघर क्लिनिक सन्चालन भएको बेला स्वास्थ्यकर्मीको उपस्थिती"
                control={
                  <Checkbox
                    defaultChecked={modalDefaultValues.presenceOfHealthStaff}
                    name="presenceOfHealthStaff"
                    variant="outlined"
                    inputRef={register}
                    color="primary"
                  />}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
    <MothersGroupMeetingRegister tableData={mothersGroupMeetingData} showActionColumn={mothersGroupMeetingData.length !== 0} onEditRow={handleEditFunction} />
  </>
  );
}