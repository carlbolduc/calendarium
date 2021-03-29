import React, { useState, useEffect, useCallback } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js"
import {calendarAccessStatus, decideWhatToDisplay, encodeObject, eventStatus} from "../../services/Helpers";
import CalendarForm from "./CalendarForm";
import Button from "../../components/Form/Button";
import EventForm from "../Events/EventForm";
import Month from "./Month";
import Message from "../../components/Form/Message";
import Collaborators from "../Collaborators/Collaborators";
import Event from "../Events/Event";
import EventsSearch from "../Events/EventsSearch";
import EditEventButton from "../Events/EditEventButton";
import SendForApprovalEventButton from "../Events/SendForApprovalEventButton";
import PublishEventButton from "../Events/PublishEventButton";
import ApproveEventButton from "../Events/ApproveEventButton";
import DeleteEventButton from "../Events/DeleteEventButton";
import UnpublishEventButton from "../Events/UnpublishEventButton";
import DeleteEventModal from "../Events/DeleteEventModal";

export default function Calendar(props) {
  const getCalendar = props.getCalendar;
  const getCalendarEvents = props.getCalendarEvents;
  const updateEvent = props.updateEvent;
  const deleteEvent = props.deleteEvent;
  let { link } = useParams();
  const [currentDay, setCurrentDay] = useState(DateTime.now());
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [event, setEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [result, setResult] = useState(null);
  const [showManageCollaborators, setShowManageCollaborators] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [messageOrigin, setMessageOrigin] = useState("");
  const [eventToDelete, setEventToDelete] = useState({eventId: null});

  useEffect(() => {
    getCalendar({ link: link });
  }, [getCalendar, link]);

  const refreshEvents = useCallback(() => {
    const q = encodeObject({ startAt: currentDay.startOf("day").toSeconds()});
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
      setResult(null);
      setMessageOrigin("updateEvent");
    } else {
      setShowEventForm(false);
    }
  }, [event]);

  useEffect(() => {
    if (!showEventForm) {
      setEvent(null);
    }
  }, [showEventForm]);

  // Show or hide the Delete Event Modal based on the eventToDelete state
  useEffect(() => {
    const el = document.getElementById("delete-event-modal");
    let modal = bootstrap.Modal.getInstance(el);
    if (modal === null) {
      // Instantiate the modal
      modal = new bootstrap.Modal(el, {
        backdrop: "static",
        keyboard: false
      });
    }
    if (eventToDelete.eventId !== null) {
      modal.show();
    } else {
      modal.hide();
    }
  }, [eventToDelete]);

  const sendForApproval = useCallback((event) => {
    event.status = eventStatus.PENDING_APPROVAL.value;
    updateEvent(event, result => {
      setResult(result);
      setMessageOrigin("sendForApproval");
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  const approveEvent = useCallback((event) => {
    event.status = eventStatus.PUBLISHED.value;
    updateEvent(event, result => {
      setResult(result);
      setMessageOrigin("approveEvent");
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  const publishEvent = useCallback((event) => {
    event.status = eventStatus.PUBLISHED.value;
    updateEvent(event, result => {
      setResult(result);
      setMessageOrigin("publishEvent");
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  const unpublishEvent = useCallback((event) => {
    event.status = eventStatus.DRAFT.value;
    updateEvent(event, result => {
      setResult(result);
      setMessageOrigin("unpublishEvent");
      refreshEvents();
    });
  }, [updateEvent, refreshEvents]);

  function confirmEventDeletion() {
    setEventToDelete({eventId: null});    
    deleteEvent(eventToDelete.eventId, result => {
      setResult(result);
      setMessageOrigin("deleteEvent");
      refreshEvents();
    });
  }

  const calendarSettingsButton = props.calendar.access === calendarAccessStatus.OWNER ? (
    <Button
      label={props.translate("Calendar settings")}
      id="button-calendar-settings"
      outline={true}
      onClick={() => {
        setShowCalendarForm(true);
        setResult(null);
        setMessageOrigin("updateCalendar");
      }}
    />
  ) : null;

  const calendarForm = (
    <CalendarForm
      new={false}
      calendar={props.calendar}
      language={props.language}
      translate={props.translate}
      updateCalendar={props.updateCalendar}
      deleteCalendar={props.deleteCalendar}
      setShowCalendarForm={setShowCalendarForm}
      setResult={setResult}
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
      getCollaborators={props.getCollaborators}
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
        <SendForApprovalEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          sendForApproval={sendForApproval}
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
          publishEvent={publishEvent}
          translate={props.translate}
        />
        <UnpublishEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          unpublishEvent={unpublishEvent}
          translate={props.translate}
        />
        <DeleteEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          deleteEvent={() => setEventToDelete(event)}
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
      result={result}
      messageOrigin={messageOrigin}
      actionButtonsZone={
        <div className="mb-4">
          <Button label={props.translate("Back to calendar")} id="button-cancel"
                  onClick={() => setShowManageEvents(false)} outline={true}/>
        </div>
      }
      setEvent={setEvent}
    />
  );

  const calendarEvents = props.calendarEvents.map(e => (
    <Event 
      key={e.eventId} 
      event={e} 
      eventActions={eventActions(e)} 
      language={props.language} 
      translate={props.translate}
      primaryColor={props.calendar.primaryColor}
      secondaryColor={props.calendar.secondaryColor}
      enableEn={props.calendar.enableEn}
      enableFr={props.calendar.enableFr}
    />
  ));

  const newEventButton = !showEventForm && [calendarAccessStatus.OWNER, calendarAccessStatus.ACTIVE].indexOf(props.calendar.access) !== -1 ? (
    <Button
      label={props.translate("New event")}
      id="button-new-event"
      outline={true}
      onClick={() => {
        setShowEventForm(true);
        setResult(null);
        setMessageOrigin("createEvent");
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
      setResult={setResult}
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
          <h1>
            {decideWhatToDisplay(
              props.language,
              props.calendar.enableEn,
              props.calendar.enableFr,
              props.calendar.nameEn,
              props.calendar.nameFr
            )}
          </h1>
          <Message result={result} origin={messageOrigin} translate={props.translate} />
          {actionButtonsZone}
          <div>
            {decideWhatToDisplay(
              props.language,
              props.calendar.enableEn,
              props.calendar.enableFr,
              props.calendar.descriptionEn,
              props.calendar.descriptionFr
            )}
          </div>
          <div className="mt-4 px-0">
            <div className="row justify-content-center">
              <div className="col-12 col-md-auto">
                <Month
                  startWeekOn={props.calendar.startWeekOn}
                  currentDay={currentDay}
                  selectDay={(date) => setCurrentDay(date)}
                  setCurrentDay={setCurrentDay}
                  language={props.language}
                  primaryColor={props.calendar.primaryColor}
                  secondaryColor={props.calendar.secondaryColor}
                />
              </div>
              <div className="col-12 col-md">
                <h2>Events</h2>
                {calendarEvents}
              </div>
            </div>
          </div>
          <DeleteEventModal
            language={props.language}
            enableEn={props.calendar.enableEn}
            enableFr={props.calendar.enableFr}
            event={eventToDelete}
            delete={confirmEventDeletion}
            cancel={() => setEventToDelete({eventId: null})}
            translate={props.translate}
          />
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
