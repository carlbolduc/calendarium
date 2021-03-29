import React from "react";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import Button from "../../components/Form/Button";

export default function SubscribeForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      props.createSubscription(paymentMethod, result => {
        // TODO: handle error after attempting to create subscription
      });
    }
  };

  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#6C757D",
        color: "#212529",
        fontWeight: 400,
        fontFamily: "sans-serif",
        fontSize: "1rem",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#212529"
        },
        "::placeholder": {
          color: "#6C757D"
        }
      }
    }
  };

  return (
    // TODO: use {props.translate("")} for text visible in the app
    <form onSubmit={handleSubmit} id="form-subscribe">
      <p>You're ready for Calendarium unlimited! Enter your payment info below.</p>
      <h5>Credit card details</h5>
      <div className="row">
        <div className="col">
          <div className="card-element my-3">
            <CardElement options={CARD_OPTIONS}/>
          </div>
        </div>
      </div>
      <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label={props.translate("Subscribe")} type="submit" id="button-subscribe" disabled={!stripe} />
      <p><span className="fw-bold">You will be charged $600 CAD now</span>, and then each year until you cancel your subscription.</p>
    </form>
  );
};