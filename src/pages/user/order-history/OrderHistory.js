import React, { useState, useEffect } from "react";
// import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
// import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import { Link } from "react-router-dom";
import { Container } from "@material-ui/core";
import { CSVLink } from "react-csv";
import Product from "../product/Product";

// html2PDF(node, options);
const OrderHistory = () => {
  const [data, setData] = useState([
    {
      id: 1,
      title: "Dell",
      price: 999,
      description: "Good Laptop",
    },
    {
      id: 1,
      title: "Dell",
      price: 999,
      description: "Good Laptop",
    },
  ]);

  // @TODO: user reducers and state

  useEffect(() => {
    HTTPClient.get(PRODUCT_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err.message));
  }, []);
  const productList =
    data &&
    data.map((item) => {
      return (
        <Product
          id={item.id}
          title={item.title}
          price={item.price}
          description={item.description}
        />
      );
    });

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b"],
  ];

  const genereatePDF = () => {
    var doc = new jsPDF("p", "pt", "a4");

    doc.html(document.querySelector("#capture"), {
      callback: function (pdf) {
        html2canvas(document.querySelector("#capture")).then((canvas) => {
          pdf.save("download.pdf");
        });
      },
    });
  };

  return (
    <div className="OrderHistory">
      <div>
        <h1> Order History </h1>
        <div>
          <div>Order Id: #111</div>
          <div>
            Order status : <button className="primary"> Processing</button>
          </div>
          <div>Shipping Address : ada dashboard adasd</div>
          <div>Amount : $111</div>
          <div>
            Seller: <button className="primary"> Follow</button>
          </div>
          <div>
            <Link to="/user/singleorder/?id=1">
              <button>See More</button>
            </Link>
          </div>
        </div>
        <div>
          <div>Order Id: #111</div>
          <div>
            Order status : <button className="primary"> Processing</button>
          </div>
          <div>Shipping Address : ada dashboard adasd</div>
          <div>Amount : $111</div>
          <div>
            Seller: <button className="primary"> Follow</button>
          </div>
        </div>
        <div>
          <div>Order Id: #111</div>
          <div>
            Order status : <button className="primary"> Processing</button>
          </div>
          <div>Shipping Address : ada dashboard adasd</div>
          <div>Amount : $111</div>
          <div>
            Seller: <button className="primary"> Follow</button>
          </div>
        </div>
      </div>

      <div id="capture">
        <div>
          <div>Order Id: #111</div>
          <div>Order status : Delivered</div>
          <div>Shipping Address : ada dashboard adasd</div>
          <div>Billing Address : ada dashboard adasd</div>
          <div>Amount : $111</div>
          <div>Seller: Bipin Karki</div>
          <div>{/* <SingleProduct /> */}</div>
        </div>
      </div>
      <div className="export_buttons">
        <CSVLink data={csvData}>
          <button>CSV</button>
        </CSVLink>
        <button id="btn" onClick={genereatePDF}>
          PDF
        </button>
      </div>
      <Container maxWidth="sm">OrderHistory</Container>
    </div>
  );
};

export default OrderHistory;
