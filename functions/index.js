/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51LD5VeIhBRfrnWV9UE3QhXSKLwBe3Od7GwB6gLwFQGzllE6EKWTzxmBA6oQVFdMmzfhU1doUkHIzxd2xPHM8mrUy00fcd6Us2B");

// API

// APP config

const app = express();

// Middlewares

app.use(cors({origin: true}));
app.use(express.json());

// API routes

app.get("/", (request, response) => response.status(200).send("Hello World"));


app.post("/payments/create", async (request, response) => {
  const total = request.body.total;
  console.log("Payment recieved Boom !! for thsi amount >>> ", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // submits of the currency
    currency: "usd",
  });

  // // OK created

  response.status(201).send({clientSecret: paymentIntent.client_secret});
});

// API listen command

exports.api = functions.https.onRequest(app);

// Example endpoint

// (http://localhost:5001/clone-cee60/us-central1/api)
