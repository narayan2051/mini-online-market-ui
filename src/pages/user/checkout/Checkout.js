import React from "react";
import "./Checkout.css";
import Subtotal from "./Subtotal";
import CheckoutProduct from "./CheckoutProduct";
import { useCartDispatch, useCartState } from "../../../context/CartContext";

function Checkout() {
  var cartDispatch = useCartDispatch();
  var { basket } = useCartState();
  console.log(basket)
  return (
    <div className="checkout">
        
      <div className="checkout__left">
        <img className="checkout__ad" src="" />
        <div>
          {basket && basket.length === 0 ? (
            <div>
              <h3>Hello, </h3>
              <h2>Your Shopping Basket is empty!!!</h2>
              <p>
                You have no items in your basket.To buy one or more items, click
                "Add to basket" next to the item.
              </p>
            </div>
          ) : (
            <div>
              <h3>Hello, </h3>
              <h2 className="checkout__title">Your Shopping Basket</h2>
             
                {basket.map((item) => (
                 
                  <CheckoutProduct
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    id={item.id}
                  ></CheckoutProduct>
                ))}
             
            </div>
          )}
        </div>
      </div>

      <div className="checkout__right">
        <Subtotal />
      </div>
    </div>
  );
}

export default Checkout;
