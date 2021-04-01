import React, { useEffect } from "react";
import { sortedCalendars } from "../../services/Helpers";
import CalendarPreview from "./CalendarPreview";

export default function PublicCalendars(props) {
  const getCalendars = props.getCalendars;

  useEffect(() => {
    getCalendars();
  }, [getCalendars])

  const calendars = sortedCalendars(props.calendars, props.localeId).map(c => (
    <CalendarPreview key={c.calendarId} calendar={c} localeId={props.localeId} translate={props.translate} />
  ));
  return (
    <article>
      <h1>{props.translate("Public calendars")}</h1>
      <div className="row">
        {calendars}
      </div>
    </article>
  );
}
