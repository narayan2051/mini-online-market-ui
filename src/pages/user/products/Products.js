import React, { useEffect, useState } from "react";
import HTTPClient, { PRODUCT_URL } from "../../../api/api";
import Product from "../product/Product";

export default function Products() {
  const [data, setData] = useState();
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
      // console.log(item);
      return (
        <Product
          id={item.id}
          title={item.title}
          price={item.price}
          description={item.description}
        />
      );
    });

  return <div className="Products">{productList}</div>;
}
