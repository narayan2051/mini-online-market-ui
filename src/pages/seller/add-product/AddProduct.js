import { Container, TextField } from "@material-ui/core";
import React, { useEffect} from "react";
import { useForm } from "react-hook-form";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";

export default function AddProduct(props) {
  const { register, handleSubmit, setValue } = useForm();

  
  useEffect(() => {
    register({ name: "category" });
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    HTTPClient.post(PRODUCT_URL, data)
      .then((resp) => {
        props.history.push("dashboard");
      })
      .catch((err) => {});
  };

  const handleChange = (event) => {
    setValue("category", event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Add a Product</h1>

        <TextField
          size="small"
          name="title"
          inputRef={register}
          variant="outlined"
          label="Title"
        />
        <TextField
          type="number"
          name="price"
          inputRef={register}
          variant="outlined"
          label="Price"
        />
        <TextField
          type="number"
          name="quantity"
          inputRef={register}
          variant="outlined"
          label="quantity"
        />
        <TextField
          inputRef={register}
          name="description"
          variant="outlined"
          label="Description"
        />
        <select name="category" onChange={handleChange}>
          <option value="Laptop"> Laptop </option>
          <option value="Desktop"> Desktop </option>
          <option value="Tablet"> Tablet </option>
          <option value="Smartphone"> Smartphone </option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </Container>
  );
}
