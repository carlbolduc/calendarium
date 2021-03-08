import {DateTime} from "luxon";
import {eventStatus} from "../../services/Helpers";

export default function Event(props) {

  function status() {
    let result = null;
    if (props.showStatus) {
      if (props.event.status === eventStatus.DRAFT.value) {
        result = <span className="badge  bg-secondary">{eventStatus.DRAFT.label}</span>
      } else if (props.event.status === eventStatus.PENDING_APPROVAL.value) {
        result = <span className="badge bg-warning">{eventStatus.PENDING_APPROVAL.label}</span>
      } else if (props.event.status === eventStatus.PUBLISHED.value) {
        result = <span className="badge bg-dark">{eventStatus.PUBLISHED.label}</span>
      }
    }
    return result;
  }
  function duration() {
    let result = null;
    if (props.event.allDay) {
      result = "All day";
    } else if (props.event.startAt !== null) {
      const startAt = DateTime.fromSeconds(props.event.startAt);
      const endAt = DateTime.fromSeconds(props.event.endAt);
      result = `${startAt.toLocaleString(DateTime.TIME_SIMPLE)} - ${endAt.toLocaleString(DateTime.TIME_SIMPLE)}`;
    }
    return result;
  }

  return (
    <article>
      <h4 data-bs-toggle="collapse" data-bs-target={`#_${props.event.eventId}`} aria-expanded="false" aria-controls={props.event.eventId}>
        {props.event.nameEn} {status()}
      </h4>
      {props.eventActions}
      <p className="small">{duration()}</p>
      <div className="collapse" id={`_${props.event.eventId}`}>
        <div className="card card-body">
          {props.event.descriptionEn}
        </div>
      </div>
    </article>
  );
}