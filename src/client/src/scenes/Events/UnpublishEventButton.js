import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus, eventStatus} from "../../services/Helpers";

export default function UnpublishEventButton(props) {
  const unpublishEvent = props.unpublishEvent;
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working && props.event.status === eventStatus.PUBLISHED.value) {
      unpublishEvent(props.event);
    } else {
      setWorking(false);
    }
  }, [working, props.event, unpublishEvent])

  function render() {
    let shouldRender = false;
    if (props.event.status === eventStatus.PUBLISHED.value) {
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
    return shouldRender ? <Button label={props.translate("Unpublish")} id="button-publish-event" onClick={() => setWorking(true)} /> : null;
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