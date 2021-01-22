import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticationFailed, setAuthenticationFailed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setAuthenticationFailed(false);
    const base64StringOfUserColonPassword = btoa(`${email}:${password}`);
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/auth/sign-in`,
      headers: {
        Authorization: 'Basic ' + base64StringOfUserColonPassword,
      },
    })
      .then(res => {
        if (res.status === 200) {
          props.signIn(res.data);
        } else {
          // authentication failed
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          setAuthenticationFailed(true);
        }
      });
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
          label="Email"
          type="email"
          id="input-email"
          required={true}
          placeholder="Enter your email address."
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          id="input-password"
          required={true}
          placeholder="Enter your password."
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <p className="small">Need an account? Sign up <Link to="/sign-up">here</Link>. | Forgot your password? Request a
          reset <Link to="/forgot-password">here</Link>.</p>
        <Button label="Sign In" type="submit" id="button-sign-in"/>
      </form>
    </div>
  );

}

SignIn.propTypes = {
  signIn: PropTypes.func,
}