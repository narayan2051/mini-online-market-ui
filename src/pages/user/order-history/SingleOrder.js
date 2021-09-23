import React from "react";
import "./OrderHistory.css";
import Button from "@mui/material/Button";
import EditOffIcon from "@mui/icons-material/EditOff";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Container } from "@material-ui/core";

function SingleOrder() {
  const orderDetails = {
    orderId: 1,
    productList: [
      {
        productId: 101,
        name: "Dell",
        price: 888,
        qty: 1,
        review: "Good Laptop",
      },
      {
        productId: 102,
        name: "Iphone13",
        price: 1700,
        qty: 1,
        review: "Good Phone",
      },
      {
        productId: 103,
        name: "Air pod",
        price: 80,
        qty: 1,
        review: "Nice Bass",
      },
    ],
  };
  const updateReview = (orderId, productId) => {};

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
              {orderDetails.productList.map((row) => {
                return (
                  <TableRow key={row.productId}>
                    <TableCell component="th" scope="row">
                      {orderDetails.orderId}
                    </TableCell>
                    <TableCell align="right">{row.productId}</TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                    <TableCell align="right">
                      <TextField
                        id="outlined-multiline-static"
                        multiline
                        defaultValue={row.review}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="warning"
                        variant="outlined"
                        onClick={() =>
                          updateReview(orderDetails.orderId, row.productId)
                        }
                      >
                        <EditOffIcon />
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
