import { Box, Button, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import { AppMisc } from "../../../../misc/appMisc";
import { AppUtils } from "../../../../utils/appUtils";
import { EDIT_SELECTED_RECORD, ID, SOMETHING_WENT_WRONG, SUCCESS } from "../../../../utils/constants";
import { DateUtils } from "../../../../utils/dateUtils";
import KhopAwanchhitGhatanaRegister from "../../components/registers/khop-awanchhit-ghatana/KhopAwanchhitGhatanaRegister";
import KhopSewaRegister from "../../components/registers/khop-sewa-register/KhopSewaRegister";
import VaccineGetAndExpendedRegister from "../../components/registers/vaccine-get-and-expended-register/VaccineGetAndExpendedRegister";
import AddKhopAwanchhitGhatanaModal from "./helpers/add-khop-awanchhit-ghatana-modal/AddKhopAwanchhitGhatanaModal";
import AddRecordToKhopSewaRegisterModal from "./helpers/add-record-to-khop-sewa-register-modal/AddRecordToKhopSewaRegisterModal";
import AddVaccineGetAndExpendedModal from "./helpers/add-vaccine-get-and-expended-modal/AddVaccineGetAndExpendedModal";
import styles from "./style";
export default function KhopSessionDetails() {
  const classes = styles();
  const [khopSewaRegisterData, setKhopSewaRegisterData] = useState([]);
  const [vaccineGetAndExpendedData, setVaccineGetAndExpendedRegisterData] = useState([]);
  const [khopAwanchhitGhatanaRegisterData, setKhopAwanchhitGhatanaRegisterData] = useState([]);
  const [khopSewaModalDefaultValues, setKhopSewaModalDefaultValues] = useState({});
  const [vaccineGetAndExpendedModalDefaultValues, setVaccineGetAndExpendedModalDefaultValues] = useState({});
  const [khopAwanchhitGhatanaModalDefaultValues, setKhopAwanchhitGhatanaModalDefaultValues] = useState({});
  const [khopSewaList, setKhopSewaList] = useState([]);
  const [showAddKhopSewaModal, setShowAddKhopSewaModal] = useState(false);
  const [khopSewaModalTitle, setKhopSewaModalTitle] = useState("खोप सेवा रजिस्टरमा नयाँ बाल-बालिका रेकर्ड थप्नुहोस्।");
  const [showVaccineGetAndExpendedModal, setShowVaccineGetAndExpendedModal] = useState(false);
  const [vaccineGetAndExpendedModalTitle, setVaccineGetAndExpendedModalTitle] = useState("रजिस्टरमा भ्याक्सिन प्राप्त, खर्च तथा खेर गएको विवरण थप्नुहोस्।");
  const [showKhopAwanchhitGhatanaModal, setShowKhopAwanchhitGhatanaModal] = useState(false);
  const [khopAwanchhitGhatanaModalTitle, setKhopAwanchhitGhatanaModalTitle] = useState("खोप पश्चात हुने अवन्छित घटना रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  const [khopKendraDetails, setKhopKendraDetails] = useState({});
  const [showAddVaccineDetailsButton, setShowAddVaccineDetailsButton] = useState(false);

  useEffect(() => {
    getKhopSewaListByKhopKendraId();
    getVaccineDetailsByKhopKendraId();
    getListOfKhopAwanchhitGhatanaData();
    getKhopKendraData();
  }, [])


  const getKhopSewaListByKhopKendraId = () => {
    HMIS.get(API_URL.khopSewa + "/khop-kendra/" + AppUtils.getUrlParam(ID)).then(response => {
      setKhopSewaList(response.data);
      setKhopSewaRegisterData(response.data)
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  // TODO: Narayan - Is this the API, which returns results we are expecting. If not, change the API url else remove the TODO from here.
  const getVaccineDetailsByKhopKendraId = () => {
    HMIS.get(API_URL.vaccineDetail + "/khop-kendra/" + AppUtils.getUrlParam(ID)).then(response => {
      setShowAddVaccineDetailsButton(response.data.length === 0)
      setVaccineGetAndExpendedRegisterData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  // TODO: Narayan - Change the API URL required to display records.
  const getListOfKhopAwanchhitGhatanaData = () => {
    HMIS.get(API_URL.khopAwanchhitGhatana + "/khop-kendra/" + AppUtils.getUrlParam(ID))
      .then(response => {
        setKhopAwanchhitGhatanaRegisterData(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const getKhopKendraData = () => {
    HMIS.get(API_URL.khopSession + "/khop-kendra-detail/" + AppUtils.getUrlParam(ID))
      .then(response => {
        response.data.type === SUCCESS && setKhopKendraDetails(response.data["data"]);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const khopSewaRecordEditFunction = id => {
    HMIS.get(API_URL.khopSewa + "/" + id)
      .then(response => {
        response.data.dateOfBirth = response.data.dateOfBirth && DateUtils.getDateFromMilliseconds(response.data.dateOfBirth);
        response.data.bcgDate = response.data.bcgDate && DateUtils.getDateFromMilliseconds(response.data.bcgDate);
        response.data.dptHepBFirstTime = response.data.dptHepBFirstTime && DateUtils.getDateFromMilliseconds(response.data.dptHepBFirstTime);
        response.data.dptHepBSecondTime = response.data.dptHepBSecondTime && DateUtils.getDateFromMilliseconds(response.data.dptHepBSecondTime);
        response.data.dptHepBThirdTime = response.data.dptHepBThirdTime && DateUtils.getDateFromMilliseconds(response.data.dptHepBThirdTime);
        response.data.polioFirstTime = response.data.polioFirstTime && DateUtils.getDateFromMilliseconds(response.data.polioFirstTime);
        response.data.polioSecondTime = response.data.polioSecondTime && DateUtils.getDateFromMilliseconds(response.data.polioSecondTime);
        response.data.polioThirdTime = response.data.polioThirdTime && DateUtils.getDateFromMilliseconds(response.data.polioThirdTime);
        response.data.pcvFirstTime = response.data.pcvFirstTime && DateUtils.getDateFromMilliseconds(response.data.pcvFirstTime);
        response.data.pcvSecondTime = response.data.pcvSecondTime && DateUtils.getDateFromMilliseconds(response.data.pcvSecondTime);
        response.data.pcvThirdTime = response.data.pcvThirdTime && DateUtils.getDateFromMilliseconds(response.data.pcvThirdTime);
        response.data.rotaFirstTime = response.data.rotaFirstTime && DateUtils.getDateFromMilliseconds(response.data.rotaFirstTime);
        response.data.rotaSecondTime = response.data.rotaSecondTime && DateUtils.getDateFromMilliseconds(response.data.rotaSecondTime);
        response.data.fipvFirstTime = response.data.fipvFirstTime && DateUtils.getDateFromMilliseconds(response.data.fipvFirstTime);
        response.data.fipvSecondTime = response.data.fipvSecondTime && DateUtils.getDateFromMilliseconds(response.data.fipvSecondTime);
        response.data.daduraRubelaNineToElevenMonth = response.data.daduraRubelaNineToElevenMonth && DateUtils.getDateFromMilliseconds(response.data.daduraRubelaNineToElevenMonth);
        response.data.daduraRubelaAfterTwelveMonth = response.data.daduraRubelaAfterTwelveMonth && DateUtils.getDateFromMilliseconds(response.data.daduraRubelaAfterTwelveMonth);
        response.data.jeAfterTwelveMonth = response.data.jeAfterTwelveMonth && DateUtils.getDateFromMilliseconds(response.data.jeAfterTwelveMonth);
        response.data.purnaKhopLayeko = response.data.purnaKhopLayeko && DateUtils.getDateFromMilliseconds(response.data.purnaKhopLayeko);
        response.data.dptHepaPolioAfter12Month = response.data.dptHepaPolioAfter12Month && DateUtils.getDateFromMilliseconds(response.data.dptHepaPolioAfter12Month);

        setKhopSewaModalTitle(EDIT_SELECTED_RECORD);
        setShowAddKhopSewaModal(true);
        setKhopSewaModalDefaultValues(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const vaccineGetAndExpendedEditFunction = id => {
    HMIS.get(API_URL.vaccineDetail + "/" + id)
      .then(response => {
        response.data.receivedDate = response.data.receivedDate && DateUtils.getDateFromMilliseconds(response.data.receivedDate);
        setVaccineGetAndExpendedModalTitle(EDIT_SELECTED_RECORD);
        setShowVaccineGetAndExpendedModal(true);
        setVaccineGetAndExpendedModalDefaultValues(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const khopAwanchhitGhatanaEditFunction = id => {
    HMIS.get(API_URL.khopAwanchhitGhatana + "/" + id)
      .then(response => {
        response.data.palikaName = response.data.palikaName && AppMisc.getMunicipalityName(response.data.palikaName);
        response.data.aefiEntryDate = response.data.aefiEntryDate && DateUtils.getDateFromMilliseconds(response.data.aefiEntryDate);
        response.data.khopLagayekoDate = response.data.khopLagayekoDate && DateUtils.getDateFromMilliseconds(response.data.khopLagayekoDate);
        response.data.symptomStartDate = response.data.symptomStartDate && DateUtils.getDateFromMilliseconds(response.data.symptomStartDate);

        setKhopAwanchhitGhatanaModalTitle(EDIT_SELECTED_RECORD);
        setShowKhopAwanchhitGhatanaModal(true);
        setKhopAwanchhitGhatanaModalDefaultValues(response.data)
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const handleKhopSewaModalClose = () => {
    setKhopSewaModalDefaultValues({});
    setShowAddKhopSewaModal(false);
    setKhopSewaModalTitle("खोप सेवा रजिस्टरमा नयाँ बाल-बालिका रेकर्ड थप्नुहोस्।");
  };

  const handleVaccineGetAndExpendedModalModalClose = () => {
    setVaccineGetAndExpendedModalDefaultValues({});
    setShowVaccineGetAndExpendedModal(false);
    setKhopSewaModalTitle("रजिस्टरमा भ्याक्सिन प्राप्त, खर्च तथा खेर गएको विवरण थप्नुहोस्।");
  }

  const handleKhopAwanchhitGhatanaModalModalClose = () => {
    setKhopAwanchhitGhatanaModalDefaultValues({});
    setShowKhopAwanchhitGhatanaModal(false);
    setKhopAwanchhitGhatanaModalTitle("खोप पश्चात हुने अवन्छित घटना रजिस्टरमा नयाँ रेकर्ड थप्नुहोस्।");
  }

  const handleKhopSewaModalSubmit = data => {
    data.id = khopSewaModalDefaultValues.id;
    data.khopKendraId = AppUtils.getUrlParam(ID);
    data.dateOfBirth = data.dateOfBirth && DateUtils.getDateMilliseconds(data.dateOfBirth);
    data.bcgDate = data.bcgDate && DateUtils.getDateMilliseconds(data.bcgDate);
    data.dptHepBFirstTime = data.dptHepBFirstTime && DateUtils.getDateMilliseconds(data.dptHepBFirstTime);
    data.dptHepBSecondTime = data.dptHepBSecondTime && DateUtils.getDateMilliseconds(data.dptHepBSecondTime);
    data.dptHepBThirdTime = data.dptHepBThirdTime && DateUtils.getDateMilliseconds(data.dptHepBThirdTime);
    data.dptHepaPolioAfter12Month = data.dptHepaPolioAfter12Month && DateUtils.getDateMilliseconds(data.dptHepaPolioAfter12Month);
    data.polioFirstTime = data.polioFirstTime && DateUtils.getDateMilliseconds(data.polioFirstTime);
    data.polioSecondTime = data.polioSecondTime && DateUtils.getDateMilliseconds(data.polioSecondTime);
    data.polioThirdTime = data.polioThirdTime && DateUtils.getDateMilliseconds(data.polioThirdTime);
    data.pcvFirstTime = data.pcvFirstTime && DateUtils.getDateMilliseconds(data.pcvFirstTime);
    data.pcvSecondTime = data.pcvSecondTime && DateUtils.getDateMilliseconds(data.pcvSecondTime);
    data.pcvThirdTime = data.pcvThirdTime && DateUtils.getDateMilliseconds(data.pcvThirdTime);
    data.rotaFirstTime = data.rotaFirstTime && DateUtils.getDateMilliseconds(data.rotaFirstTime);
    data.rotaSecondTime = data.rotaSecondTime && DateUtils.getDateMilliseconds(data.rotaSecondTime);
    data.fipvFirstTime = data.fipvFirstTime && DateUtils.getDateMilliseconds(data.fipvFirstTime);
    data.fipvSecondTime = data.fipvSecondTime && DateUtils.getDateMilliseconds(data.fipvSecondTime);
    data.daduraRubelaNineToElevenMonth = data.daduraRubelaNineToElevenMonth && DateUtils.getDateMilliseconds(data.daduraRubelaNineToElevenMonth);
    data.daduraRubelaAfterTwelveMonth = data.daduraRubelaAfterTwelveMonth && DateUtils.getDateMilliseconds(data.daduraRubelaAfterTwelveMonth);
    data.purnaKhopLayeko = data.purnaKhopLayeko && DateUtils.getDateMilliseconds(data.purnaKhopLayeko);
    data.jeAfterTwelveMonth = data.jeAfterTwelveMonth && DateUtils.getDateMilliseconds(data.jeAfterTwelveMonth);

    HMIS.post(API_URL.khopSewa, data)
      .then(response => {
        if (response.data.type === "success") {
          handleKhopSewaModalClose();
          getKhopSewaListByKhopKendraId();
          getVaccineDetailsByKhopKendraId();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG })
      });
  }

  const handleVaccineGetAndExpendedModalSubmit = data => {
    data.id = vaccineGetAndExpendedModalDefaultValues.id;
    data.khopKendraId = AppUtils.getUrlParam(ID);
    data.receivedDate = data.receivedDate && DateUtils.getDateMilliseconds(data.receivedDate);
    HMIS.post(API_URL.vaccineDetail, data)
      .then(response => {
        if (response.data.type === "success") {
          handleVaccineGetAndExpendedModalModalClose();
          getVaccineDetailsByKhopKendraId();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG })
      });
  }

  const handleKhopAwanchhitGhatanaModalSubmit = data => {
    data.khopKendraId = AppUtils.getUrlParam(ID);
    data.khopLagayekoDate = data.khopLagayekoDate && DateUtils.getDateMilliseconds(data.khopLagayekoDate);
    data.symptomStartDate = data.symptomStartDate && DateUtils.getDateMilliseconds(data.symptomStartDate);
    data.aefiEntryDate = data.aefiEntryDate && DateUtils.getDateMilliseconds(data.aefiEntryDate);
    data.palikaName = data.palikaName && AppMisc.getMunicipalityValueFromLabel(data.palikaName);
    HMIS.post(API_URL.khopAwanchhitGhatana, data)
      .then(response => {
        if (response.data.type === "success") {
          handleKhopAwanchhitGhatanaModalModalClose();
          getListOfKhopAwanchhitGhatanaData();
        }
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <>
      <Box className={classes.khopSewaRegisterHeader} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">खोप अभिलेख (बाल-बालिका)</Typography>
        {
          JSON.stringify(khopKendraDetails) !== "{}" &&
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2" className={classes.marginRight}>खोप केन्द्रको नाम: {Object.keys(khopKendraDetails)[0] || "-"}</Typography>
            <Typography variant="subtitle2">सन्चालन भएको मिति: {DateUtils.getDateFromMilliseconds(khopKendraDetails[Object.keys(khopKendraDetails)[0]].khopSessionDate) + ", " + khopKendraDetails[Object.keys(khopKendraDetails)[0]].khopSessionTime}</Typography>
          </Box>
        }
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowAddKhopSewaModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <Box className={classes.khopSewaRegister} mb={3}>
        <KhopSewaRegister
          tableData={khopSewaRegisterData}
          showActionColumn={khopSewaRegisterData.length !== 0}
          onEditRow={khopSewaRecordEditFunction.bind(this)} />
      </Box>
      <Box className={classes.vaccineDetailHeader} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">भ्याक्सिन प्राप्त, खर्च तथा खेर गएको विवरण (डोजमा)</Typography>
        {showAddVaccineDetailsButton &&
          <Box display="flex" alignItems="center">
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowVaccineGetAndExpendedModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
          </Box>}
      </Box>
      <Box className={classes.VaccineGetAndExpendedRegister} mb={3}>
        <VaccineGetAndExpendedRegister
          tableData={vaccineGetAndExpendedData}
          showActionColumn={vaccineGetAndExpendedData.length !== 0}
          onEditRow={vaccineGetAndExpendedEditFunction.bind(this)}
        />
      </Box>
      <Box className={classes.khopAwanchhitGhatanaHeader} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">खोप पश्चात हुने अवन्छित घटना</Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => { setShowKhopAwanchhitGhatanaModal(true) }}>नयाँ रेकर्ड थप्नुहोस्</Button>
        </Box>
      </Box>
      <Box className={classes.khopAwanchhitGhatanaRegister}>
        <KhopAwanchhitGhatanaRegister
          tableData={khopAwanchhitGhatanaRegisterData}
          showActionColumn={khopAwanchhitGhatanaRegisterData.length !== 0}
          onEditRow={khopAwanchhitGhatanaEditFunction.bind(this)}
        />
      </Box>
      <AddRecordToKhopSewaRegisterModal
        title={khopSewaModalTitle}
        onModalSubmit={handleKhopSewaModalSubmit}
        onModalClose={handleKhopSewaModalClose}
        showKhopSewaModal={showAddKhopSewaModal}
        khopSewaRecordEdit={khopSewaRecordEditFunction}
        modalDefaultValues={khopSewaModalDefaultValues}
      />
      <AddVaccineGetAndExpendedModal
        title={vaccineGetAndExpendedModalTitle}
        onModalSubmit={handleVaccineGetAndExpendedModalSubmit}
        onModalClose={handleVaccineGetAndExpendedModalModalClose}
        showVaccineGetAndExpendedModal={showVaccineGetAndExpendedModal}
        vaccineGetAndExpendedRecordEdit={vaccineGetAndExpendedEditFunction}
        modalDefaultValues={vaccineGetAndExpendedModalDefaultValues}
      />
      <AddKhopAwanchhitGhatanaModal
        title={khopAwanchhitGhatanaModalTitle}
        onModalSubmit={handleKhopAwanchhitGhatanaModalSubmit}
        onModalClose={handleKhopAwanchhitGhatanaModalModalClose}
        showKhopAwanchhitGhatanaModal={showKhopAwanchhitGhatanaModal}
        khopAwanchhitGhatanaRecordEdit={khopAwanchhitGhatanaEditFunction}
        modalDefaultValues={khopAwanchhitGhatanaModalDefaultValues}
        khopSewaList={khopSewaList}
      />
    </>
  );
}