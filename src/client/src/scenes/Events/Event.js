import React from "react";
import { DateTime } from "luxon";
import { eventStatus, getLocale, sameDay, decideWhatToDisplay } from "../../services/Helpers";

export default function Event(props) {

  function status() {
    let result = null;
    if (props.showStatus) {
      if (props.event.status === eventStatus.DRAFT.value) {
        result = <span className="badge bg-secondary">{props.translate(eventStatus.DRAFT.label)}</span>;
      } else if (props.event.status === eventStatus.PENDING_APPROVAL.value) {
        result = <span className="badge bg-warning">{props.translate(eventStatus.PENDING_APPROVAL.label)}</span>;
      } else if (props.event.status === eventStatus.PUBLISHED.value) {
        result = <span className="badge bg-success">{props.translate(eventStatus.PUBLISHED.label)}</span>;
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
  function hyperlink() {
    let result = null;
    const hyperlinkToDisplay = decideWhatToDisplay(props.language, props.enableEn, props.enableFr, props.event.hyperlinkEn, props.event.hyperlinkFr);
    if (hyperlinkToDisplay !== null) {
      result = <a href={hyperlinkToDisplay}>{hyperlinkToDisplay}</a>;
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
        classNames.push("border-warning");
        break;
      default:
        break;
    }
    return classNames.join(" ");
  }
  const borderStyle = props.primaryColor === undefined || props.primaryColor === "#ffffff"
    ? null
    : { borderColor: props.primaryColor };

  return (
    <article className={classNames()} style={borderStyle}>
      <div className="row">
        <div className="col">
          <div className="card-body">
            <h5 className="card-title">{decideWhatToDisplay(props.language, props.enableEn, props.enableFr, props.event.nameEn, props.event.nameFr)}</h5>
            <h6 className="card-subtitle mb-2 text-muted">{duration()}</h6>
            <p className="card-text">{decideWhatToDisplay(props.language, props.enableEn, props.enableFr, props.event.descriptionEn, props.event.descriptionFr)}</p>
            {hyperlink()}
          </div>
        </div>
        <div className="col-auto">
          <div className="card-body">
            {status()}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col ms-3">
          {props.eventActions}
        </div>
      </div>

    </article>
  );
}