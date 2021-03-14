import React, {useState, useEffect} from "react";
import Event from "../../scenes/Events/Event";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import {decideWhatToDisplay, encodeObject, eventStatus} from "../../services/Helpers";
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

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} showStatus={true} eventActions={props.eventActions(e)}/>
  ));

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Events of")} ${calendarName}`;
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