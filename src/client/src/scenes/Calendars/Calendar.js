import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { decideWhatToDisplay } from "../../services/Helpers";
import CalendarForm from "./CalendarForm";
import Button from "../../components/Form/Button";
import EventForm from "../Events/EventForm";
import Month from "./Month";
import Message from "../../components/Form/Message";
import Collaborators from "../Collaborators/Collaborators";
import Events from "../Events/Events";

export default function Calendar(props) {
  let { link } = useParams();
  const [currentDay, setCurrentDay] = useState(DateTime.now().day);
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarFormResult, setCalendarFormResult] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormResult, setEventFormResult] = useState(null);
  const [showManageCollaborators, setShowManageCollaborators] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);

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
      outline={true}
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

  // TODO: validate that this is the owner of the calendar to show the manage collaborators button
  const manageCollaboratorsButton = props.subscribed ? (
    <Button
      label={props.translate("Manage collaborators")}
      id="button-manage-collaborators"
      outline={true}
      onClick={() => {
        setShowManageCollaborators(true);
      }}
    />
  ) : null;

  const manageCollaborators = (
    <Collaborators
      calendar={props.calendar}
      translate={props.translate}
      language={props.language}
      cancel={() => setShowManageCollaborators(false)}
      hideForm={() => setShowManageCollaborators(false)}
      collaborators={props.collaborators}
      getCalendarCollaborators={props.getCalendarCollaborators}
      inviteCollaborator={props.inviteCollaborator}
/>
  );

  // TODO: validate that this is the owner of the calendar to show the manage events button
  const manageEventsButton = props.subscribed ? (
    <Button
      label={props.translate("Manage events")}
      id="button-manage-events"
      outline={true}
      onClick={() => {
        setShowManageEvents(true);
      }}
    />
  ) : null;

  const manageEvents = (
    <Events
      calendar={props.calendar}
      translate={props.translate}
      cancel={() => setShowManageEvents(false)}
      hideForm={() => setShowManageEvents(false)}
    />
  );

  const newEventButton = showEventForm ? null : (
    <Button
      label={props.translate("New event")}
      id="button-new-event"
      outline={true}
      onClick={() => {
        setShowEventForm(true);
        setEventFormResult(null);
      }}
    />
  );

  const eventForm = (
    <EventForm
      new={true}
      language={props.language}
      translate={props.translate}
      cancel={() => setShowEventForm(false)}
      createEvent={props.createEvent}
      hideForm={() => setShowEventForm(false)}
      setResult={setEventFormResult}
      calendar={props.calendar}
    />
  );

  const actionButtonsZone = showEventForm || showCalendarForm ? null : (
    <div className="mb-4">
      {newEventButton}
      {manageEventsButton}
      {manageCollaboratorsButton}
      {calendarSettingsButton}
    </div>
  );

  function renderMain() {
    let result;
    if (showCalendarForm) {
      // We're editing the calendar settings
      result = (
        <>
          {calendarForm}
        </>
      );
    } else if (showEventForm) {
      // We're adding a new event
      result = (
        <>
          {eventForm}
        </>
      );
    } else if (showManageCollaborators) {
      // We're managing the calendar collaborators
      result = (
        <>
          {manageCollaborators}
        </>
      );
    } else if (showManageEvents) {
      // We're managing the calendar events
      result = (
        <>
          {manageEvents}
        </>
      );
    } else {
      // We're viewing the calendar details and events
      result = (
        <>
          <h1>{renderName()}</h1>
          <Message result={eventFormResult} origin="EventForm" translate={props.translate} />
          {actionButtonsZone}
          <div>{renderDescription()}</div>
          <div className="mt-4 px-0">
            <div className="row justify-content-center">
              <div className="col-12 col-md-auto">
                <Month
                  startWeekOn={props.calendar === null ? "Monday" : props.calendar.startWeekOn}
                  currentDay={currentDay}
                  setCurrentDay={setCurrentDay}
                  language={props.language}
                />
              </div>
              <div className="col-12 col-md">
                <h2>Events</h2>
                <ul>
                  <li>List the events</li>
                  <li>All the events</li>
                  <li>Only the events</li>
                </ul>
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