import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "../../components/Form/Button";
import Input from "../../components/Form/Input";
import Select from "../../components/Form/Select";

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

  function countries() {
    // TODO: generate list of all countries, maybe from an open API?
    return (
      [
        { value: "CA", label: "Canada" },
        { value: "US", label: "United States" }
      ]
    );
  }

  function states() {
    // TODO: generate list of all states, maybe from an open API?
    return (
      [
        { value: "QC", label: "Quebec" },
        { value: "ON", label: "Ontario" }
      ]
    );
  }

  return (
    // TODO: use {props.translate("")} for text visible in the app
    <form onSubmit={handleSubmit} id="form-subscribe">
      <p>You're ready for Calendarium Unlimited! Enter your payment info below.</p>
      <h5>Credit card details</h5>
      <CardNumberElement className="form-control mb-2" />
      <CardExpiryElement className="form-control mb-2" />
      <CardCvcElement className="form-control mb-2" />
      <h5 className="mt-4">Billing address</h5>
      <Input
        label="Street address"
        id="line1"
        name="line1"
        type="text"
        placeholder="Enter your street address."
        required={true}
      />
      <Input
        label="City"
        id="city"
        name="city"
        type="text"
        placeholder="Enter your city."
        required={true}
      />
      <Select
        label="Country"
        id="country"
        name="country"
        ariaLabel="Country"
        placeholder="Select your country."
        options={countries()}
        required={true}
      />
      <Select
        label="State"
        id="state"
        name="state"
        ariaLabel="State"
        placeholder="Select your state."
        options={states()}
        required={true}
      />
      <Input
        label="Postal code"
        id="postal_code"
        name="postal_code"
        type="text"
        placeholder="Enter your postal code."
        required={true}
      />
      <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={props.cancel} />
      <Button label={props.translate("Subscribe")} type="submit" id="button-subscribe" disabled={!stripe} />
      <p><span className="fw-bold">You will be charged $600 CAD now</span>, and then each year until you cancel your subscription.</p>
    </form>
  );
};