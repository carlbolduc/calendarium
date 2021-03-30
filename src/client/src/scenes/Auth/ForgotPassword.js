import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import {emailValid} from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function ForgotPassword(props) {
  const createPasswordReset = props.createPasswordReset;
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [working, setWorking] = useState(false);
  const [requested, setRequested] = useState(false);
  const [result, setResult] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid(email)) {
      setWorking(true);
      createPasswordReset({
        email: email
      }, result => {
        if (result.success === true) {
          setRequested(true);
        }
        setResult(result);
        setWorking(false);
      });
    } else {
      setInvalidEmail(true);
    }
  }

  const main = requested ? (
    <>
      <h1>{props.translate("Forgot your password?")}</h1>
      <Message result={result} origin="forgotPassword" translate={props.translate} />
    </>
  ) : (
      <>
        <h1>{props.translate("Forgot your password?")}</h1>
        <Message result={result} origin="forgotPassword" translate={props.translate} />
        <form onSubmit={handleSubmit} id="form-forgot-password" noValidate>
          <label className="form-label">{props.translate("Enter your email address below and we’ll send you password reset instructions.")}</label>
          <Input
            label={props.translate("Email")}
            type="email"
            id="input-email"
            required={true}
            placeholder={props.translate("Enter your email address.")}
            value={email}
            handleChange={(e) => {
              setEmail(e.target.value);
              setInvalidEmail(false);
            }}
            invalidFeedback={invalidEmail ? <InvalidFeedback feedback="You must enter a valid email address."/> : null}
          />
          <Button label={props.translate("Email me reset instructions")} type="submit" id="button-forgot-password" working={working} />
        </form>
      </>
    );

  return props.authenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
      <article>
        {main}
      </article>
    );
}