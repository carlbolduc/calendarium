import React, {useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function Profile(props) {
  const [name, setName] = useState(props.account.name);
  const [email, setEmail] = useState(props.account.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState('')
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    return () => props.clearMessages();
  }, []);

  useEffect(() => {
    if (requesting) {
      props.updateAccount({
        "name": name,
        "email": email,
        "password": newPassword
      }, () => {
        setRequesting(false);
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    // TODO: add password validations
    e.preventDefault();
    setRequesting(true);
  }

  function formatDateInternationalWithTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
  }

  const memberSince = props.account ?(
    <p className="small">{props.translate("Member since")} {formatDateInternationalWithTime(props.account.createdAt)}</p>
  ) : null;

  const errors = props.messages.filter(m => m.type === 'error').map(e => (
    <li key={e.id} onClick={() => props.clearMessage(e.id)}>{e.message}</li>
  ));

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My profile")}</h1>
      <ul>{errors}</ul>
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
          label={props.translate("Current Password")}
          type="password"
          id="input-current-password"
          required={false}
          placeholder={props.translate("Enter your current password.")}
          value={currentPassword}
          handleChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label={props.translate("New Password")}
          type="password"
          id="input-new-password"
          required={currentPassword !== ''}
          placeholder={props.translate("Choose a new password.")}
          value={newPassword}
          handleChange={(e) => setNewPassword(e.target.value)}
        />
        {memberSince}
        <Button label={props.translate("Save")} type="submit" working={requesting} id="button-save" />
      </form>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: '/sign-in',
        state: { from: '/profile' }
      }}
    />
  );
}