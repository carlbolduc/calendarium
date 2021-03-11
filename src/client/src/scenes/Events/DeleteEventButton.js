import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../../components/Form/Button";
import {calendarAccessStatus} from "../../services/Helpers";

export default function DeleteEventButton(props) {
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (working) {
      props.delete(props.event, () => {
        setWorking(false);
        props.refresh();
      })
    }
  }, [working])

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
    return shouldRender ? <Button label={props.translate("Delete")} id="button-delete-event" onClick={() => setWorking(true)} /> : null;
  }

  return render();
}

DeleteEventButton.propTypes = {
  event: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  calendar: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};