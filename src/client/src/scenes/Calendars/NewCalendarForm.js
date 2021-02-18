import {useState, useEffect} from "react";
import InvalidFeedback from "../../components/Form/InvalidFeedback";
import Input from "../../components/Form/Input";
import Button from "../../components/Form/Button";
import {textValid} from "../../services/Helpers";
import Checkbox from "../../components/Form/Checkbox";

export default function NewCalendarForm(props) {
  const [enableEn, setEnableEn] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [invalidNameEn, setInvalidNameEn] = useState(false);
  const [descriptionEn, setDescriptionEn] = useState("");
  const [linkEn, setLinkEn] = useState("");
  const [enableFr, setEnableFr] = useState(false);
  const [nameFr, setNameFr] = useState("");
  const [invalidNameFr, setInvalidNameFr] = useState(false);
  const [publicCalendar, setPublicCalendar] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [eventApprovalRequired, setEventApprovalRequired] = useState(false);

  useEffect(() => {
    if (requesting) {
      console.log("TODO: validate and submit form");
    }
  }, [requesting]);

  function handleSubmit(e) {
    e.preventDefault();

  }

  return (
    <form onSubmit={handleSubmit} id="form-new-calendar" noValidate>
      <div className="row">
        <div className="col-auto">
          <Checkbox
            label="Enable English calendar"
            id="enable-en"
            value={enableEn}
            handleChange={e => setEnableEn(e.target.checked)}
          />
          <Input
            label={"Name"}
            type="text"
            id="input-name-en"
            placeholder={"Enter the English calendar name"}
            value={nameEn}
            handleChange={e => {
              setNameEn(e.target.value);
              setInvalidNameEn(false);
            }}
            invalidFeedback={invalidNameEn ? <InvalidFeedback feedback="..."/> : null}
          />
          <Input
            label="Description"
            type="text"
            id="input-description-en"
            placeholder={"Describe your calendar"}
            value={descriptionEn}
            handleChange={e => setDescriptionEn(e.target.value)}
          />
          <Input
            label="Link"
            type="text"
            id="input-link-en"
            placeholder={"Link..."}
            value={linkEn}
            handleChange={e => setLinkEn(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <Checkbox
            label="Enable French calendar"
            id="enable-fr"
            value={enableFr}
            handleChange={e => setEnableFr(e.target.checked)}
          />
          <Input
            label={props.translate("French Name")}
            type="text"
            id="input-name-fr"
            placeholder={"Enter the French calendar name"}
            value={nameFr}
            handleChange={e => {
              setNameFr(e.target.value);
              setInvalidNameFr(false);
            }}
            invalidFeedback={invalidNameFr ? <InvalidFeedback feedback="..."/> : null}
          />
        </div>
      </div>


      <Checkbox
        label="This calendar is available publicly"
        id="public-calendar"
        value={publicCalendar}
        required={false}
        handleChange={e => setPublicCalendar(e.target.checked)}
      />
      <Checkbox
        label="New event must be approved by calendar owner"
        id="event-approval-required"
        value={eventApprovalRequired}
        required={false}
        handleChange={e => setEventApprovalRequired(e.target.checked)}
      />
      <Button label={props.translate("Create this calendar")} type="submit" working={requesting} id="button-save" />
      <Button label={props.translate("Cancel")} id="button-cancel" onClick={props.cancel} />
    </form>
  );
}