import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { emailValid, passwordValid, textValid, getLocale } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function Profile(props) {
  const [name, setName] = useState(props.account.name);
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState(props.account.email);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("")
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    setName(props.account.name);
    setEmail(props.account.email);
  }, [props.account]);

  useEffect(() => {
    if (requesting) {
      const data = newPassword !== "" ? (
        {
          "name": name,
          "email": email,
          "currentPassword": currentPassword,
          "newPassword": newPassword
        }
      ) : (
          {
            "name": name,
            "email": email
          }
        );
      props.updateAccount(data, result => {
        setCurrentPassword("");
        setNewPassword("");
        setResult(result);
        setRequesting(false);
      });
    }
  }, [requesting, name, email, currentPassword, newPassword])

  function handleSubmit(e) {
    e.preventDefault();
    if (textValid(name) && emailValid(email)) {
      if (newPassword === "") {
        // No new password is provided, we can submit the change
        setRequesting(true);
      } else {
        // New password is provided, current password must be submitted
        if (passwordValid(currentPassword) && passwordValid(newPassword)) {
          setRequesting(true);
        } else {
          if (!passwordValid(currentPassword)) setInvalidCurrentPassword(true);
          if (!passwordValid(newPassword)) setInvalidNewPassword(true);
        }
      }
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
      if (newPassword !== "") {
        // New password is provided, current password must be submitted
        if (!passwordValid(currentPassword)) setInvalidCurrentPassword(true);
        if (!passwordValid(newPassword)) setInvalidNewPassword(true);
      }
    }
  }

  const memberSince = props.account ? (
    <p className="small">{props.translate("Member since")} {DateTime.fromSeconds(props.account.createdAt).setLocale(getLocale(props.language)).toLocaleString(DateTime.DATETIME_FULL)}</p>
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
          placeholder={props.translate("Enter your first name and last name.")}
          value={name}
          handleChange={(e) => {
            setName(e.target.value);
            setInvalidName(false);
          }}
          invalidFeedback={invalidName ? <InvalidFeedback feedback="You must enter a name." /> : null}
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
          invalidFeedback={invalidEmail ? <InvalidFeedback feedback="You must enter a valid email address." /> : null}
        />
        <Input
          label={props.translate("Current password")}
          type="password"
          id="input-current-password"
          autoComplete="new-password"
          required={false}
          placeholder={props.translate("If you want to change your password, enter your current password.")}
          value={currentPassword}
          handleChange={(e) => {
            setCurrentPassword(e.target.value);
            setInvalidCurrentPassword(false);
          }}
          invalidFeedback={invalidCurrentPassword ? <InvalidFeedback feedback="Your existing password must be provided when you want to update it." /> : null}
        />
        <Input
          label={props.translate("New password")}
          type="password"
          id="input-new-password"
          required={currentPassword !== ""}
          placeholder={props.translate("If you want to change your password, enter a new password.")}
          value={newPassword}
          handleChange={(e) => {
            setNewPassword(e.target.value);
            setInvalidNewPassword(false);
          }}
          invalidFeedback={invalidNewPassword ? <InvalidFeedback feedback="Your new password must be at least 8 characters long." /> : null}
        />
        {memberSince}
        {/* TODO: disable button when nothing has changed in the form */}
        <Button label={props.translate("Save")} type="submit" working={requesting} id="button-save" />
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
