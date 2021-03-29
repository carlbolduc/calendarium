import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus} from "../../services/Helpers";

export default function DeleteEventButton(props) {
  function render() {
    let shouldRender = false;
    if (props.calendar.access === calendarAccessStatus.OWNER) {
      shouldRender = true;
    } else if (
      props.calendar.access === calendarAccessStatus.ACTIVE &&
      props.account.accountId === props.event.accountId
    ) {
      shouldRender = true;
    }
    return shouldRender ? <Button label={props.translate("Delete")} id="button-delete-event" onClick={props.deleteEvent} /> : null;
  }

  return render();
}

DeleteEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};