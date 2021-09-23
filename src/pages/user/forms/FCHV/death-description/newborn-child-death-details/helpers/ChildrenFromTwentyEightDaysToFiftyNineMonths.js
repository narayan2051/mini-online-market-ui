import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../../../api/api";
import AddAlertMessage from "../../../../../../../components/alert/Alert";
import CustomSelect from "../../../../../../../components/custom-select/CustomSelect";
import CustomModal from '../../../../../../../components/modal/CustomModal';
import NepaliDate from "../../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { CASTE_CODES, EDIT_SELECTED_RECORD, REQUIRED_FIELD, SOMETHING_WENT_WRONG, GREATER_THAN_ZERO } from "../../../../../../../utils/constants/index";
import { DateUtils } from "../../../../../../../utils/dateUtils";
import ChildrenFromTwentyEightDaysToFiftyNineMonthsRegister from "../../../../../components/registers/FCHV/death-description-register/newborn-child-death-details-register/ChildrenFromTwentyEightDaysToFiftyNineMonthsRegister";
import styles from "../../style.js";

export default function ChildrenFromTwentyEightDaysToFiftyNineMonths(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showDeathDescriptionModal, setShowDeathDescriptionModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [modalTitle, setModalTitle] = useState("२८ दिन देखी ५९ महिना सम्मका बच्चाको मृत्यु विवरण रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");


  useEffect(() => {
    register({ name: "casteCode" }, { required: true });
    register({ name: "childBirthDate" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    register({ name: "deathDate" }, { required: true });
  }, [register]);

  useEffect(() => {
    props.selectedVolunteerId &&
      getListOfDeathDescription(props.selectedVolunteerId);
  }, [props.selectedVolunteerId]);

  const closeDeathDescriptionModal = () => {
    reset();
    setModalDefaultValues({});
    setShowDeathDescriptionModal(false);
    setModalTitle("२८ दिन देखी ५९ महिना सम्मका बच्चाको मृत्यु विवरण रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const handleBirthDateChange = (date) => {
    setValue("childBirthDate", date);
  }

  const handleVolunteerNameChange = value => {
    setValue("womenVolunteerId", value);
  }

  const handleDeathDateChange = value => {
    setValue("deathDate", value);
  }

  const handleCasteCodeChange = casteCode => {
    setValue("casteCode", casteCode);
  };

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.childBirthDate = DateUtils.getDateMilliseconds(data.childBirthDate);
    data.deathDate = DateUtils.getDateMilliseconds(data.deathDate);
    HMIS.post(API_URL.childBetweenTwentyEightToFiftyNineMonthsDeathDescription, data)
      .then(response => {
        if (response.data.type === "success") {
          getListOfDeathDescription(props.selectedVolunteerId);
          closeDeathDescriptionModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleEditFunction = (id) => {
    HMIS.get(API_URL.childBetweenTwentyEightToFiftyNineMonthsDeathDescription + "/" + id)
      .then(response => {
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowDeathDescriptionModal(true);
        response.data.childBirthDate = response.data.childBirthDate && DateUtils.getDateFromMilliseconds(response.data.childBirthDate);
        response.data.deathDate = DateUtils.getDateFromMilliseconds(response.data.deathDate);
        setModalDefaultValues(response.data)
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListOfDeathDescription = (womenVolunteerId) => {
    HMIS.get(API_URL.childBetweenTwentyEightToFiftyNineMonthsDeathDescription + "?womenVolunteerId=" + womenVolunteerId)
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          २८ दिन देखी ५९ महिना सम्मका बच्चाको मृत्यु विवरण
        </Typography>
        <Box display="flex" alignItems="center" mr={1}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowDeathDescriptionModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showDeathDescriptionModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeDeathDescriptionModal}
        maxWidth="lg"
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
                variant="outlined"
                name="womenVolunteerId"
                options={props.volunteersName}
                onChange={handleVolunteerNameChange}
                value={modalDefaultValues.womenVolunteerId || props.selectedVolunteerId}
                size="small"
                fullWidth
              />
              {errors.womenVolunteerId && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="patientFirstName"
                label="मृतक बच्चाको नाम"
                variant="outlined"
                defaultValue={modalDefaultValues.patientFirstName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="patientLastName"
                label="मृतक बच्चाको थर"
                variant="outlined"
                defaultValue={modalDefaultValues.patientLastName}
                inputRef={register({
                  required: true
                })}
                size="small"
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
                onChange={handleCasteCodeChange.bind(this)}
                fullWidth
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                name="parentFirstName"
                label="मृतक बच्चाको आमा वा बुवाको नाम"
                variant="outlined"
                defaultValue={modalDefaultValues.parentFirstName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.parentFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="parentLastName"
                label="मृतक बच्चाको आमा वा बुवाको थर"
                variant="outlined"
                defaultValue={modalDefaultValues.parentLastName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.parentLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="बच्चाको जन्म मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="childBirthDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleBirthDateChange(date) }}
                    defaultDate={modalDefaultValues.childBirthDate}
                    placeholder="बच्चाको जन्म मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.childBirthDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="बच्चाको मृत्यु भएको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="deathDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleDeathDateChange(date) }}
                    defaultDate={modalDefaultValues.deathDate}
                    placeholder="मृत्यु भएको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.deathDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs={3}>
              <TextField
                name="childAgeInMonthsWhenDied"
                type="number"
                size="small"
                label="मृत्यु हुँदा बच्चाको उमेर (महिनामा)"
                variant="outlined"
                defaultValue={modalDefaultValues.childAgeInMonthsWhenDied}
                inputRef={register({
                  required: true,
                  min: 1
                })}
                fullWidth
              />
              {errors.childAgeInMonthsWhenDied && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.childAgeInMonthsWhenDied && errors.childAgeInMonthsWhenDied.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="causeOfDeath"
                size="small"
                label="मृत्युको सम्भाव्य कारण"
                variant="outlined"
                defaultValue={modalDefaultValues.causeOfDeath}
                inputRef={register}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="remarks"
                label="कैफियत"
                size="small"
                variant="outlined"
                defaultValue={modalDefaultValues.remarks}
                inputRef={register}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
        </Box>
      </CustomModal>
      <ChildrenFromTwentyEightDaysToFiftyNineMonthsRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={handleEditFunction} />
    </div>
  );
}