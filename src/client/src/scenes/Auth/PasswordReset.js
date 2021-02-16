import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {Redirect} from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";

export default function PasswordReset(props) {
  let { id } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [reseted, setReseted] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (requesting) {
      // TODO: add password validations
      props.resetPassword({
        id: id,
        password: newPassword
      }, result => {
        if (result.success === true) {
          setReseted(true);
        }
        setResult(result);
        setRequesting(false);
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  const main = reseted ? (
    <>
      <h1>{props.translate("Reset your password")}</h1>
      <Message result={result} origin="passwordReset" translate={props.translate} />
    </>
  ) : (
    <>
      <h1>{props.translate("Reset your password")}</h1>
      <Message result={result} origin="passwordReset" translate={props.translate} />
      <form onSubmit={handleSubmit} id="form-password-reset">
        <Input
          label={props.translate("New password")}
          type="password"
          id="input-new-password"
          required={true}
          placeholder={props.translate("Enter a new password.")}
          value={newPassword}
          handleChange={(e) => setNewPassword(e.target.value)}
        />
        <Button label={props.translate("Reset my password")} type="submit" working={requesting} id="button-rest-password"/>
      </form>
    </>
  );
  
  return props.authenticated ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      {main}
    </div>
  );
}