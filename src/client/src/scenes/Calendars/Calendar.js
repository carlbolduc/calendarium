import React, { useState, useEffect, useCallback } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import {calendarAccessStatus, decideWhatToDisplay, encodeObject, eventStatus} from "../../services/Helpers";
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
  const getCalendar = props.getCalendar;
  const getCalendarEvents = props.getCalendarEvents;
  const updateEvent = props.updateEvent;
  const deleteEvent = props.deleteEvent;
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
    getCalendar({ link: link });
  }, [getCalendar, link]);

  const refreshEvents = useCallback(() => {
    const q = encodeObject({ startAt: currentDay.toSeconds()});
    getCalendarEvents(props.calendar.calendarId, q, result => {
      // We do nothing with the result.
      // TODO: should we display the error if there is one (there should never be one)
    });
  }, [props.calendar.calendarId, currentDay, getCalendarEvents]);

  useEffect(() => {
    if ([props.calendar.linkEn, props.calendar.linkFr].indexOf(link) !== -1) {
      refreshEvents();
    }
  }, [props.calendar, link, refreshEvents]);

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
  }, [showEventForm]);

  const submitForApproval = useCallback((event) => {
    event.status = eventStatus.PENDING_APPROVAL.value;
    updateEvent(event, () => {
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  const approveEvent = useCallback((event) => {
    event.status = eventStatus.PUBLISHED.value;
    updateEvent(event, () => {
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  const deleteThisEvent = useCallback((event) => {
    deleteEvent(event.eventId, () => {
      refreshEvents();
    });
  }, [deleteEvent, refreshEvents]);

  const calendarSettingsButton = props.calendar.access === calendarAccessStatus.OWNER ? (
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

  const manageCollaboratorsButton = props.calendar.access === calendarAccessStatus.OWNER ? (
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

  const manageEventsButton = [calendarAccessStatus.OWNER, calendarAccessStatus.ACTIVE].indexOf(props.calendar.access) !== -1 ? (
    <Button
      label={props.translate(props.calendar.access === calendarAccessStatus.OWNER ? "Manage all events" : "Manage my events")}
      id="button-manage-events"
      outline={true}
      onClick={() => {
        setShowManageEvents(true);
      }}
    />
  ) :null;

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
          submitForApproval={submitForApproval}
          translate={props.translate}
        />
        <ApproveEventButton
          event={event}
          calendar={props.calendar}
          approveEvent={approveEvent}
          translate={props.translate}
        />
        <PublishEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          approveEvent={approveEvent}
          translate={props.translate}
        />
        <DeleteEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          deleteEvent={deleteThisEvent}
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
    <Event key={e.eventId} event={e} eventActions={eventActions(e)} language={props.language} />
  ));

  const newEventButton = !showEventForm && [calendarAccessStatus.OWNER, calendarAccessStatus.ACTIVE].indexOf(props.calendar.access) !== -1 ? (
    <Button
      label={props.translate("New event")}
      id="button-new-event"
      outline={true}
      onClick={() => {
        setShowEventForm(true);
        setEventFormResult(null);
      }}
    />
  ) :null;

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
      refreshEvents={refreshEvents}
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
    // TODO: simplify this
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

  return props.calendar.publicCalendar || props.authenticated ? (
    <article>
      {renderMain()}
    </article>
  ) : (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: { from: "/subscription" }
        }}
      />
    );
}
