import { Box, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Help } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import VitaminAWormMedicineAndSchoolManagementPosanProgramRegister from "../../../components/registers/posan/vitaminA-worm-medicine-and-school-management-program/VitaminAWormMedicineAndSchoolManagementPosanProgramRegister";
import styles from "./style";

export default function VitaminAWormMedicineAndSchoolManagementPosanProgram() {
  const classes = styles();
  const { register, reset, handleSubmit, errors } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [tableData, setTableData] = useState({});
  const [registerDate, setRegisterDate] = useState({
    firstPhaseFromDate: null,
    firstPhaseToDate: null,
    secondPhaseFromDate: null,
    secondPhaseToDate: null
  });

  const firstDateOfYear = DateUtils.getDateWithFirstDayOfYear();

  useEffect(() => {
    registerDate.firstPhaseFromDate && registerDate.firstPhaseToDate && registerDate.secondPhaseFromDate && registerDate.secondPhaseToDate &&
      getTableData();
  }, [registerDate])

  const handleEditFunction = id => {
    setModalDefaultValues(tableData);
    setShowModal(true);
  }

  const handleFirstPhaseFromDateSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        firstPhaseFromDate: date
      }));
  }

  const handleFirstPhaseToDateSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        firstPhaseToDate: date
      }));

  }
  const handleSecondPhaseFromDateSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        secondPhaseFromDate: date
      }));
  }

  const handleSecondPhaseToDateSelect = date => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        secondPhaseToDate: date
      }));
  }

  const closeModal = () => {
    setModalDefaultValues({});
    reset();
    setShowModal(false);
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    HMIS.post(API_URL.vitaminAWormMedicineAndSchoolManagementPosanProgram, data).then(response => {
      if (response.data.type === "success") {
        closeModal();
        getTableData();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });

    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const getTableData = () => {
    HMIS.get(API_URL.vitaminAWormMedicineAndSchoolManagementPosanProgram + "/date?firstPhaseFromDate=" + DateUtils.getDateMilliseconds(registerDate.firstPhaseFromDate) +
      "&&firstPhaseToDate=" + DateUtils.getDateMilliseconds(registerDate.firstPhaseToDate) + "&&secondPhaseFromDate=" + DateUtils.getDateMilliseconds(registerDate.secondPhaseFromDate) +
      "&&secondPhaseToDate=" + DateUtils.getDateMilliseconds(registerDate.secondPhaseToDate)).then(response => {
        setTableData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          भिटामिन ए, जुकाको औषधी र विद्यालय स्वास्थ्य तथा पोषण कार्यक्रम (अभियान)
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end" mb={2} className={classes.dateRangeContainer}>
        <Typography variant="body2">चरण १ अवधि</Typography>
        <Tooltip title=" चरण १ अवधि भन्नाले पहिलो चरणमा संचालन भएको मिति को अवधी बुझिन्छ। सामान्यतया, एक चरण ६ महिनाको हुने हुँदा मिति चयन गर्दा मिति को अन्तराल ६ महिनाको हुने गरी अवधी छान्नुहोस्।" placement="top" arrow>
          <Help className={classes.helpIcon} fontSize="small" />
        </Tooltip>
        <Box display="flex" alignItems="center" mr={5}>
          <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleFirstPhaseFromDateSelect(date) }} labelText="दर्ता मिति" defaultDate={firstDateOfYear} hideLabel />
          <Typography variant="subtitle2">देखी</Typography>
          <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleFirstPhaseToDateSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getMonthsAfterBSDate(5, firstDateOfYear)} hideLabel />
          <Typography variant="subtitle2">सम्म</Typography>
        </Box>
        <Typography variant="body2">चरण २ अवधि</Typography>
        <Tooltip title=" चरण २ अवधि भन्नाले दोस्रो चरणमा संचालन भएको मिति को अवधी बुझिन्छ। सामान्यतया, एक चरण ६ महिनाको हुने हुँदा मिति चयन गर्दा मिति को अन्तराल ६ महिनाको हुने गरी अवधी छान्नुहोस्।" placement="top" arrow>
          <Help className={classes.helpIcon} fontSize="small" />
        </Tooltip>
        <Box display="flex" alignItems="center" mr={1}>
          <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleSecondPhaseFromDateSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getMonthsAfterBSDate(5, firstDateOfYear)} hideLabel />
          <Typography variant="subtitle2">देखी</Typography>
          <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleSecondPhaseToDateSelect(date) }} labelText="दर्ता मिति" defaultDate={DateUtils.getMonthsAfterBSDate(11, firstDateOfYear)} hideLabel />
          <Typography variant="subtitle2">सम्म</Typography>
        </Box>
      </Box>
      <CustomModal
        title=" भिटामिन ए, जुकाको औषधी र विद्यालय स्वास्थ्य तथा पोषण कार्यक्रम"
        showModal={showModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeModal}
        maxWidth="lg"
      >

        <Box className={classes.vitaminASchoolDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">भिटामिन ए</Typography>
          </Box>
          <Box className={classes.vitaminADetailsContainer}>
            <Typography variant="subtitle2">६-११ महिनाका बालबालिका</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="firstPhaseSixToElevenMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.firstPhaseSixToElevenMonthChildrenTarget || ""}
                  label="चरण १ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.firstPhaseSixToElevenMonthChildrenTarget && errors.firstPhaseSixToElevenMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="secondPhaseSixToElevenMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.secondPhaseSixToElevenMonthChildrenTarget || ""}
                  label="चरण २ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.secondPhaseSixToElevenMonthChildrenTarget && errors.secondPhaseSixToElevenMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  name="sixToElevenMonthChildrenRemarks"
                  size="small"
                  inputRef={register}
                  variant="outlined"
                  defaultValue={modalDefaultValues.sixToElevenMonthChildrenRemarks}
                  label="कैफियत"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">१२-५९ महिनाका बालबालिका</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="firstPhaseTwelveToFiftyNineMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.firstPhaseTwelveToFiftyNineMonthChildrenTarget || ""}
                  label="चरण १ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.firstPhaseTwelveToFiftyNineMonthChildrenTarget && errors.firstPhaseTwelveToFiftyNineMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="secondPhaseTwelveToFiftyNineMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.secondPhaseTwelveToFiftyNineMonthChildrenTarget || ""}
                  label="चरण २ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.secondPhaseTwelveToFiftyNineMonthChildrenTarget && errors.secondPhaseTwelveToFiftyNineMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  name="twelveToFiftyNineMonthChildrenRemarks"
                  size="small"
                  inputRef={register}
                  variant="outlined"
                  defaultValue={modalDefaultValues.twelveToFiftyNineMonthChildrenRemarks}
                  label="कैफियत"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.subTitle}>
            <Typography variant="h6">जुकाको औषधी (१२-५९ महिनाका बालबालिका)</Typography>
          </Box>
          <Box className={classes.wormADetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="firstPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.firstPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget || ""}
                  label="चरण १ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.firstPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget && errors.firstPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="secondPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.secondPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget || ""}
                  label="चरण २ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.secondPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget && errors.secondPhaseWormMedicineTwelveToFiftyNineMonthChildrenTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  name="wormMedicineTwelveToFiftyNineMonthChildrenRemarks"
                  size="small"
                  inputRef={register}
                  variant="outlined"
                  defaultValue={modalDefaultValues.wormMedicineTwelveToFiftyNineMonthChildrenRemarks}
                  label="कैफियत"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.subTitle}>
            <Typography variant="h6">विद्यालय स्वास्थ्य तथा पोषण कार्यक्रम</Typography>
          </Box>
          <Box className={classes.schoolWormDetailsContainer}>
            <Typography variant="subtitle2">जुकाको औषधी दिइएका छात्र (कक्षा १-१०)</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="firstPhaseWormMedicineGivenMaleTarget"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  defaultValue={modalDefaultValues.firstPhaseWormMedicineGivenMaleTarget || ""}
                  label="चरण १ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.firstPhaseWormMedicineGivenMaleTarget && errors.firstPhaseWormMedicineGivenMaleTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  size="small"
                  name="firstPhaseWormMedicineGivenMaleProgressCount"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  label="चरण १ प्रगती संख्या"
                  defaultValue={modalDefaultValues.firstPhaseWormMedicineGivenMaleProgressCount || ""}
                  fullWidth
                />
                {errors.firstPhaseWormMedicineGivenMaleProgressCount && errors.firstPhaseWormMedicineGivenMaleProgressCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  name="secondPhaseWormMedicineGivenMaleTarget"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  variant="outlined"
                  label="चरण २ लक्ष्य संख्या"
                  defaultValue={modalDefaultValues.secondPhaseWormMedicineGivenMaleTarget || ""}
                  fullWidth
                />
                {errors.secondPhaseWormMedicineGivenMaleTarget && errors.secondPhaseWormMedicineGivenMaleTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  name="secondPhaseWormMedicineGivenMaleProgressCount"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  variant="outlined"
                  label="चरण २ प्रगती संख्या"
                  defaultValue={modalDefaultValues.secondPhaseWormMedicineGivenMaleProgressCount || ""}
                  fullWidth
                />
                {errors.secondPhaseWormMedicineGivenMaleProgressCount && errors.secondPhaseWormMedicineGivenMaleProgressCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  name="wormMedicineGivenMaleRemarks"
                  inputRef={register}
                  variant="outlined"
                  size="small"
                  defaultValue={modalDefaultValues.wormMedicineGivenMaleRemarks}
                  label="कैफियत"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle2">जुकाको औषधी दिइएका छात्रा (कक्षा १-१०)</Typography>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  type="number"
                  name="firstPhaseWormMedicineGivenFemaleTarget"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  defaultValue={modalDefaultValues.firstPhaseWormMedicineGivenFemaleTarget || ""}
                  variant="outlined"
                  label="चरण १ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.firstPhaseWormMedicineGivenFemaleTarget && errors.firstPhaseWormMedicineGivenFemaleTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  name="firstPhaseWormMedicineGivenFemaleProgressCount"
                  inputRef={register({
                    min: 0
                  })}
                  defaultValue={modalDefaultValues.firstPhaseWormMedicineGivenFemaleProgressCount || ""}
                  variant="outlined"
                  size="small"
                  label="चरण १ प्रगती संख्या"
                  fullWidth
                />
                {errors.firstPhaseWormMedicineGivenFemaleProgressCount && errors.firstPhaseWormMedicineGivenFemaleProgressCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  name="secondPhaseWormMedicineGivenFemaleTarget"
                  inputRef={register({
                    min: 0
                  })}
                  size="small"
                  variant="outlined"
                  defaultValue={modalDefaultValues.secondPhaseWormMedicineGivenFemaleTarget || ""}
                  label="चरण २ लक्ष्य संख्या"
                  fullWidth
                />
                {errors.secondPhaseWormMedicineGivenFemaleTarget && errors.secondPhaseWormMedicineGivenFemaleTarget.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
              <Grid item xs>
                <TextField
                  type="number"
                  name="secondPhaseWormMedicineGivenFemaleProgressCount"
                  inputRef={register({
                    min: 0
                  })}
                  defaultValue={modalDefaultValues.secondPhaseWormMedicineGivenFemaleProgressCount || ""}
                  variant="outlined"
                  size="small"
                  label="चरण २ प्रगती संख्या"
                  fullWidth
                />
                {errors.secondPhaseWormMedicineGivenFemaleProgressCount && errors.secondPhaseWormMedicineGivenFemaleProgressCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <TextField
                  name="wormMedicineGivenFemaleRemarks"
                  inputRef={register({
                    min: 0
                  })}
                  variant="outlined"
                  size="small"
                  defaultValue={modalDefaultValues.wormMedicineGivenFemaleRemarks}
                  label="कैफियत"
                  fullWidth
                  multiline
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CustomModal>
      <VitaminAWormMedicineAndSchoolManagementPosanProgramRegister
        tableData={tableData}
        onEditRow={handleEditFunction}
        firstPhaseDate={registerDate.firstPhaseToDate}
        secondPhaseDate={registerDate.secondPhaseToDate}
      />
    </>
  )
}