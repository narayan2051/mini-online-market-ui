import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { Print } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from 'react';
import ReactToPrint from "react-to-print";
import HMIS, { API_URL } from '../../../../api/api';
import AddAlertMessage from '../../../../components/alert/Alert';
import { AppMisc } from '../../../../misc/appMisc';
import { AppUtils } from '../../../../utils/appUtils';
import { NO_RECORDS_FOUND, SOMETHING_WENT_WRONG, SUCCESS } from '../../../../utils/constants';
import { DateUtils } from '../../../../utils/dateUtils';
import HealthServiceCardHeader from './helpers/HealthServiceCardHeader';
import KusthaRogCard from './helpers/KusthaRogCard';
import PariwarNiyojanCard from './helpers/PariwarNiyojanCard';
import styles from "./style";

export default function HealthServiceCard() {
  const classes = styles();
  const printComponentRef = useRef();
  const [healthServiceCardTableData, setHealthServiceCardTableData] = useState([]);

  useEffect(() => {
    getHealthServiceCardTableData();
  }, [])

  const getHealthServiceCardTableData = () => {
    HMIS.get(API_URL.healthServiceCard + "?mulDartaaNumber=" + AppUtils.getUrlParam("mulDartaaNumber"))
      .then(response => {
        if (response.data.type === SUCCESS) {
          setHealthServiceCardTableData(response.data.data)
        }
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG })
      })
  }

  return (
    <div>
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
      <Box ref={printComponentRef}>
        <HealthServiceCardHeader tableData={healthServiceCardTableData} />
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">स्वास्थ्य सेवा कार्ड</Typography>
        </Box>
        <TableContainer>
          <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Health Service Card">
            <TableHead classes={{ root: "align-center" }}>
              <TableRow>
                <TableCell>मूल दर्ता नं</TableCell>
                <TableCell>{AppUtils.getUrlParam("mulDartaaNumber")}</TableCell>
                <TableCell>नाम, थर</TableCell>
                <TableCell>जातिकोड</TableCell>
                <TableCell>लिङ्ग</TableCell>
                <TableCell>उमेर</TableCell>
              </TableRow>
            </TableHead>
            <TableBody classes={{ root: "align-center" }}>
              <TableRow>
                <TableCell>ORC दर्ता नं.</TableCell>
                <TableCell></TableCell>
                <TableCell>{healthServiceCardTableData.fullName}</TableCell>
                <TableCell>{healthServiceCardTableData?.casteCode && AppMisc.getCasteCodeLabelWithTooltip(healthServiceCardTableData.casteCode)}</TableCell>
                <TableCell>{AppMisc.getGenderLabel(healthServiceCardTableData.gender)}</TableCell>
                <TableCell>{healthServiceCardTableData?.age && AppUtils.replaceWithNepaliDigit(healthServiceCardTableData.age)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box my={3}>
          <TableContainer>
            <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Health Service Card">
              <TableBody classes={{ root: "align-center" }}>
                <TableRow>
                  <TableCell rowSpan={2}>ठेगाना</TableCell>
                  <TableCell>जिल्ला</TableCell>
                  <TableCell>नगर/गाउँ पालिका</TableCell>
                  <TableCell>वडा नम्बर</TableCell>
                  <TableCell>सम्पर्क फोन नं.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{AppMisc.getDistrictName(healthServiceCardTableData.personDistrict)}</TableCell>
                  <TableCell>{AppMisc.getMunicipalityName(healthServiceCardTableData.municipality)}</TableCell>
                  <TableCell>{healthServiceCardTableData.wardNumber}</TableCell>
                  <TableCell>{healthServiceCardTableData.contactNumber || "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TableContainer>
          <Table classes={{ root: "table-bordered normal-spacing" }} size="small" aria-label="Health Service Card">
            <TableHead classes={{ root: "align-center" }}>
              <TableRow>
                <TableCell>मिति</TableCell>
                <TableCell>OPD दर्ता नं.</TableCell>
                <TableCell>सिकायत र निदान</TableCell>
                <TableCell>उपचार र सल्लाह</TableCell>
              </TableRow>
            </TableHead>
            <TableBody classes={{ root: "align-center" }}>
              {healthServiceCardTableData.opdHealthServiceCardDetailList?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} size="medium">{NO_RECORDS_FOUND}</TableCell>
                </TableRow>
              ) : (
                  healthServiceCardTableData.opdHealthServiceCardDetailList?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{(row.date && DateUtils.getDateFromMilliseconds(row.date)) || ""}</TableCell>
                      <TableCell>{row.opdDartaaNumber}</TableCell>
                      <TableCell>{row.complaintsOrDiagnosis}</TableCell>
                      <TableCell>{row.treatmentAndAdvice}</TableCell>
                    </TableRow>
                  )
                  ))}
              <TableRow>
                <TableCell colSpan={4}>हरेक पटक स्वास्थ्य सेवा लिन आउँदा सेवाग्राहीले यो कार्ड अनिवार्य रूपमा लिई आउनुपर्दछ</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <PariwarNiyojanCard />
        <KusthaRogCard />
      </Box>
    </div>
  )
}
