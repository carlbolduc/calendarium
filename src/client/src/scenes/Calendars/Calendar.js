import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { decideWhatToDisplay } from "../../services/Helpers";
import CalendarForm from "./CalendarForm";
import Button from "../../components/Form/Button";
import EventForm from "../Events/EventForm";
import Month from "./Month";

export default function Calendar(props) {
  let { link } = useParams();
  const [currentDay, setCurrentDay] = useState(DateTime.now().day);
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarFormResult, setCalendarFormResult] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormResult, setEventFormResult] = useState(null);

  useEffect(() => {
    props.getCalendar(link);

  }, [])

  function renderName() {
    let result = null;
    if (props.calendar !== null) {
      result = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
    }
    return result;
  }

  function renderDescription() {
    let result = null;
    if (props.calendar !== null) {
      result = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr);
    }
    return result;
  }

  // TODO: validate that this is the owner of the calendar to show the calendar settings button
  const calendarSettingsButton = props.subscribed ? (
    <Button
      label={props.translate("Calendar settings")}
      id="button-calendar-settings"
      onClick={() => {
        setShowCalendarForm(true);
        setCalendarFormResult(null);
      }}
    />
  ) : null;

  const calendarForm = (
    <CalendarForm
      new={false}
      calendar={props.calendar}
      translate={props.translate}
      cancel={() => setShowCalendarForm(false)}
      updateCalendar={props.updateCalendar}
      deleteCalendar={props.deleteCalendar}
      hideForm={() => setShowCalendarForm(false)}
      setResult={setCalendarFormResult}
    />
  );

  const newEventButton = showEventForm ? null : (
    <Button
      label={props.translate("New event")}
      id="button-new-event"
      onClick={() => {
        setShowEventForm(true);
        setEventFormResult(null);
      }}
    />
  );

  const eventForm = showEventForm ? (
    <EventForm
      language={props.language}
      translate={props.translate}
      cancel={() => setShowEventForm(false)}
      createEvent={props.createEvent}
      hideForm={() => setShowEventForm(false)}
      setResult={setEventFormResult}
      calendar={props.calendar}
    />
  ) : null;

  function renderMain() {
    let result;
    if (showCalendarForm) {
      // We're editing the calendar settings
      result = (
        <>
          {calendarForm}
        </>
      );
    } else {
      // We're viewing the calendar details and events
      result = (
        <>
          <h1>{renderName()}</h1>
          <div>{renderDescription()}</div>
          <div className="container mt-4 px-0">
            <div className="row justify-content-center">
              <div className="col-auto">
                <Month
                  startWeekOn={props.calendar === null ? "Monday" : props.calendar.startWeekOn}
                  currentDay={currentDay}
                  setCurrentDay={setCurrentDay}
                  language={props.language}
                />
                {calendarSettingsButton}
              </div>
              <div className="col">
                <h2>Events go here</h2>
                {newEventButton}
                {eventForm}
              </div>
            </div>
          </div>
        </>
      );
    }
    return result;
  }

  return props.authenticated ? (
    <div className="p-5">
      {renderMain()}
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