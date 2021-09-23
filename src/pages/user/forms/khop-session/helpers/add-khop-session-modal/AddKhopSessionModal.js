import { Box, Grid, TextField, Tooltip } from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomSelect from "../../../../../../components/custom-select/CustomSelect";
import CustomModal from "../../../../../../components/modal/CustomModal";
import NepaliDate from "../../../../../../components/nepali-datepicker/NepaliDatePicker";
import { REQUIRED_FIELD } from "../../../../../../utils/constants";
import { DateUtils } from "../../../../../../utils/dateUtils";

export default function AddKhopSessionModal(props) {
  const { register, handleSubmit, setValue, errors, reset } = useForm();

  useEffect(() => {
    register({ name: "khopSessionDate" });
    register({ name: "khopKendraId" }, { required: true });
  }, [register]);

  const handleKhopKendraChange = khopKendra => {
    setValue("khopKendraId", khopKendra);
  };

  const handleKhopSessionDateChange = date => {
    setValue("khopSessionDate", date);
  }

  const handleModalClose = () => {
    reset();
    props.onModalClose();
  }

  return (
    <CustomModal
      title={props.title}
      maxWidth="md"
      showModal={props.showAddKhopSessionModal}
      onModalSubmit={handleSubmit(props.onModalSubmit)}
      onModalClose={handleModalClose}
    >
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <CustomSelect
              name="khopKendraId"
              label="खोप केन्द्रको नाम"
              variant="outlined"
              value={props.modalDefaultValues.khopKendraId}
              options={props.khopKendraOptions}
              onChange={handleKhopKendraChange}
              fullWidth
            />
            {errors.khopKendraId && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <Tooltip title="खोप सेसन संचालन हुने मिति" placement="top" arrow>
              <Box>
                <NepaliDate
                  className="date-picker-form-control input-md full-width"
                  name="khopSessionDate"
                  variant="outlined"
                  onDateSelect={(date) => { handleKhopSessionDateChange(date) }}
                  defaultDate={props.modalDefaultValues.khopSessionDate ? DateUtils.getDateFromMilliseconds(props.modalDefaultValues.khopSessionDate) : true}
                  hideLabel
                />
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <TextField
              type="time"
              label="खोप सेसन संचालन हुने समय"
              defaultValue={props.modalDefaultValues.khopSessionTime}
              name="khopSessionTime"
              variant="outlined"
              inputRef={register({
                required: true
              })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            {errors.khopSessionTime && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
}
