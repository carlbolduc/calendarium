import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {textValid, emailValid, passwordValid} from "../../services/Helpers";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Checkbox from "../../components/Form/Checkbox";
import Message from "../../components/Form/Message";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function SignUp(props) {
  const [name, setName] = useState("")
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [termsConditions, setTermsConditions] = useState(false);
  const [invalidTermsAndConditions, setInvalidTermsAndConditions] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (requesting) {
      props.signUp({
        "name": name,
        "email": email,
        "password": password
      }, result => {
        setResult(result);
        setRequesting(false);
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email) && passwordValid(password) && termsConditions) {
      setRequesting(true);
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
      if (!passwordValid(password)) setInvalidPassword(true);
      if (!termsConditions) setInvalidTermsAndConditions(true);
    }
  }

  return props.authenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
      <>
        <article>
          <h1>{props.translate("Create an account")}</h1>
          <Message result={result} origin="signUp" translate={props.translate} />
          <form onSubmit={handleSubmit} id="form-sign-up" noValidate>
            <Input
              label={props.translate("Name")}
              type="text"
              id="input-name"
              required={true}
              placeholder={props.translate("Enter your first name and last name.")}
              value={name}
              handleChange={(e) => {
                setName(e.target.value);
                setInvalidName(false);
              }}
              invalidFeedback={invalidName ? <InvalidFeedback feedback="You must enter a name."/> : null}
            />
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
            <Input
              label={props.translate("Password")}
              type="password"
              id="input-password"
              required={true}
              placeholder={props.translate("Choose a password.")}
              value={password}
              handleChange={(e) => {
                setPassword(e.target.value);
                setInvalidPassword(false);
              }}
              invalidFeedback={invalidPassword ? <InvalidFeedback feedback="Your password must be at least 8 characters long."/> : null}
            />
            <div className="row">
              <div className="col-auto">
                <Checkbox
                  label={props.translate("I agree to the terms and conditions.")}
                  id="terms-conditions"
                  value={termsConditions}
                  required={true}
                  handleChange={(e) => {
                    setTermsConditions(e.target.checked);
                    setInvalidTermsAndConditions(false);
                  }}
                  invalidFeedback={invalidTermsAndConditions ? <InvalidFeedback feedback="You must agree before submitting."/> : null}
                />
              </div>
              <div className="col">
                {/* TODO: create the page /terms-conditions */}
                <p className="small">{props.translate("You can read them ")} <Link to="/terms-conditions">{props.translate("here")}</Link>.</p>
              </div>
            </div>
            <Button label={props.translate("Sign up")} type="submit" working={requesting} id="button-sign-up" />
          </form>
          <p className="small">{props.translate("Already have an account? Sign in")} <Link to="/sign-in">{props.translate("here")}</Link>.</p>
        </article>
      </>
    );
}