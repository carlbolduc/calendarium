import React, {useEffect, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function SignUp(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);

  useEffect(() => {
    if (requesting) {
      setEmailAlreadyExist(false);
      axios.post(`${process.env.REACT_APP_API}/auth/sign-up`, {
        "name": name,
        "email": email,
        "password": password
      })
        .then(res => {
          if (res.status === 201) {
            setRequesting(false);
            props.signIn(res.data);
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

  return props.authenticated ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit} id="form-sign-up">
        <Input
          label="Name"
          type="text"
          id="input-name"
          required={true}
          placeholder="Enter your first name and last name."
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
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
          placeholder="Choose a password."
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <p className="small">Already have an account? Sign in <Link to="/sign-in">here</Link>.</p>
        <Button label="Sign Up" type="submit" working={requesting} id="button-sign-up"/>
      </form>
    </div>
  );
}