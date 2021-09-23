import React from "react";

var CartStateContext = React.createContext();
var CartDispatchContext = React.createContext();
export const initialState = {
    basket: [],
}
// get basket total
export const getBasketTotal = 
 (basket) =>
    basket.reduce((amount, item) => item.price + amount, 0);

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_BASKET':
            return {
                ...state,
                basket: [...state.basket, action.item]
            };
        case 'EMPTY_BASKET':
            return {
                ...state,
                basket: []
            }
        case 'REMOVE_FROM_BASKET':
            // return {
            //     ...state,
            //     basket: state.basket.filter(item => item.id !== action.id)
            // };
            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            );
            let newBasket = [...state.basket];

            if (index >= 0) {
                newBasket.splice(index, 1);
            } else {
                console.warn(
                    `Cant remove product (id: ${action.id}) as its not in basket!`
                )
            }

            return {
                ...state,
                basket: newBasket,
                fadeOutAnimate: 0
            }
        default:
            return {
                ...state
            };

    }
}

function CartProvider({ children }) {
  var [state, dispatch] = React.useReducer(cartReducer, {basket:[]});

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

function useCartState() {
  var context = React.useContext(CartStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useCartDispatch() {
  var context = React.useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { CartProvider, useCartState, useCartDispatch };