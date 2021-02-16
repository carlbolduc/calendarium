import React from 'react';
import { Redirect } from 'react-router-dom';

export default function MyCalendars(props) {
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
  ))
  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("My calendars")}</h1>
      <ul>{calendars}</ul>
      <button className="btn" onClick={createCalendar}>Create Calendar</button>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: '/sign-in',
        state: { from: '/subscription' }
      }}
    />
  );
}