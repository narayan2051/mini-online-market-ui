import React, { useState } from 'react';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography, Grid } from "@material-ui/core";
import { Check as CheckIcon, Close as CloseIcon, KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import styles from "./style";
import { AppMisc } from '../../../../../../misc/appMisc';
import { AppUtils } from '../../../../../../utils/appUtils';
import { DateUtils } from '../../../../../../utils/dateUtils';
import { SMEAR_LAB_RESULT_OPTIONS } from '../../../../../../utils/constants/forms';

export default function CustomRow({ handleUnapprovedStatusChange, handleApprovedStatusChange, ...props }) {
  const classes = styles();
  const row = props.rowData;
  const [open, setOpen] = useState(false);

  function getSampleTestLabel(sampleTestResult) {
    return sampleTestResult ? SMEAR_LAB_RESULT_OPTIONS.find(obj => obj.value === sampleTestResult).label : "-"
  }

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.patientFirstName + " " + row.patientLastName}</TableCell>
        <TableCell>{row.age + " " + AppMisc.getAgeUnitLabel(row.ageUnit)}</TableCell>
        <TableCell>{AppMisc.getGenderLabel(row.gender)}</TableCell>
        <TableCell>
          <IconButton className={classes.tick} edge="end" aria-label="approved" onClick={() => handleApprovedStatusChange(row.id, true)}>
            <CheckIcon />
          </IconButton>
          <IconButton color="secondary" edge="end" aria-label="unapproved" onClick={() => handleUnapprovedStatusChange(row.id, false)}>
            <CloseIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.tableCell} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>नमूना परीक्षण मिति:-</Typography>
                  <Typography>{row.sampleTestDate && AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.sampleTestDate))}</Typography>
                </Box>
              </Grid>
              <Grid item xs>
                <Box display="flex">
                  <Typography>Sputum संकलित मिति:-</Typography>
                  <Typography>{row.sputumCollectionDate && AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.sputumCollectionDate))}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>उपचार केन्द्र:-</Typography>
                  <Typography>{row.requestingTreatmentCenter}</Typography>
                </Box>
              </Grid>
              <Grid item xs>
                <Box display="flex">
                  <Typography>नमूना परीक्षण (पहिलो ):-</Typography>
                  <Typography>{row.firstSampleTestResult && getSampleTestLabel(row.firstSampleTestResult)}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>नमूना परीक्षण (दोस्रो):-</Typography>
                  <Typography>{row.secondSampleTestResult && getSampleTestLabel(row.secondSampleTestResult)}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
