import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import {calendarAccessStatus, decideWhatToDisplay, encodeObject} from "../../services/Helpers";
import CalendarForm from "./CalendarForm";
import Button from "../../components/Form/Button";
import EventForm from "../Events/EventForm";
import Month from "./Month";
import Message from "../../components/Form/Message";
import Collaborators from "../Collaborators/Collaborators";
import EventsSearch from "../Events/EventsSearch";
import EventsList from "../Events/EventsList";

export default function Calendar(props) {
  const getCalendar = props.getCalendar;
  const getCalendarEvents = props.getCalendarEvents;
  const getDots = props.getDots;
  let { link } = useParams();
  const [selectedDate, setSelectedDate] = useState(DateTime.now());
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [event, setEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [result, setResult] = useState(null);
  const [showManageCollaborators, setShowManageCollaborators] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [messageOrigin, setMessageOrigin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCalendar({ link: link }, () => {
      setLoading(false);
    });
  }, [getCalendar, link]);

  const refreshEvents = useCallback(() => {
    if (props.calendar.calendarId !== null) {
      const eventsQ = encodeObject({ startAt: selectedDate.startOf("day").toSeconds()});
      getCalendarEvents(props.calendar.calendarId, eventsQ, result => {
        // We do nothing with the result.
        // TODO: should we display the error if there is one (there should never be one)
      });
      const dotsQ = encodeObject({
        calendarId: props.calendar.calendarId,
        startAt: selectedDate.startOf("month").startOf("day").toSeconds(),
        zoneName: selectedDate.zoneName
      });
      getDots(dotsQ);
    }
  }, [props.calendar.calendarId, selectedDate, getCalendarEvents, getDots]);

  useEffect(() => {
    if (props.calendar.calendarId !== null) {
      if ([props.calendar.linkEn, props.calendar.linkFr].indexOf(link) !== -1) {
        refreshEvents();
      }
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
      localeId={props.localeId}
      translate={props.translate}
      updateCalendar={props.updateCalendar}
      deleteCalendar={props.deleteCalendar}
      setShowCalendarForm={setShowCalendarForm}
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
      localeId={props.localeId}
      cancel={() => setShowManageCollaborators(false)}
      hideForm={() => setShowManageCollaborators(false)}
      collaborators={props.collaborators}
      getCollaborators={props.getCollaborators}
      inviteCollaborator={props.inviteCollaborator}
      deactivateCalendarAccess={props.deactivateCalendarAccess}
      activateCalendarAccess={props.activateCalendarAccess}
      account={props.account}
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

  const manageEvents = (
    <EventsSearch
      events={props.events}
      account={props.account}
      calendar={props.calendar}
      localeId={props.localeId}
      translate={props.translate}
      editEvent={setEvent}
      deleteEvent={props.deleteEvent}
      updateEvent={props.updateEvent}
      searchEvents={props.searchEvents}
      result={result}
      messageOrigin={messageOrigin}
      actionButtonsZone={
        <div className="mb-4">
          <Button
            label={props.translate("Back to calendar")}
            id="button-cancel"
            onClick={() => {
              setShowManageEvents(false);
              refreshEvents();
            }}
            outline={true}
          />
        </div>
      }
    />
  );

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
      localeId={props.localeId}
      translate={props.translate}
      cancel={() => setShowEventForm(false)}
      createEvent={props.createEvent}
      updateEvent={props.updateEvent}
      hideForm={() => setShowEventForm(false)}
      setResult={setResult}
      calendar={props.calendar}
      refreshEvents={refreshEvents}
      setSelectedDate={setSelectedDate}
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

  function main() {
    let result;
    if (loading) {
      result = (
        <div className="d-flex justify-content-center">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">{props.translate("Loading...")}</span>
          </div>
        </div>
      );
    } else if (props.calendar.calendarId === null) {
      result = <div>{props.translate("We couldn't find a calendar at this URL.")}</div>;
    } else if (showCalendarForm) {
      // We're editing the calendar settings
      result = calendarForm;
    } else if (showEventForm) {
      // We're adding a new event
      result = eventForm;
    } else if (showManageCollaborators) {
      // We're managing the calendar collaborators
      result = manageCollaborators;
    } else if (showManageEvents) {
      // We're managing the calendar events
      result = manageEvents;
    } else {
      // We're viewing the calendar details and events
      result = (
        <article>
          <h1>
            {decideWhatToDisplay(
              props.localeId,
              props.calendar.enableEn,
              props.calendar.enableFr,
              props.calendar.nameEn,
              props.calendar.nameFr
            )}
          </h1>
          <Message result={result} origin={messageOrigin} translate={props.translate} />
          {actionButtonsZone}
          <div id="calendar-description">
            {decideWhatToDisplay(
              props.localeId,
              props.calendar.enableEn,
              props.calendar.enableFr,
              props.calendar.descriptionEn,
              props.calendar.descriptionFr
            )}
          </div>
          <div className="mt-4 px-0">
            <div className="row justify-content-center">
              <div className="month col-12 col-md-auto sticky-top">
                <Month
                  startWeekOn={props.calendar.startWeekOn}
                  selectedDate={selectedDate}
                  selectDay={(date) => setSelectedDate(date)}
                  localeId={props.localeId}
                  primaryColor={props.calendar.primaryColor}
                  secondaryColor={props.calendar.secondaryColor}
                  dots={props.dots}
                  isEmbedded={false}
                />
              </div>
              <div className="col-12 col-md">
                <EventsList
                  selectedDate={selectedDate}
                  events={props.events}
                  noEventsMessage={props.translate("There are no events on or after the selected date.")}
                  account={props.account}
                  calendar={props.calendar}
                  localeId={props.localeId}
                  translate={props.translate}
                  edit={setEvent}
                  deleteEvent={props.deleteEvent}
                  updateEvent={props.updateEvent}
                  setResult={setResult}
                  setMessageOrigin={setMessageOrigin}
                  showStatus={false}
                  showButtons={true}
                  refreshEvents={refreshEvents}
                  isEmbedded={false}
                />
              </div>
            </div>
          </div>
        </article>
      );
    }
    return result;
  }

  return main();
}
