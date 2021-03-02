import Button from "../../components/Form/Button";
import { decideWhatToDisplay } from "../../services/Helpers";

export default function Events(props) {

  const title = (
    <>
      {props.translate("Events of")} {decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr)}
    </>
  );

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
    </div>
  );

  return (
    <>
      <h1>{title}</h1>
      {actionButtonsZone}
    </>
  );
}