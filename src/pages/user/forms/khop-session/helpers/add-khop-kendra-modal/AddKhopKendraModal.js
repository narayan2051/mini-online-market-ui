import { TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import CustomModal from "../../../../../../components/modal/CustomModal";
import { REQUIRED_FIELD } from "../../../../../../utils/constants";

export default function AddKhopKendraModal(props) {
  const { register, handleSubmit, errors } = useForm();

  return (
    <CustomModal
      title={props.title}
      maxWidth="sm"
      showModal={props.showAddKhopKendraModal}
      onModalSubmit={handleSubmit(props.onModalSubmit)}
      onModalClose={props.onModalClose}
    >
      <TextField
        label="खोप केन्द्रको नाम"
        name="name"
        variant="outlined"
        inputRef={register({
          required: true
        })}
        defaultValue={props.modalDefaultValues.name}
        fullWidth
      />
      {errors.name && <span className="error-message">{REQUIRED_FIELD}</span>}
    </CustomModal>
  );
}
