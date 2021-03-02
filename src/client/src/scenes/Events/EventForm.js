import { useState, useEffect } from "react";
import Button from "../../components/Form/Button";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Checkbox from "../../components/Form/Checkbox";
import { DateTime } from "luxon";
import Month from "../Calendars/Month";
import { textValid, timeList, decideWhatToDisplay } from "../../services/Helpers";

export default function EventForm(props) {
  const [nameEn, setNameEn] = useState("");
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [nameFr, setNameFr] = useState("");
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [hyperlinkEn, setHyperlinkEn] = useState("");
  const [hyperlinkFr, setHyperlinkFr] = useState("");
  const [startDate, setStartDate] = useState(DateTime.now());
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
  const [endDate, setEndDate] = useState(DateTime.now());
  const [showEndDateSelector, setShowEndDateSelector] = useState(false);
  const [endTime, setEndTime] = useState("");
  const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
  const [allDay, setAllDay] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (requesting) {
      function getTimeValues(time) {
        let hour;
        let minute;
        if (time.indexOf("pm") !== -1) {
          hour = Number(time.split(":")[0]) + 12;
          minute = Number(time.replace("pm", "").split(":")[1]);
        } else {
          hour = Number(time.split(":")[0]);
          minute = Number(time.replace("am", "").split(":")[1]);
        }
        return { hour: hour, minute: minute};
      }

      const event = {
        calendarId: props.calendar.calendarId,
        nameEn: nameEn !== "" ? nameEn : null,
        nameFr: nameFr !== "" ? nameFr : null,
        descriptionEn: descriptionEn !== "" ? descriptionEn : null,
        descriptionFr: descriptionFr !== "" ? descriptionFr : null,
        hyperlinkEn: hyperlinkEn !== "" ? hyperlinkEn : null,
        hyperlinkFr: hyperlinkFr !== "" ? hyperlinkFr : null,
        startAt: null,
        endAt: null,
        allDay: allDay
      };

      if (allDay) {

      } else {
        const startTimeValues = getTimeValues(startTime);
        const endTimeValues = getTimeValues(endTime);
        event.startAt = startDate.set({ hour: startTimeValues.hour, minute: startTimeValues.minute });
        event.endAt = endDate.set({ hour: endTimeValues.hour, minute: endTimeValues.minute });
      }


      props.createEvent(event, result => {
        props.setResult(result);
        setRequesting(false);
        if (result.success) {
          props.hideForm();
        }
      })
    }
  }, [requesting]);

  function handleSubmit(e) {
    e.preventDefault();
    if (props.calendar.enableEn && props.calendar.enableFr) {
      if (textValid(nameEn) && textValid(nameFr)) {
        debugger
        setRequesting(true);
      } else {
        if (!textValid(nameEn)) setInvalidNameEn(true);
        if (!textValid(nameFr)) setInvalidNameFr(true);
      }
    } else if (props.calendar.enableEn) {
      if (textValid(nameEn)) {
        setRequesting(true);
      } else {
        setInvalidNameEn(true);
      }
    } else if (props.calendar.enableFr) {
      if (textValid(nameFr)) {
        setRequesting(true);
      } else {
        setInvalidNameFr(true);
      }
    }
  }

  const englishFields = props.calendar.enableEn ? (
    <div className="col-12 col-md-6">
      <Input
        label={"English name"}
        type="text"
        id="input-name-en"
        placeholder={"Enter the English event name."}
        info={"Enter the English event name."}
        value={nameEn}
        handleChange={e => {
          setNameEn(e.target.value);
          setInvalidNameEn(false);
        }}
        invalidFeedback={invalidNameEn ? <InvalidFeedback feedback="You must enter a name." /> : null}
      />
      {/*TODO: description fields should be text area*/}
      <Input
        label="English description"
        type="text"
        id="input-description-en"
        placeholder={"Describe your event in English."}
        info={"Describe your event in English."}
        value={descriptionEn}
        handleChange={e => setDescriptionEn(e.target.value)}
      />
      <Input
        label="English hyperlink"
        type="text"
        id="input-hyperlink-en"
        placeholder="Enter the English hyperlink."
        info={"???"}
        value={hyperlinkEn}
        handleChange={e => setHyperlinkEn(e.target.value)}
      />
    </div>
  ) : null;

  const frenchFields = props.calendar.enableFr ? (
    <div className="col-12 col-md-6">
      <Input
        label={props.translate("French name")}
        type="text"
        id="input-name-fr"
        placeholder="Enter the French event name."
        info="Enter the French event name."
        value={nameFr}
        handleChange={e => {
          setNameFr(e.target.value);
          setInvalidNameFr(false);
        }}
        invalidFeedback={invalidNameFr ? <InvalidFeedback feedback="You must enter a name." /> : null}
      />
      {/*TODO: description fields should be text area*/}
      <Input
        label="French description"
        type="text"
        id="input-description-fr"
        placeholder={"Describe your event in French."}
        info={"Describe your event in French."}
        value={descriptionFr}
        handleChange={e => setDescriptionFr(e.target.value)}
      />
      <Input
        label="French hyperlink"
        type="text"
        id="input-hyperlink-fr"
        placeholder="Enter the French hyperlink."
        info={"???"}
        value={hyperlinkFr}
        handleChange={e => setHyperlinkFr(e.target.value)}
      />
    </div>
  ) : null;

  const startDateSelector = showStartDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={"Monday"}
        currentDay={DateTime.now()}
        selectDay={date => {
          setStartDate(date);
          setEndDate(date);
          setShowStartDateSelector(false);
        }}
        language={props.language}
      />
    </div>
  ) : null;

  // TODO: pass correct locale
  const startTimes = timeList("en-ca").map((t, index) => (
    <div key={index} onClick={() => {
      setStartTime(t);
      setShowStartTimeSelector(false);
    }}>{t}</div>
  ));

  const startTimeSelector = showStartTimeSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white", height: 200, overflow: "scroll" }}>
      {startTimes}
    </div>
  ) : null;

  const endDateSelector = showEndDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={"Monday"}
        currentDay={DateTime.now()}
        selectDay={date => {
          setEndDate(date);
          setShowEndDateSelector(false);
        }}
        language={props.language}
      />
    </div>
  ) : null;

  // TODO: pass correct locale
  const endTimes = timeList("en-ca").map((t, index) => (
    <div key={index} onClick={() => {
      setEndTime(t);
      setShowEndTimeSelector(false);
    }}>{t}</div>
  ));

  const endTimeSelector = showEndTimeSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white", height: 200, overflow: "scroll" }}>
      {endTimes}
    </div>
  ) : null;

  const renderTitle = (
    <>
      {props.new ? props.translate("New event in") : props.translate("Edit event in")} {decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr)}
    </>
  );

  const renderSubmitButton = props.new ? props.translate("Create this event") : props.translate("Save changes");

  return (
    <>
      <h1>{props.translate(renderTitle)}</h1>
      <form onSubmit={handleSubmit} id="form-event" noValidate>
        <div className="row mb-3">
          {englishFields}
          {frenchFields}
        </div>
        <div style={{ position: "relative" }}>
          <Input
            label="Start date"
            type="text"
            id="input-start-date"
            placeholder="Select date"
            info="???"
            value={startDate.toLocaleString(DateTime.DATE_HUGE)}
            readOnly={true}
            onClick={() => setShowStartDateSelector(!showStartDateSelector)}
          />
          {startDateSelector}
        </div>
        <div style={{ position: "relative" }}>
          <Input
            label="Start time"
            type="text"
            id="input-start-time"
            placeholder="Select time"
            info="???"
            value={startTime}
            onClick={() => setShowStartTimeSelector(!showStartTimeSelector)}
            handleChange={(e) => setStartTime(e.target.value)}
          />
          {startTimeSelector}
        </div>
        <div style={{ position: "relative" }}>
          <Input
            label="End date"
            type="text"
            id="input-end-date"
            placeholder="Select date"
            info="???"
            value={endDate.toLocaleString(DateTime.DATE_HUGE)}
            readOnly={true}
            onClick={() => setShowEndDateSelector(!showEndDateSelector)}
          />
          {endDateSelector}
        </div>
        <div style={{ position: "relative" }}>
          <Input
            label="End time"
            type="text"
            id="input-end-time"
            placeholder="Select time"
            info="???"
            value={endTime}
            onClick={() => setShowEndTimeSelector(!showEndTimeSelector)}
            handleChange={(e) => setEndTime(e.target.value)}
          />
          {endTimeSelector}
        </div>
        <Checkbox
          label="All day"
          id="all-day"
          value={allDay}
          handleChange={e => setAllDay(e.target.checked)}
          info="When this is checked, ???."
        />
        <Button label={props.translate("Cancel")} id="button-cancel" onClick={props.cancel} outline={true} />
        <Button label={props.translate(renderSubmitButton)} type="submit" working={requesting} id="button-save" />
      </form>
    </>
  );
}