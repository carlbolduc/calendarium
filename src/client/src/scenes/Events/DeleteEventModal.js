import React from "react";
import PropTypes from "prop-types";
import { decideWhatToDisplay } from "../../services/Helpers";

export default function DeleteEventModal(props) {
  return (
    <div id="delete-event-modal" className="modal" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm deletion of Event {decideWhatToDisplay(props.language, props.enableEn, props.enableFr, props.event.nameEn, props.event.nameFr)}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={props.cancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>Once deleted, the event will dissapear from your calendar forever.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary "
              onClick={props.cancel}
            >
              {props.translate("Cancel")}
            </button>
            <button type="button" className="btn btn-danger" onClick={props.delete}>
              {props.translate("Delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteEventModal.propTypes = {
  language: PropTypes.string.isRequired,
  enableEn: PropTypes.bool.isRequired,
  enableFr: PropTypes.bool.isRequired,
  event: PropTypes.object.isRequired,
  delete: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};
