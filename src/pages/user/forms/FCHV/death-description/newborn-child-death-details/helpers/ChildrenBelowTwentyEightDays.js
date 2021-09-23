import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../../../api/api";
import AddAlertMessage from "../../../../../../../components/alert/Alert";
import CustomSelect from "../../../../../../../components/custom-select/CustomSelect";
import CustomModal from '../../../../../../../components/modal/CustomModal';
import NepaliDate from "../../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { OTHER } from "../../../../../../../utils/constants/forms/index";
import { CASTE_CODES, CHILD_BIRTH_LOCATION_OPTIONS, CHILD_BIRTH_SITUATION_OPTIONS, CHILD_DEATH_REASON_OPTIONS, EDIT_SELECTED_RECORD, REQUIRED_FIELD, SOMETHING_WENT_WRONG, GREATER_THAN_ZERO } from "../../../../../../../utils/constants/index";
import { DateUtils } from "../../../../../../../utils/dateUtils";
import NewBornDeathDescriptionRegister from "../../../../../components/registers/FCHV/death-description-register/newborn-child-death-details-register/ChildrenBelowTwentyEightDaysRegister";
import styles from "../../style.js";

export default function ChildrenBelowTwentyEightDays(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [showDeathDescriptionModal, setShowDeathDescriptionModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [isChildBirthLocationOther, setIsChildBirthLocationOther] = useState(false);
  const [isChildBirthSituationOther, setIsChildBirthSituationOther] = useState(false);
  const [isCauseOfDeathOther, setIsCauseOfDeathOther] = useState(false);
  const [modalTitle, setModalTitle] = useState("नवजात शिशु मृत्यु विवरण रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");

  useEffect(() => {
    register({ name: "casteCode" }, { required: true });
    register({ name: "childBirthDate" }, { required: true });
    register({ name: "childBirthLocation" }, { required: true });
    register({ name: "childBirthSituation" }, { required: true });
    register({ name: "causeOfDeath" }, { required: true });
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
    setModalTitle("नवजात शिशु मृत्यु विवरण रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const handleBirthDateChange = (date) => {
    setValue("childBirthDate", date);
  }

  const handleChildBirthLocationChange = value => {
    setValue("childBirthLocation", value);
    setIsChildBirthLocationOther(value === OTHER);
  }

  const handleChildBirthSituationChange = value => {
    setValue("childBirthSituation", value);
    setIsChildBirthSituationOther(value === OTHER);
  }

  const handleCauseOfDeathChange = value => {
    setValue("causeOfDeath", value);
    setIsCauseOfDeathOther(value === OTHER);
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
    HMIS.post(API_URL.newBornDeathDescription, data)
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
    HMIS.get(API_URL.newBornDeathDescription + "/" + id)
      .then(response => {
        setModalTitle(EDIT_SELECTED_RECORD);
        setShowDeathDescriptionModal(true);
        response.data.childBirthDate = response.data.childBirthDate && DateUtils.getDateFromMilliseconds(response.data.childBirthDate)
        response.data.deathDate = DateUtils.getDateFromMilliseconds(response.data.deathDate);
        setModalDefaultValues(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getListOfDeathDescription = (womenVolunteerId) => {
    HMIS.get(API_URL.newBornDeathDescription + "?womenVolunteerId=" + womenVolunteerId)
      .then(response => {
        setMainRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleVolunteerNameChange = value => {
    setValue("womenVolunteerId", value);
  }
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h6">
          जन्मेको २८ दिनभित्र मृत्यु भएका नवजात शिशुहरु
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
                label="मृतक नवजात शिशुको नाम"
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
                label="मृतक नवजात शिशुको थर"
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
                name="motherFirstName"
                label="आमाको नाम"
                variant="outlined"
                defaultValue={modalDefaultValues.motherFirstName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.motherFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="motherLastName"
                label="आमाको थर"
                variant="outlined"
                defaultValue={modalDefaultValues.motherLastName}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
              {errors.motherLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="motherAge"
                type="number"
                label="आमाले पुरा गरेको उमेर"
                variant="outlined"
                defaultValue={modalDefaultValues.motherAge}
                inputRef={register({
                  required: true,
                  min: 1
                })}
                size="small"
                fullWidth
              />
              {errors.motherAge && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.motherAge && errors.motherAge.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
            <Grid item xs>
              <Tooltip title="मृतक नवजात शिशुको जन्म मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="childBirthDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleBirthDateChange(date) }}
                    defaultDate={modalDefaultValues.childBirthDate}
                    placeholder="नवजात शिशु जन्मेको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.childBirthDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.childOtherDetails}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomSelect
                label="बच्चा जन्मिएको स्थान"
                name="childBirthLocation"
                variant="outlined"
                options={CHILD_BIRTH_LOCATION_OPTIONS}
                onChange={handleChildBirthLocationChange}
                size="small"
                className="select-xs"
                value={modalDefaultValues.childBirthLocation}
                disabledOptionSelectable
                fullWidth
              />
              {errors.childBirthLocation && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title={isChildBirthLocationOther ? "" : "तपाईले बच्चा जन्मिएको स्थानमा अन्य विकल्प छनौट गर्नुभयो भने मात्र यहाँ टाइप गर्न सक्नुहुन्छ।"} placement="top" arrow>
                <TextField
                  name="otherBirthLocation"
                  label="अन्य जन्मिएको स्थान"
                  variant="outlined"
                  defaultValue={modalDefaultValues.otherBirthLocation}
                  inputRef={register}
                  InputProps={{ readOnly: !isChildBirthLocationOther }}
                  size="small"
                  fullWidth
                />
              </Tooltip>
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="बच्चा जन्मदाको अवस्था"
                name="childBirthSituation"
                variant="outlined"
                options={CHILD_BIRTH_SITUATION_OPTIONS}
                onChange={handleChildBirthSituationChange}
                className="select-xs"
                value={modalDefaultValues.childBirthSituation}
                disabledOptionSelectable
                size="small"
                fullWidth
              />
              {errors.childBirthSituation && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title={isChildBirthSituationOther ? "" : "तपाईले बच्चा जन्मदाको अवस्था मा अन्य विकल्प छनौट गर्नुभयो भने मात्र यहाँ टाइप गर्न सक्नुहुन्छ।"} placement="top" arrow>
                <TextField
                  name="childBirthSituationOther"
                  label="अन्य जन्मदाको अवस्था"
                  variant="outlined"
                  defaultValue={modalDefaultValues.childBirthSituationOther}
                  inputRef={register}
                  InputProps={{ readOnly: !isChildBirthSituationOther }}
                  size="small"
                  fullWidth
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <Tooltip title="नवजात शिशु मृत्यु हुँदाको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="deathDate"
                    variant="outlined"
                    onDateSelect={(date) => { handleDeathDateChange(date) }}
                    defaultDate={modalDefaultValues.deathDate}
                    placeholder="मृत्यु हुँदाको मिति"
                    hideLabel
                  />
                </Box>
              </Tooltip>
              {errors.deathDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                name="childAgeInDaysWhenDied"
                type="number"
                label="मृत्यु हुँदा शिशुको उमेर (दिनमा)"
                variant="outlined"
                defaultValue={modalDefaultValues.childAgeInDaysWhenDied}
                inputRef={register({
                  required: true,
                  min: 1
                })}
                size="small"
                fullWidth
              />
              {errors.childAgeInDaysWhenDied && <span className="error-message">{REQUIRED_FIELD}</span>}
              {errors.childAgeInDaysWhenDied && errors.childAgeInDaysWhenDied.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
            </Grid>
            <Grid item xs>
              <CustomSelect
                label="मृत्युको सम्भाव्य कारण"
                name="causeOfDeath"
                variant="outlined"
                options={CHILD_DEATH_REASON_OPTIONS}
                onChange={handleCauseOfDeathChange}
                size="small"
                className="select-xs"
                value={modalDefaultValues.causeOfDeath}
                disabledOptionSelectable
                fullWidth
              />
              {errors.causeOfDeath && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title={isCauseOfDeathOther ? "" : "तपाईले मृत्युको सम्भाव्य कारण मा अन्य विकल्प छनौट गर्नुभयो भने मात्र यहाँ टाइप गर्न सक्नुहुन्छ।"} placement="top" arrow>
                <TextField
                  name="causeOfDeathOther"
                  label="अन्य मृत्युको सम्भाव्य कारण"
                  variant="outlined"
                  defaultValue={modalDefaultValues.causeOfDeathOther}
                  inputRef={register}
                  InputProps={{ readOnly: !isCauseOfDeathOther }}
                  size="small"
                  fullWidth
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                name="remarks"
                label="कैफियत"
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
      <NewBornDeathDescriptionRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={handleEditFunction} />
    </>
  );
}