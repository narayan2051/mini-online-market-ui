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

  const [data, setData] = useState([
    {
      id: 1,
      date: "2021/09/21",
      user: "Sam",
      products: "Dell laptop",
      price: 999,
      description: "Good Laptop",
      status: "DELIVERED",
    },
    {
      id: 2,
      date: "2021/09/20",
      user: "Joe",
      products: "IPhone 15 Pro Max",
      price: 1100,
      description: "Good Phone",
      status: "SHIPPED",
    },
    {
      id: 3,
      date: "2021/09/22",
      user: "Brad",
      products: "Book",
      price: 50,
      description: "Good Read",
      status: "ON_THE_WAY",
    },
    {
      id: 4,
      date: "2021/09/22",
      user: "Philip",
      products: "MacBook Pro",
      price: 1800,
      description: "Perfect for coding",
      status: "CANCELLED",
    },
    {
      id: 5,
      date: "2021/09/23",
      user: "Samuel",
      products: "Sony Headset",
      price: 1200,
      description: "Excellent Bass",
      status: "PROCESSING",
    },
  ]);
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
      orderID: id,
      status,
    };
    HTTPClient.post(ORDER_URL, data)
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
                    defaultValue={row.status}
                    onChange={(e) => setStatusHandler(row.id, e.target.value)}
                  >
                    <MenuItem value="Select Status">Select Status</MenuItem>
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
                    <MenuItem value="PROCESSING">
                      <Button>
                        <Cached color="default" />
                        Processing
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
