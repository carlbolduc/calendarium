import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus, eventStatus} from "../../services/Helpers";

export default function SubmitForApprovalEventButton(props) {
  const submitForApproval = props.submitForApproval;
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status === eventStatus.DRAFT.value) {
      submitForApproval(props.event);
    }
  }, [props.event, working, submitForApproval]);

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
    return shouldRender ? <Button label={props.translate("Submit for approval")} id="button-submit-event" onClick={() => setWorking(true)} /> : null;
  }

  return render();
}

SubmitForApprovalEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  submitForApproval: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};