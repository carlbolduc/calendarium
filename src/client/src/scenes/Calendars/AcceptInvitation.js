import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useParams, Redirect } from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { passwordValid, decideWhatToDisplay } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function AcceptInvitation(props) {
  let { link } = useParams();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    props.getCalendar({ link: link, calendarAccessId: query.get("id") });
  }, []);

  useEffect(() => {
    if (props.calendar.calendarId !== null) {
      props.getCalendarInvitation({ calendarId: props.calendar.calendarId, calendarAccessId: query.get("id") });
    }
  }, [props.calendar]);

  useEffect(() => {
    if (requesting) {
      // TODO: add password validations
      props.resetPassword({
        id: query.get("id"),
        password: password
      }, result => {
        if (result.success === true) {
          setAccepted(true);
        }
        setResult(result);
        setRequesting(false);
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordValid(password)) {
      setRequesting(true);
    } else {
      setInvalidPassword(true);
    }

  }

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Invitation to collaborate to")} ${calendarName}`;

  const main = (
    <>
      <h1>{title}</h1>
      <Message result={result} origin="acceptInvitation" translate={props.translate} />
      {/* TODO: think about this copy, then add props.translate */}
      <h5>Welcome to Calendarium.</h5>
      <p>You have been invited to collaborate to a calendar. The email associated with your account is the email at which you receive your invitation. If you want to change it, you will be able to do so later in your account profile.</p>
      <p>To complete your account creation, enter a password for your account, then accept the invitation to get started.</p>
      {/* TODO: hide the password form if account already has a password, and adjust welcome message */}
      <form onSubmit={handleSubmit} id="form-accept-invitation" noValidate>
        <Input
          label={props.translate("Password")}
          type="password"
          id="input-password"
          required={true}
          placeholder={props.translate("Enter a password.")}
          value={password}
          handleChange={(e) => {
            setPassword(e.target.value);
            setInvalidPassword(false);
          }}
          invalidFeedback={invalidPassword ? <InvalidFeedback feedback="Your password must be at least 8 characters long." /> : null}
        />
        <Button label={props.translate("Accept the invitation")} type="submit" working={requesting} id="button-accept-invitation" />
      </form>
    </>
  );

  return accepted ? (
    <Redirect to={{ pathname: `/${link}` }} />
  ) : (
    <div className="p-5">
      {main}
    </div>
  );
}