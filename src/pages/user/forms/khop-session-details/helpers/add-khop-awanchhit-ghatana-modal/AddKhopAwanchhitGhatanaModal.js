import { Box, Grid, InputAdornment, TextField, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import CustomSelect from "../../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppMisc } from "../../../../../../misc/appMisc";
import { CASTE_CODES, GENDER_OPTIONS, REQUIRED_FIELD } from "../../../../../../utils/constants";
import { AEFI_WARGIKARAN_OPTIONS, VACCINE_TYPES } from "../../../../../../utils/constants/forms";
import styles from "../../style";

export default function AddKhopAwanchhitGhatanaModal(props) {
  const classes = styles();
  const { handleSubmit, setValue, register, reset, errors } = useForm();
  const [modalDefaultValues, setModalDefaultValues] = useState(props.modalDefaultValues);
  const [ageUnitLabel, setAgeUnitLabel] = useState("");
  const [khopSewaDartaaOptions, setKhopSewaDartaaOptions] = useState([]);
  const [khopSewaDartaaNumberLabel, setKhopSewaDartaaNumberLabel] = useState();

  const districtOptions = AppMisc.getDistrictOptions();

  useEffect(() => {
    register({ name: "aefiEntryDate" }, { required: true });
    register({ name: "gender" });
    register({ name: "casteCode" });
    register({ name: "ageUnit" });
    register({ name: "district" });
    register({ name: "vaccineName" }, { required: true });
    register({ name: "wargikaran" });
    register({ name: "khopSewaDartaaNumber" }, { required: true });
    register({ name: "khopLagayekoDate" }, { required: true });
    register({ name: "symptomStartDate" }, { required: true });
  }, [register]);

  useEffect(() => {
    props.khopSewaList.length &&
      buildKhopSewaDartaaOptions(props.khopSewaList);
  }, [props.khopSewaList]);

  useEffect(() => {
    if (JSON.stringify(props.modalDefaultValues) !== "{}") {
      setModalDefaultValues(props.modalDefaultValues);
      setValue("khopSewaDartaaNumber", props.modalDefaultValues.khopSewaDartaaNumber);
      setKhopSewaDartaaNumberLabel(khopSewaDartaaOptions.find(option => option.value === props.modalDefaultValues.khopSewaDartaaNumber));
    }
  }, [props.modalDefaultValues]);

  const updatePatientDetails = (patientDetails) => {
    patientDetails.palikaName && setValue("palikaName", AppMisc.getMunicipalityName(patientDetails.palikaName));
    setAgeUnitLabel(AppMisc.getAgeUnitLabel(patientDetails.ageUnit));
    patientDetails.sewaDartaaNumber && setKhopSewaDartaaNumberLabel(khopSewaDartaaOptions.find(option => option.value === patientDetails.sewaDartaaNumber));
    setValue("khopSewaDartaaNumber", patientDetails.sewaDartaaNumber);
    setValue("patientFirstName", patientDetails.patientFirstName);
    setValue("patientLastName", patientDetails.patientLastName);
    setValue("age", patientDetails.age);
    setValue("ageUnit", patientDetails.ageUnit);
    setValue("wardNumber", patientDetails.wardNumber);
    setValue("gaunOrTole", patientDetails.gaunOrTole);
    setValue("phoneNumber", patientDetails.phoneNumber);

    setModalDefaultValues(prev => ({
      ...prev,
      casteCode: patientDetails.casteCode,
      gender: patientDetails.gender,
      district: patientDetails.district,
    }));
  }

  const handleKhopSewaDartaaNumberChange = dartaaNumberOption => {
    updatePatientDetails(props.khopSewaList.find(obj => obj.sewaDartaaNumber === dartaaNumberOption.value));
  };

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const handleKhopLagayekoDateChange = date => {
    setValue("khopLagayekoDate", date)
  }

  const handleSymptomStartDateChange = date => {
    setValue("symptomStartDate", date)
  }
  const handleAefiDateSelect = date => {
    setValue("aefiEntryDate", date);
  }

  const buildKhopSewaDartaaOptions = data => {
    var khopSewaDartaaOptionsArray = [];
    for (let i = 0; i < data.length; i++) {
      let option = {
        value: data[i].sewaDartaaNumber,
        label: data[i].sewaDartaaNumber + " (" + data[i].patientFirstName + " " + data[i].patientLastName + ") "
      };
      khopSewaDartaaOptionsArray.push(option);
    }
    setKhopSewaDartaaOptions(khopSewaDartaaOptionsArray);
  };

  const handleModalClose = () => {
    reset();
    setModalDefaultValues({});
    props.onModalClose();
    setAgeUnitLabel("");
    setKhopSewaDartaaNumberLabel("");
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    props.onModalSubmit(data);
  };

  return (
    <CustomModal
      title={props.title}
      maxWidth="lg"
      showModal={props.showKhopAwanchhitGhatanaModal}
      onModalSubmit={handleSubmit(onSubmit)}
      onModalClose={handleModalClose}
    >
      <Box className={classes.khopAwanchhitGhatanaChildDetails}>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="AEFI दर्ता भएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  placeholder="AEFI दर्ता भएको मिति"
                  name="aefiEntryDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleAefiDateSelect(date) }}
                  defaultDate={modalDefaultValues.aefiEntryDate}
                  size="small"
                  fullWidth
                  hideLabel
                />
                {errors.aefiEntryDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <Select
              className="select-sm"
              classNamePrefix="react-select"
              size="small"
              placeholder="खोप सेवा दर्ता नं."
              options={khopSewaDartaaOptions}
              value={khopSewaDartaaNumberLabel}
              name="khopSewaDartaaNumber"
              onChange={handleKhopSewaDartaaNumberChange}
            />
            {errors.khopSewaDartaaNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              name="patientFirstName"
              label="बच्चाको नाम"
              defaultValue={modalDefaultValues.patientFirstName}
              variant="outlined"
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              inputRef={register({
                required: true
              })}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="patientLastName"
              label="बच्चाको थर"
              defaultValue={modalDefaultValues.patientLastName}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputRef={register({
                required: true
              })}
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <CustomSelect
              name="gender"
              label="लिङ्ग"
              options={GENDER_OPTIONS}
              onChange={handleCustomSelectChange}
              value={modalDefaultValues.gender}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="age"
              label="उमेर"
              defaultValue={modalDefaultValues.age}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputRef={register}
              InputProps={{
                endAdornment: <InputAdornment position="start">{ageUnitLabel}</InputAdornment>,
                readOnly: true,
              }}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              name="casteCode"
              variant="outlined"
              label="जाति कोड"
              options={CASTE_CODES}
              onChange={handleCustomSelectChange}
              value={modalDefaultValues.casteCode}
              size="small"
              fullWidth
              disabled
            />
            {errors.casteCode && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <CustomSelect
              name="district"
              label="जिल्ला"
              options={districtOptions}
              onChange={handleCustomSelectChange}
              value={modalDefaultValues.district}
              variant="outlined"
              size="small"
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="palikaName"
              placeholder="नगर/गाउँपालिका"
              defaultValue={modalDefaultValues.palikaName}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              inputRef={register}
              size="small"
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              name="wardNumber"
              label="वडा नं."
              defaultValue={modalDefaultValues.wardNumber}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="gaunOrTole"
              InputProps={{ readOnly: true }}
              label="गाँउ/टोल"
              defaultValue={modalDefaultValues.gaunOrTole}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="phoneNumber"
              label="सम्पर्क फोन नं."
              defaultValue={modalDefaultValues.phoneNumber}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">खोप सम्बन्धी विवरण तथा देखिएका लक्षणहरुको विवरण</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              name="vaccineName"
              label="खोपको नाम"
              options={VACCINE_TYPES}
              value={modalDefaultValues.vaccineName}
              onChange={handleCustomSelectChange}
              variant="outlined"
              size="small"
              fullWidth
            />
            {errors.vaccineName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              name="khopBatchNumber"
              label="खोपको ब्याच नं."
              defaultValue={modalDefaultValues.khopBatchNumber}
              variant="outlined"
              inputRef={register({
                required: true,
              })}
              size="small"
              fullWidth
            />
            {errors.khopBatchNumber && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="खोप लगाएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  placeholder="खोप लगाएको मिति"
                  name="khopLagayekoDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleKhopLagayekoDateChange(date) }}
                  defaultDate={modalDefaultValues.khopLagayekoDate}
                  size="small"
                  fullWidth
                  hideLabel
                />
              </Box>
            </Tooltip>
            {errors.khopLagayekoDate && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              type="time"
              name="khopLagayekoTime"
              defaultValue={modalDefaultValues.khopLagayekoTime}
              label="खोप लगाएको समय"
              variant="outlined"
              inputRef={register}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="khopLagayekoSthan"
              label="खोप लगाएको स्थान"
              defaultValue={modalDefaultValues.khopLagayekoSthan}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="लक्षण सुरु भएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  placeholder="लक्षण सुरु भएको मिति"
                  name="symptomStartDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleSymptomStartDateChange(date) }}
                  defaultDate={modalDefaultValues.symptomStartDate}
                  size="small"
                  fullWidth
                  hideLabel
                />
              </Box>
            </Tooltip>
            {errors.symptomStartDate && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              type="time"
              name="symptomStartTime"
              defaultValue={modalDefaultValues.symptomStartTime}
              label="लक्षण सुरु भएको समय"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <Tooltip title="AEFI भई आएका लक्षणहरूका आधारमा सामान्य वा कडा के छ, सो को वर्गीकरण छान्नुहोस।" placement="top" arrow>
              <Box>
                <CustomSelect
                  name="wargikaran"
                  label="वर्गिकरण"
                  options={AEFI_WARGIKARAN_OPTIONS}
                  onChange={handleCustomSelectChange}
                  value={modalDefaultValues.wargikaran}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TextField
              name="symptoms"
              label="देखिएका मुख्य लक्षणहरु"
              placeholder="देखिएका मुख्य लक्षणहरु"
              defaultValue={modalDefaultValues.symptoms}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs>
            <TextField
              name="remarks"
              label="कैफियत"
              defaultValue={modalDefaultValues.remarks}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
}