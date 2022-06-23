import React from "react";
import "./checkoutproduct.css";
import { useStateValue } from "./StateProvider";

const CheckoutProduct = ({ id, tittle, image, price, rating, hideButton }) => {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = () => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  return (
    <div className="checkout__Product">
      <img className="checkoutProduct__image" src={image} alt="" srcset="" />
      <div className="checkoutProduct__info">
        <p className="checkoutProduct__tittle">{tittle}</p>
        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="checkoutProduct__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>⭐</p>
            ))}
        </div>
        {!hideButton && (
          <button onClick={removeFromBasket}>Remove From Product</button>
        )}
      </div>
    </div>
  );
};

export default CheckoutProduct;
