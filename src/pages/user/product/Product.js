import { Container } from "@material-ui/core";
import React from "react";
import styles from "../../../components/sidebar/helpers/SidebarLink/styles";


export default function Product(data) {
  const classes = styles();
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


  return (<div className="product" key={data.id}>
    <Container maxWidth="lg" className={classes.root} disableGutters>
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

      <button className="fade">Add to Basket</button>
      </Container>
    </div>);
}
