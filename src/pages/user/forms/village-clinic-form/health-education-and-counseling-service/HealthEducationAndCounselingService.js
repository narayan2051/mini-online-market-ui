import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomModal from "../../../../../components/modal/CustomModal";
import { AppUtils } from "../../../../../utils/appUtils";
import { EDIT_SELECTED_RECORD, ID, REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import HealthEducationAndCounselingServiceRegister from "../../../components/registers/village-clinic-register/health-education-and-counseling-service-register/HealthEducationAndCounselingServiceRegister";
import styles from "./style";

export default function HealthEducationAndCounselingService(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const { register, setValue, errors, handleSubmit, reset } = useForm();
  const [registerData, setRegisterData] = useState([]);
  const [modalTitle, setModalTitle] = useState("स्वास्थ्य शिक्षा तथा परामर्श सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const classes = styles();


  useEffect(() => {
    getRegisterDataFromClinicId();
  }, [register]);

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.communityClinicId = modalDefaultValues.communityClinicId || AppUtils.getUrlParam(ID);
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.healthEducationAndCounselingServiceRegister, data).then(response => {
      if (response.data.type === "success") {
        closeModal();
        getRegisterDataFromClinicId();
      }
      AddAlertMessage({ type: response.data.type, message: response.data.message });
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });

    });
  }

  const handleEditFunction = id => {
    HMIS.get(API_URL.healthEducationAndCounselingServiceRegister + "/" + id).then(response => {
      setModalTitle(EDIT_SELECTED_RECORD);
      setModalDefaultValues(response.data);
      setShowModal(true);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const closeModal = () => {
    reset();
    setModalDefaultValues({});
    setShowModal(false);
    setModalTitle("स्वास्थ्य शिक्षा तथा परामर्श सेवा रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const getRegisterDataFromClinicId = () => {
    HMIS.get(API_URL.healthEducationAndCounselingServiceRegister + "/clinicId/" + AppUtils.getUrlParam(ID))
      .then(response => {
        setRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">स्वास्थ्य शिक्षा तथा परामर्श सेवा </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeModal}
        maxWidth="lg"
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="सेवा लिन आएको मिति: गाउँघर क्लिनिक संचालन भएको मिति नै सेवाग्राहीले सेवा लिन आएको मिति हुने हुनाले यो फिल्ड Disable गरिएको छ।" placement="top" arrow>
              <Box>
                <TextField
                  label="सेवा लिन आएको मिति"
                  size="small"
                  name="dartaaMiti"
                  variant="outlined"
                  defaultValue={DateUtils.getDateFromMilliseconds(props.villageClinicServiceDate)}
                  InputProps={{ readOnly: true }}
                  inputRef={register}
                  fullWidth
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <Tooltip title="गाउँघर क्लिनिक सञ्चालन भएको दिन दिइएको स्वास्थ्य शिक्षाको समुदाय वा विद्यालयको नाम लेख्नुपर्दछ । जस्तै: विद्यालयमा दिइन्छ भने विद्यालयको नाम, आमा समूहमा भए आमा समूहको नाम र वडा नं., कुनै जाति समुदायमा गरिएको भए सोही कुरा यसमा उल्लेख गर्नुपर्दछ ।" placement="top" arrow>
              <TextField
                label="स्वास्थ्य शिक्षा दिएको स्थान"
                name="placeOfHealthEducation"
                variant="outlined"
                defaultValue={modalDefaultValues.placeOfHealthEducation}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
              />
            </Tooltip>
            {errors.placeOfHealthEducation && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="स्वास्थ्य शिक्षा दिइएको विषयको नाम यसमा लेख्नुहोस्।" placement="top" arrow>
              <TextField
                label="विषय"
                name="subject"
                variant="outlined"
                defaultValue={modalDefaultValues.subject}
                inputRef={register({
                  required: true
                })}
                size="small"
                fullWidth
                multiline
              />
            </Tooltip>
            {errors.subject && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="स्वास्थ्य शिक्षा दिँदाको सहभागी संख्या लेख्नुहोस्।" placement="top" arrow>
              <TextField
                type="number"
                label="सहभागी संख्या"
                name="participantNumber"
                variant="outlined"
                defaultValue={modalDefaultValues.participantNumber}
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
            </Tooltip>
            {errors.participantNumber && errors.participantNumber.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.participantNumber && errors.participantNumber.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="कैफियत "
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
      </CustomModal>
      <HealthEducationAndCounselingServiceRegister tableData={registerData} onEditRow={handleEditFunction} showActionColumn={registerData.length !== 0} villageClinicServiceDate={props.villageClinicServiceDate} />
    </>)
}