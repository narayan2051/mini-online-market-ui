import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import HTTPClient, { ORDER_URL } from "../../../api/api";
import { AppUtils } from "../../../utils/appUtils";

export default function OrderDetail(props) {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    HTTPClient.get(ORDER_URL + "/" + AppUtils.getUrlParam("number"))
      .then((response) => {
        setProductList(response.data.productList);
      })
      .catch((err) => {});
  });

  return (
    <Container maxWidth="sm">
      <h1>Order Details</h1>

      <Table>
        <TableHead>
          <TableCell>Title</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Quantity</TableCell>
        </TableHead>
        <TableBody>{
            productList.map((item)=><TableRow>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                </TableRow>)
            }</TableBody>
      </Table>
    </Container>
  );
}
