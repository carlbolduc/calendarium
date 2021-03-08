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
    <article className="card border-dark mb-3">
      <div className="row g-0">
        <div className="col-md-5">
          <div className="card-body">
            <h5 className="card-title">{props.event.nameEn}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{duration()}</h6>
            {props.eventActions}
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-body">
            {status()}
            <p className="card-text">{props.event.descriptionEn}</p>
          </div>
        </div>
      </div>
    </article>
  );
}