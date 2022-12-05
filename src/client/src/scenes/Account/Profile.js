import React, {useEffect, useState} from "react";
import {Redirect} from "react-router-dom";
import {DateTime} from "luxon";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import {emailValid, getLocale, textValid} from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import ProfilePassword from "./ProfilePassword";

export default function Profile(props) {
  const updateAccount = props.updateAccount;
  const [name, setName] = useState(props.account.name);
  const [invalidName, setInvalidName] = useState(false);
  const [email, setEmail] = useState(props.account.email);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [working, setWorking] = useState(false);
  const [formResult, setFormResult] = useState("");
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

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
      updateAccount(data, (formResult) => {
        setFormResult(formResult);
        setWorking(false);
        if (formResult.success) {
          setShowEditProfileForm(false);
        }
      });
    } else {
      if (!textValid(name)) setInvalidName(true);
      if (!emailValid(email)) setInvalidEmail(true);
    }
  }

  function cancelEditProfile() {
    setName(props.account.name);
    setEmail(props.account.email);
    setFormResult("");
    setShowEditProfileForm(false)
  }

  debugger
  const memberSince = props.account ? (
    <p>{props.translate("Member since")} {DateTime.fromSeconds(props.account.createdAt).setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATETIME_FULL)}</p>
  ) : null;

  const editProfileButton = (
    <Button
      label={props.translate("Edit my profile")}
      id="button-edit-profile"
      outline={true}
      onClick={() => {
        setFormResult("");
        setShowEditProfileForm(true);
      }}
    />
  );

  const changePasswordButton = (
    <Button
      label={props.translate("Change my password")}
      id="button-change-password"
      outline={true}
      onClick={() => {
        setShowChangePasswordForm(true);
      }}
    />
  );

  const actionButtonsZone = showEditProfileForm || showChangePasswordForm ? null : (
    <div className="mb-4">
      {editProfileButton}
      {changePasswordButton}
    </div>
  );

  function main() {
    let result;
    if (showEditProfileForm) {
      // We're editing profile name and email
      result = (
        <article>
          <h1>{props.translate("My profile")}</h1>
          <Message result={formResult} origin="profile" translate={props.translate} />
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
            <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={cancelEditProfile} disabled={working} outline={true} />
            <Button label={props.translate("Save")} type="submit" disabled={name === props.account.name && email === props.account.email} id="button-save" working={working} />
          </form>
        </article>
      );
    } else if (showChangePasswordForm) {
      // We're editing the password
      result = (
        <ProfilePassword
          localeId={props.localeId}
          updateAccountPassword={props.updateAccountPassword}
          translate={props.translate}
          cancel={() => setShowChangePasswordForm(false)}
        />
      );
    } else {
      // We're viewing profile in read only
      result = (
        <article>
          <h1>{props.translate("My profile")}</h1>
          <Message result={formResult} origin="profile" translate={props.translate} />
          {actionButtonsZone}
          <p>{props.translate("Name:")} {name}</p>
          <p>{props.translate("Email:")} {email}</p>
          {memberSince}
        </article>
      );
    }
    return result;
  }

  return props.authenticated ?
    main()
    : (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: { from: "/profile" }
        }}
      />
    );
}
