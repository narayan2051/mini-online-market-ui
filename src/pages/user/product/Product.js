import { Container } from "@material-ui/core";
import React from "react";
import styles from "../../../components/sidebar/helpers/SidebarLink/styles";
import { useCartDispatch, useCartState } from "../../../context/CartContext";

export default function Product(data) {
  const classes = styles();
  var cartDispatch = useCartDispatch();
  var { basket } = useCartState();
  const addToBasket = () => {
    // dispatch the item to data layer
    cartDispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        quantity: 1,
      },
    });
    console.log(basket);
  };

  return (
    <div className="product" key={data.id}>
      <div className="product__info">
        <p> {data.title} </p>
        <p>dasda</p>
        <p className="product__price">
          <small>$</small>
          <strong>{data.price}</strong>
        </p>
        <div className="product__description">
          <p>{data.description}</p>
        </div>
      </div>

      <button className="fade" onClick={addToBasket}>
        Add to Basket
      </button>
    </div>
  );
}
