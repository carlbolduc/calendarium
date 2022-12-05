import React, {useState} from "react";
import PropTypes from "prop-types";
import Message from "../../components/Form/Message";
import Input from "../../components/Form/Input";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Checkbox from "../../components/Form/Checkbox";
import Button from "../../components/Form/Button";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {CARD_OPTIONS, emailValid, passwordValid, textValid} from "../../services/Helpers";

export default function SubscribeForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("")
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [termsConditions, setTermsConditions] = useState(false);
  const [invalidTermsAndConditions, setInvalidTermsAndConditions] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (textValid(name) && emailValid(email) && passwordValid(password) && termsConditions) {
      // Account details are valid, start to work
      setWorking(true);

      // Get a reference to a mounted CardElement.
      const cardElement = elements.getElement(CardElement);

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        // Stripe error
        console.log("[error]", error);
        setWorking(false);
      } else {
        // Account is valid, and we have a payment method, we can attempt to subscribe
        props.signUpAndSubscribe({
          signUp: {
            "name": name,
            "email": email,
            "password": password
          },
          paymentMethodDetails: paymentMethod
        }, () => {
          setWorking(false);
        });
      }
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
      if (!passwordValid(password)) setInvalidPassword(true);
      if (!termsConditions) setInvalidTermsAndConditions(true);
    }
  };

  return (
    <article>
      <h5 className="mt-4">{props.translate("Account details")}</h5>
      <Message result={result} origin="signUp" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-sign-up" noValidate>
        <Input
          label={props.translate("Name")}
          type="text"
          id="input-name"
          required={true}
          value={name}
          handleChange={(e) => {
            setName(e.target.value);
            setInvalidName(false);
          }}
          invalidFeedback={invalidName ? <InvalidFeedback feedback={props.translate("You must enter your first name and last name.")} /> : null}
        />
        <Input
          label={props.translate("Email")}
          type="email"
          id="input-email"
          required={true}
          value={email}
          handleChange={(e) => {
            setEmail(e.target.value);
            setInvalidEmail(false);
          }}
          invalidFeedback={invalidEmail ? <InvalidFeedback feedback={props.translate("You must enter a valid email address.")} /> : null}
        />
        <Input
          label={props.translate("Password")}
          type="password"
          id="input-password"
          required={true}
          value={password}
          handleChange={(e) => {
            setPassword(e.target.value);
            setInvalidPassword(false);
          }}
          invalidFeedback={invalidPassword ? <InvalidFeedback feedback={props.translate("Your password must be at least 8 characters long.")} /> : null}
        />
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

        <div className="row mt-4">
          <div className="col-sm-auto col-12 pe-sm-0">
            <Checkbox
              label={props.translate("I agree to the terms of service.")}
              id="terms-conditions"
              value={termsConditions}
              required={true}
              handleChange={(e) => {
                setTermsConditions(e.target.checked);
                setInvalidTermsAndConditions(false);
              }}
              invalidFeedback={invalidTermsAndConditions ? <InvalidFeedback feedback={props.translate("You must agree to the terms of service.")} /> : null}
            />
          </div>
          <div className="col-md col-12 ps-md-1">
            <p>{props.translate("They can be read ")}&nbsp;<a href="http://codebards.io/policies/terms/" target="_blank" rel="noreferrer">{props.translate("here")}</a>.</p>
          </div>
        </div>
        <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={props.cancel} disabled={working} outline={true} />
        <Button label={props.translate("Subscribe")} type="submit" id="button-sign-up" working={working} />
        <p><span className="fw-bold">{props.translate("You will be charged $10 CAD now, plus any applicable* sales taxes")}</span>, {props.translate("and then each month until you cancel your subscription.")}</p>
        <small className="fst-italic">{props.translate("*We currently charge sales taxes only to Canadian customers.")}</small>
      </form>
    </article>
  );
}

SubscribeForm.propTypes = {
  translate: PropTypes.func,
  cancel: PropTypes.func,
  signUpAndSubscribe: PropTypes.func
}