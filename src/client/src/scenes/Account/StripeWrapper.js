import React from "react";
import PropTypes from "prop-types";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

export default function StripeWrapper(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK, {
    locale: props.localeId === "frCa" ? "fr-CA" : "en",
  });
  return (
    <Elements stripe={stripePromise}>
      {props.element}
    </Elements>
  );
}

StripeWrapper.propTypes = {
  element: PropTypes.element,
}
