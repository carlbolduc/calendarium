import {useState, useEffect} from "react";
import Button from "../../components/Form/Button";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Checkbox from "../../components/Form/Checkbox";

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

  return (
    <form onSubmit={handleSubmit} id="form-event" noValidate>
      {englishFields}
      {frenchFields}
      <Checkbox
        label="All day"
        id="all-day"
        value={allDay}
        handleChange={e => setAllDay(e.target.checked)}
        info="When this is checked, ???."
      />
      <Button label={props.translate("Cancel")} id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label={props.translate("Post this event")} type="submit" working={requesting} id="button-save" />
    </form>
  );
}