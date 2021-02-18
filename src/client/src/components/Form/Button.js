import React from 'react';

export default function Button(props) {
  return props.working ? (
    <button
      id={props.id}
      type={props.type}
      className="btn btn-secondary my-3"
      disabled
    >
      <span className="spinner-border spinner-border-sm mr-1"/>
      {props.label}
    </button>
  ) : (
    <button
      id={props.id}
      type={props.type}
      className="btn btn-secondary my-3"
      data-bs-toggle={props.dataBsToggle ? props.dataBsToggle : null}
      data-bs-target={props.dataBsTarget ? props.dataBsTarget : null}
      aria-expanded={props.ariaExpanded ? props.ariaExpanded : null}
      aria-controls={props.ariaControls ? props.ariaControls : null}
      disabled={props.disabled ? props.disabled : null}
      onClick={props.onClick ? props.onClick : null}
    >{props.label}</button>
  );
}
