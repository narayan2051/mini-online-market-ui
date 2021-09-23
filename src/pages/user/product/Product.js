import React from "react";


export default function Product(id, title, price, description) {
  //   const [{ basket }, dispatch] = useStateValue();
  //   console.log("here");
  //   const addToBasket = () => {
  //     // dispatch the item to data layer
  //     dispatch({
  //       type: "ADD_TO_BASKET",
  //       item: {
  //         id: id,
  //         title: title,
  //         description: description,
  //         price: price,
  //       },
  //     });
  //   };

  return (
    <div className="product">
      <div className="product__info">
        <p> {title} </p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__description">
          <p>{description}</p>
        </div>
      </div>

      <button className="fade">Add to Basket</button>
    </div>
  );
}
