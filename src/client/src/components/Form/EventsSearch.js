import React, {useState, useEffect, useCallback} from "react";
import Event from "../../scenes/Events/Event";
import Select from "./Select";
import Input from "./Input";
import Button from "./Button";
import {decideWhatToDisplay, encodeObject, eventStatus, getLocale} from "../../services/Helpers";
import Message from "./Message";
import {DateTime} from "luxon";
import Month from "../../scenes/Calendars/Month";
import EditEventButton from "../../scenes/Events/EditEventButton";
import SendForApprovalEventButton from "../../scenes/Events/SendForApprovalEventButton";
import ApproveEventButton from "../../scenes/Events/ApproveEventButton";
import PublishEventButton from "../../scenes/Events/PublishEventButton";
import UnpublishEventButton from "../../scenes/Events/UnpublishEventButton";
import DeleteEventButton from "../../scenes/Events/DeleteEventButton";

export default function EventsSearch(props) {
  const searchEvents = props.searchEvents;
  const updateEvent = props.updateEvent;
  const deleteEvent = props.deleteEvent;
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [showEndDateSelector, setShowEndDateSelector] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [working, setWorking] = useState(false);
  const [canSearch, setCanSearch] = useState(false);

  const buildQuery = useCallback(() => {
    return encodeObject({
      search: search,
      startAt: startDate !== null ? startDate.startOf("day").toSeconds() : null,
      endAt: endDate !== null ? endDate.endOf("day").toSeconds() : null,
      status: status,
      calendarId: props.calendar.calendarId
    });
  }, [props.calendar.calendarId, endDate, search, startDate, status]);

  // Perform search immidiately when the search form is shown
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      const q = buildQuery();
      searchEvents(q);
    }
  }, [initialLoad, buildQuery, searchEvents]);
  
  const executeSearch = useCallback(() => {
    if (working) {
      const q = buildQuery();
      searchEvents(q, () => {
        setWorking(false);
        setCanSearch(false);
      });
    }
  }, [working, buildQuery, searchEvents]);

  useEffect(() => {
    if (working) {
      // Build query param with currentDay
      executeSearch();
    }
  }, [working, executeSearch]);

  function handleSubmit(e) {
    e.preventDefault();
    setWorking(true);
  }

  const submitForApproval = useCallback((event) => {
    event.status = eventStatus.PENDING_APPROVAL.value;
    updateEvent(event, () => {
      setWorking(true);
    });
  }, [updateEvent]);

  const approveEvent = useCallback((event) => {
    event.status = eventStatus.PUBLISHED.value;
    updateEvent(event, () => {
      setWorking(true);
    });
  }, [updateEvent]);

  const unpublishEvent = useCallback((event) => {
    event.status = eventStatus.DRAFT.value;
    updateEvent(event, () => {
      setWorking(true);
    });
  }, [updateEvent]);

  const deleteThisEvent = useCallback((event) => {
    deleteEvent(event.eventId, () => {
      setWorking(true);
    });
  }, [deleteEvent]);

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

  function eventActions(event) {
    return (
      <div>
        <EditEventButton
          event={event}
          account={props.account}
          calendar={props.calendar}
          edit={() => props.setEvent(event)}
          translate={props.translate}
        />
        <SendForApprovalEventButton
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
          deleteEvent={deleteThisEvent}
          translate={props.translate}
        />
      </div>
    )
  }

  const events = props.events.map(e => (
    <Event 
      key={e.eventId} 
      event={e} 
      showStatus={true} 
      eventActions={eventActions(e)} 
      language={props.language} 
      translate={props.translate}
      enableEn={props.calendar.enableEn}
      enableFr={props.calendar.enableFr}
   />
  ));

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Events of")} ${calendarName}`;
  const searchButton = canSearch ? (
    <Button label="Search" type="submit" working={working} id="button-search" />
  ) : (
    <Button label="Search" type="submit" working={working} id="button-search" disabled={true} />
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