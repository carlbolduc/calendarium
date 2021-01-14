import React from 'react';

export default function Button(props) {
  return props.working ? (
    <button
      id={props.id}
      type={props.type}
      className="btn btn-primary"
      disabled
    >
      <span className="spinner-border spinner-border-sm mr-1"/>
      {props.label}
    </button>
  ) : (
    <button
      id={props.id}
      type={props.type}
      className="btn btn-primary"
      disabled={props.disabled ? props.disabled : null}
    >{props.label}</button>
  );
}
