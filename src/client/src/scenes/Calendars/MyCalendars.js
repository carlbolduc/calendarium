import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
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

  useEffect(() =>{
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
      result = (
        <div className="row">
          {sortedCalendars(props.calendars, props.language).map(c => (
            <CalendarPreview key={c.calendarId} calendar={c} language={props.language} translate={props.translate} />
          ))}
        </div>
      );
    }
    return result;
  }

  const newCalendarButton = props.subscribed ? (
    <Button
      label={props.translate("New calendar")}
      id="button-new-calendar"
      outline={true}
      onClick={() => {
        setShowCalendarForm(true);
        setCalendarFormResult(null);
      }}
    />
  ) : null;

  const actionButtonsZone = showCalendarForm ? null : (
    <div className="mb-4">
      {newCalendarButton}
    </div>
  );

  const calendarForm = showCalendarForm ? (
    <CalendarForm
      new={true}
      calendar={props.calendar}
      language={props.language}
      translate={props.translate}
      createCalendar={props.createCalendar}
      setShowCalendarForm={setShowCalendarForm}
      setResult={setCalendarFormResult}
    />
  ) : null;

  return props.authenticated ? (
    <article>
      {title}
      <Message result={calendarFormResult} origin="CalendarForm" translate={props.translate} />
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
