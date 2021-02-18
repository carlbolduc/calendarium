import React, {useState} from "react";
import {Redirect} from "react-router-dom";
import NewCalendarForm from "./NewCalendarForm";

export default function MyCalendars(props) {
  const [showNewCalendarForm, setShowNewCalendarForm] = useState(false);

  function createCalendar() {
    const data = {
      enableFr: false,
      enableEn: true,
      nameFr: "",
      nameEn: "gro"
    }
    props.createCalendar(data, result => {
      console.log("TODO: what do we do here?");
    });
  }

  const calendars = props.calendars.map(c => (
    <li key={c.calendarId}>{c.calendarId}</li>
  ));

  const newCalendarButton = showNewCalendarForm ? null : (
    <button className="btn btn-primary" onClick={() => setShowNewCalendarForm(true)}>New Calendar</button>
  );

  const newCalendarForm = showNewCalendarForm ? (
    <NewCalendarForm translate={props.translate} cancel={() => setShowNewCalendarForm(false)}/>
  ) : null;

  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My calendars")}</h1>
      <ul>{calendars}</ul>
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