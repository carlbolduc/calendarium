import {DateTime} from "luxon";

export default function Event(props) {

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
        {props.event.nameEn}
      </h4>
      <p className="small">{duration()}</p>
      <div className="collapse" id={`_${props.event.eventId}`}>
        <div className="card card-body">
          Description of the event
        </div>
      </div>
    </article>
  );
}