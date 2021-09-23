import React from 'react'
import './Subtotal.css';

import { useHistory } from 'react-router-dom';
import { getBasketTotal, useCartDispatch, useCartState } from '../../../context/CartContext';


function Subtotal() {
    const history = useHistory();
    var cartDispatch = useCartDispatch();
    var { basket } = useCartState();

    return (
        <div className="subtotal">
            <p>${getBasketTotal(basket)}</p>
            <button onClick={e => history.push('payment')}>Proceed to Checkout</button>
        </div>
    )
}

export default Subtotal
