import {
  Container,
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
import HTTPClient, { PRODUCT_URL } from "../../../api/api";

export default function SellerDashboard(props) {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    HTTPClient.get(PRODUCT_URL)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    HTTPClient.delete(PRODUCT_URL + "/" + id).then((response) => {
      if (response.data.type === "success") {
        getData();
      }
    });
  };

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
              <TableCell>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
