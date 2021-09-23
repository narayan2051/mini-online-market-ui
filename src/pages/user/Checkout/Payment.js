import { Container, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import HTTPClient, { ORDER_URL } from "../../../api/api";
import {
    getBasketTotal,
    useCartDispatch,
    useCartState
} from "../../../context/CartContext";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";

function Payment() {
  const history = useHistory();
  var cartDispatch = useCartDispatch();
  var { basket } = useCartState();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const allData = {
      productList: basket,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      amount: data.amount,
    };
    console.log(allData);
    HTTPClient.post(ORDER_URL, allData)
      .then((resp) => {
        history.push("dashboard");
      })
      .catch((err) => {});
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket && basket.length} items</Link>)
        </h1>
        {/* Payment section - Review Items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        </div>

        {/* Payment section - Payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <Container maxWidth="sm">
              <form onSubmit={handleSubmit(onSubmit)}>
                <p>${getBasketTotal(basket)}</p>
                <div className="addresses">
                  <TextField
                    type="text"
                    name="amount"
                    value={getBasketTotal(basket)}
                    inputRef={register}
                    variant="outlined"
                  />
                  <TextField
                    name="billingAddress"
                    inputRef={register}
                    variant="outlined"
                    label="Billing Address"
                  />
                  <p id="error"></p>
                  <br />
                </div>
                <div className="addresses">
                  <TextField
                    name="shippingAddress"
                    inputRef={register}
                    variant="outlined"
                    label="Shipping Address"
                  />
                  <p id="error"></p>
                </div>
                <button type="submit">Submit</button>
              </form>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
