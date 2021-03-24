import React, {useEffect} from "react";
import CalendarPreview from "./CalendarPreview";

export default function PublicCalendars(props) {
  const getCalendars = props.getCalendars;

  useEffect(() => {
    getCalendars();
  }, [getCalendars])

  const calendars = props.calendars.map(c => (
    <CalendarPreview key={c.calendarId} calendar={c} language={props.language} translate={props.translate} />
  ));
  return (
    <article>
      <h1>{props.translate("Public calendars")}</h1>
      {calendars}
    </article>
  );
}
