import React from 'react';

export default function Select(props) {
  const options = props.options.map((o, index) => (
    <option key={index + 1} value={o.value}>{o.label}</option>
  ));

  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label">{props.label}</label>
      <select
        className="form-select"
        id={props.id}
        name={props.name ? props.name : null}
        aria-label={props.ariaLabel ? props.ariaLabel : null}
        required={props.required ? props.required : null}
      >
        <option key="0" value="">{props.placeholder}</option>
        {options}
      </select>
    </div>
  );
}