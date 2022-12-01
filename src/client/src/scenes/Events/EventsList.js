import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";
import { eventStatus, getLocale } from "../../services/Helpers";
import {DateTime} from "luxon";

export default function EventsList(props) {

  function sendForApproval(event) {
    event.status = eventStatus.PENDING_APPROVAL.value;
    props.updateEvent(event, result => {
      props.setResult(result);
      props.setMessageOrigin("sendForApproval");
      props.refreshEvents();
    });
  }

  function approveEvent(event) {
    event.status = eventStatus.PUBLISHED.value;
    props.updateEvent(event, result => {
      props.setResult(result);
      props.setMessageOrigin("approveEvent");
      props.refreshEvents();
    });
  }

  function publishEvent(event) {
    event.status = eventStatus.PUBLISHED.value;
    props.updateEvent(event, result => {
      props.setResult(result);
      props.setMessageOrigin("publishEvent");
      props.refreshEvents();
    });
  }

  function unpublishEvent(event) {
    event.status = eventStatus.DRAFT.value;
    props.updateEvent(event, result => {
      props.setResult(result);
      props.setMessageOrigin("unpublishEvent");
      props.refreshEvents();
    });
  }

  function deleteEvent(event) {
    props.deleteEvent(event.eventId, result => {
      props.setResult(result);
      props.setMessageOrigin("deleteEvent");
      props.refreshEvents();
    });
  }

  const pastEvents = props.events.filter(e => e.endAt < props.selectedDate.toSeconds()).map(e => (
    <Event
      key={e.eventId}
      event={e}
      account={props.account}
      calendar={props.calendar}
      localeId={props.localeId}
      translate={props.translate}
      enableEn={props.calendar.enableEn}
      enableFr={props.calendar.enableFr}
      primaryColor={props.calendar.primaryColor}
      showStatus={props.showStatus}
      showButtons={props.showButtons}
      isEmbedded={props.isEmbedded}
      edit={props.edit}
      sendForApproval={sendForApproval}
      publishEvent={publishEvent}
      unpublishEvent={unpublishEvent}
      approveEvent={approveEvent}
      delete={deleteEvent}
    />
  ));

  const futureEvents = props.events.filter(e => e.endAt >= props.selectedDate.toSeconds()).map(e => (
    <Event
      key={e.eventId}
      event={e}
      account={props.account}
      calendar={props.calendar}
      localeId={props.localeId}
      translate={props.translate}
      enableEn={props.calendar.enableEn}
      enableFr={props.calendar.enableFr}
      primaryColor={props.calendar.primaryColor}
      showStatus={props.showStatus}
      showButtons={props.showButtons}
      isEmbedded={props.isEmbedded}
      edit={props.edit}
      sendForApproval={sendForApproval}
      publishEvent={publishEvent}
      unpublishEvent={unpublishEvent}
      approveEvent={approveEvent}
      delete={deleteEvent}
    />
  ));

  const locale = getLocale(props.localeId);

  return props.events.length === 0 ? (
    <div>{props.noEventsMessage}</div>
    ) : (
    <div id="">
      {pastEvents}
      <div id="now" className="fw-bold text-center text-uppercase mb-3 h2">
        {props.selectedDate.setLocale(locale).toLocaleString(DateTime.DATE_HUGE)}
      </div>
      {futureEvents}
    </div>
  );

}

EventsList.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  noEventsMessage: PropTypes.string.isRequired,
  account: PropTypes.object,
  calendar: PropTypes.object.isRequired,
  localeId: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  edit: PropTypes.func,
  deleteEvent: PropTypes.func,
  updateEvent: PropTypes.func,
  setResult: PropTypes.func,
  setMessageOrigin: PropTypes.func,
  showStatus: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired,
  isEmbedded: PropTypes.bool,
  refreshEvents: PropTypes.func,
};