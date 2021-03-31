import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Button from "../../components/Form/Button";

export default function SubscribeForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [working, setWorking] = useState(false);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Start to work
    setWorking(true);

    // Get a reference to a mounted CardElement.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setWorking(false);
    } else {
      props.createSubscription(paymentMethod, () => {
        setWorking(false);
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
        fontSize: "16px",
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
    <form onSubmit={handleSubmit} id="form-subscribe">
      <p>{props.translate("You're ready for Calendarium unlimited! Enter your payment info below.")}</p>
      <h5>{props.translate("Credit card details")}</h5>
      <div className="row mb-3">
        <div className="col">
          <div className="card-element mt-3">
            <CardElement
              // @ts-ignore
              options={CARD_OPTIONS} />
          </div>
          <div id="powered-by-stripe">
            <a href="https://stripe.com/" target="_blank" rel="noreferrer" tabIndex={-1}><img src="/img/stripe.svg" alt="Powered by Stripe" /></a>
          </div>
        </div>
      </div>
      <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={props.cancel} disabled={working} outline={true} />
      <Button label={props.translate("Subscribe")} type="submit" id="button-subscribe" working={working} disabled={!stripe} />
      <p><span className="fw-bold">{props.translate("You will be charged $600 CAD now, plus any applicable* sales taxes")}</span>, {props.translate("and then each year until you cancel your subscription.")}</p>
      <small className="fst-italic">{props.translate("*We currently charge sales taxes only to Canadian customers.")}</small>
    </form>
  );
};