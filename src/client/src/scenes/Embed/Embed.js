import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import Month from "../Calendars/Month";
import Event from "../Events/Event";


export default function Embed(props) {
  let { id } = useParams();
  const [currentDay, setCurrentDay] = useState(DateTime.now());

  useEffect(() => {
    console.log(id)
  }, []);

  const calendarEvents = props.calendarEvents.map(e => (
    <Event key={e.eventId} event={e} language={props.language} />
  ));

  return (
    <div className="mt-4 px-0">
      <div className="row justify-content-center">
        <div className="col-12 col-md-auto">
          <Month
            startWeekOn={props.calendar.startWeekOn}
            currentDay={currentDay}
            selectDay={date => setCurrentDay(date)}
            setCurrentDay={setCurrentDay}
            language={props.language}
          />
        </div>
        <div className="col-12 col-md">
          <h2>Events</h2>
          {calendarEvents}
        </div>
      </div>
    </div>
  );

}

Embed.propTypes = {
  calendar: PropTypes.object.isRequired,
  getCalendar: PropTypes.func.isRequired,
  calendarEvents: PropTypes.array.isRequired,
  getCalendarEvents: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired
};
