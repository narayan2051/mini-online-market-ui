import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomModal from "../../../../../components/modal/CustomModal";
import { REQUIRED_FIELD, SOMETHING_WENT_WRONG, SUCCESS, ZERO_OR_GREATER } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import OtherDetailsRegister from "../../../components/registers/village-clinic-register/other-details-register/OtherDetailsRegister";
import styles from "./style";

export default function OtherDetails(props) {
  const classes = styles();
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const { register, setValue, errors, handleSubmit, reset } = useForm();

  useEffect(() => {
    getOtherDetails();
  }, []);

  useEffect(() => {
    reset(modalDefaultValues);
  }, [modalDefaultValues])

  useEffect(() => {
  }, [register]);

  const onSubmit = data => {
    if (modalDefaultValues) {
      data.id = modalDefaultValues.id;
    }
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);

    HMIS.post(API_URL.villageClinicOtherDetails, data)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getOtherDetails();
          closeModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getOtherDetails = () => {
    HMIS.get(API_URL.villageClinicOtherDetails)
      .then(response => {
        if (response.data.type === SUCCESS) {
          setTableData(response.data.objectList);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleEditRow = (id) => {
    HMIS.get(API_URL.villageClinicOtherDetails + "/" + id)
      .then(response => {
        if (response.data.type === SUCCESS) {
          setShowModal(true);
          setModalDefaultValues(response.data.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closeModal = () => {
    setShowModal(false);
    setModalDefaultValues({});
  }

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">अन्य विवरण</Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title="अन्य विवरण थप्नुहोस।"
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
            <Tooltip title="उपचारमा नियमित नभएका बिरामीको खोज गरेको संख्या(क्षयरोग)।" placement="top" arrow>
              <TextField
                label="उपचारमा नियमित नभएका बिरामीको संख्या"
                type="number"
                name="irregularTuberculosisTreatmentPatientCount"
                variant="outlined"
                inputRef={register({
                  required: true,
                  min: 0
                })}
                size="small"
                fullWidth
              />
            </Tooltip>
            {errors.irregularTuberculosisTreatmentPatientCount && errors.irregularTuberculosisTreatmentPatientCount.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.irregularTuberculosisTreatmentPatientCount && errors.irregularTuberculosisTreatmentPatientCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
          <Grid item xs>
            <TextField
              label="रक्त नमुना संकलन गरेको संख्या"
              type="number"
              name="bloodSampleCollectedCount"
              variant="outlined"
              inputRef={register({
                required: true,
                min: 0
              })}
              size="small"
              fullWidth
            />
            {errors.bloodSampleCollectedCount && errors.bloodSampleCollectedCount.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.bloodSampleCollectedCount && errors.bloodSampleCollectedCount.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
          </Grid>
        </Grid>
      </CustomModal>
      <OtherDetailsRegister tableData={tableData} defaultValues={modalDefaultValues} showActionColumn={tableData.length !== 0} onEditRow={handleEditRow.bind(this)} villageClinicServiceDate={props.villageClinicServiceDate} />
    </>
  );
}