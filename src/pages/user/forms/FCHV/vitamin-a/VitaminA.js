import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomSelect from "../../../../../components/custom-select/CustomSelect";
import CustomModal from '../../../../../components/modal/CustomModal';
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { AGE_UNITS } from "../../../../../utils/constants/forms";
import { EDIT_SELECTED_RECORD, REQUIRED_FIELD, SOMETHING_WENT_WRONG, GREATER_THAN_ZERO } from "../../../../../utils/constants/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import VitaminARegister from "../../../components/registers/FCHV/vitamin-a/VitaminARegister";
import styles from "../style";

export default function VitaminA() {
  const classes = styles();
  const { setValue, register, handleSubmit, reset, errors } = useForm();
  const [vitaminARegisterData, setVitaminARegisterData] = useState([]);
  const [showVitaminAModal, setShowVitaminAModal] = useState(false);
  const [modalDefaultValues, setModalDefaultValues] = useState({});
  const [registerVolunteerId, setRegisterVolunteerId] = useState();
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [modalTitle, setModalTitle] = useState("राष्ट्रिय भिटामिन ए कार्यक्रम रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");

  useEffect(() => {
    register({ name: "dartaaMiti" }, { required: true });
    register({ name: "ageUnit" }, { required: true });
    register({ name: "womenVolunteerId" }, { required: true });
    buildFemaleVolunteerOptions();
  }, [register]);

  useEffect(() => {
    registerVolunteerId && getVitaminARegisterData();
  }, [registerVolunteerId]);

  const onSubmit = data => {
    data.dartaaMiti = DateUtils.getDateMilliseconds(data.dartaaMiti);
    data.id = modalDefaultValues.id;
    HMIS.post(API_URL.vitaminA, data)
      .then(response => {
        if (response.data.type === "success") {
          getVitaminARegisterData();
          closeVitaminAModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleEditFunction = (id) => {
    HMIS.get(API_URL.vitaminA + "/" + id)
      .then(response => {
        setModalTitle(EDIT_SELECTED_RECORD);
        response.data.dartaaMiti = DateUtils.getDateFromMilliseconds(response.data.dartaaMiti);
        setModalDefaultValues(response.data);
        setShowVitaminAModal(true);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const closeVitaminAModal = () => {
    reset();
    setModalDefaultValues({});
    setShowVitaminAModal(false);
    setModalTitle("राष्ट्रिय भिटामिन ए कार्यक्रम रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const handleRegisterVolunteerChange = value => {
    setRegisterVolunteerId(value);
  }

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
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
    })
  }

  const handleDartaaMitiChange = date => {
    date &&
      setValue("dartaaMiti", date);
  }

  const getVitaminARegisterData = () => {
    HMIS.get(API_URL.vitaminA + "/womenVolunteerId/" + registerVolunteerId).then(response => {
      setVitaminARegisterData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          राष्ट्रिय भिटामिन ए कार्यक्रम रजिस्टर
        </Typography>
        <Box display="flex" alignItems="center">
          <Box mr={2} className={classes.volunteerSelectContainer}>
            <CustomSelect
              label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
              variant="outlined"
              options={femaleVolunteersName}
              onChange={handleRegisterVolunteerChange.bind(this)}
              size="small"
              className="select-xs"
              disabledOptionSelectable
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => { setShowVitaminAModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={showVitaminAModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeVitaminAModal}
        maxWidth="lg"
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
              variant="outlined"
              name="womenVolunteerId"
              options={femaleVolunteersName}
              onChange={handleCustomSelectChange}
              value={modalDefaultValues.womenVolunteerId || registerVolunteerId}
              size="small"
              fullWidth
            />
            {errors.womenVolunteerId && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="औषधी/क्याप्सुल खुवाएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  name="dartaaMiti"
                  variant="outlined"
                  onDateSelect={(date) => { handleDartaaMitiChange(date) }}
                  defaultDate={modalDefaultValues.dartaaMiti}
                  placeholder="क्याप्सुल खुवाएको मिति"
                  hideLabel
                />
              </Box>
            </Tooltip>
            {errors.dartaaMiti && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="बच्चाको अभिभावकको बोलाउने नाम, थर यसमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                label="अभिभावकको (बोलाउने नाम)"
                name="parentName"
                variant="outlined"
                size="small"
                defaultValue={modalDefaultValues.parentName}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
            </Tooltip>
            {errors.parentName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <Tooltip title="बच्चाको बोलाउने नाम, थर यसमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                label="बच्चाको (बोलाउने नाम)"
                name="patientName"
                variant="outlined"
                size="small"
                defaultValue={modalDefaultValues.patientName}
                inputRef={register({
                  required: true
                })}
                fullWidth
              />
            </Tooltip>
            {errors.patientName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="बच्चाको उमेर पूरा भएको महिनामा यसमा लेख्नुपर्दछ।" placement="top" arrow>
              <TextField
                label="बच्चाको उमेर"
                type="number"
                name="age"
                size="small"
                variant="outlined"
                defaultValue={modalDefaultValues.age}
                inputRef={register({
                  required: true,
                  min: 1
                })}
                fullWidth
              />
            </Tooltip>
            {errors.age && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.age && errors.age.type === "min" && (<span className="error-message">{GREATER_THAN_ZERO}</span>)}
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="उमेर वर्ष वा महिना"
              name="ageUnit"
              size="small"
              value={modalDefaultValues.ageUnit || "YEAR"}
              variant="outlined"
              options={AGE_UNITS}
              onChange={handleCustomSelectChange}
              disabledOptionSelectable
              fullWidth
            />
            {errors.ageUnit && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
      </CustomModal>
      <VitaminARegister tableData={vitaminARegisterData} showActionColumn={vitaminARegisterData.length !== 0} onEditRow={handleEditFunction} />
    </div>
  );
}
