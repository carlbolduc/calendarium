import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SubscribeForm from "./SubscribeForm";

export default function StripeWrapper(props) {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK, {
    locale: props.language === "frCa" ? "fr-CA" : "en",
  });
  return (
    <Elements stripe={stripePromise}>
      <SubscribeForm
        createSubscription={props.createSubscription}
        cancel={props.cancel}
        translate={props.translate}
      />
    </Elements>
  );
}
