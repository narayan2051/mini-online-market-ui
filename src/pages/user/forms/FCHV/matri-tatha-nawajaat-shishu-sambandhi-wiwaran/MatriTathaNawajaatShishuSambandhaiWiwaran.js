import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add, Help } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomReactSelect from "../../../../../components/custom-react-select/CustomReactSelect";
import CustomModal from "../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { CASTE_CODES, GREATER_THAN_ZERO, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../../utils/constants";
import { YES_OR_NO_OPTION } from "../../../../../utils/constants/forms";
import { DateUtils } from "../../../../../utils/dateUtils";
import MatriTathaNawajaatShishuSambandhaiWiwaranRegister from "../../../components/registers/FCHV/matri-tatha-nawajaat-shishu-sambandhi-wiwaran/MatriTathaNawajaatShishuSambandhaiWiwaranRegister";
import styles from "../style";

export default function MatriTathaNawajaatShishuSambandhaiWiwaran() {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [registerVolunteerId, setRegisterVolunteerId] = useState();
  const [showOtherPlaceOfDeliveryInput, setShowOtherPlaceOfDeliveryInput] = useState(false);

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    register({ name: "casteCode" }, { required: true });
    register({ name: "lmpDate" }, { required: true });
    register({ name: "lifeSafetyPermitGiven" });
    register({ name: "oneHundredEightyIronChakkiReceivedDuringPregnancy" });
    register({ name: "fourtyFiveIronChakkiReceivedAfterDelivery" });
    register({ name: "vitaminAReceivedAfterDelivery" });
    register({ name: "pariwaarNiyojanSadhanUsed" });
    buildFemaleVolunteerOptions();
  }, [register]);

  useEffect(() => {
    registerVolunteerId &&
      getMatriTathaaNawaShishuDataByVolunteerName();
  }, [registerVolunteerId]);

  const handleCustomReactSelectChange = (name, value) => {
    if (name === "femaleVolunteersName") {
      value && setRegisterVolunteerId(value);
    }
    setValue(name, value);
  }

  const handlePlaceOfDeliveryChange = placeOfDelivery => {
    setShowOtherPlaceOfDeliveryInput(placeOfDelivery === "OTHER");
  }

  const handleModalClose = () => {
    setModalDefaultValues({});
    reset();
    setShowModal(false);
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
    HMIS.get(API_URL.matriTathaNawajaatShishuSambandhaiWiwaranRegister + "/" + id).then(response => {
      response.data.dartaaMiti = response.data.dartaaMiti && DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
      response.data.lmpDate = response.data.lmpDate && DateUtils.getDateFromMilliseconds(response.data.lmpDate);
      response.data.eddDate = response.data.eddDate && DateUtils.getDateFromMilliseconds(response.data.eddDate);
      setModalDefaultValues(response.data);
      setShowModal(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.dartaaMiti = data.dartaaMiti && DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.lmpDate = data.lmpDate && DateUtils.getDateMilliseconds(data.lmpDate);
    data.eddDate = data.eddDate && DateUtils.getDateMilliseconds(data.eddDate);
    HMIS.post(API_URL.matriTathaNawajaatShishuSambandhaiWiwaranRegister, data).then(response => {
      if (response.data.type === "success") {
        handleModalClose();
        getMatriTathaaNawaShishuDataByVolunteerName();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const handleDartaaMitiChange = date => {
    setValue("dartaaMiti", date);
  }
  const handleLmpDateChange = date => {
    let dateAfterNineMonths = DateUtils.getMonthsAfterBSDate(9, date);
    setValue("eddDate", date ? DateUtils.getDaysAfterBSDate(7, dateAfterNineMonths) : "");
    setValue("lmpDate", date);
  }

  const getMatriTathaaNawaShishuDataByVolunteerName = () => {
    HMIS.get(API_URL.matriTathaNawajaatShishuSambandhaiWiwaranRegister + "/volunteerId?volunteerId=" + registerVolunteerId).then(response => {
      setTableData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          मातृ तथा नवजात शिशु सम्वन्धि विवरण
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2} className={classes.volunteerSelectContainer}>
            <CustomReactSelect
              label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
              options={femaleVolunteersName}
              onChange={handleCustomReactSelectChange}
              name="femaleVolunteersName"
            />
          </Box>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title="मातृ तथा नवजात शिशु सम्वन्धि विवरण"
        maxWidth="lg"
        showModal={showModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={handleModalClose}
      >
        <Box className={classes.generalInfo}>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomReactSelect
                label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
                name="womenVolunteerId"
                options={femaleVolunteersName}
                onChange={handleCustomReactSelectChange}
                defaultValue={modalDefaultValues.womenVolunteerId || registerVolunteerId}
              />
              {errors.womenVolunteerId && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <Tooltip title="गर्भवती महिलालाई पहिलो पटक भेट गर्दाको मिति" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control input-sm full-width"
                    name="dartaaMiti"
                    variant="outlined"
                    onDateSelect={(date) => { handleDartaaMitiChange(date) }}
                    defaultDate={modalDefaultValues.dartaaMiti || true}
                    placeholder="गर्भवती महिलालाई पहिलो पटक भेट गर्दाको मिति"
                    hideLabel
                  />
                  {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs>
              <TextField
                label="गर्भवती महिलाको नाम"
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
                label="गर्भवती महिलाको थर"
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
          </Grid>
          <Grid container spacing={2} alignItems="center" className={classes.row}>
            <Grid item xs>
              <CustomReactSelect
                label="गर्भवती महिलाको जाति कोड"
                name="casteCode"
                defaultValue={modalDefaultValues.casteCode}
                options={CASTE_CODES}
                onChange={handleCustomReactSelectChange}
              />
              {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="गर्भवती महिलाको उमेर (वर्षमा)"
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
              <NepaliDate
                className="date-picker-form-control input-sm full-width"
                name="lmpDate"
                variant="outlined"
                onDateSelect={(date) => { handleLmpDateChange(date) }}
                defaultDate={modalDefaultValues.lmpDate}
                placeholder="अन्तिम रजश्वला भएको मिति (LMP)"
                hideLabel
              />
              {errors.lmpDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="प्रसुतिको अनुमानित मिती (EDD)"
                name="eddDate"
                size="small"
                defaultValue={modalDefaultValues.eddDate}
                variant="outlined"
                inputRef={register({
                  required: true
                })}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              {errors.eddDate && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          </Grid>
        </Box>
        <Box className={classes.pregnancyTestDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">सुरक्षा परामर्श तथा स्वास्थ्य संस्थामा गर्भ जाँच गराएको विवरण</Typography>
          </Box>
          <Box className={classes.pregnancyTestDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <Tooltip title="गर्भवती महिलालाई जीवन सुरक्षासम्बन्धी परामर्श दिएको भएमा मात्र हो भन्ने विकल्प चयन गर्नु पर्दछ।" placement="top" arrow>
                  <Box>
                    <CustomReactSelect
                      label="जीवन सुरक्षा परामर्श दिएको"
                      name="lifeSafetyPermitGiven"
                      options={YES_OR_NO_OPTION}
                      defaultValue={modalDefaultValues.lifeSafetyPermitGiven}
                      onChange={handleCustomReactSelectChange}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={9}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1">स्वास्थ्य संस्थामा गर्भ जाँच गरेको पटक(औं महिनामा) </Typography>
                  <Tooltip title="गर्भवती महिलालाई सोधेर वा उनले गर्भ जाँच गराएको कार्ड हेरेर उनले कुन–कुन महिनामा गर्भ जाँच गराएकी छिन्, सोहीअनुसार दिईएका महिनाहरुमा सही चिन्ह (✓) लगाउनु पर्दछ। ४, ६, ८, ९ बाहेक अन्य महिनामा जँचाएको पाइएमा अन्य मा महिना अंकमा उल्लेख गर्नुपर्दछ ।" placement="top" arrow>
                    <Help className={classes.helpIcon} fontSize="small" />
                  </Tooltip>
                  <Typography variant="body1">:</Typography>
                  <Box ml={2}>
                    <FormGroup aria-label="स्वास्थ्य संस्थामा गर्भ जाँच गरेको पटक(औं महिनामा)" row>
                      <FormControlLabel
                        label="४"
                        control={<Checkbox name="wombTestInFourthMonth"
                          defaultChecked={modalDefaultValues.wombTestInFourthMonth}
                          variant="outlined"
                          inputRef={register}
                          color="primary"
                        />}
                      />
                      <FormControlLabel
                        label="६"
                        control={<Checkbox name="wombTestInSixthMonth"
                          defaultChecked={modalDefaultValues.wombTestInSixthMonth}
                          variant="outlined"
                          inputRef={register}
                          color="primary"
                        />}
                      />
                      <FormControlLabel
                        label="८"
                        control={<Checkbox name="wombTestInEighthMonth"
                          defaultChecked={modalDefaultValues.wombTestInEighthMonth}
                          variant="outlined"
                          inputRef={register}
                          color="primary"
                        />}
                      />
                      <FormControlLabel
                        label="९"
                        control={<Checkbox name="wombTestInNinthMonth"
                          defaultChecked={modalDefaultValues.wombTestInNinthMonth}
                          variant="outlined"
                          inputRef={register}
                          color="primary"
                        />}
                      />
                    </FormGroup>
                  </Box>
                  <Box>
                    <TextField
                      name="wombTestInOtherMonth"
                      inputRef={register({
                        min: 0
                      })}
                      type="number"
                      defaultValue={modalDefaultValues.wombTestInOtherMonth || ""}
                      variant="outlined"
                      size="small"
                      label="अन्य"
                      placeholder="अन्य"
                    />
                  </Box>
                  {errors.wombTestInOtherMonth && errors.wombTestInOtherMonth.type === "min" && <span className="error-message">{GREATER_THAN_ZERO}</span>}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.ironTabletAndVitaminDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">आइरन चक्की तथा भिटामिन ए विवरण</Typography>
          </Box>
          <Box className={classes.ironTabletAndVitaminDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <Tooltip title="गर्भवती महिलाले गर्भावस्थामा १८० चक्की आइरन पाएको भएमा मात्र हो भन्ने विकल्प चयन गर्नु पर्दछ। उक्त विवरण गर्भावस्थाको अन्तिम महिनापछि सोधी भर्नुपर्दछ।" placement="top" arrow>
                  <Box>
                    <CustomReactSelect
                      label="गर्भावस्थामा १८० चक्की आइरन पाएको"
                      name="oneHundredEightyIronChakkiReceivedDuringPregnancy"
                      options={YES_OR_NO_OPTION}
                      defaultValue={modalDefaultValues.oneHundredEightyIronChakkiReceivedDuringPregnancy}
                      onChange={handleCustomReactSelectChange}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <Tooltip title="सुत्केरी महिलाले सुत्केरीपछि ४५ चक्की आइरन पाएको भएमा मात्र हो भन्ने विकल्प चयन गर्नु पर्दछ। उक्त विवरण सुत्केरी भएपछि सोधी भर्नुपर्दछ।" placement="top" arrow>
                  <Box>
                    <CustomReactSelect
                      label="सुत्केरीपछि ४५ चक्की आइरन पाएको"
                      name="fourtyFiveIronChakkiReceivedAfterDelivery"
                      options={YES_OR_NO_OPTION}
                      defaultValue={modalDefaultValues.fourtyFiveIronChakkiReceivedAfterDelivery}
                      onChange={handleCustomReactSelectChange}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <Tooltip title="सुत्केरी महिलाले सुत्केरीपछि भिटामिन ए पाएको भएमा मात्र हो भन्ने विकल्प चयन गर्नु पर्दछ। उक्त विवरण सुत्केरी भएपछि सोधी भर्नुपर्दछ।" placement="top" arrow>
                  <Box>
                    <CustomReactSelect
                      label="सुत्केरीपछि भिटामिन ए पाएको"
                      name="vitaminAReceivedAfterDelivery"
                      options={YES_OR_NO_OPTION}
                      defaultValue={modalDefaultValues.vitaminAReceivedAfterDelivery}
                      onChange={handleCustomReactSelectChange}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={classes.motherAndChildDetails}>
          <Box className={classes.subTitle}>
            <Typography variant="h6">सुत्केरी महिला तथा नवजात शिशुको विवरण</Typography>
          </Box>
          <Box className={classes.motherAndChildDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
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
                      value="OTHER"
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
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">शिशुको जन्म अवस्था</FormLabel>
                  <RadioGroup name="childBornCondition" defaultValue={modalDefaultValues.childBornCondition} row>
                    <FormControlLabel
                      value="ALIVE"
                      control={<Radio color="primary" />}
                      label="जीवित"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="DEAD"
                      control={<Radio color="primary" />}
                      label="मृत"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">स्वास्थ्यकर्मीले नवजात शिशुसँगै सुत्केरी महिलालाई जाँच गरेको</FormLabel>
                  <FormGroup aria-label="स्वास्थ्यकर्मीले नवजात शिशुसँगै सुत्केरी महिलालाई जाँच गरेको" row>
                    <FormControlLabel
                      label="२४ घण्टा भित्र"
                      control={<Checkbox name="healthCheckedBeforeTwentyFourHours"
                        defaultChecked={modalDefaultValues.healthCheckedBeforeTwentyFourHours}
                        variant="outlined"
                        inputRef={register}
                        color="primary"
                      />}
                    />
                    <FormControlLabel
                      label="तेस्रो दिन"
                      control={<Checkbox name="healthCheckedOnThirdDay"
                        defaultChecked={modalDefaultValues.healthCheckedOnThirdDay}
                        variant="outlined"
                        inputRef={register}
                        color="primary"
                      />}
                    />
                    <FormControlLabel
                      label="सातौं दिन"
                      control={<Checkbox name="healthCheckedOnSeventhDay"
                        defaultChecked={modalDefaultValues.healthCheckedOnSeventhDay}
                        variant="outlined"
                        inputRef={register}
                        color="primary"
                      />}
                    />
                    <FormControlLabel
                      label="अन्य"
                      control={<Checkbox name="healthCheckedOtherTime"
                        defaultChecked={modalDefaultValues.healthCheckedOtherTime}
                        variant="outlined"
                        inputRef={register}
                        color="primary"
                      />}
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box className={classes.motherAndChildOtherDetailsContainer}>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <Tooltip title="सुत्केरी महिलाले परिवार नियोजनका साधन अपनाएको भएमा मात्र हो भन्ने विकल्प चयन गर्नु पर्दछ।" placement="top" arrow>
                  <Box>
                    <CustomReactSelect
                      label="परिवार नियोजनको साधन प्रयोग गरेको"
                      name="pariwaarNiyojanSadhanUsed"
                      options={YES_OR_NO_OPTION}
                      defaultValue={modalDefaultValues.pariwaarNiyojanSadhanUsed}
                      onChange={handleCustomReactSelectChange}
                    />
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="सुत्केरी महिलाले मातृ सुरक्षा चक्की खाएको भए यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                  <FormControlLabel
                    label="मातृ सुरक्षा चक्की खाएको"
                    control={<Checkbox name="matriSurakshyaChakkiKhayeko"
                      defaultChecked={modalDefaultValues.matriSurakshyaChakkiKhayeko}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">शिशुको तौल अवस्था</FormLabel>
                  <RadioGroup name="childWeightCondition" defaultValue={modalDefaultValues.childWeightCondition} row>
                    <FormControlLabel
                      value="NORMAL_WEIGHT"
                      control={<Radio color="primary" />}
                      label="सामान्य तौल"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="LESS_WEIGHT"
                      control={<Radio color="primary" />}
                      label="कम तौल"
                      inputRef={register}
                    />
                    <FormControlLabel
                      value="MUCH_LESS_WEIGHT"
                      control={<Radio color="primary" />}
                      label="धेरै कम तौल"
                      inputRef={register}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs={3}>
                <Tooltip title="जन्मेको १ घण्टाभित्र स्तनपान गराएको भए यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                  <FormControlLabel
                    label="जन्मेको १ घण्टाभित्र स्तनपान गराएको"
                    control={<Checkbox name="afterBirthBreastFeedingOneHour"
                      defaultChecked={modalDefaultValues.afterBirthBreastFeedingOneHour}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="नाभी मलमको प्रयोग गरेको भए यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                  <FormControlLabel
                    label="नाभी मलमको प्रयोग गरेको"
                    control={<Checkbox name="naabhiMalamUsed"
                      defaultChecked={modalDefaultValues.naabhiMalamUsed}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="जन्मने बित्तिकै आमाको छातीसंग टासेर राखेको भए यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                  <FormControlLabel
                    label="जन्मने बित्तिकै आमाको छातीसंग टासेर राखेको"
                    control={<Checkbox name="janmaneBittikaiAamakoChhatiSangaTaseko"
                      defaultChecked={modalDefaultValues.janmaneBittikaiAamakoChhatiSangaTaseko}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                  />
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.row}>
              <Grid item xs>
                <Tooltip title="निसास्सीएको नवजात शिशुको व्यवस्थापन गरेको भए यसमा सही चिन्ह (✓) लगाउनु पर्दछ।" placement="top" arrow>
                  <FormControlLabel
                    label="निसास्सीएको नवजात शिशुको व्यवस्थापन गरेको"
                    control={<Checkbox name="nisassiyekoShishukoWewasthapan"
                      defaultChecked={modalDefaultValues.nisassiyekoShishukoWewasthapan}
                      variant="outlined"
                      inputRef={register}
                      color="primary"
                    />}
                  />
                </Tooltip>
              </Grid>
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
        </Box>
      </CustomModal>
      <MatriTathaNawajaatShishuSambandhaiWiwaranRegister tableData={tableData} showActionColumn={tableData.length !== 0} onEditRow={handleEditFunction} />
    </>
  );
}