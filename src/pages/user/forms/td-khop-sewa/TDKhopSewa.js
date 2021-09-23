import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import CustomReactSelect from "../../../../components/custom-react-select/CustomReactSelect";
import CustomSelect from "../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../components/modal/CustomModal";
import NepaliDate from "../../../../components/nepali-datepicker/NepaliDatePicker";
import { CASTE_CODES, EDIT_SELECTED_RECORD, GREATER_THAN_ZERO, REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../utils/constants/index";
import { DateUtils } from "../../../../utils/dateUtils";
import TDKhopSewaRegister from "../../components/registers/td-khop-sewa-register/TDKhopSewaRegister";
import styles from "./style";

export default function TDKhopSewa(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [openTDKhopSewaModal, setOpenTDKhopSewaModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [tdKhopDefaultValues, setTdKhopDefaultValues] = useState({});
  const [sewaDartaaRegisterDate, setSewaDartaaRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [disabledField, setDisabledField] = useState(false);
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
    register({ name: "casteCode" }, { required: true });
    register({ name: "tdVaccineOneTakenDate" }, { required: true });
    register({ name: "tdVaccineTwoTakenDate" });
    register({ name: "tdVaccineTwoPlusTakenDate" });
    register({ name: "tdVaccineNumber" });
    register({ name: "dartaaMiti" }, { required: true });
  }, [register]);

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.tdVaccineOneTakenDate = data.tdVaccineOneTakenDate && DateUtils.getDateMilliseconds(data.tdVaccineOneTakenDate);
    data.tdVaccineTwoTakenDate = data.tdVaccineTwoTakenDate && DateUtils.getDateMilliseconds(data.tdVaccineTwoTakenDate);
    data.tdVaccineTwoPlusTakenDate = data.tdVaccineTwoPlusTakenDate && DateUtils.getDateMilliseconds(data.tdVaccineTwoPlusTakenDate);
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    HMIS.post(API_URL.tdKhopSewa, data)
      .then(response => {
        if (response.data.type === "success") {
          closeTDKhopSewaModal();
          sewaDartaaRegisterDate && getListOfTDKhopSewaFromRegistrationDate();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  };

  const tdKhopSewaEditFunction = (id) => {
    HMIS.get(API_URL.tdKhopSewa + "/" + id)
      .then(response => {
        response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        response.data.tdVaccineOneTakenDate = response.data.tdVaccineOneTakenDate && DateUtils.getDateFromMilliseconds(response.data.tdVaccineOneTakenDate);
        response.data.tdVaccineTwoTakenDate = response.data.tdVaccineTwoTakenDate && DateUtils.getDateFromMilliseconds(response.data.tdVaccineTwoTakenDate);
        response.data.tdVaccineTwoPlusTakenDate = response.data.tdVaccineTwoPlusTakenDate && DateUtils.getDateFromMilliseconds(response.data.tdVaccineTwoPlusTakenDate);
        setModalDefaultValues(response.data);
        if (response.data.matriTathaNawaSishuRegisterObjectId)
          setDisabledField(true);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  useEffect(() => {
    JSON.stringify(modalDefaultValues) !== "{}" && setOpenTDKhopSewaModal(true);
    setTdKhopDefaultValues(modalDefaultValues || {});
  }, [modalDefaultValues]);

  const closeTDKhopSewaModal = () => {
    setOpenTDKhopSewaModal(false);
    setDisabledField(false);
    setModalDefaultValues({});
    reset({});
  }

  const handleNepaliDateChange = (date, name) => {
    setValue(name, date);
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }

  const handleCustomReactSelectChange = (name, value) => {
    setValue(name, value);
  }

  const getListOfTDKhopSewaFromRegistrationDate = () => {
    HMIS.get(API_URL.tdKhopSewa + "?fromDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateFrom) + "&&toDate=" + DateUtils.getDateMilliseconds(sewaDartaaRegisterDate.dateTo))
      .then(response => {
        setMainRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  useEffect(() => {
    sewaDartaaRegisterDate.dateFrom && sewaDartaaRegisterDate.dateTo &&
      getListOfTDKhopSewaFromRegistrationDate();
  }, [sewaDartaaRegisterDate]);

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          टी.डी. खोप सेवा
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
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setOpenTDKhopSewaModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
          </Box>
        </Box>
      </Box>
      <CustomModal
        title={EDIT_SELECTED_RECORD}
        showModal={openTDKhopSewaModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeTDKhopSewaModal}
        maxWidth="lg"
      >
        <Box className={classes.tdKhopInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="दर्ता गरिएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    disabled={disabledField}
                    name="dartaaMiti"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={tdKhopDefaultValues.dartaaMiti}
                    onDateSelect={(date) => { handleDartaaMitiChange(date) }}
                    placeholder="मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="गर्भवति महिलाको नाम"
                defaultValue={modalDefaultValues.patientFirstName}
                name="patientFirstName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                InputProps={{ readOnly: disabledField }}
                fullWidth
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: disabledField }}
                label="गर्भवति महिलाको थर"
                defaultValue={modalDefaultValues.patientLastName}
                name="patientLastName"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.patientLastName && <span className="error-message">{REQUIRED_FIELD}</span>}

            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: disabledField }}
                label="उमेर"
                defaultValue={modalDefaultValues.age}
                name="age"
                size="small"
                type="number"
                inputRef={register({
                  required: true
                })}
                variant="outlined"
                fullWidth
              />
              {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomReactSelect
                label="जाति कोड"
                name="casteCode"
                defaultValue={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCustomReactSelectChange}
                isDisabled={disabledField}
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: disabledField }}
                label="गाउँ/टोल "
                defaultValue={modalDefaultValues.gaunOrTol}
                name="gaunOrTol"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
              {errors.gaunOrTol && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                InputProps={{ readOnly: disabledField }}
                label="सम्पर्क फोन नं."
                defaultValue={modalDefaultValues.phoneNumber}
                name="phoneNumber"
                size="small"
                inputRef={register}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs>
              <TextField
                label="गर्भको पटक"
                type="number"
                defaultValue={tdKhopDefaultValues.pregnancyCount || ""}
                name="pregnancyCount"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 1
                })}
                fullWidth
              />
              {errors.pregnancyCount && errors.pregnancyCount.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
              {errors.pregnancyCount && errors.pregnancyCount.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                label="पहिले लगाएको टी.डी खोपको मात्रा"
                type="number"
                defaultValue={tdKhopDefaultValues.previousTDVaccineQuantity || ""}
                name="previousTDVaccineQuantity"
                size="small"
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                fullWidth
              />
              {errors.previousTDVaccineQuantity && errors.previousTDVaccineQuantity.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
              {errors.previousTDVaccineQuantity && errors.previousTDVaccineQuantity.type === "required" && (<span className="error-message">{REQUIRED_FIELD}</span>)}
            </Grid>
            {/* TODO: Sandeep - Make conditional disabled fields for khop dates based on several conditions. Eg: If there is date for 2+ khop, 1 and 2 muse be disabled. If there is date for 1 || 2, 2+ must be disabled. */}
            <Grid item xs>
              <Tooltip title="टी.डी. खोप १ लगाएको भए लगाएको मिति उल्लेख गर्नुहोस्।" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="tdVaccineOneTakenDate"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={tdKhopDefaultValues.tdVaccineOneTakenDate}
                    onDateSelect={(date) => { handleNepaliDateChange(date, "tdVaccineOneTakenDate") }}
                    placeholder="टी.डी. खोप १ लगाएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.tdVaccineOneTakenDate && (<span className="error-message">{REQUIRED_FIELD}</span>)}
            </Grid>
            <Grid item xs>
              <Tooltip title="टी.डी. खोप २ लगाएको भए लगाएको मिति उल्लेख गर्नुहोस्।" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="tdVaccineTwoTakenDate"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={tdKhopDefaultValues.tdVaccineTwoTakenDate}
                    onDateSelect={(date) => { handleNepaliDateChange(date, "tdVaccineTwoTakenDate") }}
                    placeholder="टी.डी. खोप २ लगाएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <Tooltip title="टी.डी. खोप २+ लगाएको भए लगाएको मिति उल्लेख गर्नुहोस्।" placement="top" arrow>
                <Box>
                  <NepaliDate
                    name="tdVaccineTwoPlusTakenDate"
                    className="date-picker-form-control input-sm full-width"
                    defaultDate={tdKhopDefaultValues.tdVaccineTwoPlusTakenDate}
                    onDateSelect={(date) => { handleNepaliDateChange(date, "tdVaccineTwoPlusTakenDate") }}
                    placeholder="टी.डी. २+ खोप लगाएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                label="कैफियत"
                defaultValue={tdKhopDefaultValues.remarks}
                name="remarks"
                size="small"
                variant="outlined"
                inputRef={register}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <TDKhopSewaRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={tdKhopSewaEditFunction.bind(this)} />
    </>
  );
}
