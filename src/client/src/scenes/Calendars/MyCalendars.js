import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import CalendarForm from "./CalendarForm";
import Message from "../../components/Form/Message";
import Button from "../../components/Form/Button";
import CalendarPreview from "./CalendarPreview";

export default function MyCalendars(props) {
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarFormResult, setCalendarFormResult] = useState(null);

  const title = !showCalendarForm ? (
    <h1>{props.translate("My calendars")}</h1>
  ) : null;

  function calendars() {
    let result = null;
    if (!showCalendarForm) {
      result = (
        <div className="row">
          {props.calendars.map(c => (
            <CalendarPreview key={c.calendarId} calendar={c} language={props.language} translate={props.translate} />
          ))}
        </div>
      );
    };
    return result;
  }

  const newCalendarButton = showCalendarForm || !props.subscribed ? null : (
    <Button
      label={props.translate("New calendar")}
      id="button-new-calendar"
      onClick={() => {
        setShowCalendarForm(true);
        setCalendarFormResult(null);
      }}
    />
  );

  const calendarForm = showCalendarForm ? (
    <CalendarForm
      new={true}
      translate={props.translate}
      cancel={() => setShowCalendarForm(false)}
      createCalendar={props.createCalendar}
      hideForm={() => setShowCalendarForm(false)}
      setResult={setCalendarFormResult}
    />
  ) : null;

  return props.authenticated ? (
    <div className="p-5">
      {title}
      <Message result={calendarFormResult} origin="CalendarForm" translate={props.translate} />
      {calendars()}
      {newCalendarButton}
      {calendarForm}
    </div>
  ) : (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: { from: "/subscription" }
        }}
      />
    );
}