import { Container } from "@material-ui/core";
import React from "react";
import { Route } from "react-router";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import OrderHistory from "../order-history/OrderHistory";
import Product from "../product/Product";

// import "./UserProfile.css";

const UserProfile = () => {
  const [data, setData] = React.useState();
  // @TODO: user reducers and state
  React.useEffect(() => {
    HTTPClient.get(PRODUCT_URL)
      .then((response) => {
        console.log(response.data);
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
  return (
    <div className="UserProfile">
      <Container maxWidth="sm">
        {productList}
        <OrderHistory />
        {/* <Route path="/singleorder/:id" component={SingleOrder} /> */}
      </Container>
    </div>
  );
};

export default UserProfile;
