import { Box, Grid, TextField, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../../api/api";
import AddAlertMessage from "../../../../../../components/alert/Alert";
import CustomModal from "../../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AppUtils } from "../../../../../../utils/appUtils";
import { ID, REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../../../utils/constants";
import styles from "../../style";

export default function AddVaccineGetAndExpendedModal(props) {
  const classes = styles();
  const { register, handleSubmit, reset, errors } = useForm();

  const handleModalClose = () => {
    reset({});
    props.onModalClose();
  }

  const onSubmit = data => {
    props.onModalSubmit(data);
  };

  return (
    <CustomModal
      title={props.title}
      maxWidth="lg"
      showModal={props.showVaccineGetAndExpendedModal}
      onModalSubmit={handleSubmit(onSubmit)}
      onModalClose={handleModalClose}
    >
      <Box className={classes.vaccineGetExpendedDetails}>
        <Box className={classes.subTitle}>
          <Typography variant="h6">बि.सि.जि (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="bcgReceivedDose"
              defaultValue={props.modalDefaultValues.bcgReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.bcgReceivedDose && errors.bcgReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
              type="number"
              label="खर्च (डोज)"
              name="bcgExpensesDose"
              defaultValue={props.modalDefaultValues.bcgExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="bcgLostDoseOpened"
              defaultValue={props.modalDefaultValues.bcgLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.bcgLostDoseOpened && errors.bcgLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="bcgLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.bcgLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.bcgLostDoseNotOpened && errors.bcgLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">डि.पि.टि./हेप बि/हिब (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="dptHepBHibReceivedDose"
              defaultValue={props.modalDefaultValues.dptHepBHibReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.dptHepBHibReceivedDose && errors.dptHepBHibReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              InputProps={{ readOnly: true }}
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="dptHepBHibExpensesDose"
              defaultValue={props.modalDefaultValues.dptHepBHibExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="dptHepBHibLostDoseOpened"
              defaultValue={props.modalDefaultValues.dptHepBHibLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.dptHepBHibLostDoseOpened && errors.dptHepBHibLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="dptHepBHibLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.dptHepBHibLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.dptHepBHibLostDoseNotOpened && errors.dptHepBHibLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">पोलियो (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="polioReceivedDose"
              defaultValue={props.modalDefaultValues.polioReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.polioReceivedDose && errors.polioReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="polioExpensesDose"
              defaultValue={props.modalDefaultValues.polioExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="polioLostDoseOpened"
              defaultValue={props.modalDefaultValues.polioLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.polioLostDoseOpened && errors.polioLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको गएको (डोज)"
              name="polioLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.polioLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.polioLostDoseNotOpened && errors.polioLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">पि.सि.भि. (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="pcvReceivedDose"
              defaultValue={props.modalDefaultValues.pcvReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.pcvReceivedDose && errors.pcvReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="pcvExpensesDose"
              defaultValue={props.modalDefaultValues.pcvExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="pcvLostDoseOpened"
              defaultValue={props.modalDefaultValues.pcvLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.pcvLostDoseOpened && errors.pcvLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="pcvLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.pcvLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.pcvLostDoseNotOpened && errors.pcvLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">रोटा (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="rotaReceivedDose"
              defaultValue={props.modalDefaultValues.rotaReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.rotaReceivedDose && errors.rotaReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="rotaExpensesDose"
              defaultValue={props.modalDefaultValues.rotaExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="rotaLostDoseOpened"
              defaultValue={props.modalDefaultValues.rotaLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.rotaLostDoseOpened && errors.rotaLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="rotaLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.rotaLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
          </Grid>
          {errors.rotaLostDoseNotOpened && errors.rotaLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">एफ.आई.पि.भि.(FIPV) (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="fipvReceivedDose"
              defaultValue={props.modalDefaultValues.fipvReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.fipvReceivedDose && errors.fipvReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="fipvExpensesDose"
              defaultValue={props.modalDefaultValues.fipvExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="fipvLostDoseOpened"
              defaultValue={props.modalDefaultValues.fipvLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.fipvLostDoseOpened && errors.fipvLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="fipvLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.fipvLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.fipvLostDoseNotOpened && errors.fipvLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">दादुरा/रुबेला (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="daduraRubelaReceivedDose"
              defaultValue={props.modalDefaultValues.daduraRubelaReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.daduraRubelaReceivedDose && errors.daduraRubelaReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="daduraRubelaExpensesDose"
              defaultValue={props.modalDefaultValues.daduraRubelaExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="daduraRubelaLostDoseOpened"
              defaultValue={props.modalDefaultValues.daduraRubelaLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.daduraRubelaLostDoseOpened && errors.daduraRubelaLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="daduraRubelaLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.daduraRubelaLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.daduraRubelaLostDoseNotOpened && errors.daduraRubelaLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">जे.ई. (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="jeReceivedDose"
              defaultValue={props.modalDefaultValues.jeReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.jeReceivedDose && errors.jeReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              InputProps={{ readOnly: true }}
              type="number"
              label="खर्च (डोज)"
              InputLabelProps={{ shrink: true }}
              name="jeExpensesDose"
              defaultValue={props.modalDefaultValues.jeExpensesDose}
              variant="outlined"
              inputRef={register}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="jeLostDoseOpened"
              defaultValue={props.modalDefaultValues.jeLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.jeLostDoseOpened && errors.jeLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="jeLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.jeLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.jeLostDoseNotOpened && errors.jeLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Box className={classes.subTitle}>
          <Typography variant="h6">टी.डी. (प्राप्त, खर्च तथा खेर गएको)</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              type="number"
              label="प्राप्त (डोज)"
              name="tdReceivedDose"
              defaultValue={props.modalDefaultValues.tdReceivedDose}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.tdReceivedDose && errors.tdReceivedDose.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="खोलेको खेर गएको (डोज)"
              name="tdLostDoseOpened"
              defaultValue={props.modalDefaultValues.tdLostDoseOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.tdLostDoseOpened && errors.tdLostDoseOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              type="number"
              label="नखोलेको खेर गएको (डोज)"
              name="tdLostDoseNotOpened"
              defaultValue={props.modalDefaultValues.tdLostDoseNotOpened}
              variant="outlined"
              inputRef={register({
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.tdLostDoseNotOpened && errors.tdLostDoseNotOpened.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
         <Grid item xs>
          </Grid>
        </Grid>
        <Grid container>
          <TextField
            name="remarks"
            label="कैफियत"
            defaultValue={props.modalDefaultValues.remarks}
            variant="outlined"
            inputRef={register}
            size="small"
            fullWidth
            multiline
          />
        </Grid>
      </Box>
    </CustomModal>
  );
}
