import { Box, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Help as HelpIcon } from '@material-ui/icons';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import AddAlertMessage from "../../../../../../components/alert/Alert";
import CustomSelect from "../../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../../../misc/appMisc";
import { CASTE_CODES, GENDER_OPTIONS, GREATER_THAN_ZERO, REQUIRED_FIELD } from "../../../../../../utils/constants";
import { AGE_UNITS } from "../../../../../../utils/constants/forms";
import styles from "../../style";

export default function AddRecordToKhopSewaRegisterModal(props) {
  const classes = styles();
  const { register, handleSubmit, setValue, reset, errors } = useForm();
  const [districtLabel, setDistrictLabel] = useState();
  const [palikaNameLabel, setPalikaNameLabel] = useState();
  const [palikaOptions, setPalikaOptions] = useState();
  const [hasDistrictSelected, setHasDistrictSelected] = useState(false);
  const districtOptions = AppMisc.getDistrictOptions();

  useEffect(() => {
    register({ name: "casteCode" }, { required: true });
    register({ name: "gender" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "district" }, { required: true });
    register({ name: "palikaName" }, { required: true });
    register({ name: "dateOfBirth" }, { required: true });
    register({ name: "bcgDate" });
    register({ name: "dptHepBFirstTime" });
    register({ name: "dptHepBSecondTime" });
    register({ name: "dptHepBThirdTime" });
    register({ name: "dptHepaPolioAfter12Month" });
    register({ name: "polioFirstTime" });
    register({ name: "polioSecondTime" });
    register({ name: "polioThirdTime" });
    register({ name: "pcvFirstTime" });
    register({ name: "pcvSecondTime" });
    register({ name: "pcvThirdTime" });
    register({ name: "rotaFirstTime" });
    register({ name: "rotaSecondTime" });
    register({ name: "fipvFirstTime" });
    register({ name: "fipvSecondTime" });
    register({ name: "daduraRubelaNineToElevenMonth" });
    register({ name: "daduraRubelaAfterTwelveMonth" });
    register({ name: "purnaKhopLayeko" });
    register({ name: "jeAfterTwelveMonth" });
  }, [register]);

  useEffect(() => {
    !props.showKhopSewaModal && handleModalClose();
  }, [props.showKhopSewaModal])

  useEffect(() => {
    if (props.modalDefaultValues.district && props.modalDefaultValues.palikaName) {
      let district = districtOptions.find(option => option.value === props.modalDefaultValues.district);
      let palikas = district.palikas;
      handleDistrictChange(district);
      handlePalikaNameChange(palikas.find(option => option.value === props.modalDefaultValues.palikaName));
    }
  }, [props.modalDefaultValues.district, props.modalDefaultValues.palikaName]);

  const handleJatiCodeOnChange = casteCode => {
    setValue("casteCode", casteCode);
  };

  const handleGenderChange = (genderValue) => {
    setValue("gender", genderValue);
  }

  const handleDOBSelect = date => {
    setValue("dateOfBirth", date);
  }
  //BCG date handler
  const handleBcgDateSelect = date => {
    setValue("bcgDate", date);
  }
  //DPT HEPA/HIBA date handler
  const handleDPTHepaFirstTimeDateSelect = date => {
    setValue("dptHepBFirstTime", date);
  }
  const handleDPTHepaSecondTimeDateSelect = date => {
    setValue("dptHepBSecondTime", date);
  }

  const handleDPTHepaThirdTimeDateSelect = date => {
    setValue("dptHepBThirdTime", date);
  }

  const handleDPTHepaPolioAfter12Month = date => {
    setValue("dptHepaPolioAfter12Month", date);
  }

  //Polio Date Handler
  const handlePolioFirstTimeDateSelect = date => {
    setValue("polioFirstTime", date);
  }
  const handlePolioSecondTimeDateSelect = (date) => {
    setValue("polioSecondTime", date);
  }
  const handlePolioThirdTimeDateSelect = (date) => {
    setValue("polioThirdTime", date);
  }
  //PCV Date Handler
  const handlePcvFirstTimeDateSelect = (date) => {
    setValue("pcvFirstTime", date);
  }

  const handlePcvSecondTimeDateSelect = (date) => {
    setValue("pcvSecondTime", date);
  }

  const handlePcvThirdTimeDateSelect = (date) => {
    setValue("pcvThirdTime", date);
  }

  // Rota Date Handler
  const handleRotaFirstTimeDateSelect = (date) => {
    setValue("rotaFirstTime", date);
  }
  const handleRotaSecondTimeDateSelect = (date) => {
    setValue("rotaSecondTime", date);
  }

  // FIPV Date Handler
  const handleFipvFirstTimeDateSelect = (date) => {
    setValue("fipvFirstTime", date);
  }
  const handleFipvSecondTimeDateSelect = (date) => {
    setValue("fipvSecondTime", date);
  }

  //Dadura Rubela Date handler
  const handleDaduraRubela9To11MonthDateSelect = (date) => {
    setValue("daduraRubelaNineToElevenMonth", date);
  }

  const handleDaduraRubelaAfter12MonthDateSelect = (date) => {
    setValue("daduraRubelaAfterTwelveMonth", date);
  }
  //Purna Khop Date handler
  const handlePurnaKhopDateSelect = (date) => {
    setValue("purnaKhopLayeko", date);
  }
  //JE Khop Date handler
  const handleJeAfter12MonthDateSelect = (date) => {
    setValue("jeAfterTwelveMonth", date);
  }

  const handleAgeUnitChange = ageUnit => {
    setValue("ageUnit", ageUnit);
  }

  const handleDistrictChange = (districtOption) => {
    districtOption ? setHasDistrictSelected(true) : setHasDistrictSelected(false);
    setValue("palikaName", null);
    setPalikaNameLabel("");
    setValue("district", districtOption ? districtOption.value : null);
    setDistrictLabel(districtOption ? districtOption : "");
    districtOption &&
      setPalikaOptions(districtOption.palikas);
  }

  const handlePalikaNameChange = palikaOption => {
    setValue("palikaName", palikaOption ? palikaOption.value : null);
    setPalikaNameLabel(palikaOption ? palikaOption : "");
  }

  const handleModalClose = () => {
    reset({});
    setDistrictLabel("");
    setPalikaNameLabel("");
    props.onModalClose();
  }

  const onSubmit = data => {
    if (data.bcgDate || data.dptHepBFirstTime || data.dptHepBSecondTime || data.dptHepBThirdTime || data.dptHepaPolioAfter12Month ||
      data.polioFirstTime || data.polioSecondTime || data.polioThirdTime || data.pcvFirstTime || data.pcvSecondTime || data.pcvThirdTime ||
      data.rotaFirstTime || data.rotaSecondTime || data.fipvFirstTime || data.fipvSecondTime || data.daduraRubelaNineToElevenMonth || data.daduraRubelaAfterTwelveMonth
      || data.purnaKhopLayeko || data.jeAfterTwelveMonth) {
      props.onModalSubmit(data);
    } else {
      AddAlertMessage({ type: "error", message: "खोप रेजिष्टरमा रेकर्ड थप्न, बच्चालाई कम्तिमा एउटा खोप दिनै पर्छ।" });
    }
  }

  return (
    <CustomModal
      title={props.title}
      maxWidth="lg"
      showModal={props.showKhopSewaModal}
      onModalSubmit={handleSubmit(onSubmit)}
      onModalClose={handleModalClose}
    >
      <Box className={classes.generalInfo}>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="बच्चाको नाम"
              name="patientFirstName"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              defaultValue={props.modalDefaultValues.patientFirstName}
              size="small"
              fullWidth
            />
            {errors.patientFirstName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              label="बच्चाको थर"
              name="patientLastName"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              defaultValue={props.modalDefaultValues.patientLastName}
              size="small"
              fullWidth
            />
            {errors.patientLastName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomSelect
              name="casteCode"
              variant="outlined"
              label="जाति कोड"
              options={CASTE_CODES}
              onChange={handleJatiCodeOnChange}
              value={props.modalDefaultValues.casteCode}
              size="small"
              fullWidth
            />
            {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="लिङ्ग"
              name="gender"
              options={GENDER_OPTIONS}
              onChange={handleGenderChange}
              variant="outlined"
              inputRef={register}
              value={props.modalDefaultValues.gender}
              size="small"
              fullWidth
            />
            {errors.gender && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="बच्चा जन्मेको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  placeholder="बच्चा जन्मेको मिति"
                  name="dateOfBirth"
                  variant="outlined"
                  onDateSelect={(date) => { handleDOBSelect(date) }}
                  defaultDate={props.modalDefaultValues.dateOfBirth}
                  size="small"
                  fullWidth
                  hideLabel
                />
                {errors.dateOfBirth && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="उमेर"
              name="age"
              type="number"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              defaultValue={props.modalDefaultValues.age}
              size="small"
              fullWidth
            />
            {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="उमेर वर्ष वा महिना"
              name="ageUnit"
              size="small"
              value={props.modalDefaultValues.ageUnit || "YEAR"}
              variant="outlined"
              options={AGE_UNITS}
              onChange={handleAgeUnitChange.bind(this)}
              disabledOptionSelectable
              fullWidth
            />
            {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              label="आमा/वुवाको नाम,थर"
              name="parentFullName"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              defaultValue={props.modalDefaultValues.parentFullName}
              size="small"
              fullWidth
            />
            {errors.parentFullName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Select
              className="select-sm"
              classNamePrefix="react-select"
              value={districtLabel}
              onChange={handleDistrictChange}
              placeholder="जिल्ला"
              options={districtOptions}
              name="district"
              isClearable
            />
            {errors.district && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Select
              className="select-sm"
              classNamePrefix="react-select"
              name="palikaName"
              placeholder="नगर/गाउँपालिका"
              options={palikaOptions}
              value={palikaNameLabel}
              onChange={handlePalikaNameChange}
              isDisabled={!hasDistrictSelected}
              isClearable
            />
            {errors.palikaName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="वडा नं."
              name="wardNumber"
              variant="outlined"
              inputRef={register({
                required: true,
                min: 1
              })}
              defaultValue={props.modalDefaultValues.wardNumber}
              size="small"
              fullWidth
            />
            {errors.wardNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.wardNumber && errors.wardNumber.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              label="गाँउ/टोल"
              name="gaunOrTole"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              defaultValue={props.modalDefaultValues.gaunOrTole}
              size="small"
              fullWidth
            />
            {errors.gaunOrTole && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              label="सम्पर्क फोन नं."
              name="phoneNumber"
              variant="outlined"
              inputRef={register}
              defaultValue={props.modalDefaultValues.phoneNumber}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <Tooltip title="बच्चालाई बि.सि.जि खोप दिएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  placeholder="बि.सि.जि खोप दिएको मिति"
                  name="bcgDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleBcgDateSelect(date) }}
                  defaultDate={props.modalDefaultValues.bcgDate}
                  size="small"
                  fullWidth
                  hideLabel
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </Box>
      <Box className={classes.dpdKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">डी.पी.टी./हेप बी/हिब (पहिलो, दोस्रो, तेस्रो)</Typography>
          <Tooltip title="बच्चालार्ई डी.पी.टी./हेप बी/हिब खोपको पहिलो, दोस्रो वा तेस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <NepaliDate
              name="dptHepBFirstTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.dptHepBFirstTime}
              onDateSelect={(date) => { handleDPTHepaFirstTimeDateSelect(date) }}
              labelText="पहिलो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="dptHepBSecondTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.dptHepBSecondTime}
              onDateSelect={(date) => { handleDPTHepaSecondTimeDateSelect(date) }}
              labelText="दोस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="dptHepBThirdTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.dptHepBThirdTime}
              onDateSelect={(date) => { handleDPTHepaThirdTimeDateSelect(date) }}
              labelText="तेस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.polioKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">पोलियो(OPV) (पहिलो, दोस्रो, तेस्रो)</Typography>
          <Tooltip title="बच्चालार्ई पोलियो खोपको पहिलो, दोस्रो वा तेस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <NepaliDate
              name="polioFirstTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.polioFirstTime}
              onDateSelect={(date) => { handlePolioFirstTimeDateSelect(date) }}
              labelText="पहिलो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="polioSecondTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.polioSecondTime}
              onDateSelect={(date) => { handlePolioSecondTimeDateSelect(date) }}
              labelText="दोस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="polioThirdTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.polioThirdTime}
              onDateSelect={(date) => { handlePolioThirdTimeDateSelect(date) }}
              labelText="तेस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.pcvKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">पि.सि.भि.(PCV)(पहिलो, दोस्रो, तेस्रो)</Typography>
          <Tooltip title="बच्चालार्ई पी.सी.भी. खोपको पहिलो, दोस्रो वा तेस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <NepaliDate
              name="pcvFirstTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.pcvFirstTime}
              onDateSelect={(date) => { handlePcvFirstTimeDateSelect(date) }}
              labelText="पहिलो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="pcvSecondTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.pcvSecondTime}
              onDateSelect={(date) => { handlePcvSecondTimeDateSelect(date) }}
              labelText="दोस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="pcvThirdTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.pcvThirdTime}
              onDateSelect={(date) => { handlePcvThirdTimeDateSelect(date) }}
              labelText="तेस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.rotaKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">रोटा(पहिलो, दोस्रो)</Typography>
          <Tooltip title="बच्चालार्ई रोटा खोपको पहिलो वा दोस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <NepaliDate
              name="rotaFirstTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.rotaFirstTime}
              onDateSelect={(date) => { handleRotaFirstTimeDateSelect(date) }}
              labelText="पहिलो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="rotaSecondTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.rotaSecondTime}
              onDateSelect={(date) => { handleRotaSecondTimeDateSelect(date) }}
              labelText="दोस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.fipvKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">एफ.आई.पि.भि.(FIPV) (पहिलो, दोस्रो)</Typography>
          <Tooltip title="बच्चालार्ई एफ.आई.पि.भि. खोपको पहिलो वा दोस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <NepaliDate
              name="fipvFirstTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.fipvFirstTime}
              onDateSelect={(date) => { handleFipvFirstTimeDateSelect(date) }}
              labelText="पहिलो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
          <Grid item>
            <NepaliDate
              name="fipvSecondTime"
              className="date-picker-form-control full-width"
              defaultDate={props.modalDefaultValues.fipvSecondTime}
              onDateSelect={(date) => { handleFipvSecondTimeDateSelect(date) }}
              labelText="दोस्रो"
              dateLabelClass={classes.labelSmall}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.daduraRubelaKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">दादुरा/रुबेला(पहिलो, दोस्रो)</Typography>
          <Tooltip title="बच्चालार्ई दादुरा/रुबेला खोपको पहिलो वा दोस्रो मात्रा दिएको मिति (साल, महिना, गते) सम्बन्धित ईनपुट बक्स मा लेख्नुपर्दछ।" placement="top" arrow>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </Tooltip>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <Tooltip title="दादुरा/रुबेला खोप ९–११ महिनामा दिएको भए खोप लगाएको मिति चयन गर्नुहोस्।" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="daduraRubelaNineToElevenMonth"
                  className="date-picker-form-control full-width"
                  defaultDate={props.modalDefaultValues.daduraRubelaNineToElevenMonth}
                  onDateSelect={(date) => { handleDaduraRubela9To11MonthDateSelect(date) }}
                  labelText="पहिलो (९ म)"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="१५ महिनाका बच्चालार्ई दादुरा/रुबेला दोस्रो मात्रा लगाएको मिति चयन गर्नुहोस्।" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="daduraRubelaAfterTwelveMonth"
                  className="date-picker-form-control full-width"
                  defaultDate={props.modalDefaultValues.daduraRubelaAfterTwelveMonth}
                  onDateSelect={(date) => { handleDaduraRubelaAfter12MonthDateSelect(date) }}
                  labelText="दोस्रो (१५ म)"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.otherKhopDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">अन्य खोप सम्बन्धी विवरण</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item>
            <Tooltip title="१२ महिनाका बच्चाहरूलार्ई जापानीज इन्सेफिलाइटिसको खोप लगाएको मिति चयन गर्नुहोस्।" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="jeAfterTwelveMonth"
                  className="date-picker-form-control full-width"
                  defaultDate={props.modalDefaultValues.jeAfterTwelveMonth}
                  onDateSelect={(date) => { handleJeAfter12MonthDateSelect(date) }}
                  labelText="जे.ई. (१२ महिना)"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="पूर्णखोप भन्नाले १५ महिना सम्मका बच्चाले लगाउनुपर्ने सम्पूर्ण खोपहरू (बी. सी. जी. १ मात्रा, डी.पी.टी./हेप.बी./हिब, पोलियो र पी.सी.भी. ३ मात्रा, एफ.आई.पि.भि २ मात्रा (लागु भएपछि), जे.इ. १ मात्रा र दादुरा–रुबेला २ मात्रा) पूरा भएपछिलाई जनाउँछ । यस ईनपुट बक्स मा पुरा गरेको अन्तिम खोपको मिति (साल, महिना, गते) लेख्नुपर्दछ । यदि कुनै वालवालिकाले जे.ई र दादुरा रुवेलाको दोश्रो मात्रा १५ महिना पछाडी २३ महिनाभित्र पूरा गरेमा अन्तिम खोप लगाएको मिति (साल, महिना, गते) चयन गर्नुहोस्।" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="purnaKhopLayeko"
                  className="date-picker-form-control full-width"
                  defaultDate={props.modalDefaultValues.purnaKhopLayeko}
                  onDateSelect={(date) => { handlePurnaKhopDateSelect(date) }}
                  labelText="पूर्ण खोप लगाएको मिति"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="बच्चा १२ महिना पूरा भइसकेपछि डी.पी.टी./हेप बी/हिब खोपको तेस्रो मात्रा दिएको भए खोप दिएको मिति (साल, महिना, गते) चयन गर्नुहोस्।" placement="top" arrow>
              <Box>
                <NepaliDate
                  name="dptHepaPolioAfter12Month"
                  className="date-picker-form-control full-width"
                  defaultDate={props.modalDefaultValues.dptHepaPolioAfter12Month}
                  onDateSelect={(date) => { handleDPTHepaPolioAfter12Month(date) }}
                  labelText="१२ महिना पछि डि.पि.टि./हेप बि/हिब पोलियो ३ मात्रा पूरा गरेको"
                  dateLabelClass={classes.labelSmall}
                />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
}
