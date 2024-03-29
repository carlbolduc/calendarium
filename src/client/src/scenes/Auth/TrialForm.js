import React, {useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {emailValid, passwordValid, textValid} from "../../services/Helpers";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Checkbox from "../../components/Form/Checkbox";
import Message from "../../components/Form/Message";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function TrialForm(props) {
  const signUp = props.signUp;
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

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email) && passwordValid(password) && termsConditions) {
      setWorking(true);
      signUp({
        "name": name,
        "email": email,
        "password": password
      }, result => {
        if (!result.success) {
          setResult(result);
          setWorking(false);
        }
      });
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
      if (!passwordValid(password)) setInvalidPassword(true);
      if (!termsConditions) setInvalidTermsAndConditions(true);
    }
  }

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
        <div className="row">
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
          <div className="col-sm col-12 ps-sm-0">
            <p>{props.translate("They can be read ")}&nbsp;<a href="http://codebards.io/policies/terms/" target="_blank" rel="noreferrer">{props.translate("here")}</a>.</p>
          </div>
        </div>
        <Button label={props.translate("Never mind")} type="button" id="button-never-mind" onClick={props.cancel} outline={true} />
        <Button label={props.translate("Start my trial")} type="submit" id="button-start-trial" working={working} />
      </form>
      <p className="small">{props.translate("Already have an account? Sign in")} <Link to="/sign-in">{props.translate("here")}</Link>.</p>
    </article>
  );
}

TrialForm.propTypes = {
  translate: PropTypes.func,
  cancel: PropTypes.func,
  signUp: PropTypes.func,
}