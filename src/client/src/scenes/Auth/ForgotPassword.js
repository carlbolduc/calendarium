import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../components/Form/Input';
import Button from '../../components/Form/Button';
import Message from "../../components/Form/Message";
import {emailValid} from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (requesting) {
      props.createPasswordReset({
        email: email
      }, result => {
        if (result.success === true) {
          setRequested(true);
        }
        setResult(result);
        setRequesting(false);
      })
    }
  }, [email, requesting])

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid(email)) {
      setRequesting(true);
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
          <Button label={props.translate("Email me reset instructions")} type="submit" working={requesting} id="button-forgot-password" />
        </form>
      </>
    );

  return props.authenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
      <div className="p-5">
        {main}
      </div>
    );
}