import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { passwordValid } from "../../services/Helpers";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function ProfilePassword(props) {
  const updateAccountPassword = props.updateAccountPassword;
  const [currentPassword, setCurrentPassword] = useState("");
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("")
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // New password is provided, current password must be submitted
    if (passwordValid(currentPassword) && passwordValid(newPassword)) {
      setWorking(true);
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      updateAccountPassword(data, (result) => {
        setCurrentPassword("");
        setNewPassword("");
        setResult(result);
        setWorking(false);
      });
    } else {
      if (!passwordValid(currentPassword)) setInvalidCurrentPassword(true);
      if (!passwordValid(newPassword)) setInvalidNewPassword(true);
    }
  }

  return (
    <article>
      <h1>{props.translate("Change my password")}</h1>
      <Message result={result} origin="profilePassword" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-profile-password" noValidate>
        <Input
          label={props.translate("Current password")}
          type="password"
          id="input-current-password"
          autoComplete="new-password"
          required={false}
          value={currentPassword}
          handleChange={(e) => {
            setCurrentPassword(e.target.value);
            setInvalidCurrentPassword(false);
          }}
          invalidFeedback={invalidCurrentPassword ? <InvalidFeedback feedback={props.translate("You must provide your current password when you want to update it.")} /> : null}
        />
        <Input
          label={props.translate("New password")}
          type="password"
          id="input-new-password"
          required={currentPassword !== ""}
          value={newPassword}
          handleChange={(e) => {
            setNewPassword(e.target.value);
            setInvalidNewPassword(false);
          }}
          invalidFeedback={invalidNewPassword ? <InvalidFeedback feedback={props.translate("Your new password must be at least 8 characters long.")} /> : null}
        />
        <Button label={result.success ? props.translate("Back") : props.translate("Cancel")} type="button" id="button-cancel" onClick={props.cancel} disabled={working} outline={true} />
        {result.success ? null : <Button label={props.translate("Save")} type="submit" disabled={newPassword === ""} id="button-save" working={working} />}
      </form>
    </article>
  );
}

ProfilePassword.propTypes = {
  localeId: PropTypes.string.isRequired,
  updateAccountPassword: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};