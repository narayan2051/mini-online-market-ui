import {
  Container,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import HTTPClient, { API_URL, PRODUCT_URL } from "../../../api/api";

export default function SellerDashboard(props) {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    HTTPClient.get(PRODUCT_URL)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },[]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3">All Products</Typography>
      <Table>
        <TableHead>
          <TableCell>Title</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Action</TableCell>
        </TableHead>
        <TableBody>
          {productData.map((item) => (
            <TableRow>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell><IconButton><Delete/></IconButton></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
