import React, { useState, useEffect, useCallback } from "react";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import { textValid } from "../../services/Helpers";
import Checkbox from "../../components/Form/Checkbox";
import Select from "../../components/Form/Select";
import Textarea from "../../components/Form/Textarea";
import ReadOnlyIframe from "../../components/Form/ReadOnlyIframe";
import Month from "./Month";
import { DateTime } from "luxon";

export default function CalendarForm(props) {
  const createCalendar = props.createCalendar;
  const updateCalendar = props.updateCalendar;
  const setResult = props.setResult;
  const setShowCalendarForm = props.setShowCalendarForm;
  const [enableEn, setEnableEn] = useState(props.new ? false : props.calendar.enableEn);
  const [nameEn, setNameEn] = useState(props.new ? "" : props.calendar.nameEn);
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState(props.new ? "" : props.calendar.descriptionEn);
  const [invalidDescriptionEn, setInvalidDescriptionEn] = useState(false);
  const [linkEn, setLinkEn] = useState(props.new ? "" : props.calendar.linkEn);
  const [invalidLinkEn, setInvalidLinkEn] = useState(false);
  const [enableFr, setEnableFr] = useState(props.new ? false : props.calendar.enableFr);
  const [nameFr, setNameFr] = useState(props.new ? "" : props.calendar.nameFr);
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [descriptionFr, setDescriptionFr] = useState(props.new ? "" : props.calendar.descriptionFr);
  const [invalidDescriptionFr, setInvalidDescriptionFr] = useState(false);
  const [linkFr, setLinkFr] = useState(props.new ? "" : props.calendar.linkFr);
  const [invalidLinkFr, setInvalidLinkFr] = useState(false);
  const [startWeekOn, setStartWeekOn] = useState(props.new ? "Sunday" : props.calendar.startWeekOn);
  const [primaryColor, setPrimaryColor] = useState(props.new ? "#ffffff" : props.calendar.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(props.new ? "#ffffff" : props.calendar.secondaryColor);
  const [embedCalendar, setEmbedCalendar] = useState(props.new ? false : props.calendar.embedCalendar);
  const [publicCalendar, setPublicCalendar] = useState(props.new ? false : props.calendar.publicCalendar);
  const [working, setWorking] = useState(false);
  const [eventApprovalRequired, setEventApprovalRequired] = useState(props.new ? true : props.calendar.eventApprovalRequired);
  const [noLanguageEnabled, setNoLanguageEnabled] = useState(false);
  const [currentDay, setCurrentDay] = useState(DateTime.now());

  const buildCalendar = useCallback(() => {
    return {
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
      embedCalendar: embedCalendar,
      publicCalendar: publicCalendar,
      eventApprovalRequired: eventApprovalRequired
    };
  }, [enableEn, nameEn, descriptionEn, linkEn, enableFr, nameFr, descriptionFr, linkFr, startWeekOn, primaryColor, secondaryColor, embedCalendar, publicCalendar, eventApprovalRequired])

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
    let canSubmit = false;
    const enValid = textValid(nameEn) && textValid(descriptionEn) && textValid(linkEn);
    const frValid = textValid(nameFr) && textValid(descriptionFr) && textValid(linkFr);
    if (enableEn && enableFr) {
      if (enValid && frValid) {
        canSubmit = true;
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
        canSubmit = true;
      } else {
        if (!textValid(nameEn)) setInvalidNameEn(true);
        if (!textValid(descriptionEn)) setInvalidDescriptionEn(true);
        if (!textValid(linkEn)) setInvalidLinkEn(true);
      }
    } else if (enableFr) {
      if (frValid) {
        canSubmit = true;
      } else {
        if (!textValid(nameFr)) setInvalidNameFr(true);
        if (!textValid(descriptionFr)) setInvalidDescriptionFr(true);
        if (!textValid(linkFr)) setInvalidLinkFr(true);
      }
    } else {
      setNoLanguageEnabled(true);
    }
    if (canSubmit) {
      setWorking(true);
      // Name and link must be unique, set them to null if they are an empty string
      const calendar = buildCalendar();
      if (props.new) {
        createCalendar(calendar, result => {
          setResult(result);
          setWorking(false);
          if (result.success) {
            setShowCalendarForm(false);
          }
        });
      } else {
        updateCalendar(props.calendar.calendarId, calendar, result => {
          setResult(result);
          setWorking(false);
          if (result.success) {
            setShowCalendarForm(false);
          }
        });
      }
    }
  }

  const englishFields = enableEn ? (
    <>
      {embedCalendar ?
        <ReadOnlyIframe
          id="read-only-iframe-en"
          label={props.translate("English embeddable iframe")}
          iframe={`<iframe src="https://calendarium.ca/embed/${props.calendar.calendarId}?locale=enCa"></iframe>`}
          info={props.translate("Click on Copy to copy the embeddable iframe code to your clipboard, then paste it in your website.")}
          translate={props.translate}
        /> : null}
      <Input
        label={props.translate("English name")}
        type="text"
        id="input-name-en"
        placeholder={props.translate("Enter the English calendar name.")}
        info={props.translate("Enter the English calendar name.")}
        value={nameEn}
        handleChange={e => {
          setNameEn(e.target.value);
          setInvalidNameEn(false);
        }}
        invalidFeedback={invalidNameEn ? <InvalidFeedback feedback={props.translate("You must enter a name.")} /> : null}
      />
      <Textarea
        label={props.translate("English description")}
        type="text"
        id="input-description-en"
        placeholder={props.translate("Describe your calendar in English.")}
        info={props.translate("Describe your calendar in English.")}
        height="100"
        value={descriptionEn}
        handleChange={e => {
          setDescriptionEn(e.target.value);
          setInvalidDescriptionEn(false);
        }}
        invalidFeedback={invalidDescriptionEn ? <InvalidFeedback feedback={props.translate("You must enter a description.")} /> : null}
      />
      <Input
        label={props.translate("English customised link")}
        type="text"
        id="input-link-en"
        placeholder={props.translate("Enter the English customised link.")}
        info={props.translate("Enter the customised name that you would like to appear in the browser url when accessing the English version of your calendar.")}
        value={linkEn}
        handleChange={e => {
          setLinkEn(e.target.value);
          setInvalidLinkEn(false);
        }}
        invalidFeedback={invalidLinkEn ? <InvalidFeedback feedback={props.translate("You must enter a link.")} /> : null}
      />
    </>
  ) : null;

  const frenchFields = enableFr ? (
    <>
      {embedCalendar ?
        <ReadOnlyIframe
          id="read-only-iframe-fr"
          label={props.translate("French embeddable iframe")}
          iframe={`<iframe src="https://calendarium.ca/embed/${props.calendar.calendarId}?locale=frCa"></iframe>`}
          info={props.translate("Click on Copy to copy the embeddable iframe code to your clipboard, then paste it in your website.")}
          translate={props.translate}
        /> : null}
      <Input
        label={props.translate("French name")}
        type="text"
        id="input-name-fr"
        placeholder={props.translate("Enter the French calendar name.")}
        info={props.translate("Enter the French calendar name.")}
        value={nameFr}
        handleChange={e => {
          setNameFr(e.target.value);
          setInvalidNameFr(false);
        }}
        invalidFeedback={invalidNameFr ? <InvalidFeedback feedback={props.translate("You must enter a name.")} /> : null}
      />
      <Textarea
        label={props.translate("French description")}
        type="text"
        id="input-description-fr"
        placeholder={props.translate("Describe your calendar in French.")}
        info={props.translate("Describe your calendar in French.")}
        height="100"
        value={descriptionFr}
        handleChange={e => {
          setDescriptionFr(e.target.value);
          setInvalidDescriptionFr(false);
        }}
        invalidFeedback={invalidDescriptionFr ? <InvalidFeedback feedback={props.translate("You must enter a description.")} /> : null}
      />
      <Input
        label={props.translate("French customised link")}
        type="text"
        id="input-link-fr"
        placeholder={props.translate("Enter the French customised link.")}
        info={props.translate("Enter the customised name that you would like to appear in the browser url when accessing the French version of your calendar.")}
        value={linkFr}
        handleChange={e => {
          setLinkFr(e.target.value);
          setInvalidLinkFr(false);
        }}
        invalidFeedback={invalidLinkFr ? <InvalidFeedback feedback={props.translate("You must enter a link.")} /> : null}
      />
    </>
  ) : null;

  const title = props.new ? "New calendar" : "Calendar settings"; // this is translated where the const is used

  const submitButton = props.new ? "Create this calendar" : "Save changes"; // this is translated where the const is used

  return (
    <>
      <h1>{props.translate(title)}</h1>
      <form onSubmit={handleSubmit} id="form-new-calendar" noValidate>
        {noLanguageEnabled ? <InvalidFeedback feedback={props.translate("You must enable at least one language.")} /> : null}
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <Checkbox
              label={props.translate("Enable English content for this calendar")}
              id="enable-en"
              value={enableEn}
              handleChange={e => setEnableEn(e.target.checked)}
              info={props.translate("When this is checked, you will be able to provide English versions of content for this calendar and for its events.")}
            />
            {englishFields}
          </div>
          <div className="col-12 col-md-6">
            <Checkbox
              label={props.translate("Enable French content for this calendar")}
              id="enable-fr"
              value={enableFr}
              handleChange={e => setEnableFr(e.target.checked)}
              info={props.translate("When this is checked, you will be able to provide French versions of content for this calendar and for its events.")}
            />
            {frenchFields}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <Select
              label={props.translate("Start week on")}
              id="select-start-week-on"
              options={[{ label: props.translate("Monday"), value: "Monday" }, { label: props.translate("Tuesday"), value: "Tuesday" }, { label: props.translate("Wednesday"), value: "Wednesday" }, { label: props.translate("Thursday"), value: "Thursday" }, { label: props.translate("Friday"), value: "Friday" }, { label: props.translate("Saturday"), value: "Saturday" }, { label: props.translate("Sunday"), value: "Sunday" }]}
              value={startWeekOn}
              handleChange={e => setStartWeekOn(e.target.value)}
              info={props.translate("Select which day of the week will be the first day displayed on the left in this calendar.")}
            />
            <Input
              label={props.translate("Primary color")}
              type="color"
              id="input-primary-color"
              placeholder={props.translate("Primary color")}
              value={primaryColor}
              handleChange={e => setPrimaryColor(e.target.value)}
              // TODO: include in the info text where the primary color is used in the calendar (TBD when the calendar display will be done)
              info={props.translate("Select a primary color for this calendar.")}
            />
            <Input
              label={props.translate("Secondary color")}
              type="color"
              id="input-secondary-color"
              placeholder={props.translate("Secondary color")}
              value={secondaryColor}
              handleChange={e => setSecondaryColor(e.target.value)}
              // TODO: include in the info text where the secondary color is used in the calendar (TBD when the calendar display will be done)
              info={props.translate("Select a secondary color for this calendar.")}
            />
          </div>
          <div className="col-12 col-md-auto">
            <div className="mb-2">{props.translate("Calendar preview")}</div>
            <Month
              startWeekOn={startWeekOn}
              currentDay={currentDay}
              selectDay={date => setCurrentDay(date)}
              setCurrentDay={setCurrentDay}
              language={props.language}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>
        <Checkbox
          label={props.translate("Make this calendar embeddable")}
          id="embed-calendar"
          value={embedCalendar}
          required={false}
          handleChange={e => setEmbedCalendar(e.target.checked)}
          info={props.translate("When this is checked, this calendar will become embeddable in any other website. You can uncheck this at any time and the calendar will no longer be embeddable.")}
        />
        <Checkbox
          label={props.translate("Make this calendar publicly available")}
          id="public-calendar"
          value={publicCalendar}
          required={false}
          handleChange={e => setPublicCalendar(e.target.checked)}
          info={props.translate("When this is checked, this calendar will appear in the section Public calendars, anyone will be able to view its events, and it will be indexed by search engines. You can uncheck this at any time and the calendar will no longer be included in Public calendars, but a cache may remain in search engines.")}
        />
        <Checkbox
          label={props.translate("Require my approval to publish collaborators' events")}
          id="event-approval-required"
          value={eventApprovalRequired}
          required={false}
          handleChange={e => setEventApprovalRequired(e.target.checked)}
          info={props.translate("When this is checked, you will need to approve all events created by collaborators that you have invited to this calendar. You can uncheck this at any time to remove the restriction.")}
        />
        <Button label={props.translate("Cancel")} id="button-cancel" onClick={() => setShowCalendarForm(false)} outline={true} />
        <Button label={props.translate(submitButton)} type="submit" id="button-save" working={working} />
      </form>
    </>
  );
}