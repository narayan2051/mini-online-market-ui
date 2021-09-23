import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import MahilaSwasthyaSwamSewikaDetailRegister from "../../../components/registers/FCHV/mahila-swasthya-swam-sewika-detail/MahilaSwasthyaSwamSewikaDetailRegister";
import styles from "../style";

export default function MahilaSwasthyaSwamSewikaDetails(props) {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    register({ name: "dateOfBirth" });
    register({ name: "serviceStartDate" });
    register({ name: "serviceEndDate" });
    register({ name: "firstPhaseTrainingDate" });
    register({ name: "secondPhaseTrainingDate" });
    getMahilaSwasthyaSwamSewikaData();
  }, [register])

  const handleModalClose = () => {
    setModalDefaultValues({});
    reset();
    setOpenModal(false);
  }

  const getMahilaSwasthyaSwamSewikaData = () => {
    HMIS.get(API_URL.mahilaSwasthyaSwamSewikaDetailRegister).then(response => {
      setTableData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }

  const handleDateOfBirthChange = date => {
    setValue("dateOfBirth", date);
  }

  const handleServiceStartDateChange = date => {
    setValue("serviceStartDate", date);
  }
  const handleServiceEndDateChange = date => {
    setValue("serviceEndDate", date);
  }

  const handleFirstPhaseTrainingDateChange = date => {
    setValue("firstPhaseTrainingDate", date);
  }

  const handleSecondPhaseTrainingDateChange = date => {
    setValue("secondPhaseTrainingDate", date);
  }

  const handleEditFunction = id => {
    HMIS.get(API_URL.mahilaSwasthyaSwamSewikaDetailRegister + "/" + id)
      .then(response => {
        response.data.dateOfBirth = response.data.dateOfBirth && DateUtils.getDateFromMilliseconds(response.data.dateOfBirth);
        response.data.serviceStartDate = response.data.serviceStartDate && DateUtils.getDateFromMilliseconds(response.data.serviceStartDate);
        response.data.serviceEndDate = response.data.serviceEndDate && DateUtils.getDateFromMilliseconds(response.data.serviceEndDate);
        response.data.firstPhaseTrainingDate = response.data.firstPhaseTrainingDate && DateUtils.getDateFromMilliseconds(response.data.firstPhaseTrainingDate);
        response.data.secondPhaseTrainingDate = response.data.secondPhaseTrainingDate && DateUtils.getDateFromMilliseconds(response.data.secondPhaseTrainingDate);

        setModalDefaultValues(response.data);
        setOpenModal(true);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG })
      })
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.dateOfBirth = data.dateOfBirth && DateUtils.getDateMilliseconds(data.dateOfBirth);
    data.serviceStartDate = data.serviceStartDate && DateUtils.getDateMilliseconds(data.serviceStartDate);
    data.serviceEndDate = data.serviceEndDate && DateUtils.getDateMilliseconds(data.serviceEndDate);
    data.firstPhaseTrainingDate = data.firstPhaseTrainingDate && DateUtils.getDateMilliseconds(data.firstPhaseTrainingDate);
    data.secondPhaseTrainingDate = data.secondPhaseTrainingDate && DateUtils.getDateMilliseconds(data.secondPhaseTrainingDate);

    HMIS.post(API_URL.mahilaSwasthyaSwamSewikaDetailRegister, data).then(response => {
      if (response.data) {
        handleModalClose();
        getMahilaSwasthyaSwamSewikaData();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    })
  }
  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          महिला स्वास्थ्य स्वयंसेविका विवरण
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
      </Box>
      <h1> </h1>
      <CustomModal
        title="महिला स्वास्थ्य स्वयंसेविका विवरण"
        maxWidth="lg"
        showModal={openModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={handleModalClose}
      >
        <Box className={classes.mahilaSwasthyaSwamSewikaDetails}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="fullName"
                label="नाम थर"
                variant="outlined"
                defaultValue={modalDefaultValues.fullName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.fullName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="जन्म मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="dateOfBirth"
                    variant="outlined"
                    onDateSelect={(date) => { handleDateOfBirthChange(date) }}
                    defaultDate={modalDefaultValues.dateOfBirth}
                    placeholder="जन्म मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                name="address"
                label="ठेगाना"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                defaultValue={modalDefaultValues.address}
                size="small"
                fullWidth
              />
              {errors.address && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="phoneNumber"
                label="फोन नं."
                variant="outlined"
                defaultValue={modalDefaultValues.phoneNumber}
                inputRef={register}
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="कार्यकाल देखी" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="serviceStartDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleServiceStartDateChange(date) }}
                    defaultDate={modalDefaultValues.serviceStartDate}
                    placeholder="कार्यकाल देखी (मिति)"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="कार्यकाल सम्म" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="serviceEndDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleServiceEndDateChange(date) }}
                    defaultDate={modalDefaultValues.serviceEndDate}
                    placeholder="कार्यकाल सम्म (मिति)"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="पहिलो चरणको आधारभूत तालिम लिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="firstPhaseTrainingDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleFirstPhaseTrainingDateChange(date) }}
                    defaultDate={modalDefaultValues.firstPhaseTrainingDate}
                    placeholder="पहिलो चरण तालिम मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="दोश्रो चरणको आधारभूत तालिम लिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="secondPhaseTrainingDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleSecondPhaseTrainingDateChange(date) }}
                    defaultDate={modalDefaultValues.secondPhaseTrainingDate}
                    placeholder="दोश्रो चरण तालिम मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <MahilaSwasthyaSwamSewikaDetailRegister tableData={tableData} showActionColumn={tableData.length !== 0} onEditRow={handleEditFunction} />
    </div>
  );
}