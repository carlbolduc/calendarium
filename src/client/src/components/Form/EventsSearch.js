import React, {useState, useEffect} from "react";
import Event from "../../scenes/Events/Event";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import {calendarAccessStatus, decideWhatToDisplay, encodeObject, eventStatus} from "../../services/Helpers";
import Message from "./Message";

export default function EventsSearch(props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [canSearch, setCanSearch] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    searchEvents();
  }, []);

  useEffect(() => {
    if (requesting) {
      // Build query param with currentDay
      searchEvents();
    }
  }, [requesting]);

  function searchEvents() {
    // Build query param with currentDay
    const q = encodeObject({ search: search, status: status, calendarId: props.calendar.calendarId });
    props.searchEvents(q, () => {
      setRequesting(false);
      setCanSearch(false);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  function submitForApproval(event) {
    event.status = eventStatus.PENDING_APPROVAL.value;
    props.updateEvent(event, result => {
      setResult(result);
      searchEvents();
    });
  }

  function approveEvent(event) {
    event.status = eventStatus.PUBLISHED.value;
    props.updateEvent(event, result => {
      setResult(result);
      searchEvents();
    });
  }

  function deleteEvent(event) {
    props.deleteEvent(event.eventId, result => {
      setResult(result);
      searchEvents();
    });
  }

  function eventActions(event) {
    const editEvent = props.account.accountId === event.accountId ? (
        <button type="button" className="btn btn-info btn-sm me-1" onClick={() => props.editEvent(event)}>Edit</button>
    ) : null;
    let submitForApprovalButton = null;
    let approveButton = null;
    if (props.calendar !== null && props.calendar.access === calendarAccessStatus.OWNER) {
      // TODO: can the owner publish a draft from another user?
      if ([eventStatus.DRAFT.value, eventStatus.PENDING_APPROVAL.value].indexOf(event.status) !== -1) {
        approveButton = <button type="button" className="btn btn-success btn-sm me-1" onClick={() => approveEvent(event)}>Approve</button>;
      }
    } else if (props.calendar !== null && props.calendar.access === calendarAccessStatus.ACTIVE) {
      if (event.status === eventStatus.DRAFT.value) {
        submitForApprovalButton = <button type="button" className="btn btn-info btn-sm me-1" onClick={() => submitForApproval(event)}>Submit</button>;
      }
    }
    const deleteButton = <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteEvent(event)}>Delete</button>;
    return <div>{editEvent}{submitForApprovalButton}{approveButton}{deleteButton}</div>;
  }

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} showStatus={true} eventActions={eventActions(e)}/>
  ));

  const calendarName = props.calendar !== null ? decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr) : "";
  const title = props.calendar !== null ? `${props.translate("Events of")} ${calendarName}` : props.translate("Events");
  const searchButton = canSearch ? (
    <Button label="Search" type="submit" working={requesting} id="button-search" />
  ) : (
    <Button label="Search" type="submit" working={requesting} id="button-search" disabled={true} />
  );
  return (
    <article>
      <h1>{title}</h1>
      <Message result={result} origin="EventSearch" translate={props.translate} />
      {props.actionButtonsZone}
      <form onSubmit={handleSubmit}>
        <Input
          label="Search"
          type="search"
          id="input-search"
          placeholder="Enter a search term."
          value={search}
          handleChange={e => {
            setSearch(e.target.value);
            setCanSearch(true);
          }}
        />
        <Select
          label="Status"
          id="select-status"
          options={[{ label: "All", value: "" }, { label: eventStatus.DRAFT.label, value: eventStatus.DRAFT.value }, { label: eventStatus.PENDING_APPROVAL.label, value: eventStatus.PENDING_APPROVAL.value }, { label: eventStatus.PUBLISHED.label, value: eventStatus.PUBLISHED.value }]}
          value={status}
          handleChange={e => {
            setStatus(e.target.value);
            setCanSearch(true);
          }}
        />
        {searchButton}
      </form>
      {events}
    </article>
  );
}