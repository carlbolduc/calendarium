import React from "react";
import Info from "../Icons/Info";

export default function Checkbox(props) {
  const infoButton = props.info ? (
    <div className="col ps-0">
      <button
        className="btn text-secondary btn-icon p-0"
        type="button"
        id="button-help"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse-help-${props.id}`}
        aria-expanded="false"
        aria-controls={`collapse-help-${props.id}`}
        tabIndex={-1}
      >
        <Info />
      </button>
    </div>
  ) : null;

  const infoText = props.info ? (
    <div className="collapse" id={`collapse-help-${props.id}`}>
      <p className="small">{props.info}</p>
    </div>
  ) : null;

  return (
    <>
      <div className="row">
        <div className="col-auto">
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={props.value}
              id={props.id}
              required={props.required ? props.required : null}
              onChange={props.handleChange}
            />
            <label
              className="form-check-label"
              htmlFor={props.id}
            >
              {props.label}
            </label>
            {props.invalidFeedback}
          </div>
        </div>
        {infoButton}
      </div>
      {infoText}
    </>
  );
}
