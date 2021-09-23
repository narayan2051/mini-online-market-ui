import { Container } from "@material-ui/core";
import React from "react";
import { Route } from "react-router";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";

// import "./UserProfile.css";

const UserProfile = () => {
  const [data, setData] = React.useState();
  // @TODO: user reducers and state
  React.useEffect(() => {
    HTTPClient.get(PRODUCT_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  //-- add later-----------//
  //   const productList =
  //     data &&
  //     data.map((item) => {
  //       // console.log(item);
  //       return (
  //         <Product
  //           id={item.id}
  //           title={item.title}
  //           price={item.price}
  //           description={item.description}
  //         />
  //       );
  //     });
  return (
    <div className="UserProfile">
      {/* add later */}
      {/* <OrderHistory />
      <Route path="/singleorder/:id" component={SingleOrder} /> */}

      <Container maxWidth="sm">UserProfile</Container>
    </div>
  );
};

export default UserProfile;
