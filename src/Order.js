import moment from "moment";
import React from "react";
import CheckoutProduct from "./CheckoutProduct";
import "./Order.css";

function Order({ order }) {
  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(order.data.created).format("MMMM DO YYYY, h:mma")}</p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      {order.data.basket.map(item => (
        <CheckoutProduct
              id={item.id}
              tittle={item.tittle}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
      ))}
    </div>
  );
}

export default Order;
