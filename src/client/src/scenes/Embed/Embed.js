import React, { useState, useEffect } from "react";
import {useLocation, useParams} from "react-router-dom";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import Month from "../Calendars/Month";
import Event from "../Events/Event";
import {encodeObject} from "../../services/Helpers";


export default function Embed(props) {
  let { id } = useParams();
  const location = useLocation();
  const updateAccountLanguageId = props.updateAccountLanguageId;
  const getCalendar = props.getCalendar;
  const getCalendarEvents = props.getCalendarEvents;
  const [currentDay, setCurrentDay] = useState(DateTime.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.languages.length > 0) {
      getCalendar({id: id}, () => {
        setLoading(false);
      });
    }
  }, [props.languages, id, getCalendar]);

  useEffect(() => {
    if (props.languages.length > 0) {
      const query = new URLSearchParams(location.search);
      const queryLocale = query.get("locale");
      if (queryLocale !== null) {
        const language = props.languages.find(l => l.localeId.toLowerCase() === queryLocale.toLowerCase());
        if (language !== undefined) {
          updateAccountLanguageId(language.languageId);
        }
      }
    }
  }, [props.languages, location, updateAccountLanguageId]);

  useEffect(() => {
    if (props.calendar.calendarId !== null) {
      const q = encodeObject({ startAt: currentDay.toSeconds()});
      getCalendarEvents(props.calendar.calendarId, q, result => {
        // We do nothing with the result.
        // TODO: should we display the error if there is one (there should never be one)
      });
    }
  }, [props.calendar.calendarId, currentDay, getCalendarEvents])

  const calendarEvents = props.calendarEvents.map(e => (
    <Event key={e.eventId} event={e} language={props.language} />
  ));

  function main() {
    let result;
    if (loading) {
      result = (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else if (props.calendar.calendarId === null) {
      result = <div>We did not find a calendar for this URL.</div>
    } else {
      result = (
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
      );
    }
    return result;
  }

  return (
    <div className="mt-4 px-0">
      {main()}
    </div>
  );

}

Embed.propTypes = {
  calendar: PropTypes.object.isRequired,
  getCalendar: PropTypes.func.isRequired,
  calendarEvents: PropTypes.array.isRequired,
  getCalendarEvents: PropTypes.func.isRequired,
  languages: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
  updateAccountLanguageId: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};
