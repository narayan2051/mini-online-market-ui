import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select as MaterialSelect, TextField, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../api/api";
import AddUserModal from "../../../components/add-user/AddUserModal";
import AddAlertMessage from "../../../components/alert/Alert";
import CustomSelect from "../../../components/custom-select/CustomSelect";
import { FISCAL_YEARS, REQUIRED_FIELD, SOMETHING_WENT_WRONG, ZERO_OR_GREATER } from "../../../utils/constants";
import { SERVICES_AVAILABLE } from "../../../utils/constants/forms";
import styles from "./style";

export default function UserSetting() {
  const classes = styles();
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [defaultSetting, setDefaultSetting] = useState({});
  const { register, setValue, handleSubmit, errors, reset } = useForm();
  const [servicesAvailableValue, setServicesAvailableValue] = useState([]);

  const closeOpenAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  const submitAddUserModal = data => {
    HMIS.post(API_URL.user, data)
      .then(response => {
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
        if (response.data.type === "success") {
          closeOpenAddUserModal();
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  useEffect(() => {
    reset(defaultSetting);
    defaultSetting.availableServices && setServicesAvailableValue(defaultSetting.availableServices);
  }, [defaultSetting])

  const drawFiscalYear = () => {
    HMIS.get(API_URL.applicationSetting)
      .then(response => {
        if (response.data !== null) {
          setDefaultSetting(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const onFiscalYearSubmit = data => {
    if (JSON.stringify(defaultSetting) !== "{}") {
      data.id = defaultSetting.id;
    }
    data.availableServices = servicesAvailableValue;

    HMIS.post(API_URL.applicationSetting, data)
      .then(response => {
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleOnFiscalYearChange = currentFiscalYear => {
    setValue("currentFiscalYear", currentFiscalYear);
  };

  const handleAvailableServicesChange = event => {
    let services = event.target.value
    setServicesAvailableValue(services);
  };

  useEffect(() => {
    register({ name: "currentFiscalYear" }, { required: true });
  }, [register])

  useEffect(() => {
    drawFiscalYear();
  }, []);

  return (
    <>
      <Box className={classes.setting}>
        <Box borderBottom={1} mb={3} pb={1}>
          <Typography variant="h6">
            स्वास्थ्य व्यवस्थापन सूचना प्रणाली सेटिङ सम्पादन गर्नुहोस् ।
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onFiscalYearSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs>
              <CustomSelect
                label="आर्थिक वर्ष"
                variant="outlined"
                size="small"
                name="currentFiscalYear"
                disabledOptionSelectable
                options={FISCAL_YEARS}
                onChange={handleOnFiscalYearChange}
                fullWidth
                value={defaultSetting.currentFiscalYear}
              />
              {errors.currentFiscalYear && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
            <Grid item xs>
              <TextField
                label="स्वास्थ्य संस्था कोड"
                type="text"
                size="small"
                variant="outlined"
                name="healthInstitutionCode"
                inputRef={register}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>उपलब्ध सेवाहरु</InputLabel>
                <MaterialSelect
                  multiple
                  value={servicesAvailableValue}
                  onChange={handleAvailableServicesChange}
                  name="availableServices"
                >
                  <MenuItem value="" disabled>कृपया छान्नुहोस </MenuItem>
                  {SERVICES_AVAILABLE.map((option, index) => <MenuItem key={index} value={option.value}>{option.label}</MenuItem>)}
                </MaterialSelect>
              </FormControl>
            </Grid>
          </Grid>
          <Box borderBottom={1} mb={3} pb={1} mt={3}>
            <Typography variant="h6">
              लक्षित संख्याहरू
          </Typography>
          </Box>
          <Grid container spacing={1} alignItems="center" className={classes.row}>
            <Grid item xs>
              <TextField
                label="गाउँघर क्लिनिक संचालन हुनुपर्ने (संख्या)"
                type="number"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                name="gaungharClinicToBeOperated"
                inputRef={register({
                  min: 0
                })}
                fullWidth
              />
              {errors.gaungharClinicToBeOperated && errors.gaungharClinicToBeOperated.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="खोप क्लिनिक संचालन हुनुपर्ने (संख्या)"
                type="number"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                name="khopClinicToBeOperated"
                inputRef={register({
                  min: 0
                })}
                fullWidth
              />
              {errors.khopClinicToBeOperated && errors.khopClinicToBeOperated.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
            <Grid item xs>
              <TextField
                label="म.स्वा.स्व.से. क्लिनिक संचालन हुनुपर्ने (संख्या)"
                type="number"
                size="small"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                name="fchvToBeOperated"
                inputRef={register({
                  min: 0
                })}
                fullWidth
              />
              {errors.fchvToBeOperated && errors.fchvToBeOperated.type === "min" && (<span className="error-message">{ZERO_OR_GREATER}</span>)}
            </Grid>
          </Grid>
          <Box
            item="true"
            textAlign="right"
            borderTop={1}
            pt={2}
            className={classes.btnContainer}
          >
            <Button
              className={classes.resetBtn}
              variant="contained"
              color="secondary"
              type="reset"
            >
              रद्द गर्नुहोस
            </Button>
            <Button variant="contained" color="primary" type="submit">
              सुरक्षित गर्नुहोस
            </Button>
          </Box>
        </form>
        <Box borderBottom={1} mb={3} pb={1} mt={3}>
          <Typography variant="h6">
            नयाँ प्रयोगकर्ता थप गर्नुहोस्।
          </Typography>
        </Box>
        <Box textAlign="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => {
            setOpenAddUserModal(true);
          }}>नयाँ प्रयोगकर्ता थप गर्नुहोस्</Button>
        </Box>
      </Box>
      <AddUserModal showAddUserModal={openAddUserModal} handleAddUserModalClose={closeOpenAddUserModal} onSubmit={submitAddUserModal.bind(this)} defaultValues={defaultSetting} />
    </>
  );
}
