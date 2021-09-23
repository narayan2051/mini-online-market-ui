import React, { useState } from 'react';
import './Payment.css';
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { getBasketTotal, useCartDispatch, useCartState } from '../../../context/CartContext';
import HTTPClient, { ORDER_URL } from '../../../api/api';
import { Container, TextareaAutosize, TextField } from '@material-ui/core';

function Payment() {
    const history = useHistory();
    var cartDispatch = useCartDispatch();
    var { basket } = useCartState();
    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => {
        const allData = {
            productList: basket,
            shippingAddress: data.shipping_address,
            billingAddress: data.billing_address,
            amount: data.amount
        };
        console.log(allData)
        HTTPClient.post(ORDER_URL, data)
            .then((resp) => {
                history.push("dashboard");
            })
            .catch((err) => { });
    };


    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout (
                    <Link to="/checkout">{basket && basket.length} items</Link>
                    )
                </h1>
                {/* Payment section - Review Items */}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item => (
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
                <div className='payment__section'>
                    <div className="payment__title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment__details">
                        <Container maxWidth="sm">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p>${getBasketTotal(basket)}</p>
                                <div className="addresses">
                                    <input type="text" name="amount" value={getBasketTotal(basket)} inputRef={register} />
                                    <label>Shipping Address</label>
                                    <textarea
                                        name="billingAddress"
                                        inputRef={register}
                                    >
                                    </textarea>
                                    <p id="error"></p>
                                    <br />
                                </div>
                                <div className="addresses">
                                    <label>Billing Address</label>
                                    <textarea
                                        name="shippingAddress"
                                        inputRef={register}
                                    >
                                    </textarea>
                                    <p id="error"></p>
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment