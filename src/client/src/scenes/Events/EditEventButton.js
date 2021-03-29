import React from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus} from "../../services/Helpers";

export default function EditEventButton(props) {

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
    return shouldRender ? <Button label={props.translate("Edit")} id="button-edit-event" onClick={() => props.edit(props.event)} /> : null;
  }

  return render();

}

EditEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  edit: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};