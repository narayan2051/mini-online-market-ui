import { Box, Button, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import HMIS, { API_URL } from "../../../../api/api";
import AddAlertMessage from "../../../../components/alert/Alert";
import { EDIT_SELECTED_RECORD, SOMETHING_WENT_WRONG } from "../../../../utils/constants";
import { DateUtils } from "../../../../utils/dateUtils";
import KhopKendraRegister from "../../components/registers/khop-kendra-register/KhopKendraRegister";
import KhopSessionRegister from "../../components/registers/khop-session-register/KhopSessionRegister";
import AddKhopKendraModal from "./helpers/add-khop-kendra-modal/AddKhopKendraModal";
import AddKhopSessionModal from "./helpers/add-khop-session-modal/AddKhopSessionModal";
import styles from "./style";

export default function KhopSessionSanchalanWiwaran(props) {
  const classes = styles();
  const [showAddKhopKendraModal, setShowAddKhopKendraModal] = useState(false);
  const [showAddKhopSessionModal, setShowAddKhopSessionModal] = useState(false);
  const [khopKendraRegisterData, setKhopKendraRegisterData] = useState([]);
  const [khopSessionRegisterData, setKhopSessionRegisterData] = useState([]);
  const [khopKendraModalDefaultValues, setKhopKendraModalDefaultValues] = useState({});
  const [khopSessionModalDefaultValues, setKhopSessionModalDefaultValues] = useState({});
  const [addKhopKendraModalTitle, setAddKhopKendraModalTitle] = useState("नयाँ खोप केन्द्र थप्नुहोस् ।");
  const [addKhopSessionModalTitle, setAddKhopSessionModalTitle] = useState("नयाँ खोप सेसन थप्नुहोस् ।");
  const [khopKendraOptions, setKhopKendraOptions] = useState([]);

  useEffect(() => {
    getKhopKendraData();
    getKhopSessionData();
  }, [])

  const handleKhopKendraModalClose = () => {
    setKhopKendraModalDefaultValues({});
    setShowAddKhopKendraModal(false);
    setAddKhopKendraModalTitle("नयाँ खोप केन्द्र थप्नुहोस् ।");
  };

  const handleKhopSessionModalClose = () => {
    setKhopSessionModalDefaultValues({});
    setShowAddKhopSessionModal(false);
    setAddKhopSessionModalTitle("नयाँ खोप सेसन थप्नुहोस् ।");
  };

  const handleKhopKendraModalSubmit = data => {
    data.id = khopKendraModalDefaultValues.id;
    HMIS.post(API_URL.khopKendra, data)
      .then(response => {
        if (response.data.type === "success") {
          handleKhopKendraModalClose();
          getKhopKendraData();
        }
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const handleKhopSessionModalSubmit = data => {
    data.id = khopSessionModalDefaultValues.id;
    data.khopSessionDate = data.khopSessionDate && DateUtils.getDateMilliseconds(data.khopSessionDate);
    HMIS.post(API_URL.khopSession, data)
      .then(response => {
        if (response.data.type === "success") {
          handleKhopSessionModalClose();
          getKhopSessionData();
        }
        AddAlertMessage({
          type: response.data.type,
          message: response.data.message
        });
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const getKhopKendraData = () => {
    HMIS.get(API_URL.khopKendra)
      .then(response => {
        setKhopKendraRegisterData(response.data);
        buildKhopKendraOptions(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  };

  const getKhopSessionData = () => {
    HMIS.get(API_URL.khopSession).then(response => {
      setKhopSessionRegisterData(response.data);
    }).catch(error => {
      AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
    });
  }

  const buildKhopKendraOptions = data => {
    var khopKendraOptionsArray = [];
    for (let i = 0; i < data.length; i++) {
      let option = {
        value: data[i].id,
        label: data[i].name
      };
      khopKendraOptionsArray.push(option);
    }
    setKhopKendraOptions(khopKendraOptionsArray);
  };

  const khopKendraEditFunction = id => {
    HMIS.get(API_URL.khopKendra + "/" + id)
      .then(response => {
        setAddKhopKendraModalTitle(EDIT_SELECTED_RECORD);
        setShowAddKhopKendraModal(true);
        setKhopKendraModalDefaultValues(response.data);
      })
      .catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  const khopSessionEditFunction = id => {
    HMIS.get(API_URL.khopSession + "/" + id)
      .then(response => {
        setAddKhopSessionModalTitle(EDIT_SELECTED_RECORD);
        setShowAddKhopSessionModal(true);
        setKhopSessionModalDefaultValues(response.data);
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <>
      <Box className={classes.khopSessionHeader} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          खोप सेसनहरु
        </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={() => { setShowAddKhopSessionModal(true) }} startIcon={<AddIcon />}>नयाँ खोप सेसन थप्नुहोस्</Button>
        </Box>
      </Box>
      <Box className={classes.khopSessionRegister}>
        <KhopSessionRegister khopSessionData={khopSessionRegisterData} showActionColumn={khopSessionRegisterData.length !== 0} onEditRow={khopSessionEditFunction.bind(this)} />
      </Box>
      <Box className={classes.khopKendraHeader} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" borderBottom={1} mb={3} pb={1}>
        <Typography variant="h5">
          खोप केन्द्रहरु
        </Typography>
        <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={() => { setShowAddKhopKendraModal(true) }} startIcon={<AddIcon />}>नयाँ खोप केन्द्र थप्नुहोस्</Button>
        </Box>
      </Box>
      <Box className={classes.khopKendraRegister}>
        <KhopKendraRegister khopKendraData={khopKendraRegisterData} showActionColumn={khopKendraRegisterData.length !== 0} onEditRow={khopKendraEditFunction.bind(this)} />
      </Box>
      <AddKhopKendraModal
        title={addKhopKendraModalTitle}
        onModalSubmit={handleKhopKendraModalSubmit}
        onModalClose={handleKhopKendraModalClose}
        showAddKhopKendraModal={showAddKhopKendraModal}
        khopKendraEditFunction={khopKendraEditFunction}
        modalDefaultValues={khopKendraModalDefaultValues}
      />
      <AddKhopSessionModal
        title={addKhopSessionModalTitle}
        onModalSubmit={handleKhopSessionModalSubmit}
        onModalClose={handleKhopSessionModalClose}
        showAddKhopSessionModal={showAddKhopSessionModal}
        khopSessionEditFunction={khopSessionEditFunction}
        modalDefaultValues={khopSessionModalDefaultValues}
        khopKendraOptions={khopKendraOptions}
      />
    </>
  );
}
