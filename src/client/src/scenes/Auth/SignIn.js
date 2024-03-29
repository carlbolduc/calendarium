import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { emailValid, passwordValid } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function SignIn(props) {
  const signIn = props.signIn;
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (emailValid(email) && passwordValid(password)) {
      setWorking(true);
      signIn({
        "email": email,
        "password": password
      }, result => {
        if (!result.success) {
          setResult(result);
          setWorking(false);
        }
        // Signed in user gets immediately redirected to home page
      });
    } else {
      if (!emailValid(email)) setInvalidEmail(true);
      if (!passwordValid(password)) setInvalidPassword(true);
    }
  }

  return props.authenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
    <article>
      <h1>{props.translate("Sign in")}</h1>
      <Message result={result} origin="signIn" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-sign-in" noValidate>
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
        <Button label={props.translate("Sign in")} type="submit" id="button-sign-in" working={working} />
      </form>
      <p className="small">
        {props.translate("Don't have an account? Start a trial")} <Link to="/subscription">{props.translate("here")}</Link>. |&nbsp;
          {props.translate("Forgot your password? Request a reset")} <Link to="/forgot-password">{props.translate("here")}</Link>.</p>
    </article>
  );
}