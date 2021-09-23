import { Box, Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import HMIS, { API_URL } from "../../../../../api/api";
import AddAlertMessage from "../../../../../components/alert/Alert";
import { AppUtils } from "../../../../../utils/appUtils";
import { LOGOUT_SUCCESS, REQUIRED_FIELD, SOMETHING_WENT_WRONG } from "../../../../../utils/constants";
import { useUserDispatch } from "../../../../../context/UserContext";
import styles from "../../style";

export default function UserInfo(props) {
  const { register, handleSubmit, errors } = useForm();
  const [defaultValues, setDefaultValues] = useState({});
  const [profileDataRetrieved, setProfileDataRetrieved] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  var userDispatch = useUserDispatch();
  const classes = styles();
  let history = useHistory();

  useEffect(() => {
    drawUserProfile();
  }, []);

  useEffect(() => {
    emailChanged && logout();
  });

  const logout = () => {
    HMIS.post(API_URL.logOut)
      .then(response => {
        let data = response.data;
        if (data.type === "success") {
          AppUtils.removeUserRef();
          userDispatch({ type: LOGOUT_SUCCESS });
          history.push("/");
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const drawUserProfile = () => {
    HMIS.get(API_URL.user)
      .then(response => {
        if (response.data !== null) {
          setDefaultValues(response.data);
          setProfileDataRetrieved(true);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const onSubmit = data => {
    let emailChanged = defaultValues.userEmail !== data.userEmail
    HMIS.post(API_URL.profile, data)
      .then(response => {
        if (response.data.type === "success") {
          setEmailChanged(emailChanged);
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  return (
    profileDataRetrieved && (
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} display="flex">
            <TextField
              label="ईमेल:"
              type="email"
              size="small"
              variant="outlined"
              name="userEmail"
              fullWidth
              inputRef={register}
              defaultValue={defaultValues.userEmail}
            />
            <TextField
              label="पुरा नाम:"
              type="text"
              size="small"
              variant="outlined"
              name="fullName"
              fullWidth
              inputRef={register({
                required: true
              })}
              defaultValue={defaultValues.fullName}
            />
            {errors.fullName && (
              <span className="error-message">{REQUIRED_FIELD}</span>
            )}
          </Box>
          <Box
            item="true"
            textAlign="right"
            borderTop={1}
            borderColor={"grey.500"}
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
      </Box>
    )
  );
}
