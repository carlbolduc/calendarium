import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Checkbox from "../../components/Form/Checkbox";
import Message from "../../components/Form/Message";

export default function SignUp(props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
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
    // TODO: add password validations
    e.preventDefault();
    setRequesting(true);
  }

  return props.authenticated ? (
    <Redirect to={{ pathname: "/" }} />
  ) : (
      <>
        <div className="p-5">
          <h1>{props.translate("Create an account")}</h1>
          <Message result={result} origin="signUp" translate={props.translate} />
          <form onSubmit={handleSubmit} id="form-sign-up">
            <Input
              label={props.translate("Name")}
              type="text"
              id="input-name"
              required={true}
              placeholder={props.translate("Enter your first name and last name.")}
              value={name}
              handleChange={(e) => setName(e.target.value)}
            />
            <Input
              label={props.translate("Email")}
              type="email"
              id="input-email"
              required={true}
              placeholder={props.translate("Enter your email address.")}
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label={props.translate("Password")}
              type="password"
              id="input-password"
              required={true}
              placeholder={props.translate("Choose a password.")}
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
            />
            <div className="row">
              <div className="col-auto">
                <Checkbox
                  label={props.translate("I agree to the terms and conditions.")}
                  id="terms-conditions"
                  value={termsConditions}
                  required={true}
                  handleChange={(e) => setTermsConditions(e.target.value)}
                  invalidFeedback={props.translate("You must agree before signing up.")}
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
        </div>
      </>
    );
}