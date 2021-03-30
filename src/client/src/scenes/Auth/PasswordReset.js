import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {Redirect} from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { passwordValid } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function PasswordReset(props) {
  const resetPassword = props.resetPassword;
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [reseted, setReseted] = useState(false);
  const [result, setResult] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordValid(newPassword)) {
      setWorking(true);
      const query = new URLSearchParams(location.search);
      resetPassword({
        id: query.get("id"),
        password: newPassword
      }, result => {
        if (result.success === true) {
          setReseted(true);
        }
        setResult(result);
        setWorking(false);
      });
    } else {
      setInvalidNewPassword(true);
    }
  }

  const main = reseted ? (
    <>
      <h1>{props.translate("Reset your password")}</h1>
      <Message result={result} origin="passwordReset" translate={props.translate} />
    </>
  ) : (
    <>
      <h1>{props.translate("Reset your password")}</h1>
      <Message result={result} origin="passwordReset" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-password-reset" noValidate>
        <Input
          label={props.translate("New password")}
          type="password"
          id="input-new-password"
          required={true}
          placeholder={props.translate("Enter a new password.")}
          value={newPassword}
          handleChange={(e) => {
            setNewPassword(e.target.value);
            setInvalidNewPassword(false);
          }}
          invalidFeedback={invalidNewPassword ? <InvalidFeedback feedback={props.translate("Your password must be at least 8 characters long.")} /> : null}
        />
        <Button label={props.translate("Reset my password")} type="submit" id="button-reset-password" working={working} />
      </form>
    </>
  );

  // Authenticated use should not see this page unless they weren't autenticated when they interracted with the form
  return props.authenticated && newPassword === "" ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <article>
      {main}
    </article>
  );
}