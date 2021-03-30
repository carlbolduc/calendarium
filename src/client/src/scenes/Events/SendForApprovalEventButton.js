import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import { calendarAccessStatus, eventStatus } from "../../services/Helpers";

export default function SendForApprovalEventButton(props) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status !== eventStatus.DRAFT.value) {
      setWorking(false);
    }
  }, [props.event, working]);

  function sendForApproval() {
    setWorking(true);
    props.sendForApproval(props.event);
  }

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
    return shouldRender ? (
      <Button
        label={props.translate("Send for approval")}
        id="button-submit-event"
        onClick={sendForApproval}
      />
    ) : null;
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
