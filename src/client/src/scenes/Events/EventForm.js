import { useState, useEffect } from "react";
import Button from "../../components/Form/Button";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Checkbox from "../../components/Form/Checkbox";
import { DateTime } from "luxon";
import Month from "../Calendars/Month";

export default function EventForm(props) {
  const [status, setStatus] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [nameFr, setNameFr] = useState("");
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [hyperlinkEn, setHyperlinkEn] = useState("");
  const [hyperlinkFr, setHyperlinkFr] = useState("");
  const [startDate, setStartDate] = useState("");
  const [showStartDateSelector, setShowStartDateSelector] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [allDay, setAllDay] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const event = {};
    props.createEvent(event, result => {
      props.setResult(result);
      setRequesting(false);
      if (result.success) {
        props.hideForm();
      }
    })

  }, [requesting]);

  function handleSubmit(e) {
    e.preventDefault();
    if (true) {
      setRequesting(true);
    }
  }

  const englishFields = props.calendar.enableEn ? (
    <>
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
    </>
  ) : null;

  const frenchFields = props.calendar.enableFr ? (
    <>
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
    </>
  ) : null;

  const startDateSelector = showStartDateSelector ? (
    <div style={{ position: "absolute", top: 57, left: 0, zIndex: 10, background: "white" }}>
      <Month
        startWeekOn={"Monday"}
        currentDay={DateTime.now()}
        setCurrentDay={setStartDate}
        language={props.language}
      />
    </div>
  ) : null;

  const renderTitle = props.new ? "New event" : "Edit event";

  const renderSubmitButton = props.new ? "Create this event" : "Save changes";

  return (
    <>
      <h1>{props.translate(renderTitle)}</h1>
      <form onSubmit={handleSubmit} id="form-event" noValidate>
        {englishFields}
        {frenchFields}
        <div style={{ position: "relative" }}>
          <Input
            label="Select day"
            type="text"
            id="input-start-day"
            placeholder="Select day"
            info="???"
            value={startDate}
            readOnly={true}
            onClick={() => setShowStartDateSelector(!showStartDateSelector)}
          />
          {startDateSelector}
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