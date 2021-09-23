import { Box, Typography } from "@material-ui/core";
import React from "react";
import governmentLogo from "../../../../../assets/img/nepal-goverment-logo.png";
import { AppMisc } from "../../../../../misc/appMisc";
import styles from "../style";

export default function HealthServiceCardHeader(props) {
  const classes = styles();
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <img src={governmentLogo} alt="Nepal Government HMIS" className={classes.logoWidth}></img>
        </Box>
        <Box textAlign="center">
          <Typography>नेपाल सरकार</Typography>
          <Typography>स्वास्थ्य तथा जनसंख्या मन्त्रालय</Typography>
          <Typography>स्वास्थ्य सेवा विभाग</Typography>
          <Typography variant="h6">स्वास्थ्य व्यवस्थापन सूचना प्रणाली</Typography>
        </Box>
        <Box className={classes.logoWidth}></Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box flexGrow={1}>
          <Box mt={2}>
            <Typography>जिल्ला : <span>{props.tableData?.municipalityDistrict && AppMisc.getDistrictName(props.tableData.municipalityDistrict)}</span></Typography>
          </Box>
        </Box>
        <Box>
          <Box mt={2}>
            <Typography>स्वास्थ्य संस्था को नाम : <span>{props.tableData?.healthClientName}</span></Typography>
          </Box>
        </Box>
        <Box>
        </Box>
      </Box>
    </>
  )
}