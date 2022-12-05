import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import CalendarForm from "./CalendarForm";
import Message from "../../components/Form/Message";
import Button from "../../components/Form/Button";
import CalendarPreview from "./CalendarPreview";
import { sortedCalendars } from "../../services/Helpers";

export default function MyCalendars(props) {
  const getCalendars = props.getCalendars;
  const clearCalendars = props.clearCalendars;
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarFormResult, setCalendarFormResult] = useState(null);

  useEffect(() => {
    getCalendars();
  }, [getCalendars]);

  useEffect(() => {
    return () => clearCalendars();
  }, [clearCalendars]);

  const title = !showCalendarForm ? (
    <h1>{props.translate("My calendars")}</h1>
  ) : null;

  function calendars() {
    let result = null;
    if (!showCalendarForm) {
      if (props.calendars.length > 0) {
        // There are calendars to display
        result = (
          <div className="row">
            {sortedCalendars(props.calendars, props.localeId).map(c => (
              <CalendarPreview key={c.calendarId} calendar={c} localeId={props.localeId} translate={props.translate} />
            ))}
          </div>
        );
      } else {
        // There are no calendars to display, show a welcoming message if the person has never been subscribed
        if (props.account.subscription === null) {
          result = (
            <>
              <p>{props.translate("Welcome!")}</p>
              <p>{props.translate("You don't have any calendar yet, so this page feels a little empty for now. But it won't always stay like this!")}</p>
              <p>{props.translate("For now, you can have a look at the")} <Link to="/public-calendars">{props.translate("Public calendars")}</Link> {props.translate("or if you're ready to create your own calendars, you can")} <Link to="/subscription">{props.translate("start a free Calendarium trial")}</Link>.</p>
              <p>{props.translate("We hope you enjoy your time here!")}</p>
            </>
          );
        }
      }
    }
    return result;
  }

  function newCalendarButton() {
    let result = null;
    // Show New calendar button to subscribed users, and to trial users who haven't created a calendar yet
    if (props.subscribed) {
      if ((props.account.subscription.product !== "trial") || (props.account.subscription.product === "trial" && props.calendars.length < 1)) {
        result = (
          <Button
            label={props.translate("New calendar")}
            id="button-new-calendar"
            outline={true}
            onClick={() => {
              setShowCalendarForm(true);
              setCalendarFormResult(null);
            }}
          />
        );
      }
    }
    return result;
  }

  const actionButtonsZone = showCalendarForm ? null : (
    <div className="mb-4">
      {newCalendarButton()}
    </div>
  );

  const calendarForm = showCalendarForm ? (
    <CalendarForm
      new={true}
      calendar={props.calendar}
      localeId={props.localeId}
      translate={props.translate}
      createCalendar={props.createCalendar}
      setShowCalendarForm={setShowCalendarForm}
      setResult={setCalendarFormResult}
    />
  ) : null;

  return props.authenticated ? (
    <article>
      {title}
      {actionButtonsZone}
      {calendars()}
      {calendarForm}
    </article>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: { from: "/subscription" }
      }}
    />
  );
}
