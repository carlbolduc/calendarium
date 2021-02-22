import React from "react";

export default function Select(props) {
  const options = props.options.map((o, index) => (
    <option key={index + 1} value={o.value}>{o.label}</option>
  ));

  return (
    <div className="form-floating mb-3">
      <select
        className="form-select"
        id={props.id}
        name={props.name ? props.name : null}
        aria-label={props.ariaLabel ? props.ariaLabel : null}
        required={props.required ? props.required : null}
        title={props.placeholder}
      >
        <option key="0" value="">{props.placeholder}</option>
        {options}
      </select>
      <label 
        htmlFor={props.id} 
        className="form-label"
      >
        {props.label}
      </label>
    </div>
  );
}