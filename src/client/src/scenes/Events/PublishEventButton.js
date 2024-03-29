import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import { calendarAccessStatus, eventStatus } from "../../services/Helpers";

export default function PublishEventButton(props) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status !== eventStatus.DRAFT.value) {
      setWorking(false);
    }
  }, [working, props.event]);

  function publishEvent() {
    setWorking(true);
    props.publishEvent(props.event);
  }

  function render() {
    let shouldRender = false;
    if (props.event.status === eventStatus.DRAFT.value) {
      if (props.calendar.access === calendarAccessStatus.OWNER) {
        shouldRender = true;
      } else if (
        props.calendar.access === calendarAccessStatus.ACTIVE &&
        props.account.accountId === props.event.accountId &&
        !props.calendar.eventApprovalRequired
      ) {
        shouldRender = true;
      }
    }
    return shouldRender ? (
      <Button
        label={props.translate("Publish")}
        id="button-publish-event"
        onClick={publishEvent}
      />
    ) : null;
  }

  return render();
}

PublishEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  publishEvent: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};
