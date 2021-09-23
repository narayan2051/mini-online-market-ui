import { Box, Collapse, Grid, IconButton, TableCell, TableRow, Typography } from "@material-ui/core";
import { Check as CheckIcon, Close as CloseIcon, KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import React, { useEffect, useState } from 'react';
import { AppMisc } from "../../../../../misc/appMisc";
import { AppUtils } from "../../../../../utils/appUtils";
import { MALARIA_TYPE } from "../../../../../utils/constants/forms/index";
import { DateUtils } from "../../../../../utils/dateUtils";
import styles from "../style";

export default function CustomRow({ handleApprovedStatusChange, handleUnapprovedStatusChange, ...props }) {
  const classes = styles();
  const row = props.rowData;
  const [open, setOpen] = useState(false);
  const [showKalaazarReportField, setShowKalaazarReportField] = useState(false);

  useEffect(() => {
    setShowKalaazarReportField(row.registerType === "KALAAZAR");
  }, [row])

  function findMalariaSpeciesType(malariaType) {
    let malariaTypes = [];
    for (let i in malariaType) {
      malariaTypes.push(MALARIA_TYPE.find(obj => obj.value === malariaType[i]).label)
    }
    return malariaTypes.join(", ")
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
              {showKalaazarReportField && (
                <Grid item xs>
                  <Box display="flex">
                    <Typography>कालाजार रिपोर्ट:-</Typography>
                    <Typography>{row.isKalaazarPositive ? "पोजिटिभ" : "नेगेटिभ"}</Typography>
                  </Box>
                </Grid>
              )}
              {!showKalaazarReportField && (
                <Grid item xs>
                  <Box display="flex">
                    <Typography>औलोको जात:-</Typography>
                    <Typography>{row.malariaSpecies && findMalariaSpeciesType(row.malariaSpecies)}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            {!showKalaazarReportField && (
              <Grid container spacing={2} alignItems="center" className={classes.customRow}>
                <Grid item xs>
                  <Box display="flex">
                    <Typography>औलोको अवस्था:-</Typography>
                    <Typography>{row.malariaStage}</Typography>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Box display="flex">
                    <Typography>औलोको घनत्व:-</Typography>
                    <Typography>{row.malariaDensity}</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
