import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { decideWhatToDisplay, encodeObject, eventStatus } from "../../services/Helpers";
import CalendarForm from "./CalendarForm";
import Button from "../../components/Form/Button";
import EventForm from "../Events/EventForm";
import Month from "./Month";
import Message from "../../components/Form/Message";
import Collaborators from "../Collaborators/Collaborators";
import Event from "../Events/Event";
import EventsSearch from "../../components/Form/EventsSearch";
import EditEventButton from "../Events/EditEventButton";
import SubmitForApprovalEventButton from "../Events/SubmitForApprovalEventButton";
import PublishEventButton from "../Events/PublishEventButton";
import ApproveEventButton from "../Events/ApproveEventButton";
import DeleteEventButton from "../Events/DeleteEventButton";

export default function Calendar(props) {
  let { link } = useParams();
  const [currentDay, setCurrentDay] = useState(DateTime.now());
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calendarFormResult, setCalendarFormResult] = useState(null);
  const [event, setEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventFormResult, setEventFormResult] = useState(null);
  const [showManageCollaborators, setShowManageCollaborators] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);

  useEffect(() => {
    props.getCalendar({ link: link });
  }, []);

  useEffect(() => {
    getCalendarEvents();
  }, [props.calendar, currentDay])

  useEffect(() => {
    if (event !== null) {
      setShowEventForm(true);
    } else {
      setShowEventForm(false);
    }
  }, [event]);

  useEffect(() => {
    if (!showEventForm) {
      setEvent(null);
    }
  }, [showEventForm])

  function getCalendarEvents() {
    const q = encodeObject({ startAt: currentDay.toSeconds()});
    props.getCalendarEvents(props.calendar.calendarId, q, result => {
      // We do nothing with the result.
      // TODO: should we display the error if there is one (there should never be one)
    });
  }

  function copyIframe(iframe) {
    const el = document.getElementById("iframe-copied");
    // const toast = new Toast(el, {});
    // navigator.clipboard.writeText(iframe).then(()=> toast.show());
  }

  function submitForApproval(event) {
    event.status = eventStatus.PENDING_APPROVAL.value;
    props.updateEvent(event, () => {
      getCalendarEvents();
    });
  }

  function approveEvent(event) {
    event.status = eventStatus.PUBLISHED.value;
    props.updateEvent(event, () => {
      getCalendarEvents();
    });
  }

  function deleteEvent(event) {
    props.deleteEvent(event.eventId, () => {
      getCalendarEvents();
    });
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

  const iframe = (`<iframe src="https://codebards.io/embed/${props.calendar.calendarId}"></iframe>`);
 
  const calendarEmbed = props.calendar.publicCalendar ? (
    <article className="mb-4">
      <h5>Embed code</h5>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          readOnly={true}
          value={iframe}
        />
          <span className="input-group-text" style={{cursor: "pointer"}} onClick={() => copyIframe(iframe)}>Copy</span>
      </div>
    </article>
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
      calendarEmbed={calendarEmbed}
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
      deactivateCalendarAccess={props.deactivateCalendarAccess}
      activateCalendarAccess={props.activateCalendarAccess}
/>
  );

  // TODO: validate that this is the owner of the calendar to show the manage events button
  const manageEventsButton = (
    <Button
      label={props.translate(props.subscribed ? "Manage all events" : "Manage my events")}
      id="button-manage-events"
      outline={true}
      onClick={() => {
        setShowManageEvents(true);
      }}
    />
  );

  function eventActions(event) {
    return (
      <div>
        <EditEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          edit={() => setEvent(event)}
          translate={props.translate}
        />
        <SubmitForApprovalEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          submit={() => submitForApproval(event)}
          refresh={props.getCalendarEvents}
          translate={props.translate}
        />
        <ApproveEventButton
          event={event}
          calendar={props.calendar}
          approve={() => approveEvent(event)}
          refresh={props.getCalendarEvents}
          translate={props.translate}
        />
        <PublishEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          publish={() => approveEvent(event)}
          refresh={props.getCalendarEvents}
          translate={props.translate}
        />
        <DeleteEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          delete={() => deleteEvent(event)}
          refresh={props.getCalendarEvents}
          translate={props.translate}
        />
      </div>
    )
  }

  const manageEvents = (
    <EventsSearch
      account={props.account}
      calendar={props.calendar}
      events={props.events}
      editEvent={setEvent}
      updateEvent={props.updateEvent}
      deleteEvent={props.deleteEvent}
      searchEvents={props.searchEvents}
      language={props.language}
      translate={props.translate}
      actionButtonsZone={
        <div className="mb-4">
          <Button label={props.translate("Back to calendar")} id="button-cancel"
                  onClick={() => setShowManageEvents(false)} outline={true}/>
        </div>
      }
      eventActions={eventActions}
    />
  );

  const calendarEvents = props.calendarEvents.map(e => (
    <Event key={e.eventId} event={e} eventActions={eventActions(e)} />
  ));

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
      event={event}
      language={props.language}
      translate={props.translate}
      cancel={() => setShowEventForm(false)}
      createEvent={props.createEvent}
      updateEvent={props.updateEvent}
      hideForm={() => setShowEventForm(false)}
      setResult={setEventFormResult}
      calendar={props.calendar}
      getCalendarEvents={getCalendarEvents}
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
          <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 10}}>
            <div id="iframe-copied" className="toast align-items-center text-white bg-secondary border-0" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="d-flex">
                <div className="toast-body">
                  Copied to clipboard!
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"/>
              </div>
            </div>
          </div>
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
          <h1>{decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr)}</h1>
          <Message result={eventFormResult} origin="EventForm" translate={props.translate} />
          {actionButtonsZone}
          <div>{decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr)}</div>
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