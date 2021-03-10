import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {Redirect} from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { passwordValid } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function PasswordReset(props) {
  function useQuery() {
      return new URLSearchParams(useLocation().search);
    }
  const query = useQuery();
  const [newPassword, setNewPassword] = useState("");
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [reseted, setReseted] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (requesting) {
      // TODO: add password validations
      props.resetPassword({
        id: query.get("id"),
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
    if (passwordValid(newPassword)) {
      setRequesting(true);
    } else {
      setInvalidNewPassword(true);
    }

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
      <form onSubmit={handleSubmit} id="form-password-reset" noValidate>
        <Input
          label={props.translate("New password")}
          type="password"
          id="input-new-password"
          required={true}
          placeholder={props.translate("Enter a new password.")}
          value={newPassword}
          handleChange={(e) => {
            setNewPassword(e.target.value);
            setInvalidNewPassword(false);
          }}
          invalidFeedback={invalidNewPassword ? <InvalidFeedback feedback="Your password must be at least 8 characters long."/> : null}
        />
        <Button label={props.translate("Reset my password")} type="submit" working={requesting} id="button-rest-password"/>
      </form>
    </>
  );

  // TODO: authenticated comes in as "true" before reseted becomes true, find another way to stay on the page after the reset
  return props.authenticated && !reseted ? (
    <Redirect to={{pathname: "/"}}/>
  ) : (
    <div className="p-5">
      {main}
    </div>
  );
}