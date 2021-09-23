import React, { useEffect, useRef, useState } from "react";
import "./OrderHistory.css";
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";

import { AppUtils } from "../../../utils/appUtils";
import HTTPClient, { ORDER_URL, PRODUCT_URL } from "../../../api/api";

function SingleOrder() {
  const [productList, setProductList] = useState([]);
  const orderId = AppUtils.getUrlParam("id");
  const reviewRef = useRef(null);
  useEffect(() => {
    HTTPClient.get(ORDER_URL + "/" + AppUtils.getUrlParam("id"))
      .then((response) => {
        setProductList(response.data.productList);
      })
      .catch((err) => {});
  }, []);
  //console.log(productList);
  const updateReview = (productId) => {
    const data = {
      productId,
      reviewText: reviewRef.current.value,
    };
    HTTPClient.post(PRODUCT_URL, data)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  // const changeReviewHandler = (e, productId) => {
  //   productList.map((product) => {
  //     if (product.id === productId) {
  //       return { ...product, reviewText: e.target.value };
  //     } else {
  //       return product;
  //     }
  //   });
  // };

  return (
    <div className="OrderHistory">
      <Container maxWidth="md">
        <h1>Order Details</h1>
        <TableContainer component={Paper} id="container">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow id="head">
                <TableCell>Order_ID</TableCell>
                <TableCell align="right">Product_ID</TableCell>
                <TableCell align="right">Product_Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Review</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {orderId}
                    </TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.title}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">
                      <TextField
                        id="outlined-multiline-static"
                        multiline
                        // onChange={(e) => changeReviewHandler(e, row.productId)}
                        ref={reviewRef}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="warning"
                        variant="outlined"
                        onClick={(e) => updateReview(row.productId)}
                      >
                        {/* <EditOff /> */}
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* <p>{moment.unix(order.created).format("MMMM Do YYYY, h:mma")}</p>
            <p className="order__id">
                <small>{order.id}</small>
            </p>
           
            <CurrencyFormat
                renderText={(value) => (
                    <h3 className="order__total">Order Total: {value}</h3>
                )}
                decimalScale={2}
                value={order.amount / 100}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
            /> */}
    </div>
  );
}

export default SingleOrder;
