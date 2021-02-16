import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "../../components/Form/Button";

export default function SubscribeForm(props) {
  const [line1, setLine1] = useState("123");
  const [city, setCity] = useState("Quebec");
  const [country, setCountry] = useState("CA");
  const [state, setState] = useState("Quebec");
  const [postalCode, setPostalCode] = useState("G1S0C7");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardNumberElement = elements.getElement(CardNumberElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
      billing_details: {
        "address": {
          "city": city,
          "country": country,
          "line1": line1,
          "line2": null,
          "postal_code": postalCode,
          "state": state
        },
      }
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      props.createSubscription(paymentMethod, result => {
        // TODO: handle error after attempting to create subscription
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <input name="line1" type="text" />
      <input name="city" type="text" />
      <select name="country">
        <option value="CA">Canada</option>
      </select>
      <select name="state">
        <option value="QC">Quebec</option>
      </select>
      <input name="postal_code" type="text" />
      <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={() => props.setWantToSubscribe(false)} />
      <Button label={props.translate("Subscribe")} type="submit" id="button-subscribe" disabled={!stripe} />
    </form>
  );
};