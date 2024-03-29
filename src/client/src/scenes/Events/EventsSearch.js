import React, {useState, useEffect, useCallback} from "react";
import Select from "../../components/Form/Select";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import {decideWhatToDisplay, encodeObject, eventStatus, getLocale} from "../../services/Helpers";
import Message from "../../components/Form/Message";
import {DateTime} from "luxon";
import Month from "../Calendars/Month";
import EventsList from "./EventsList";

export default function EventsSearch(props) {
  const searchEvents = props.searchEvents;
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [showEndDateSelector, setShowEndDateSelector] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(props.result);
  const [initialLoad, setInitialLoad] = useState(true);
  const [working, setWorking] = useState(false);
  const [canSearch, setCanSearch] = useState(false);
  const [messageOrigin, setMessageOrigin] = useState(props.messageOrigin);

  const buildQuery = useCallback(() => {
    return encodeObject({
      search: search,
      startAt: startDate !== null ? startDate.startOf("day").toSeconds() : null,
      endAt: endDate !== null ? endDate.endOf("day").toSeconds() : null,
      status: status,
      calendarId: props.calendar.calendarId
    });
  }, [props.calendar.calendarId, endDate, search, startDate, status]);

  // Perform search immediately when the search form is shown
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      const q = buildQuery();
      searchEvents(q);
    }
  }, [initialLoad, buildQuery, searchEvents]);

  function handleSubmit(e) {
    e.preventDefault();
    setWorking(true);
    const q = buildQuery();
    searchEvents(q, () => {
      setWorking(false);
      setCanSearch(false);
    });
  }

  const startDateSelector = showStartDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={props.calendar.startWeekOn}
        selectedDate={DateTime.now()}
        selectDay={date => {
          setStartDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setCanSearch(true);
        }}
        hide={() => setShowStartDateSelector(false)}
        localeId={props.localeId}
      />
    </div>
  ) : null;

  const endDateSelector = showEndDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={props.calendar.startWeekOn}
        selectedDate={DateTime.now()}
        selectDay={date => {
          setEndDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setCanSearch(true);
        }}
        hide={() => setShowEndDateSelector(false)}
        localeId={props.localeId}
      />
    </div>
  ) : null;

  const calendarName = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Events of")} ${calendarName}`;
  const searchButton = canSearch ? (
    <Button label={props.translate("Search")} type="submit" id="button-search" working={working} />
  ) : (
    <Button label={props.translate("Search")} type="submit" id="button-search" working={working} disabled={true} />
  );

  return (
    <article>
      <h1>{title}</h1>
      <Message result={result} origin={messageOrigin} translate={props.translate} />
      {props.actionButtonsZone}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <Input
              label={props.translate("Search")}
              type="search"
              id="input-search"
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
                label={props.translate("Start date")}
                type="text"
                id="input-start-date"
                value={startDate !== null ? startDate.setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATE_HUGE) : ""}
                readOnly={true}
                onClick={() => setShowStartDateSelector(true)}
              />
              {startDateSelector}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div style={{ position: "relative" }}>
              <Input
                label={props.translate("End date")}
                type="text"
                id="input-end-date"
                value={endDate !== null ? endDate.setLocale(getLocale(props.localeId)).toLocaleString(DateTime.DATE_HUGE) : ""}
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
              label={props.translate("Status")}
              id="select-status"
              options={[{ label: props.translate("All"), value: "" }, { label: props.translate(eventStatus.DRAFT.label), value: eventStatus.DRAFT.value }, { label: props.translate(eventStatus.PENDING_APPROVAL.label), value: eventStatus.PENDING_APPROVAL.value }, { label: props.translate(eventStatus.PUBLISHED.label), value: eventStatus.PUBLISHED.value }]}
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
      <EventsList
        selectedDate={DateTime.now()}
        events={props.events}
        noEventsMessage={props.translate("There are no events matching these search criteria.")}
        account={props.account}
        calendar={props.calendar}
        localeId={props.localeId}
        translate={props.translate}
        edit={props.editEvent}
        deleteEvent={props.deleteEvent}
        updateEvent={props.updateEvent}
        setResult={setResult}
        setMessageOrigin={setMessageOrigin}
        showStatus={true}
        showButtons={true}
        refreshEvents={() => {
          const q = buildQuery();
          searchEvents(q);
        }}
      />
    </article>
  );
}