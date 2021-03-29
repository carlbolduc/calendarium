import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus, eventStatus} from "../../services/Helpers";

export default function SendForApprovalEventButton(props) {
  const sendForApproval = props.sendForApproval;
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status === eventStatus.DRAFT.value) {
      sendForApproval(props.event);
    } else {
      setWorking(false);
    }
  }, [props.event, working, sendForApproval]);

  function render() {
    let shouldRender = false;
    if (
      props.calendar.eventApprovalRequired &&
      props.calendar.access === calendarAccessStatus.ACTIVE &&
      props.event.status === eventStatus.DRAFT.value &&
      props.account.accountId === props.event.accountId
    ) {
      shouldRender = true;
    }
    return shouldRender ? <Button label={props.translate("Send for approval")} id="button-submit-event" onClick={() => setWorking(true)} /> : null;
  }

  return render();
}

SendForApprovalEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  sendForApproval: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};