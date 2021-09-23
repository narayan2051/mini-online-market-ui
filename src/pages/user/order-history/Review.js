import { Button, Container, TextField } from "@material-ui/core";
import { Label } from "@material-ui/icons";
import { CompressOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import { AppUtils } from "../../../utils/appUtils";

export default function Review(props) {
  const { register, handleSubmit } = useForm();

  const [commentList, setCommentList] = useState([]);
  const productId = AppUtils.getUrlParam("id");

  useEffect(() => {
    HTTPClient.get(PRODUCT_URL + "/" + productId)
      .then((resp) => {
        setCommentList(resp.data.reviews);
      })
      .catch((err) => {});
  }, []);

  const onSubmit = (data) => {
    const formData = {
      productId,
      reviewText: data.reviewText,
    };
    HTTPClient.post(PRODUCT_URL + "/review", formData)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <Container maxWidth="sm">
      {commentList &&
        commentList.map((item) => {
          {
            console.log(commentList);
          }
          <h3 key={item.reviewText}>{item.reviewText}</h3>;
        })}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          label="Comment"
          multiline
          name="reviewText"
          inputRef={register}
        />
        <Button type="submit">Add Review</Button>
      </form>
    </Container>
  );
}
