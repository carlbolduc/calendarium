import React from 'react';

export default function Input(props) {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label">{props.label}</label>
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        name={props.name ? props.name : null}
        autoComplete={props.autoComplete ? props.autoComplete : null}
        required={props.required ? props.required : null}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
}