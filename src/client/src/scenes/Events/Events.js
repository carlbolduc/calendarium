import Button from "../../components/Form/Button";
import Event from "./Event";
import { decideWhatToDisplay } from "../../services/Helpers";

export default function Events(props) {

  const calendarName = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const title = `${props.translate("Events of")} ${calendarName}`;

  const actionButtonsZone = (
    <div className="mb-4">
      <Button label={props.translate("Back to calendar")} id="button-cancel" onClick={props.cancel} outline={true} />
    </div>
  );

  const events = props.events.map(e => (
    <Event key={e.eventId} event={e} translate={props.translate} />
  ));

  return (
    <>
      <h1>{title}</h1>
      {actionButtonsZone}
      {events}
    </>
  );
}