import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import {Redirect} from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";

export default function PasswordReset(props) {
  const [invalidDigest, setInvalidDigest] = useState(false);
  let { id } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (requesting) {
      // TODO: validate that both passwords match
      props.resetPassword({
        id: id,
        password: newPassword
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

  return props.authenticated || invalidDigest ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      <h1>{props.translate("Reset your password")}</h1>
      <form onSubmit={handleSubmit} id="form-sign-up">
        <Input
          label={props.translate("Enter a new password")}
          type="password"
          id="input-new-password"
          required={true}
          value={newPassword}
          handleChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label={props.translate("Confirm your password")}
          type="password"
          id="input-new-password-confirmation"
          required={true}
          value={newPasswordConfirmation}
          handleChange={(e) => setNewPasswordConfirmation(e.target.value)}
        />
        <Button label={props.translate("Reset")} type="submit" working={requesting} id="button-rest-password"/>
      </form>
    </div>
  );
}