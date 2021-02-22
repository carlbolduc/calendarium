import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import NewCalendarForm from "./NewCalendarForm";
import Message from "../../components/Form/Message";
import Button from "../../components/Form/Button";

export default function MyCalendars(props) {
  const [showNewCalendarForm, setShowNewCalendarForm] = useState(false);
  const [newCalendarFormResult, setNewCalendarFormResult] = useState(null);

  const calendars = props.calendars.map(c => (
    <li key={c.calendarId}>{c.nameEn}</li>
  ));

  const newCalendarButton = showNewCalendarForm || !props.subscribed ? null : (
    <Button 
      label={props.translate("New calendar")} 
      id="button-new-calendar" 
      onClick={() => {
        setShowNewCalendarForm(true);
        setNewCalendarFormResult(null);
      }} 
    />
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
      <Message result={newCalendarFormResult} origin="newCalendarForm" translate={props.translate} />
      {newCalendarButton}
      {newCalendarForm}
      <ul>{calendars}</ul>
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