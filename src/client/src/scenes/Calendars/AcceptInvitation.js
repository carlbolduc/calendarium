import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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
      props.acceptCalendarInvitation({
        calendarId: props.calendarAccess.calendarId,
        calendarAccessId: props.calendarAccess.calendarAccessId,
        accountId: props.calendarAccess.accountId,
        password: password
      }, result => {
        if (result.success === true) {
          setAccepted(true);
        } else {
          setResult(result);
          setRequesting(false);
        }
      });
    }
  }, [requesting])

  function handleSubmit(e) {
    e.preventDefault();
    if (props.account.accountId !== null || passwordValid(password)) {
      setRequesting(true);
    } else {
      setInvalidPassword(true);
    }

  }

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Invitation to collaborate to")} ${calendarName}`;

  {/* TODO: think about this copy, then add props.translate */ }
  const instructions = props.account.accountId !== null ? (
    <>
      <p>You have been invited to collaborate to a calendar. Accept the invitation to get started.</p>
    </>
  ) : (
    <>
      <h5>Welcome to Calendarium.</h5>
      <p>You have been invited to collaborate to a calendar. The email associated with your account is the email at which you receive your invitation. If you want to change it, you will be able to do so later in your account profile.</p>
      <p>To complete your account creation, enter a password for your account, then accept the invitation to get started.</p>
    </>
  );

  const passwordField = props.account.accountId !== null ? null : (
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
  );

  // If user is signed in on a different account, don't show invitation
  const main = props.account.accountId !== null && props.calendarAccess.accountId !== props.account.accountId ? (
    <>
      <h1>Calendar invitation for someone else</h1>
      <p>You have clicked on a calendar invitation that was sent to an email address different than the one you are currently signed in with.</p>
      <p>If you think this is an error, <a href="mailto:grove@codebards.io">contact us in the grove</a>.</p>
      <Link to="/my-calendars">{props.translate("Back to my calendars")}</Link>
    </>
  ) : (
    <>
      <h1>{title}</h1>
      <Message result={result} origin="acceptInvitation" translate={props.translate} />
      {instructions}
      <form onSubmit={handleSubmit} id="form-accept-invitation" noValidate>
        {passwordField}
        <Button label={props.translate("Accept the invitation")} type="submit" working={requesting} id="button-accept-invitation" />
      </form>
    </>
  );

  return accepted ? (
    <Redirect to={{ pathname: `/${link}` }} />
  ) : (
    <article>
      {main}
    </article>
  );
}