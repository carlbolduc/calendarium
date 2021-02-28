import {useState, useEffect} from "react";
import Button from "../../components/Form/Button";

export default function EventForm(props) {
  const [calendarId, setCalendarId] = useState("");
  const [status, setStatus] = useState("");
  const [nameFR, setNameFr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionFr, setDescriptionFr] = useState("");
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [allDay, setAllDay] = useState(null);
  const [hyperlinkFr, setHyperlinkFr] = useState("");
  const [hyperlinkEn, setHyperlinkEn] = useState("");
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

  return (
    <form onSubmit={handleSubmit} id="form-event" noValidate>

      <Button label={props.translate("Cancel")} id="button-cancel" onClick={props.cancel} outline={true} />
      <Button label={props.translate("Post this event")} type="submit" working={requesting} id="button-save" />
    </form>
  );
}