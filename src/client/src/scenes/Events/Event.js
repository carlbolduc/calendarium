import React, { useState } from "react";
import PropTypes from "prop-types";
import { DateTime } from "luxon";
import { eventStatus, getLocale, sameDay, decideWhatToDisplay } from "../../services/Helpers";
import EditEventButton from "./EditEventButton";
import SendForApprovalEventButton from "./SendForApprovalEventButton";
import PublishEventButton from "./PublishEventButton";
import UnpublishEventButton from "./UnpublishEventButton";
import ApproveEventButton from "./ApproveEventButton";
import DeleteEventButton from "./DeleteEventButton";
import Button from "../../components/Form/Button";

export default function Event(props) {
  const [wantToDelete, setWantToDelete] = useState(false);

  function status() {
    let result = null;
    if (props.showStatus) {
      let status = null;
      if (props.event.status === eventStatus.DRAFT.value) {
        status = <span className="badge bg-secondary">{props.translate(eventStatus.DRAFT.label)}</span>;
      } else if (props.event.status === eventStatus.PENDING_APPROVAL.value) {
        status = <span className="badge bg-warning">{props.translate(eventStatus.PENDING_APPROVAL.label)}</span>;
      } else if (props.event.status === eventStatus.PUBLISHED.value) {
        status = <span className="badge bg-success">{props.translate(eventStatus.PUBLISHED.label)}</span>;
      }
      result = (
        <div className="col-auto">
          <div className="card-body">
            {status}
          </div>
        </div>
      );
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
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}, ${startAt.setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE)} - ${endAt.setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE)}`;
      }
    } else {
      if (props.event.allDay) {
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} - ${endAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
      } else {
        result = `${startAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}, ${startAt.setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE)} - ${endAt.setLocale(locale).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}, ${endAt.setLocale(locale).toLocaleString(DateTime.TIME_SIMPLE)}`;
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
    if (wantToDelete) {
      classNames.push("border-danger");
    } else {
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
    }
    return classNames.join(" ");
  }

  const borderStyle = props.event.status === eventStatus.PUBLISHED.value && props.primaryColor !== undefined && props.primaryColor !== "#ffffff"
    ? { borderColor: props.primaryColor }
    : null;

  const eventButtons = props.showButtons ? (
    <div>
      <EditEventButton
        event={props.event}
        account={props.account}
        calendar={props.calendar}
        edit={props.edit}
        translate={props.translate}
      />
      <SendForApprovalEventButton
        event={props.event}
        account={props.account}
        calendar={props.calendar}
        sendForApproval={props.sendForApproval}
        translate={props.translate}
      />
      <PublishEventButton
        event={props.event}
        account={props.account}
        calendar={props.calendar}
        publishEvent={props.publishEvent}
        translate={props.translate}
      />
      <UnpublishEventButton
        event={props.event}
        account={props.account}
        calendar={props.calendar}
        unpublishEvent={props.unpublishEvent}
        translate={props.translate}
      />
      <ApproveEventButton
        event={props.event}
        calendar={props.calendar}
        approveEvent={props.approveEvent}
        translate={props.translate}
      />
      <DeleteEventButton
        event={props.event}
        account={props.account}
        calendar={props.calendar}
        deleteEvent={() => setWantToDelete(true)}
        translate={props.translate}
      />
    </div>
  ) : null;

  const eventDetails = (
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
        {status()}
      </div>
      <div className="row">
        <div className="col ms-3">
          {eventButtons}
        </div>
      </div>
    </article>
  );

  const deleteConfirmation = (
    <article className={classNames()} style={borderStyle}>
      <div className="row">
        <div className="col">
          <div className="card-body">
            <h5 className="card-title">Confirm deletion of event {decideWhatToDisplay(props.language, props.enableEn, props.enableFr, props.event.nameEn, props.event.nameFr)}</h5>
            <p>Once deleted, the event will dissapear from your calendar forever.</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col ms-3">
          <div>
            <Button
              label={props.translate("Cancel")}
              id="button-cancel-delete"
              outline={true}
              onClick={() => setWantToDelete(false)}
            />
            <Button
              label={props.translate("Delete")}
              id="button-confirm-delete"
              onClick={() => props.delete(props.event)}
            />
          </div>
        </div>
      </div>
    </article>
  )

  return wantToDelete ? deleteConfirmation : eventDetails;
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object,
  calendar: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  enableFr: PropTypes.bool.isRequired,
  enableEn: PropTypes.bool.isRequired,
  primaryColor: PropTypes.string,
  showStatus: PropTypes.bool.isRequired,
  showButtons: PropTypes.bool.isRequired,
  edit: PropTypes.func,
  sendForApproval: PropTypes.func,
  publishEvent: PropTypes.func,
  unpublishEvent: PropTypes.func,
  approveEvent: PropTypes.func,
  delete: PropTypes.func
};