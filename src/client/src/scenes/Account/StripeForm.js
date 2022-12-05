import React, { useState } from "react";
import PropTypes from "prop-types";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Button from "../../components/Form/Button";
import {CARD_OPTIONS} from "../../services/Helpers";

export default function StripeForm(props) {
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

  return (
    <form onSubmit={handleSubmit} id="form-subscribe">
      <h5 className="mt-4">{props.translate("Credit card details")}</h5>
      <div className="row">
        <div className="col">
          <div className="card-element">
            <CardElement
              // @ts-ignore
              options={CARD_OPTIONS} />
          </div>
          <div id="powered-by-stripe">
            <a href="https://stripe.com/" target="_blank" rel="noreferrer" tabIndex={-1}><img src="/img/stripe.svg" alt="Powered by Stripe" /></a>
          </div>
        </div>
      </div>
      <Button label={props.translate("Never mind")} type="button" id="button-cancel" onClick={props.cancel} disabled={working} outline={true} />
      <Button label={props.translate("Subscribe")} type="submit" id="button-subscribe" working={working} disabled={!stripe} />
      <p><span className="fw-bold">{props.translate("You will be charged $10 CAD now, plus any applicable* sales taxes")}</span>, {props.translate("and then each month until you cancel your subscription.")}</p>
      <small className="fst-italic">{props.translate("*We currently charge sales taxes only to Canadian customers.")}</small>
    </form>
  );
};

StripeForm.propTypes = {
  translate: PropTypes.func,
  cancel: PropTypes.func,
  createSubscription: PropTypes.func,
}