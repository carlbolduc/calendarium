import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticationFailed, setAuthenticationFailed] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (requesting) {
      props.signIn({
        "email": email,
        "password": password
      }, result => {
        console.log(result);
        setRequesting(false);
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  const warning = authenticationFailed ? (
    <div className="alert alert-warning">
      Sorry, we didn’t recognize your email address or your password. Want to try again?
    </div>
  ) : null;

  return props.authenticated ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      <h1>{props.translate("Sign in")}</h1>
      <form onSubmit={handleSubmit} id="form-sign-in">
        {warning}
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
          placeholder={props.translate("Enter your password.")}
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <p className="small">
          {props.translate("Need an account? Sign up")} <Link to="/sign-up">{props.translate("here")}</Link>. |&nbsp;
          {props.translate("Forgot your password? Request a reset")} <Link to="/forgot-password">{props.translate("here")}</Link>.</p>
        <Button label={props.translate("Sign in")} type="submit" id="button-sign-in"/>
      </form>
    </div>
  );

}