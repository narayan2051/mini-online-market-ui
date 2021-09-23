import { FormControlLabel, Grid, Switch, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ENTER_VALID_EMAIL, REQUIRED_FIELD } from "../../utils/constants";
import CustomSelect from "../custom-select/CustomSelect";
import CustomModal from "../modal/CustomModal";
import styles from "./style";

export default function AddUserModal({ showAddUserModal, handleAddUserModalClose, onSubmit, ...props }) {
  const classes = styles();
  const { register, setValue, handleSubmit, errors, reset } = useForm();
  const [activeStatus, setActiveStatus] = useState(true);

  useEffect(() => {
    register({ name: "role" }, { required: props.userRoles });
  }, [register, props.userRoles]);

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  };

  const handleStatusChange = (event) => {
    setActiveStatus(event.target.checked);
  };

  function closeAddUserModal() {
    reset();
    setActiveStatus(true);
    handleAddUserModalClose();
  }

  useEffect(() => {
    reset(props.defaultValues);
    typeof props.defaultValues?.active === "boolean" && setActiveStatus(props.defaultValues.active);
  }, [props.defaultValues, reset]);

  return (
    <>
      <CustomModal
        title="नयाँ प्रयोगकर्ता थप्नुहोस्"
        onModalSubmit={handleSubmit(onSubmit)}
        showModal={showAddUserModal}
        onModalClose={closeAddUserModal}
      >
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs>
            <TextField
              fullWidth
              required
              label="User Full Name"
              type="text"
              variant="outlined"
              size="small"
              name="fullName"
              defaultValue={props.defaultValues.fullName}
              inputRef={register({
                required: true
              })}
            />
            {errors.fullName && <span className="error-message">{REQUIRED_FIELD}</span>}
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              required
              label="User Email"
              type="email"
              size="small"
              variant="outlined"
              name="userEmail"
              defaultValue={props.defaultValues.userEmail}
              inputRef={register({
                required: true,
                pattern: /\S+@\S+\.\S+/
              })}
            />
            {errors.userEmail && errors.userEmail.type === "required" && <span className="error-message">{REQUIRED_FIELD}</span>}
            {errors.userEmail && errors.userEmail.type === "pattern" && <span className="error-message">{ENTER_VALID_EMAIL}</span>}
          </Grid>
          {
            props.userRoles &&
            <Grid item xs>
              <CustomSelect
                label="प्रयोगकर्ताको भूमिका"
                size="small"
                name="role"
                variant="outlined"
                options={props.userRoles}
                value={props.defaultValues.role}
                onChange={handleCustomSelectChange}
                disabledOptionSelectable
                fullWidth
              />
              {errors.role && <span className="error-message">{REQUIRED_FIELD}</span>}
            </Grid>
          }
        </Grid>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs>
            <FormControlLabel
              inputRef={register}
              control={
                <Switch
                  checked={activeStatus}
                  color="primary"
                  name="active"
                  onChange={handleStatusChange}
                />
              }
              label="सक्रिय / निष्क्रिय"
              classes={{
                label: classes.switchLabelSmall,
              }}
            />
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};