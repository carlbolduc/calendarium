import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus, eventStatus} from "../../services/Helpers";

export default function ApproveEventButton(props) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working) {
      props.approve(props.event, () => {
        setWorking(false);
        props.refresh();
      })
    }
  }, [working, props])

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
  approve: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};