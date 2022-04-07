import {loadStripe} from "@stripe/stripe-js";
import React, {useEffect, useState} from "react";
import Button from "../../components/Form/Button";

export default function UpdateBillingInformationButton(props) {
  const [sessionId, setSessionId] = useState(null);
  const [working, setWorking] = useState(false);

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK, {
    locale: props.localeId === "frCa" ? "fr-CA" : "en",
  });

  useEffect(() => {
    if (sessionId !== null) {
      stripePromise.then(stripe => {
        stripe.redirectToCheckout({sessionId});
      })
    }
  }, [sessionId]);

  const handleClick = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setWorking(true);

    if (!stripePromise) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    props.createCheckoutSession(result => {
      setSessionId(result);
    });

  }

  return (
    <Button
      label={props.translate("Update billing information")}
      type="button"
      id="button-update-billing"
      onClick={handleClick}
      working={working}
    />
  );
}