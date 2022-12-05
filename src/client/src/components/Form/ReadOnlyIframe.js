import React from "react";
import { useState, useEffect } from "react";
import Info from "../Icons/Info";

export default function ReadOnlyIframe(props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied])

  const infoButton = props.info ? (
    <div className="col-auto ps-0">
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

  function copy() {
    navigator.clipboard.writeText(props.iframe).then(() => {
      setCopied(true);
    });
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-floating input-group mb-3">
            <input
              type="text"
              className="form-control text-muted"
              id={props.id}
              readOnly={true}
              value={props.iframe}
            />
            <span
              className="input-group-text"
              style={copied ? {} : { cursor: "pointer" }}
              onClick={copied ? null : copy}
            >
              {copied ? props.translate("Copied") : props.translate("Copy")}
            </span>
            <label
              htmlFor={props.id}
              className="form-label text-secondary"
            >
              {props.label}
            </label>
          </div>
        </div>
        {infoButton}
      </div>
      {infoText}
    </>
  );
}