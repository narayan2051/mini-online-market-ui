import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Title } from "@material-ui/icons";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import HTTPClient, { ORDER_URL } from "../../../api/api";

// html2PDF(node, options);
const OrderHistory = () => {
  const [data, setData] = useState();

  // @TODO: user reducers and state
  const getOrders = () => {
    HTTPClient.get(ORDER_URL + "/userSpecific")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getOrders();
  }, []);

  console.log(data);

  const csvData = [
    [
      "Order No",
      "Date",
      "Amount",
      "Status",
      "Billing Addres",
      "Shipping Address",
    ],
  ];

  data &&
    data.map((row) =>
      csvData.push([
        row.id,
        row.createdDate,
        row.amount,
        row.orderStatus,
        row.billingAddress,
        row.shippingAddress,
      ])
    );

  console.log(csvData);

  const genereatePDF = () => {
    var doc = new jsPDF("p", "pt", "a4");

    doc.html(document.querySelector("#capture"), {
      callback: function (pdf) {
        // html2canvas(document.querySelector("#capture")).then((canvas) => {
        pdf.save("download.pdf");
        // });
      },
    });
  };

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
    <div>
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
                  <TableCell>
                    {" "}
                    <a href={`singleorder?id=` + row.id}>{row.id}</a>
                  </TableCell>
                  <TableCell>
                    {new Date(row.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>{row.orderStatus}
                    {
                      row.orderStatus === "PROCESSING" ?
                        <button onClick={(e) => setStatusHandler(row.id, "CANCELLED")}>
                          Cancel Order
                        </button>
                        : ""
                    }
                  </TableCell>
                  <TableCell>{row.billingAddress}</TableCell>
                  <TableCell>{row.shippingAddress}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="export_buttons">
          {/* <CSVLink data={csvData}>
          <button>CSV</button>
        </CSVLink> */}
          <button id="btn" onClick={genereatePDF}>
            Export PDF
          </button>
        </div>
      </Container>
      <div id="capture">
        <Table>
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
                  <TableCell>{row.id}                  </TableCell>
                  <TableCell>
                    {new Date(row.createdDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>{row.orderStatus}
                  </TableCell>
                  <TableCell>{row.billingAddress}</TableCell>
                  <TableCell>{row.shippingAddress}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      </div>
  );
};

export default OrderHistory;
