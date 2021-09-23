import { Box, Collapse, IconButton, TableCell, TableRow, Typography, Grid } from "@material-ui/core";
import { Check as CheckIcon, Close as CloseIcon, KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React, { useState } from 'react';
import { AppMisc } from "../../../../../misc/appMisc";
import { DateUtils } from "../../../../../utils/dateUtils";
import { AppUtils } from "../../../../../utils/appUtils";
import styles from "./style";
import { KUSTHAROG_SPECIMEN_TYPES } from "../../../../../utils/constants/forms";

export default function CustomRow({ handleUnapprovedStatusChange, handleApprovedStatusChange, ...props }) {
  const classes = styles();
  const row = props.rowData;
  const [open, setOpen] = useState(false);

  function getKustharogSpecimenTypeLabel(specimenType) {
    return specimenType ? KUSTHAROG_SPECIMEN_TYPES.find(obj => obj.value === specimenType).label : "";
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
          <IconButton className={classes.tick} edge="end" aria-label="approved" onClick={() => handleApprovedStatusChange(row.id)}>
            <CheckIcon />
          </IconButton>
          <IconButton color="secondary" edge="end" aria-label="unapproved" onClick={() => handleUnapprovedStatusChange(row.id)}>
            <CloseIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>स्लाइड प्राप्त भएको मिति:-</Typography>
                  <Typography>{row.slideReceivedDate && AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.slideReceivedDate))}</Typography>
                </Box>
              </Grid>
              <Grid item xs>
                <Box display="flex">
                  <Typography>स्लाइड जाचेको मिति:-</Typography>
                  <Typography>{row.slideTestedDate && AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.slideTestedDate))}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>रिपोर्ट बुझाएको मिति:-</Typography>
                  <Typography>{row.testReportSubmittedDate && AppUtils.replaceWithNepaliDigit(DateUtils.getDateFromMilliseconds(row.testReportSubmittedDate))}</Typography>
                </Box>
              </Grid>
              <Grid item xs>
                <Box display="flex">
                  <Typography>EL(L): {getKustharogSpecimenTypeLabel(row.ell)}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>EL(R): {getKustharogSpecimenTypeLabel(row.elr)}</Typography>
                </Box>
              </Grid>
              <Grid item xs>
                <Box display="flex">
                  <Typography>L1: {getKustharogSpecimenTypeLabel(row.l1)}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" className={classes.customRow}>
              <Grid item xs>
                <Box display="flex">
                  <Typography>L2: {getKustharogSpecimenTypeLabel(row.l2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs></Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
