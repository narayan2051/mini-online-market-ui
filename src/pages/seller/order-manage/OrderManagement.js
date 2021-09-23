import {
  Button,
  Container,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  Block,
  Cached,
  DirectionsBoat,
  LocalShipping,
  Store,
  Title,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HTTPClient, { ORDER_URL } from "../../../api/api";

export default function OrderManagement(props) {
  const handleSubmit = () => {};

  const [data, setData] = useState([]);
  const getOrders = () => {
    HTTPClient.get(ORDER_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getOrders();
  }, []);

  const setStatusHandler = (id, status) => {
    const data = {
      orderId: id,
      status,
    };
    HTTPClient.post(ORDER_URL + "/orderstatus", data)
      .then((response) => {
        getOrders();
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <Container maxWidth="sm">
      <Title>All Orders</Title>
      <Table size="small" className="Orders">
        <TableHead id="table-head">
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <a href={`orderDetail?number=` + row.id}>{row.id}</a>
                </TableCell>
                <TableCell>
                  {new Date(row.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{`$${row.amount}`}</TableCell>
                <TableCell>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    label="Status"
                    defaultValue={row.orderStatus}
                    onChange={(e) => setStatusHandler(row.id, e.target.value)}
                  >
                    <MenuItem value="Select Status">Select Status</MenuItem>
                    <MenuItem value="PROCESSING" selected>
                      <Button>
                        <Cached color="default" />
                        Processing
                      </Button>
                    </MenuItem>
                    <MenuItem value="SHIPPED">
                      <Button type="submit">
                        <DirectionsBoat color="secondary" />
                        SHIPPED
                      </Button>
                    </MenuItem>
                    <MenuItem value="ON_THE_WAY">
                      <Button>
                        <LocalShipping color="primary" />
                        On The Way
                      </Button>
                    </MenuItem>
                    <MenuItem value="DELIVERED">
                      <Button>
                        <Store color="success" />
                        Delivered
                      </Button>
                    </MenuItem>
                    <MenuItem value="CANCELLED">
                      <Button>
                        <Block color="error" />
                        Cancelled
                      </Button>
                    </MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={handleSubmit} sx={{ mt: 3 }}>
        See more Orders
      </Link>
    </Container>
  );
}
