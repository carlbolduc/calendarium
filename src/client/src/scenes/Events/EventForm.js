import { useState, useEffect } from "react";
import Button from "../../components/Form/Button";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Checkbox from "../../components/Form/Checkbox";
import { DateTime } from "luxon";
import Month from "../Calendars/Month";
import {textValid, timesList, decideWhatToDisplay, getLocale} from "../../services/Helpers";
import Textarea from "../../components/Form/Textarea";

export default function EventForm(props) {
  const [nameEn, setNameEn] = useState("");
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [nameFr, setNameFr] = useState("");
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [hyperlinkEn, setHyperlinkEn] = useState("");
  const [hyperlinkFr, setHyperlinkFr] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [invalidStartDate, setInvalidStartDate] = useState(false);
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [previousStartTime, setPreviousStartTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [invalidStartTime, setInvalidStartTime] = useState(false);
  const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [invalidEndDate, setInvalidEndDate] = useState(false);
  const [showEndDateSelector, setShowEndDateSelector] = useState(false);
  const [previousEndTime, setPreviousEndTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [invalidEndTime, setInvalidEndTime] = useState(false);
  const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (props.event !== null) {
      const locale = getLocale(props.language);
      const fm = DateTime.TIME_SIMPLE;
      setNameEn(props.event.nameEn);
      setNameFr(props.event.nameFr);
      setDescriptionEn(props.event.descriptionEn !== null ? props.event.descriptionEn : "");
      setDescriptionFr(props.event.descriptionFr !== null ? props.event.descriptionFr : "");
      setHyperlinkEn(props.event.hyperlinkEn);
      setHyperlinkFr(props.event.hyperlinkFr);
      const startAt = DateTime.fromSeconds(props.event.startAt);
      setStartDate(DateTime.fromFormat(`${startAt.year}-${startAt.month}-${startAt.day}`, "yyyy-M-d"));
      const endAt = DateTime.fromSeconds(props.event.endAt);
      setEndDate(DateTime.fromFormat(`${endAt.year}-${endAt.month}-${endAt.day}`, "yyyy-M-d"));
      if (props.event.allDay) {
        setAllDay(true);
      } else {
        setPreviousStartTime(startAt.setLocale(locale).toLocaleString(fm));
        setStartTime(startAt.setLocale(locale).toLocaleString(fm));
        setPreviousEndTime(endAt.setLocale(locale).toLocaleString(fm));
        setEndTime(endAt.setLocale(locale).toLocaleString(fm));
      }
    }
  }, [props.event]);

  useEffect(() => {
    const locale = getLocale(props.language);
    const dt = DateTime.now();
    const fm = DateTime.TIME_SIMPLE;
    if (textValid(previousStartTime)) {
      const previousStartTimeValues = getTimeValues(previousStartTime);
      setPreviousStartTime(dt.set({ hour: previousStartTimeValues.hour, minute: previousStartTimeValues.minute, second: 0, millisecond: 0 }).setLocale(locale).toLocaleString(fm));
    }
    if (textValid(startTime)) {
      const startTimeValues = getTimeValues(startTime);
      setStartTime(dt.set({ hour: startTimeValues.hour, minute: startTimeValues.minute, second: 0, millisecond: 0 }).setLocale(locale).toLocaleString(fm));
    }
    if (textValid(previousEndTime)) {
      const previousEndTimeValues = getTimeValues(previousEndTime);
      setPreviousEndTime(dt.set({ hour: previousEndTimeValues.hour, minute: previousEndTimeValues.minute, second: 0, millisecond: 0 }).setLocale(locale).toLocaleString(fm));
    }
    if (textValid(endTime)) {
      const endTimeValues = getTimeValues(endTime);
      setEndTime(dt.set({ hour: endTimeValues.hour, minute: endTimeValues.minute, second: 0, millisecond: 0 }).setLocale(locale).toLocaleString(fm));
    }
  }, [props.language]);

  useEffect(() => {
    if (requesting) {
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
        event.startAt = startDate.startOf("day").toSeconds();
        event.endAt = endDate.endOf("day").toSeconds();
      } else {
        const startTimeValues = getTimeValues(startTime);
        const endTimeValues = getTimeValues(endTime);
        event.startAt = startDate.set({ hour: startTimeValues.hour, minute: startTimeValues.minute, second: 0, millisecond: 0 }).toSeconds();
        event.endAt = endDate.set({ hour: endTimeValues.hour, minute: endTimeValues.minute, second: 0, millisecond: 0 }).toSeconds();
      }

      if (props.event === null) {
        props.createEvent(event, result => {
          setRequesting(false);
          if (result.success) {
            props.getCalendarEvents();
            props.hideForm();
          } else {
            props.setResult(result);
          }
        });
      } else {
        event["eventId"] = props.event.eventId;
        props.updateEvent(event, result => {
          setRequesting(false);
          if (result.success) {
            props.getCalendarEvents();
            props.hideForm();
          } else {
            props.setResult(result);
          }
        });
      }


    }
  }, [requesting]);

  function handleSubmit(e) {
    e.preventDefault();
    // Text validations
    const enValid = validateEnglishFields();
    const frValid = validateFrenchFields();
    // Dates validations
    const datesAndTimesValid = validateDateAndTimeFields();
    if ( enValid && frValid && datesAndTimesValid) {
      setRequesting(true);
    }
  }

  function validateEnglishFields() {
    let valid;
    if (props.calendar.enableEn) {
      valid = textValid(nameEn);
    } else {
      valid = true;
    }
    if (!valid) setInvalidNameEn(true);
    return valid;
  }

  function validateFrenchFields() {
    let valid;
    if (props.calendar.enableFr) {
      valid = textValid(nameFr);
    } else {
      valid = true;
    }
    if (!valid) setInvalidNameFr(true);
    return valid;
  }

  function validateDateAndTimeFields() {
    const startDateValid = startDate !== null;
    let startTimeValid;
    const endDateValid = (endDate !== null && startDateValid && endDate.ts >= startDate.ts) || (endDate !== null && !startDateValid);
    let endTimeValid;
    if (allDay) {
      startTimeValid = true;
      endTimeValid = true;
    } else if (startDateValid && endDateValid) {
      startTimeValid = textValid(startTime);
      if (textValid(endTime)) {
        if (startDate.day === endDate.day && startTimeValid) {
          // Events ends on the same day that it started, endTime must be later than start time
          const startTimeValues = getTimeValues(startTime);
          const endTimeValues = getTimeValues(endTime);
          endTimeValid = endTimeValues.hour > startTimeValues.hour ||
            endTimeValues.hour === startTimeValues.hour && endTimeValues.minute > startTimeValues.minute;
        } else {
          // Event ends on a different day OR startTime is invalid, all end times are valid
          endTimeValid = true;
        }
      } else {
        endTimeValid = false;
      }
    } else {
      // Dates are not valid, we cannot set time as invalid
      startTimeValid = true;
      endTimeValid = true;
    }
    if (!startDateValid) setInvalidStartDate(true);
    if (!startTimeValid) setInvalidStartTime(true);
    if (!endDateValid) setInvalidEndDate(true);
    if (!endTimeValid) setInvalidEndTime(true);
    return startDateValid && startTimeValid && endDateValid && endTimeValid;
  }

  function getTimeValues(time) {
    // This function is safe since we process time values that were generated by Luxon
    let hour;
    let minute;
    // We support two time formats: English (1:00 p.m.) and French (13 h 00)
    const timeParts = time.indexOf("h") !== -1 ? time.split(" h ") : time.split(":");
    if (timeParts[1].indexOf("p.m.") !== -1) {
      // When processing English format, return corresponding 24h format
      hour = Number(timeParts[0]);
      if (hour !== 12) {
        hour += 12;
      }
      minute = Number(timeParts[1].replace("p.m.", ""));
    } else {
      hour = Number(timeParts[0]);
      if (timeParts[1].indexOf("a.m.") !== -1 && hour === 12) {
        // When processing English format, return corresponding 24h format
        hour = 0;
      }
      minute = Number(timeParts[1].replace("a.m.", ""));
    }
    return { hour: hour, minute: minute };
  }

  function processTime(time) {
    const result = { valid: false, hour: 0, minute: 0 };
    const timeParts = time.indexOf("h") !== -1 ? time.split(" h ") : time.split(":");
    if (timeParts.length === 2) {
      const re = /AM|A\.M\.|am|a\.m\.|PM|P\.M\.|pm|p\.m\./g;
      if (timeParts[1].match(re)) {
        // English time format
        let hour = Number(timeParts[0]);
        if (!isNaN(hour) && hour < 13) {
          const minutes = Number(timeParts[1].substring(0,2));
          if (!isNaN(minutes) && minutes < 60) {
            const meridiem = timeParts[1].match(re)[0];
            if (hour === 12 && ["am", "a.m."].indexOf(meridiem.toLowerCase()) !== -1) {
              hour = 0;
            } else if (hour !== 12 && ["pm", "p.m."].indexOf(meridiem.toLowerCase()) !== -1) {
              hour += 12;
            }
            result.valid = true;
            result.hour = hour;
            result.minute = minutes;
          }
        }
      } else {
        const hour = Number(timeParts[0]);
        const minutes = Number(timeParts[1].substring(0,2));
        if (!isNaN(hour) && !isNaN(minutes) && hour < 24 && minutes < 60) {
          result.valid = true;
          result.hour = hour;
          result.minute = minutes;
        }
      }
    }
    return result;
  }

  function processStartTime() {

    const startTimeValues = processTime(startTime);
    if (startTimeValues.valid) {
      const locale = getLocale(props.language);
      const fm = DateTime.TIME_SIMPLE;
      const dt = DateTime.fromObject({ hour: startTimeValues.hour, minute: startTimeValues.minute, second: 0, millisecond: 0 });
      setPreviousStartTime(dt.setLocale(locale).toLocaleString(fm))
      setStartTime(dt.setLocale(locale).toLocaleString(fm));
    } else {
      setStartTime(previousStartTime);
    }
  }

  function processEndTime() {
    const result = processTime(endTime);
    if (result.valid) {
      const locale = getLocale(props.language);
      const fm = DateTime.TIME_SIMPLE;
      const dt = DateTime.fromObject({ hour: result.hour, minute: result.minute, second: 0, millisecond: 0 });
      setPreviousEndTime(dt.setLocale(locale).toLocaleString(fm));
      setEndTime(dt.setLocale(locale).toLocaleString(fm));
    } else {
      setEndTime(previousEndTime);
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
      <Textarea
        label="English description"
        id="textarea-description-en"
        placeholder={"Describe your event in English."}
        height={100}
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
      <Textarea
        label="French description"
        id="textarea-description-fr"
        placeholder={"Describe your event in French."}
        height={100}
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
        startWeekOn={props.calendar.startWeekOn}
        currentDay={DateTime.now()}
        selectDay={date => {
          setStartDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setInvalidStartDate(false);
        }}
        hide={() => setShowStartDateSelector(false)}
        language={props.language}
      />
    </div>
  ) : null;

  const startTimes = timesList(getLocale(props.language)).map((t, index) => (
    <div
      key={index}
      onMouseDown={() => {
        setStartTime(t);
        setInvalidStartTime(false);
      }}
      onMouseUp={() => setShowStartTimeSelector(false)}
    >
      {t}
    </div>
  ));

  const startTimeSelector = showStartTimeSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white", height: 200, overflow: "scroll" }}>
      {startTimes}
    </div>
  ) : null;

  const endDateSelector = showEndDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={props.calendar.startWeekOn}
        currentDay={DateTime.now()}
        selectDay={date => {
          setEndDate(DateTime.fromFormat(`${date.year}-${date.month}-${date.day}`, "yyyy-M-d"));
          setInvalidEndDate(false);
        }}
        hide={() => setShowEndDateSelector(false)}
        language={props.language}
      />
    </div>
  ) : null;

  const endTimes = timesList(getLocale(props.language)).map((t, index) => (
    <div
      key={index}
      onMouseDown={() => {
        setEndTime(t);
        setInvalidEndTime(false);
      }}
      onMouseUp={() => setShowEndTimeSelector(false)}
    >
      {t}
    </div>
  ));

  const endTimeSelector = showEndTimeSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white", height: 200, overflow: "scroll" }}>
      {endTimes}
    </div>
  ) : null;

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = props.event === null ? `${props.translate("New event in")} ${calendarName}` : `${props.translate("Edit event in")} ${calendarName}`;

  const submitButton = props.event === null ? props.translate("Create this event") : props.translate("Save changes");

  return (
    <>
      <h1>{title}</h1>
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
            value={startDate !== null ? startDate.setLocale(getLocale(props.language)).toLocaleString(DateTime.DATE_HUGE) : ""}
            readOnly={true}
            onClick={() => setShowStartDateSelector(true)}
            invalidFeedback={invalidStartDate ? <InvalidFeedback feedback="You must chose a start date." /> : null}
          />
          {startDateSelector}
        </div>
        {allDay ? null : (
          <div style={{ position: "relative" }}>
            <Input
              label="Start time"
              type="text"
              id="input-start-time"
              placeholder="Select time"
              info="???"
              value={startTime}
              onClick={() => setShowStartTimeSelector(!showStartTimeSelector)}
              onBlur={() => {
                setShowStartTimeSelector(false);
                processStartTime();
              }}
              handleChange={(e) => {
                setStartTime(e.target.value);
                setInvalidStartTime(false);
              }}
              invalidFeedback={invalidStartTime ? <InvalidFeedback feedback="You must chose a start time." /> : null}
            />
            {startTimeSelector}
          </div>
        )}
        <div style={{ position: "relative" }}>
          <Input
            label="End date"
            type="text"
            id="input-end-date"
            placeholder="Select date"
            info="???"
            value={endDate !== null ? endDate.setLocale(getLocale(props.language)).toLocaleString(DateTime.DATE_HUGE) : ""}
            readOnly={true}
            onClick={() => setShowEndDateSelector(!showEndDateSelector)}
            invalidFeedback={invalidEndDate ? <InvalidFeedback feedback="Your end date must be on the same day as your start date or later." /> : null}
          />
          {endDateSelector}
        </div>
        {allDay ? null : (
          <div style={{ position: "relative" }}>
            <Input
              label="End time"
              type="text"
              id="input-end-time"
              placeholder="Select time"
              info="???"
              value={endTime}
              onClick={() => setShowEndTimeSelector(!showEndTimeSelector)}
              onBlur={() => {
                setShowEndTimeSelector(false);
                processEndTime();
              }}
              handleChange={(e) => {
                setEndTime(e.target.value);
                setInvalidEndTime(false);
              }}
              invalidFeedback={invalidEndTime ? <InvalidFeedback feedback="Your end time must be valid and later than your start time." /> : null}
            />
            {endTimeSelector}
          </div>
        )}
        <Checkbox
          label="All day"
          id="all-day"
          value={allDay}
          handleChange={e => setAllDay(e.target.checked)}
          info="When this is checked, ???."
        />
        <Button label={props.translate("Cancel")} type="button" id="button-cancel" onClick={props.cancel} outline={true} />
        <Button label={props.translate(submitButton)} type="submit" working={requesting} id="button-save" />
      </form>
    </>
  );
}