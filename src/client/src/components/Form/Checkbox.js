import React from 'react';

export default function Checkbox(props) {
  return (
    <div className="form-check mb-3">
      <input
        className="form-check-input"
        type="checkbox"
        value={props.value}
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
    </div>
  );
}