import React from "react";
import {DateTime} from "luxon";
import {eventStatus, getLocale, sameDay} from "../../services/Helpers";

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
    const locale = getLocale(props.language);
    let result;
    const startAt = DateTime.fromSeconds(props.event.startAt);
    const endAt = DateTime.fromSeconds(props.event.endAt);
    if (sameDay(startAt, endAt)) {
      if (props.event.allDay) {
        result = startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
      } else {
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}, ${startAt.setLocale(getLocale(props.language)).toLocaleString(DateTime.TIME_SIMPLE)} - ${endAt.setLocale(getLocale(props.language)).toLocaleString(DateTime.TIME_SIMPLE)}`;
      }
    } else {
      if (props.event.allDay) {
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} - ${endAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
      } else {
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} ${startAt.setLocale(getLocale(props.language)).toLocaleString(DateTime.TIME_SIMPLE)} - ${endAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} ${endAt.setLocale(getLocale(props.language)).toLocaleString(DateTime.TIME_SIMPLE)}`;
      }
    }
    return result;
  }
  function classNames() {
    const classNames = ["card", "mb-3"];
    switch (props.event.status) {
      case eventStatus.DRAFT.value:
        classNames.push("bg-light");
        break;
      case eventStatus.PENDING_APPROVAL.value:
        classNames.push("bg-info");
        break;
      default:
        break;
    }
    return classNames.join(" ");
  }
  const borderStyle = props.primaryColor === undefined || props.primaryColor === "#ffffff" ? null : { borderColor: props.primaryColor };

  return (
    <article className={classNames()} style={borderStyle}>
      <div className="row g-0">
        <div className="col-auto">
          <div className="card-body">
            <h5 className="card-title">{props.event.nameEn}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{duration()}</h6>
            {props.eventActions}
          </div>
        </div>
        <div className="col">
          <div className="card-body">
            {status()}
            <p className="card-text">{props.event.descriptionEn}</p>
          </div>
        </div>
      </div>
    </article>
  );
}