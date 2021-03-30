import React from "react";
import PropTypes from "prop-types";
import Event from "./Event";
import EditEventButton from "./EditEventButton";
import SendForApprovalEventButton from "./SendForApprovalEventButton";
import ApproveEventButton from "./ApproveEventButton";
import PublishEventButton from "./PublishEventButton";
import UnpublishEventButton from "./UnpublishEventButton";
import DeleteEventButton from "./DeleteEventButton";
import { eventStatus } from "../../services/Helpers";


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

  function eventActions(event) {
    return (
      <div>
        <EditEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          edit={() => props.edit(event)}
          translate={props.translate}
        />
        <SendForApprovalEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          sendForApproval={sendForApproval}
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
        <ApproveEventButton
          event={event}
          calendar={props.calendar}
          approveEvent={approveEvent}
          translate={props.translate}
        />
        <DeleteEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          deleteEvent={() => props.deleteEvent(event)}
          translate={props.translate}
        />
      </div>
    )
  }

  const events = props.events.map(e => (
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
      showStatus={props.showStatus} 
    />
  ));

  return props.events.length === 0 ? (
    <div>{props.noEventsMessage}</div>
    ) : (
    <div>{events}</div>
  );

}

EventsList.propTypes = {
  events: PropTypes.array.isRequired,
  noEventsMessage: PropTypes.string.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  setResult: PropTypes.func.isRequired,
  setMessageOrigin: PropTypes.func.isRequired,
  showStatus: PropTypes.bool,
  refreshEvents: PropTypes.func.isRequired
};