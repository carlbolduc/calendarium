import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus, eventStatus} from "../../services/Helpers";

export default function ApproveEventButton(props) {
  const approveEvent = props.approveEvent;
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status === eventStatus.PENDING_APPROVAL.value) {
      approveEvent(props.event);
    } else {
      setWorking(false);
    }
  }, [props.event, working, approveEvent])

  function render() {
    let shouldRender = false;
    if (props.event.status === eventStatus.PENDING_APPROVAL.value && props.calendar.access === calendarAccessStatus.OWNER) {
        shouldRender = true;
    }
    return shouldRender ? <Button label={props.translate("Approve")} id="button-approve-event" onClick={() => setWorking(true)} /> : null;
  }

  return render();
}

ApproveEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  approveEvent: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};