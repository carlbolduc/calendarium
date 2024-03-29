import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useParams, Redirect } from "react-router-dom";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import Message from "../../components/Form/Message";
import { passwordValid, decideWhatToDisplay, calendarAccessStatus } from "../../services/Helpers";
import InvalidFeedback from "../../components/Form/InvalidFeedback";

export default function AcceptInvitation(props) {
  const getCalendar = props.getCalendar;
  const getCalendarInvitation = props.getCalendarInvitation;
  const acceptCalendarInvitation = props.acceptCalendarInvitation;
  let { link } = useParams();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    getCalendar({ link: link, calendarAccessId: query.get("id") });
  }, [getCalendar, link, location.search]);

  useEffect(() => {
    if (props.calendar.calendarId !== null) {
      const query = new URLSearchParams(location.search);
      getCalendarInvitation({ calendarId: props.calendar.calendarId, calendarAccessId: query.get("id") });
    }
  }, [getCalendarInvitation, props.calendar.calendarId, location.search]);

  function handleSubmit(e) {
    e.preventDefault();
    if (props.account.accountId !== null || passwordValid(password)) {
      setWorking(true);
      acceptCalendarInvitation({
        calendarId: props.calendarAccess.calendarId,
        calendarAccessId: props.calendarAccess.calendarAccessId,
        accountId: props.calendarAccess.accountId,
        password: password
      }, result => {
        if (result.success === true) {
          setAccepted(true);
        } else {
          setResult(result);
          setWorking(false);
        }
      });
    } else {
      setInvalidPassword(true);
    }

  }

  const calendarName = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Invitation to collaborate to")} ${calendarName}`;

  const instructions = props.account.accountId !== null ? (
    // If user is signed in, display shorter instructions
    <>
      <p>{props.translate("You have been invited to collaborate to a calendar. Accept the invitation to get started and view this calendar in My calendars.")}</p>
    </>
  ) : (
    // If user is new, display more extensive instructions
    <>
      <h5 className="mt-4">{props.translate("Welcome to Calendarium.")}</h5>
      <p>{props.translate("You have been invited to collaborate to a calendar. The email associated with your account is the email at which you receive your invitation. If you want to change it, you will be able to do so later in your account profile.")}</p>
      <p>{props.translate("To complete your account creation, enter a password for your account, then accept the invitation to get started.")}</p>
    </>
  );

  const passwordField = props.account.accountId !== null ? null : (
    <>
    <Input
      label={props.translate("Password")}
      type="password"
      id="input-password"
      required={true}
      value={password}
      handleChange={(e) => {
        setPassword(e.target.value);
        setInvalidPassword(false);
      }}
      invalidFeedback={invalidPassword ? <InvalidFeedback feedback={props.translate("Your password must be at least 8 characters long.")} /> : null}
    />
    <p>{props.translate("If you already have an account, you can")} <Link to="/sign-in">{props.translate("sign in here")}</Link> {props.translate("and then click again on the invitation link you've received.")}</p>
    </>
  );

  const backToMyCalendars = props.account.accountId !== null ? <Link to="/my-calendars">{props.translate("Back to my calendars")}</Link> : null;

  function main() {
    let result = null;
    // If user is signed in on a different account, show a message that invitation is for someone else
    if (props.account.accountId !== null && props.calendarAccess.accountId !== props.account.accountId) {
      result = (
        <>
          <h1>{props.translate("Calendar invitation")}</h1>
          <p>{props.translate("You have clicked on a calendar invitation that was sent to an email address different than the one you are currently signed in with.")}</p>
          <p>{props.translate("If you think this is an error")}, <a href="mailto:grove@codebards.io">{props.translate("contact us in the grove")}</a>.</p>
          {backToMyCalendars}
        </>
      );
    } else if (props.calendar.calendarId === null || props.calendarAccess.status !== calendarAccessStatus.INVITED) {
      // If no calendar can be found with queryparam, or invitation has already been accepted or has been revoked, show an invalid invitation error message
      // TODO: we could also add a check if calendar is in an expired subscription account, this would mean an invalid invitation
      result = (
        <>
          <h1>{props.translate("Calendar invitation")}</h1>
          <p>{props.translate("This calendar invitation is no longer valid.")}</p>
          <p>{props.translate("If you think this is an error")}, <a href="mailto:grove@codebards.io">{props.translate("contact us in the grove")}</a>.</p>
          {backToMyCalendars}
        </>
      );
    } else {
      // Invitation is valid, show form to accept it
      result = (
        <>
          <h1>{title}</h1>
          <Message result={result} origin="acceptInvitation" translate={props.translate} />
          {instructions}
          <form onSubmit={handleSubmit} id="form-accept-invitation" noValidate>
            {passwordField}
            <Button label={props.translate("Accept the invitation")} type="submit" id="button-accept-invitation" working={working} />
          </form>
        </>
      );
    }
    return result;
  }

  return accepted ? (
    <Redirect to={{ pathname: `/${link}` }} />
  ) : (
    <article>
      {main()}
    </article>
  );
}