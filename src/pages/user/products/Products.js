import { Container } from "@material-ui/core";
import React from "react";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import styles from "../../../components/sidebar/helpers/SidebarLink/styles";
import Product from "../product/Product";
import "./Products.css";


export default function Products() {
  const classes = styles();
  const [products, setProducts] = React.useState([]);
  // @TODO: user reducers and state
  const getProducts = () => {
    HTTPClient.get(PRODUCT_URL + "/stock")
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((err) => console.log(err.message));
  };
  React.useEffect(() => {
    getProducts();
  }, []);

  const productList =
    products &&
    products.map((item) => {
      return (
        <Product
          key={item.id}
          id={item.id}
          title={item.title}
          price={item.price}
          description={item.description}
        />
      );
    });

  return (
    <Container maxWidth="lg" className={classes.root} disableGutters>
      <div className="Products">{productList}</div>
    </Container>
  );
}
