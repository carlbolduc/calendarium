import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import { calendarAccessStatus, eventStatus } from "../../services/Helpers";

export default function UnpublishEventButton(props) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (
      working &&
      [eventStatus.PUBLISHED.value, eventStatus.PENDING_APPROVAL.value].indexOf(props.event.status) === -1
    ) {
      setWorking(false);
    }
  }, [working, props.event]);

  function unpublishEvent() {
    setWorking(true);
    props.unpublishEvent(props.event);
  }

  function render() {
    let shouldRender = false;
    if ([eventStatus.PUBLISHED.value, eventStatus.PENDING_APPROVAL.value].indexOf(props.event.status) !== -1) {
      // Calendar owner can always unpublish
      if (props.calendar.access === calendarAccessStatus.OWNER) {
        shouldRender = true;
      } else if (
        // Event owner with active account can unpublish
        props.calendar.access === calendarAccessStatus.ACTIVE &&
        props.account.accountId === props.event.accountId
      ) {
        shouldRender = true;
      }
    }
    return shouldRender ? (
      <Button
        label={props.translate("Unpublish")}
        id="button-publish-event"
        onClick={unpublishEvent}
      />
    ) : null;
  }

  return render();
}

UnpublishEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  unpublishEvent: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};
