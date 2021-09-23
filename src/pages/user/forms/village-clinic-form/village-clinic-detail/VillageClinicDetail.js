import React, { useState, useEffect } from 'react';
import VillageClinicRegistration from "../registration-register/VillageClinicRegistration";
import ChildrenBelowTwoMonths from "../children-disease-management/ChildrenBelowTwoMonths";
import ChildrenTwoMonthsAndAbove from "../children-disease-management/ChildrenTwoMonthsAndAbove";
import ChildDevelopmentServiceBelowTwoYears from "../children-disease-management/ChildDevelopmentServiceBelowTwoYears";
import SurakshitMatrittoSewa from "../surakshit-matritto-sewa/SurakshitMatrittoSewa";
import PariwaarNiyojanSewa from "../pariwaar-niyojan-sewa/PariwaarNiyojanSewa";
import PrathaamikUpacharSewa from "../prathaamik-upachar-sewa/PrathaamikUpacharSewa";
import HMIS, { API_URL } from "../../../../../api/api";
import { AppUtils } from "../../../../../utils/appUtils";
import { HTTP_STATUS_CODES, SOMETHING_WENT_WRONG, ID } from "../../../../../utils/constants";
import AddAlertMessage from "../../../../../components/alert/Alert";
import { Box } from "@material-ui/core";
import HealthEducationAndCounselingService from "../health-education-and-counseling-service/HealthEducationAndCounselingService";
import OtherDetails from "../other-details/OtherDetails";

export default function VillageClinicDetail() {
  const [villageClinicGeneralInfo, setVillageClinicGeneralInfo] = useState({});
  const [attachDartaaNumber, setAttachDartaaNumber] = useState(false);
  const getVillageClinicGeneralInfo = () => {
    HMIS.get(API_URL.villageClinicEntry + "/" + AppUtils.getUrlParam(ID))
      .then(response => {
        if (response.status === HTTP_STATUS_CODES.OK) {
          setVillageClinicGeneralInfo(response.data);
        }
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }
  useEffect(() => {
    getVillageClinicGeneralInfo();
  }, []);

  return (
    <div>
      <Box mb={3}>
        <VillageClinicRegistration
          villageClinicInfo={villageClinicGeneralInfo}
          attachDartaaNumber={(value) => setAttachDartaaNumber(value)}
          villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate}
        />
      </Box>
      <Box mb={3}>
        <ChildrenBelowTwoMonths attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <ChildrenTwoMonthsAndAbove attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <ChildDevelopmentServiceBelowTwoYears attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <SurakshitMatrittoSewa attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <PariwaarNiyojanSewa attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <PrathaamikUpacharSewa attachDartaaNumber={attachDartaaNumber} afterAttachDartaaNumber={(value) => setAttachDartaaNumber(value)} villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <HealthEducationAndCounselingService villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
      <Box mb={3}>
        <OtherDetails villageClinicServiceDate={villageClinicGeneralInfo.villageClinicServiceDate} />
      </Box>
    </div>
  );

}