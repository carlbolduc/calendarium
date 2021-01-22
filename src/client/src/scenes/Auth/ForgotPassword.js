import React, {useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [resetRequested, setResetRequested] = useState(false);
  const [unknownEmail, setUnknownEmail] = useState(false);

  useEffect(() => {
    if (requesting) {
      setUnknownEmail(false);
      axios.post(`${process.env.REACT_APP_API}/auth/password-resets`, {
        email: email
      })
        .then(() => {
          setRequesting(false);
          setResetRequested(true);
        })
        .catch(err => {
          if (err.response.status === 404) {
            setRequesting(false);
            setUnknownEmail(true);
          }
        });
    }
  }, [email, requesting])

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  const warning = unknownEmail ? (
    <div className="alert alert-warning">
      {props.translate("Sorry, we didn’t recognize your email address. Want to try again?")}
    </div>
  ) : null;

  const main = resetRequested ? (
      <p>{props.translate("You will receive password reset instructions by email shortly.")}</p>
    ) : (
      <>
        <h1>{props.translate("Forgot your password?")}</h1>
        <form onSubmit={handleSubmit} id="form-forgot-password">
          {warning}
          <Input
            label={props.translate("Enter your email address below and we’ll send you password reset instructions.")}
            type="email"
            id="input-email"
            required={true}
            placeholder={props.translate("Enter your email address.")}
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <Button label={props.translate("Email me reset instructions")} type="submit" working={requesting} id="button-forgot-password" />
        </form>
      </>
    )
  ;
  return props.authenticated ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      {main}
    </div>
  );
}