import { Container } from "@material-ui/core";
import React from "react";
import { Route } from "react-router";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import OrderHistory from "../order-history/OrderHistory";
import Product from "../product/Product";

// import "./UserProfile.css";

const UserProfile = () => {
  return (
    <div className="UserProfile">
      <Container maxWidth="sm">
        <OrderHistory />
      </Container>
    </div>
  );
};

export default UserProfile;
