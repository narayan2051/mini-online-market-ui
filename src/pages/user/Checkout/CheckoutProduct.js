import React from 'react'
import { useCartDispatch, useCartState } from '../../../context/CartContext';
import './CheckoutProduct.css';

function CheckoutProduct({ id, title, price, hideButton }) {
    var cartDispatch = useCartDispatch();
    var { basket } = useCartState();
    const removeFromBasket = () => {
        cartDispatch({
            type:'REMOVE_FROM_BASKET',
            id: id
        })
    }

    return (
        <div className="checkoutProduct">
            <div className="checkoutProduct__info">
                <p className="checkoutProduct__title">{title}</p>
                <p className="checkoutProduct__price">
                    <small>$</small>
                    <strong>{price}</strong>
                </p>
                {!hideButton && (
                    <button onClick={removeFromBasket}>Remove from Basket</button>
                )}
            </div>
        </div>
        
    )
}

export default CheckoutProduct
