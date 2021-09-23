import React, { useState, useEffect } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

import HTTPClient, { ORDER_URL, PRODUCT_URL } from "../../../api/api";
import { Link } from "react-router-dom";
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
// import { CSVLink } from "react-csv";


// html2PDF(node, options);
const OrderHistory = () => {
  const [data, setData] = useState();

  // @TODO: user reducers and state
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

  console.log(data)

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b"],
  ];

  const genereatePDF = () => {
    // var doc = new jsPDF("p", "pt", "a4");

    // doc.html(document.querySelector("#capture"), {
    //   callback: function (pdf) {
    //     // html2canvas(document.querySelector("#capture")).then((canvas) => {
    //       pdf.save("download.pdf");
    //     // });
    //   },
    // });
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
            <TableCell>Billing Address</TableCell>
            <TableCell>Shipping Adress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  {new Date(row.createdDate).toLocaleDateString()}
                </TableCell>
                <TableCell>${row.amount}</TableCell>
                <TableCell>{row.orderStatus}</TableCell>
                <TableCell>{row.billingAddress}</TableCell>
                <TableCell>{row.shippingAddress}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Container>
  );
  //     <div id="capture">
  //       <div>
  //         <div>Order Id: #111</div>
  //         <div>Order status : Delivered</div>
  //         <div>Shipping Address : ada dashboard adasd</div>
  //         <div>Billing Address : ada dashboard adasd</div>
  //         <div>Amount : $111</div>
  //         <div>Seller: Bipin Karki</div>
  //         <div>{/* <SingleProduct /> */}</div>
  //       </div>
  //     </div>
  //     <div className="export_buttons">
  //       {/* <CSVLink data={csvData}>
  //         <button>CSV</button>
  //       </CSVLink> */}
  //       <button id="btn" onClick={genereatePDF}>
  //         PDF
  //       </button>
  //     </div>
  //     <Container maxWidth="sm">OrderHistory</Container>
  //   </div>
  
};

export default OrderHistory;
