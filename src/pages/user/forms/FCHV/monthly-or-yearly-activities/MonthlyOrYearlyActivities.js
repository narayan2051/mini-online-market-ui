import { Box, Grid, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import { REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { FCHV_ACTIVITIES } from "../../../../../utils/constants/forms";
import MonthlyOrYearlyActivitiesRegister from "../../../components/registers/FCHV/monthly-or-yearly-activities/MonthlyOrYearlyActivitiesRegister";
import styles from "../style";

export default function MonthlyOrYearlyActivities(props) {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [showMonthlyYearlyActivityModal, setShowMonthlyYearlyActivityModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [monthlyYearlyActivitiesData, setMonthlyYearlyActivitiesData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [registerVolunteerId, setRegisterVolunteerId] = useState();
  const [activityLabel, setActivityLabel] = useState();

  useEffect(() => {
    register({ name: "activity" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    buildFemaleVolunteerOptions();
  }, [register])

  useEffect(() => {
    registerVolunteerId &&
      getMonthlyYearlyActivitiesDataByVolunterName();
  }, [registerVolunteerId])


  const handleModalClose = () => {
    setModalDefaultValues({});
    reset();
    setActivityLabel("");
    setShowMonthlyYearlyActivityModal(false);
  }

  const addNewData = (openModal, fchvActivities) => {
    setShowMonthlyYearlyActivityModal(openModal);
    handleOnActivityChange(fchvActivities);
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
    });
  }

  const handleEditFunction = id => {
    HMIS.get(API_URL.monthlyOrYearlyActivities + "/" + id).then(response => {
      setModalDefaultValues(response.data);
      if (response.data.activity) {
        for (let i = 0; i < FCHV_ACTIVITIES.length; i++) {
          for (let j = 0; j < FCHV_ACTIVITIES[i].options.length; j++) {
            if (FCHV_ACTIVITIES[i].options[j].value === response.data.activity) {
              handleOnActivityChange(FCHV_ACTIVITIES[i].options[j]);
            }
          }
        }
      }
      setShowMonthlyYearlyActivityModal(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    HMIS.post(API_URL.monthlyOrYearlyActivities, data).then(response => {
      if (response.data.type === "success") {
        getMonthlyYearlyActivitiesDataByVolunterName();
        handleModalClose();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  const handleOnActivityChange = activity => {
    setValue("activity", activity ? activity.value : null);
    setActivityLabel(activity ? activity : "");
  }

  const handleVolunteerNameChange = volunteerName => {
    setValue("womenVolunteerId", volunteerName);
  }

  const handleRegisterVolunteerChange = volunteerId => {
    setRegisterVolunteerId(volunteerId);
  }

  const getMonthlyYearlyActivitiesDataByVolunterName = () => {
    HMIS.get(API_URL.monthlyOrYearlyActivities + "/volunteerId?volunteerId=" + registerVolunteerId).then(response => {
      setMonthlyYearlyActivitiesData(response.data);
      setShowTable(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          महिला स्वास्थ्य स्वयंसेवीकाले गरेका कामहरुको मासिक तथा वर्षिक अभिलेख
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
        </Box>
      </Box>
      <CustomModal
        title="महिला स्वास्थ्य स्वयंसेवीकाले गरेका कामहरुको मासिक तथा वर्षिक अभिलेख"
        maxWidth="xl"
        showModal={showMonthlyYearlyActivityModal}
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
                disabled
                fullWidth
              />
              {errors.womenVolunteerId && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Select
                className="select-sm"
                classNamePrefix="react-select"
                name="activity"
                variant="outlined"
                onChange={handleOnActivityChange}
                value={activityLabel}
                placeholder="कृपया गतिविधि छान्नुहोस्।"
                options={FCHV_ACTIVITIES}
                isDisabled={true}
              />
              {errors.activity && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.activitiesMonthlyDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">गतिविधिको मासिक विवरण</Typography>
          </Box>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="shrawanCount"
                label="श्रावण"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.shrawanCount}
                fullWidth
              />
              {errors.shrawanCount && errors.shrawanCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="bhadauCount"
                label="भदौ"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.bhadauCount}
                fullWidth
              />
              {errors.bhadauCount && errors.bhadauCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="aswinCount"
                label="आश्विन"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.aswinCount}
                fullWidth
              />
              {errors.aswinCount && errors.aswinCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="kartikCount"
                label="कार्तिक"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.kartikCount}
                fullWidth
              />
              {errors.kartikCount && errors.kartikCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="mansirCount"
                label="मंसिर"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.mansirCount}
                fullWidth
              />
              {errors.mansirCount && errors.mansirCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="poushCount"
                label="पुष"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.poushCount}
                fullWidth
              />
              {errors.poushCount && errors.poushCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="maghCount"
                label="माघ"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.maghCount}
                fullWidth
              />
              {errors.maghCount && errors.maghCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="falgunCount"
                label="फाल्गुन"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.falgunCount}
                fullWidth
              />
              {errors.falgunCount && errors.falgunCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="chaitraCount"
                label="चैत्र"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.chaitraCount}
                fullWidth
              />
              {errors.chaitraCount && errors.chaitraCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="baishakhCount"
                label="बैशाख"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.baishakhCount}
                fullWidth
              />
              {errors.baishakhCount && errors.baishakhCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="jesthaCount"
                label="जेठ"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.jesthaCount}
                fullWidth
              />
              {errors.jesthaCount && errors.jesthaCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                type="number"
                size="small"
                name="asarCount"
                label="असार"
                variant="outlined"
                inputRef={register({
                  min: 0
                })}
                defaultValue={modalDefaultValues.asarCount}
                fullWidth
              />
              {errors.asarCount && errors.asarCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <MonthlyOrYearlyActivitiesRegister tableData={monthlyYearlyActivitiesData} showActionColumn={monthlyYearlyActivitiesData.length !== 0} onEditRow={handleEditFunction} addNewData={addNewData.bind(this)} showTable={showTable} />
    </>
  );
}