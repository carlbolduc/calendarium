import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Input from '../../components/Form/Input/Input';
import Button from '../../components/Form/Button/Button';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    return () => props.clearMessages();
  }, []);

  useEffect(() => {
    if (requesting) {
      props.createPasswordReset({
        email: email
      }, () => {
        setRequesting(false);
      })
    }
  }, [email, requesting])

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  // const warning = unknownEmail ? (
  //   <div className="alert alert-warning">
  //     {props.translate("Sorry, we didn’t recognize your email address. Want to try again?")}
  //   </div>
  // ) : null;

  const successes = props.messages.filter(m => m.type === "success").map(s => (
    <li key={s.id} onClick={() => props.clearMessage(s.id)}>{s.message}</li>
  ));

  const errors = props.messages.filter(m => m.type === "error").map(e => (
    <li key={e.id} onClick={() => props.clearMessage(e.id)}>{e.message}</li>
  ));

  const main = props.messages.find(m => m.type === "success") !== undefined ? (
    <p>{props.translate("You will receive password reset instructions by email shortly.")}</p>
  ) : (
      <>
        <h1>{props.translate("Forgot your password?")}</h1>
        <ul>
          {successes}
          {errors}
        </ul>
        <form onSubmit={handleSubmit} id="form-forgot-password">
          {/* {warning} */}
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
    <Redirect to={{ pathname: "/" }} />
  ) : (
      <div className="p-5">
        {main}
      </div>
    );
}