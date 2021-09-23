import { Box, Typography } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import HMIS, { API_URL } from "../../../../../../api/api.js";
import AddAlertMessage from "../../../../../../components/alert/Alert.js";
import CustomSelect from "../../../../../../components/custom-select/CustomSelect.js";
import { SOMETHING_WENT_WRONG } from "../../../../../../utils/constants/index.js";
import styles from "../style.js";
import ChildrenBelowTwentyEightDays from "./helpers/ChildrenBelowTwentyEightDays";
import ChildrenFromTwentyEightDaysToFiftyNineMonths from "./helpers/ChildrenFromTwentyEightDaysToFiftyNineMonths";

export default function NewBornChildDeathDetails() {
  const classes = styles();
  const [femaleVolunteersName, setFemaleVolunteersName] = useState([]);
  const [registerVolunteerId, setRegisterVolunteerId] = useState();

  useEffect(() => {
    buildFemaleVolunteerOptions();
  }, []);

  const handleVolunteerNameChange = value => {
    setRegisterVolunteerId(value);
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
    });
  }

  return (
    <div>
      <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          नवजात शिशु मृत्यु विवरण
        </Typography>
        <Box display="flex" alignItems="center" mr={1}>
          <Box className={classes.volunteerSelectContainer}>
            <CustomSelect
              label="महिला स्वास्थ्य स्वयंसेविकाको नाम"
              variant="outlined"
              name="womenVolunteerId"
              options={femaleVolunteersName}
              onChange={handleVolunteerNameChange}
              size="small"
              fullWidth
            />
          </Box>
        </Box>
      </Box>

      <Box className={classes.childrenBelowTwentyEightDays} mb={3}>
        <ChildrenBelowTwentyEightDays volunteersName={femaleVolunteersName} selectedVolunteerId={registerVolunteerId} />
      </Box>
      <Box className={classes.childrenFromTwentyEightDaysToFiftyNineMonths}>
        <ChildrenFromTwentyEightDaysToFiftyNineMonths volunteersName={femaleVolunteersName} selectedVolunteerId={registerVolunteerId} />
      </Box>
    </div>
  )

}