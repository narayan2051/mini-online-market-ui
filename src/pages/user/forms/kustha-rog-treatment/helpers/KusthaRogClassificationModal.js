import { Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import HMIS, { API_URL } from '../../../../../api/api';
import AddAlertMessage from '../../../../../components/alert/Alert';
import CustomSelect from '../../../../../components/custom-select/CustomSelect';
import CustomModal from '../../../../../components/modal/CustomModal';
import { SOMETHING_WENT_WRONG, SUCCESS, YES } from '../../../../../utils/constants';
import { NERVES_AFFECTED, SKIN_BLEMISHES, SKIN_SMEAR_GERMS } from '../../../../../utils/constants/forms';
import styles from "./style";

export default function KusthaRogClassificationModal({ showModal, closeModal, approvedStatusAndId, getPendingApprovalData, showConfirmationModal }) {
  const classes = styles();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    register({ name: "skinBlemishes" });
    register({ name: "nervesAffected" });
    register({ name: "skinSmearGerms" });
  }, [register])

  const handleCustomSelectChange = (value, name) => {
    setValue(name, value);
  }

  const onKusthaRogClassificationSubmit = (data) => {
    let postData = {
      id: approvedStatusAndId.id,
      approved: approvedStatusAndId.approvedStatus,
      skinBlemishes: data.skinBlemishes,
      nervesAffected: data.nervesAffected,
      skinSmearGerms: data.skinSmearGerms,
    }

    HMIS.post(API_URL.malariaKalaazarLaboratoryRegister + "/update-approval-status", postData)
      .then(response => {
        if (response.data.type === SUCCESS) {
          getPendingApprovalData();
          closeModal();
        }
        AddAlertMessage({ type: response.data.type, message: response.data.message });
      }).catch(error => {
        AddAlertMessage({ type: "error", message: SOMETHING_WENT_WRONG });
      });
  }

  return (
    <div>
      <CustomModal
        title="वर्गीकरण तालिका"
        showModal={showModal}
        onModalSubmit={handleSubmit(onKusthaRogClassificationSubmit)}
        onModalClose={closeModal}
      >
        <Grid container spacing={2} alignItems="center" className={classes.row}>
          <Grid item xs>
            <CustomSelect
              label="छालाको दाग"
              name="skinBlemishes"
              variant="outlined"
              size="small"
              options={SKIN_BLEMISHES}
              onChange={handleCustomSelectChange}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="स्नायुमा"
              name="nervesAffected"
              variant="outlined"
              size="small"
              options={NERVES_AFFECTED}
              onChange={handleCustomSelectChange}
              fullWidth
            />
          </Grid>
          <Grid item xs>
            <CustomSelect
              label="स्किन स्मयर"
              name="skinSmearGerms"
              variant="outlined"
              size="small"
              options={SKIN_SMEAR_GERMS}
              onChange={handleCustomSelectChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Typography variant="caption" component="em" color="secondary">नोट: सुरक्षित गर्नु अगाडी यी तीनमध्ये कुनै एउटा विवरण अनिवार्य भर्नुपर्दछ।</Typography>
      </CustomModal>
      <CustomModal
        title="के तपाई यो रेकर्ड उपचार रजिष्टरबाट हटाउन चाहनुहुन्छ ?"
        onModalSubmit={() => onKusthaRogClassificationSubmit({})}
        showModal={showConfirmationModal}
        onModalClose={closeModal}
        submitButtonText={YES}
      >
        <Typography variant="caption" component="em" color="secondary">नोट:एक पटक विवरण थपेपछि वा हटाएपछि तपाईं यस कार्यलाई पूर्ववत गर्न सक्नुहुन्न।</Typography>
      </CustomModal>
    </div>
  )
}