import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function SignUp(props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    return () => props.clearMessages();
  }, []);

  useEffect(() => {
    if (requesting) {
      props.signUp({
        'name': name,
        'email': email,
        'password': password
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

  const errors = props.messages.filter(m => m.type === 'error').map(e => (
    <li key={e.id} onClick={() => props.clearMessage(e.id)}>{e.message}</li>
  ));

  return props.authenticated ? (
    <Redirect to={{pathname: '/'}}/>
  ) : (
    <div className="p-5">
      <h1>{props.translate("Create an account")}</h1>
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
          label={props.translate("Password")}
          type="password"
          id="input-password"
          required={true}
          placeholder={props.translate("Choose a password.")}
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <p className="small">{props.translate("Already have an account? Sign in")} <Link to="/sign-in">{props.translate("here")}</Link>.</p>
        <Button label={props.translate("Sign up")} type="submit" working={requesting} id="button-sign-up"/>
      </form>
    </div>
  );
}