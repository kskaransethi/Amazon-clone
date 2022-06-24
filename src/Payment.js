import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const getClientSecret = async () => {
      await fetch(
        "http://localhost:5001/clone-cee60/us-central1/api/payments/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ total: getBasketTotal(basket) * 100 }),
        }
      )
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    };
    getClientSecret();
  }, [basket]);


  console.log("the secret is >>>", clientSecret);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {card: elements.getElement(CardElement)},
      })
      .then(({ paymentIntent }) => {
        console.log(paymentIntent);
        db.collection("users")
          .doc(user.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });
        // PaymentIntent = payment confirmation
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
          type: "EMPTY_BASKET"
        })

        navigate("/orders", { replace: true });
      });
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="paymet__container">
        <h1>
          Checkout( <Link to="/checkout">{basket.length} items</Link>)
        </h1>
        {/*Payment - Section - delivery Address */}
        <div className="payment__section">
          <div className="payment__tittle">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{!user ? "Guest" : user.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        {/*Payment - Section - Review items */}

        <div className="payment__section">
          <div className="payment__tittle">
            <h3>Review Items and Delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                tittle={item.tittle}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/*Payment - Section - Payment Method */}

        <div className="payment__section">
          <div className="payment__tittle">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/*Stripe Payments */}

            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total:{value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)} // Part of the homework
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {/* Error */}
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
