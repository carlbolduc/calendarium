import React, {useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function Profile(props) {
  const [name, setName] = useState(props.account ? props.account.name : '');
  const [email, setEmail] = useState(props.account ? props.account.email : '');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);

  useEffect(() => {
    if (requesting) {
      setEmailAlreadyExist(false);
      const token = localStorage.getItem("token");
      axios({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts/${props.account.accountId}`,
        data: {
          "name": name,
          "email": email,
          "password": newPassword
        },
      })
        .then(res => {
          if (res.status === 200) {
            setRequesting(false);
            props.setAccount(res.data);
          }
        })
        .catch(err => {
          if (err.response.status === 409) {
            setRequesting(false);
            setEmailAlreadyExist(true);
          }
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

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("Profile")}</h1>
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
          required={true}
          placeholder={props.translate("Enter your current password.")}
          value={currentPassword}
          handleChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label={props.translate("New Password")}
          type="password"
          id="input-new-password"
          required={true}
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