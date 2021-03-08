import {useState, useEffect} from "react";
import Event from "../../scenes/Events/Event";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import {decideWhatToDisplay, encodeObject, eventStatus} from "../../services/Helpers";

export default function EventsSearch(props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [canSearch, setCanSearch] = useState(false);

  useEffect(() => {
    if (requesting) {
      // Build query param with currentDay
      const q = encodeObject({ search: search, status: status });
      props.searchEvents(q, () => {
        setRequesting(false);
        setCanSearch(false);
      });
    }
  }, [requesting]);

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  function approveEvent(e) {
    console.log("TODO");
  }

  function deleteEvent(e) {
    console.log("TODO");
  }

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} showStatus={true} eventActions={null}/>
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
      {props.actionButtonsZone}
      <form onSubmit={handleSubmit}>
        <Input
          label="Search"
          type="search"
          id="input-search"
          placeholder="Enter a search term."
          info={"You can search in the properties of your events."}
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
          info="Select which status you want to see."
        />
        {searchButton}
      </form>
      {events}
    </article>
  );
}