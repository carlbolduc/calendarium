import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import NewCalendarForm from "./NewCalendarForm";
import Message from "../../components/Form/Message";
import CalendarPreview from "./CalendarPreview";

export default function MyCalendars(props) {
  const [showNewCalendarForm, setShowNewCalendarForm] = useState(false);
  const [newCalendarFormResult, setNewCalendarFormResult] = useState(null);

  const calendars = props.calendars.map(c => (
    <CalendarPreview key={c.id} calendar={c} />
  ));

  const newCalendarButton = showNewCalendarForm ? null : (
    <button className="btn btn-primary" onClick={() => {
      setShowNewCalendarForm(true);
      setNewCalendarFormResult(null);
    }}>New Calendar</button>
  );

  const newCalendarForm = showNewCalendarForm ? (
    <NewCalendarForm
      translate={props.translate}
      cancel={() => setShowNewCalendarForm(false)}
      createCalendar={props.createCalendar}
      hideForm={() => setShowNewCalendarForm(false)}
      setResult={setNewCalendarFormResult}
    />
  ) : null;

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My calendars")}</h1>
      <Message result={newCalendarFormResult} origin="NewCalendarForm" translate={props.translate} />
      {calendars}
      {newCalendarButton}
      {newCalendarForm}
    </div>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: {from: "/subscription"}
      }}
    />
  );
}