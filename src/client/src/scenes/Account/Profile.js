import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { emailValid, textValid, getLocale } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function Profile(props) {
  const updateAccount = props.updateAccount;
  const [name, setName] = useState(props.account.name);
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState(props.account.email);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    setName(props.account.name);
    setEmail(props.account.email);
  }, [props.account]);

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email)) {
      setWorking(true);
      const data = {
        name: name,
        email: email,
      };
      updateAccount(data, (result) => {
        setResult(result);
        setWorking(false);
      });
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
    }
  }

  const memberSince = props.account ? (
    <p className="small">{props.translate("Member since")} {DateTime.fromSeconds(props.account.createdAt).setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATETIME_FULL)}</p>
  ) : null;

  return props.authenticated ? (
    <article>
      <h1>{props.translate("My profile")}</h1>
      <Message result={result} origin="profile" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-profile" noValidate>
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
        {memberSince}
        <p className="small">
          {props.translate("Change your password")} <Link to="/profile-password">{props.translate("here")}</Link>.
        </p>
        <Button label={props.translate("Save")} type="submit" disabled={name === props.account.name && email === props.account.email} id="button-save" working={working} />
      </form>
    </article>
  ) : (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: { from: "/profile" }
        }}
      />
    );
}
