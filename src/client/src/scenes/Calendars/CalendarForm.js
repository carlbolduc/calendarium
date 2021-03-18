import React, { useState, useEffect } from "react";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { textValid } from "../../services/Helpers";
import Checkbox from "../../components/Form/Checkbox";
import Select from "../../components/Form/Select";
import Textarea from "../../components/Form/Textarea";
import ReadOnlyIframe from "../../components/Form/ReadOnlyIframe";

export default function CalendarForm(props) {
  const [enableEn, setEnableEn] = useState(props.calendar.enableEn);
  const [nameEn, setNameEn] = useState(props.calendar.nameEn);
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState(props.calendar.descriptionEn);
  const [invalidDescriptionEn, setInvalidDescriptionEn] = useState(false);
  const [linkEn, setLinkEn] = useState(props.calendar.linkEn);
  const [invalidLinkEn, setInvalidLinkEn] = useState(false);
  const [enableFr, setEnableFr] = useState(props.calendar.enableFr);
  const [nameFr, setNameFr] = useState(props.calendar.nameFr);
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [descriptionFr, setDescriptionFr] = useState(props.calendar.descriptionFr);
  const [invalidDescriptionFr, setInvalidDescriptionFr] = useState(false);
  const [linkFr, setLinkFr] = useState(props.calendar.linkFr);
  const [invalidLinkFr, setInvalidLinkFr] = useState(false);
  const [startWeekOn, setStartWeekOn] = useState(props.calendar.startWeekOn);
  const [primaryColor, setPrimaryColor] = useState(props.calendar.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(props.calendar.secondaryColor);
  const [publicCalendar, setPublicCalendar] = useState(props.calendar.publicCalendar);
  const [requesting, setRequesting] = useState(false);
  const [eventApprovalRequired, setEventApprovalRequired] = useState(props.calendar.eventApprovalRequired);
  const [noLanguageEnabled, setNoLanguageEnabled] = useState(false);

  useEffect(() => {
    if (requesting) {
      // Name and link must be unique, set them to null if they are an empty string
      const calendar = {
        enableEn: enableEn,
        nameEn: nameEn === "" ? null : nameEn,
        descriptionEn: descriptionEn,
        linkEn: linkEn === "" ? null : linkEn,
        enableFr: enableFr,
        nameFr: nameFr === "" ? null : nameFr,
        descriptionFr: descriptionFr,
        linkFr: linkFr === "" ? null : linkFr,
        startWeekOn: startWeekOn,
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        publicCalendar: publicCalendar,
        eventApprovalRequired: eventApprovalRequired
      }
      if (props.new) {
        props.createCalendar(calendar, result => {
          props.setResult(result);
          setRequesting(false);
          if (result.success) {
            props.hideForm();
          }
        });
      } else {
        props.updateCalendar(props.calendar.calendarId, calendar, result => {
          props.setResult(result);
          setRequesting(false);
          if (result.success) {
            props.hideForm();
          }
        });
      }
    }
  }, [requesting]);

  useEffect(() => {
    if (enableEn || enableFr) {
      setNoLanguageEnabled(false);
    }
    if (!enableEn) {
      setInvalidNameEn(false);
      setInvalidDescriptionEn(false);
      setInvalidLinkEn(false);
    }
    if (!enableFr) {
      setInvalidNameFr(false);
      setInvalidDescriptionFr(false);
      setInvalidLinkFr(false);
    }
  }, [enableEn, enableFr])

  function handleSubmit(e) {
    e.preventDefault();
    const enValid = textValid(nameEn) && textValid(descriptionEn) && textValid(linkEn);
    const frValid = textValid(nameFr) && textValid(descriptionFr) && textValid(linkFr);
    if (enableEn && enableFr) {
      if (enValid && frValid) {
        setRequesting(true);
      } else {
        if (!textValid(nameEn)) setInvalidNameEn(true);
        if (!textValid(descriptionEn)) setInvalidDescriptionEn(true);
        if (!textValid(linkEn)) setInvalidLinkEn(true);
        if (!textValid(nameFr)) setInvalidNameFr(true);
        if (!textValid(descriptionFr)) setInvalidDescriptionFr(true);
        if (!textValid(linkFr)) setInvalidLinkFr(true);
      }
    } else if (enableEn) {
      if (enValid) {
        setRequesting(true);
      } else {
        if (!textValid(nameEn)) setInvalidNameEn(true);
        if (!textValid(descriptionEn)) setInvalidDescriptionEn(true);
        if (!textValid(linkEn)) setInvalidLinkEn(true);
      }
    } else if (enableFr) {
      if (frValid) {
        setRequesting(true);
      } else {
        if (!textValid(nameFr)) setInvalidNameFr(true);
        if (!textValid(descriptionFr)) setInvalidDescriptionFr(true);
        if (!textValid(linkFr)) setInvalidLinkFr(true);
      }
    } else {
      setNoLanguageEnabled(true);
    }
  }

  const englishFields = enableEn ? (
    <>
      <ReadOnlyIframe iframe={enableEn ? `<iframe src="https://codebards.io/embed/${props.calendar.calendarId}?locale=enCa"></iframe>` : ""} />
      <Input
        label={"English name"}
        type="text"
        id="input-name-en"
        placeholder={"Enter the English calendar name."}
        info={"Enter the English calendar name."}
        value={nameEn}
        handleChange={e => {
          setNameEn(e.target.value);
          setInvalidNameEn(false);
        }}
        invalidFeedback={invalidNameEn ? <InvalidFeedback feedback="You must enter a name." /> : null}
      />
      <Textarea
        label="English description"
        type="text"
        id="input-description-en"
        placeholder={"Describe your calendar in English."}
        info={"Describe your calendar in English."}
        height="100"
        value={descriptionEn}
        handleChange={e => {
          setDescriptionEn(e.target.value);
          setInvalidDescriptionEn(false);
        }}
        invalidFeedback={invalidDescriptionEn ? <InvalidFeedback feedback="You must enter a description." /> : null}
      />
      <Input
        label="English customised link"
        type="text"
        id="input-link-en"
        placeholder="Enter the English customised link."
        info={"Enter the customised name that you would like to appear in the browser url when accessing the English version of your calendar."}
        value={linkEn}
        handleChange={e => {
          setLinkEn(e.target.value);
          setInvalidLinkEn(false);
        }}
        invalidFeedback={invalidLinkEn ? <InvalidFeedback feedback="You must enter a link." /> : null}
      />
    </>
  ) : null;

  const frenchFields = enableFr ? (
    <>
      <ReadOnlyIframe iframe={enableFr ? `<iframe src="https://codebards.io/embed/${props.calendar.calendarId}?locale=frCa"></iframe>` : ""} />
      <Input
        label={props.translate("French name")}
        type="text"
        id="input-name-fr"
        placeholder="Enter the French calendar name."
        info="Enter the French calendar name."
        value={nameFr}
        handleChange={e => {
          setNameFr(e.target.value);
          setInvalidNameFr(false);
        }}
        invalidFeedback={invalidNameFr ? <InvalidFeedback feedback="You must enter a name." /> : null}
      />
      <Textarea
        label="French description"
        type="text"
        id="input-description-fr"
        placeholder={"Describe your calendar in French."}
        info={"Describe your calendar in French."}
        height="100"
        value={descriptionFr}
        handleChange={e => {
          setDescriptionFr(e.target.value);
          setInvalidDescriptionFr(false);
        }}
        invalidFeedback={invalidDescriptionFr ? <InvalidFeedback feedback="You must enter a description." /> : null}
      />
      <Input
        label="French customised link"
        type="text"
        id="input-link-fr"
        placeholder="Enter the French customised link."
        info={"Enter the customised name that you would like to appear in the browser url when accessing the French version of your calendar."}
        value={linkFr}
        handleChange={e => {
          setLinkFr(e.target.value);
          setInvalidLinkFr(false);
        }}
        invalidFeedback={invalidLinkFr ? <InvalidFeedback feedback="You must enter a link." /> : null}
      />
    </>
  ) : null;

  const title = props.new ? "New calendar" : "Calendar settings";

  const submitButton = props.new ? "Create this calendar" : "Save changes";

  return (
    // TODO: use {props.translate("")} for text visible in the app
    <>
      <h1>{props.translate(title)}</h1>
      {props.calendarEmbed}
      <form onSubmit={handleSubmit} id="form-new-calendar" noValidate>
        {noLanguageEnabled ? <InvalidFeedback feedback="Enable at least one language." /> : null}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <Checkbox
              label="Enable English content for this calendar"
              id="enable-en"
              value={enableEn}
              handleChange={e => setEnableEn(e.target.checked)}
              info="When this is checked, you will be able to provide English versions of content for this calendar and for its events."
            />
            {englishFields}
          </div>
          <div className="col-12 col-md-6">
            <Checkbox
              label="Enable French content for this calendar"
              id="enable-fr"
              value={enableFr}
              handleChange={e => setEnableFr(e.target.checked)}
              info="When this is checked, you will be able to provide French versions of content for this calendar and for its events."
            />
            {frenchFields}
          </div>
        </div>
        <Select
          label="Start week on"
          id="select-start-week-on"
          options={[{ label: "Monday", value: "Monday" }, { label: "Tuesday", value: "Tuesday" }, { label: "Wednesday", value: "Wednesday" }, { label: "Thursday", value: "Thursday" }, { label: "Friday", value: "Friday" }, { label: "Saturday", value: "Saturday" }, { label: "Sunday", value: "Sunday" }]}
          value={startWeekOn}
          handleChange={e => setStartWeekOn(e.target.value)}
          info="Select which day of the week will be the first day displayed on the left in this calendar."
        />
        <Input
          label="Primary color"
          type="color"
          id="input-primary-color"
          placeholder={"Primary color"}
          value={primaryColor}
          handleChange={e => setPrimaryColor(e.target.value)}
          // TODO: include in the info text where the primary color is used in the calendar (TBD when the calendar display will be done)
          info="Select a primary color for this calendar."
        />
        <Input
          label="Secondary color"
          type="color"
          id="input-secondary-color"
          placeholder={"Secondary color"}
          value={secondaryColor}
          handleChange={e => setSecondaryColor(e.target.value)}
          // TODO: include in the info text where the secondary color is used in the calendar (TBD when the calendar display will be done)
          info="Select a secondary color for this calendar."
        />
        <Checkbox
          label="Make this calendar available publicly"
          id="public-calendar"
          value={publicCalendar}
          required={false}
          handleChange={e => setPublicCalendar(e.target.checked)}
          info="When this is checked, this calendar will appear in the section Public calendars, anyone will be able to view its events, and it will be indexed by search engines. You can uncheck this at any time and the calendar will no longer be included in Public calendars, but a cache may remain in search engines."
        />
        <Checkbox
          label="Require my approval to publish other users' events"
          id="event-approval-required"
          value={eventApprovalRequired}
          required={false}
          handleChange={e => setEventApprovalRequired(e.target.checked)}
          info="When this is checked, you will need to approve all events created by other users that you have invited to this calendar. You can uncheck this at any time to remove the restriction and instantly approve any pending events."
        />
        <Button label={props.translate("Cancel")} id="button-cancel" onClick={props.cancel} outline={true} />
        <Button label={props.translate(submitButton)} type="submit" working={requesting} id="button-save" />
      </form>
    </>
  );
}