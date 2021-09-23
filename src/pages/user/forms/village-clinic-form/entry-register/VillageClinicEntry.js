import { Box, Button, Grid, TextField, Tooltip, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import CustomModal from '../../../../../components/modal/CustomModal';
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import { EDIT_SELECTED_RECORD, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../../utils/constants/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import VillageClinicEntryRegister from "../../../components/registers/village-clinic-register/village-clinic-entry-register/VillageClinicEntryRegister";
import styles from "./style";

export default function VillageClinicEntry() {
  const classes = styles();
  const [modalTitle, setModalTitle] = useState("गाउँघर क्लिनिक रजिस्टरमा नयाँ रेकर्ड थप्नुहोस् ।");
  const [mainRegisterData, setMainRegisterData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [clinicServiceHeaderDate, setClinicServiceHeaderDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [modalDefaultValues, setModalDefaultValues] = useState({});

  const handleRegisterDateFromSelect = date => {
    date &&
      setClinicServiceHeaderDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleRegisterDateToSelect = (date) => {
    date &&
      setClinicServiceHeaderDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  const closeModal = () => {
    setModalDefaultValues({});
    reset();
    setOpenModal(false);
  }

  const handleServiceDateChange = date => {
    setValue("villageClinicServiceDate", date);
  }

  const onSubmit = data => {
    data.id = modalDefaultValues.id;
    data.villageClinicServiceDate = DateUtils.getDateMilliseconds(data.villageClinicServiceDate);
    HMIS.post(API_URL.villageClinicEntry, data)
      .then(response => {
        if (response.data.type === "success") {
          closeModal();
          clinicServiceHeaderDate.dateFrom &&
            clinicServiceHeaderDate.dateTo &&
            getVillageClinicEntryList();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const editFunction = id => {
    HMIS.get(API_URL.villageClinicEntry + "/" + id)
      .then(response => {
        response.data.villageClinicServiceDate = DateUtils.getDateFromMilliseconds(response.data.villageClinicServiceDate);
        setModalDefaultValues(response.data);
        setOpenModal(true);
        setModalTitle(EDIT_SELECTED_RECORD);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  const getVillageClinicEntryList = () => {
    HMIS.get(API_URL.villageClinicEntry + "?dateFrom=" + DateUtils.getDateMilliseconds(clinicServiceHeaderDate.dateFrom) + "&&dateTo=" + DateUtils.getDateMilliseconds(clinicServiceHeaderDate.dateTo))
      .then(response => {
        setMainRegisterData(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      })
  }

  useEffect(() => {
    register({ name: "villageClinicServiceDate" }, { required: true });
  }, [register])

  useEffect(() => {
    clinicServiceHeaderDate.dateFrom && clinicServiceHeaderDate.dateTo &&
      getVillageClinicEntryList();
  }, [clinicServiceHeaderDate]);

  useEffect(() => {
    JSON.stringify(modalDefaultValues) !== "{}"
      && setOpenModal(true)
  }, [modalDefaultValues]);

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          गाउँघर क्लिनिकहरु
        </Typography>
        <Box display="flex" alignItems="center">
          <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
            <Tooltip title="गाउँघर क्लिनिक सन्चालन भएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterDateFromSelect(date) }} labelText="गाउँघर क्लिनिक सन्चालन भएको मिति" defaultDate={DateUtils.getStartDateOfCurrentFiscalYear()} hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">देखी</Typography>
            <Tooltip title="गाउँघर क्लिनिक सन्चालन भएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate className="date-picker-form-control width-sm" onDateSelect={(date) => { handleRegisterDateToSelect(date) }} labelText="गाउँघर क्लिनिक सन्चालन भएको मिति" defaultDate hideLabel />
              </Box>
            </Tooltip>
            <Typography variant="subtitle2">सम्म</Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setOpenModal(true) }}>नयाँ गाउँघर क्लिनिक थप्नुहोस्</Button>
        </Box>
      </Box>
      <CustomModal
        title={modalTitle}
        showModal={openModal}
        onModalSubmit={handleSubmit(onSubmit)}
        onModalClose={closeModal}
        maxWidth="lg"
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <TextField
              label="गाउँघर क्लिनिकको नाम"
              defaultValue={modalDefaultValues.villageClinicName}
              type="text"
              size="small"
              variant="outlined"
              name="villageClinicName"
              inputRef={register({
                required: true
              })}
              fullWidth
            />
            {errors.villageClinicName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="गाउँघर क्लिनिक सन्चालन भएको मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-sm full-width"
                  name="villageClinicServiceDate"
                  defaultDate={modalDefaultValues.villageClinicServiceDate}
                  onDateSelect={(date) => { handleServiceDateChange(date) }}
                  placeholder="गाउँघर क्लिनिक सन्चालन भएको मिति"
                  hideLabel
                />
                {errors.villageClinicServiceDate && <span className="error-message">{REQUIRED_FIELD}</span>}
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TextField
              label="गाउँघर क्लिनिक सञ्चालन हुने स्थान"
              defaultValue={modalDefaultValues.villageClinicLocation}
              type="text"
              size="small"
              variant="outlined"
              name="villageClinicLocation"
              inputRef={register({
                required: true
              })}
              fullWidth
            />
            {errors.villageClinicLocation && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>

        </Grid>
      </CustomModal>
      <VillageClinicEntryRegister tableData={mainRegisterData} showActionColumn={mainRegisterData.length !== 0} onEditRow={editFunction} />
    </>
  );
}