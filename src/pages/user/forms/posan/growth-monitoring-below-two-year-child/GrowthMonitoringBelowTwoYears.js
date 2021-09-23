import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, IconButton } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import HMIS, { API_URL } from "../../../../../api/api";
import AlertMessage from "../../../../../components/alert/Alert";
import NepaliDate from "../../../../../components/nepali-datepicker/NepaliDatePicker";
import ReactToPrint from "react-to-print";
import { Print } from "@material-ui/icons";
import { NO_RECORDS_FOUND, SOMETHING_WENT_WRONG } from "../../../../../utils/constants";
import { DateUtils } from "../../../../../utils/dateUtils";
import styles from "./style";

export default function GrowthMonitoringBelowTwoYears(props) {
  const classes = styles();
  const printComponentRef = useRef();
  const [registerDate, setRegisterDate] = useState({
    dateFrom: null,
    dateTo: null
  });
  const [monthlyReport, setMonthlyReport] = useState(null);

  const handleFromDateSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        dateFrom: date
      }));
  }

  const handleToDateSelect = (date) => {
    date &&
      setRegisterDate(prev => ({
        ...prev,
        dateTo: date
      }));
  }

  useEffect(() => {
    registerDate.dateFrom && registerDate.dateTo && getReportData();
  }, [registerDate]);

  const getReportData = () => {
    setMonthlyReport(null);
    HMIS.get(API_URL.balbalikaPosanReport + "/monthly-light-weight-children-report?fromDate=" + DateUtils.getDateMilliseconds(registerDate.dateFrom) + "&toDate=" + DateUtils.getDateMilliseconds(registerDate.dateTo)).then(response => {
      buildMonthlyReport(response.data.data);
    }).catch(error => {
      AlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const buildMonthlyReport = data => {
    if (data.monthlyLightWeightChildrenReportList) {
      data = data.monthlyLightWeightChildrenReportList;
      for (let i = 0; i < data.length; i++) {
        data[i].total = data[i].dalitFemaleCount + data[i].dalitMaleCount + data[i].janjatiFemaleCount +
          data[i].janjatiMaleCount + data[i].madhesiFemaleCount + data[i].madhesiMaleCount +
          data[i].muslimFemaleCount + data[i].muslimMaleCount + data[i].brahamanFemaleCount + data[i].brahamanMaleCount +
          data[i].aanyaFemaleCount + data[i].aanyaMaleCount;

        setMonthlyReport(prev => ({
          ...prev,
          [data[i].monthValue]: data[i]
        }));
      }
    }
  }

  return (
    <>
      <Box ref={printComponentRef}>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
          <Typography>बृद्धि अनुगमनमा आएका २ वर्ष मुनिका कम तौल भएका बालबालिकाको जात/जातिगत मासिक विवरण</Typography>
          <Box display="flex" alignItems="center" className="print-none">
            <Box className={classes.dateRangeContainer} display="flex" alignItems="center" mr={1}>
              <Tooltip title="देखी" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control width-sm"
                    onDateSelect={handleFromDateSelect}
                    labelText="देखी"
                    defaultDate={DateUtils.getCurrentMonthFirstAndLastDate().firstDay}
                    hideLabel
                  />
                </Box>
              </Tooltip>
              <Typography variant="subtitle2">देखी</Typography>
              <Tooltip title="सम्म" placement="top" arrow>
                <Box>
                  <NepaliDate
                    className="date-picker-form-control width-sm"
                    onDateSelect={handleToDateSelect}
                    labelText="सम्म"
                    defaultDate={DateUtils.getCurrentMonthFirstAndLastDate().lastDay}
                    hideLabel />
                </Box>
              </Tooltip>
              <Typography variant="subtitle2">सम्म</Typography>
              <ReactToPrint
                trigger={() => (
                  <Box className={classes.printIcon}>
                    <IconButton>
                      <Print />
                    </IconButton>
                  </Box>
                )}
                content={() => printComponentRef.current}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <TableContainer>
            <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="a dense table">
              <TableHead classes={{ root: "align-center" }}>
                <TableRow>
                  <TableCell rowSpan={3}>महिना</TableCell>
                  <TableCell rowSpan={3}>जम्मा</TableCell>
                  <TableCell colSpan={12}>जाति कोड</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>दलित</TableCell>
                  <TableCell colSpan={2}>जनजाती</TableCell>
                  <TableCell colSpan={2}>मधेशी</TableCell>
                  <TableCell colSpan={2}>मुस्लिम</TableCell>
                  <TableCell colSpan={2}>ब्राह्मण / क्षेत्री</TableCell>
                  <TableCell colSpan={2}>अन्य</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                  <TableCell>महिला</TableCell>
                  <TableCell>पुरुष</TableCell>
                </TableRow>
              </TableHead>
              <TableBody classes={{ root: "align-center" }}>
                {
                  monthlyReport ? (
                    <>
                      <TableRow>
                        <TableCell>बैशाख</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["1"] ? monthlyReport["1"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>जेठ</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["2"] ? monthlyReport["2"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>असार</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["3"] ? monthlyReport["3"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>श्रावण</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["4"] ? monthlyReport["4"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>भदौ</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["5"] ? monthlyReport["5"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>आश्विन</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["6"] ? monthlyReport["6"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>कार्तिक</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["7"] ? monthlyReport["7"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>मंसिर</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["8"] ? monthlyReport["8"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>पुष</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["9"] ? monthlyReport["9"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>माघ</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["10"] ? monthlyReport["10"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>फाल्गुन</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["11"] ? monthlyReport["11"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>चैत्र</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].total : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].dalitFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].dalitMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].janjatiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].janjatiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].madhesiFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].madhesiMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].muslimFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].muslimMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].brahamanFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].brahamanMaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].aanyaFemaleCount : "-"}</TableCell>
                        <TableCell>{monthlyReport["12"] ? monthlyReport["12"].aanyaMaleCount : "-"}</TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} align="center" size="medium">{NO_RECORDS_FOUND}</TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  )
}