import React, {useState, useEffect, useCallback} from "react";
import Event from "../../scenes/Events/Event";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import {decideWhatToDisplay, encodeObject, eventStatus, getLocale} from "../../services/Helpers";
import Message from "./Message";
import {DateTime} from "luxon";
import Month from "../../scenes/Calendars/Month";

export default function EventsSearch(props) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [showEndDateSelector, setShowEndDateSelector] = useState(false);
  const [status, setStatus] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [canSearch, setCanSearch] = useState(false);
  const [result, setResult] = useState(null);

  const searchEvents = useCallback(() => {
    // Build query param with currentDay
    const q = encodeObject({
      search: search,
      startAt: startDate !== null ? startDate.startOf("day").toSeconds() : null,
      endAt: endDate !== null ? endDate.endOf("day").toSeconds() : null,
      status: status,
      calendarId: props.calendar.calendarId
    });
    props.searchEvents(q, () => {
      setRequesting(false);
      setCanSearch(false);
    });
  }, [endDate, search, startDate, status]);


  useEffect(() => {
    searchEvents();
  }, [searchEvents]);

  useEffect(() => {
    if (requesting) {
      // Build query param with currentDay
      searchEvents();
    }
  }, [requesting, searchEvents]);

  function handleSubmit(e) {
    e.preventDefault();
    setRequesting(true);
  }

  const startDateSelector = showStartDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={props.calendar.startWeekOn}
        currentDay={DateTime.now()}
        selectDay={date => {
          setStartDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setCanSearch(true);
        }}
        hide={() => setShowStartDateSelector(false)}
        language={props.language}
      />
    </div>
  ) : null;

  const endDateSelector = showEndDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={props.calendar.startWeekOn}
        currentDay={DateTime.now()}
        selectDay={date => {
          setEndDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setCanSearch(true);
        }}
        hide={() => setShowEndDateSelector(false)}
        language={props.language}
      />
    </div>
  ) : null;

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} showStatus={true} eventActions={props.eventActions(e)} language={props.language}/>
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
        <div className="row">
          <div className="col">
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
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-6">
            <div style={{ position: "relative" }}>
              <Input
                label="Start date"
                type="text"
                id="input-start-date"
                placeholder="Select date"
                value={startDate !== null ? startDate.setLocale(getLocale(props.language)).toLocaleString(DateTime.DATE_HUGE) : ""}
                readOnly={true}
                onClick={() => setShowStartDateSelector(true)}
              />
              {startDateSelector}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div style={{ position: "relative" }}>
              <Input
                label="End date"
                type="text"
                id="input-end-date"
                placeholder="Select date"
                value={endDate !== null ? endDate.setLocale(getLocale(props.language)).toLocaleString(DateTime.DATE_HUGE) : ""}
                readOnly={true}
                onClick={() => setShowEndDateSelector(!showEndDateSelector)}
              />
              {endDateSelector}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
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
          </div>
        </div>

        {searchButton}
      </form>
      {events}
    </article>
  );
}