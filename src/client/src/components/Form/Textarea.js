import React from "react";
import Info from "../Icons/Info";

export default function Textarea(props) {
  const infoButton = props.info ? (
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
  ) : null;

  const infoText = props.info ? (
    <div className="collapse" id={`collapse-help-${props.id}`}>
      <p className="small">{props.info}</p>
    </div>
  ) : null;

  return (
    <>
      <div className="row">
        <div className="col pe-0">
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id={props.id}
              name={props.name ? props.name : null}
              readOnly={props.readOnly ? props.readOnly : null}
              value={props.value}
              onChange={props.handleChange}
              style={props.height ? {height: `${props.height}px`} : null}
            />
            <label
              htmlFor={props.id}
              className="form-label text-secondary"
            >
              {props.label}
            </label>
            {props.invalidFeedback}
          </div>
        </div>
        <div className="col-auto">
          {infoButton}
        </div>
      </div>
      {infoText}
    </>
  );
}
