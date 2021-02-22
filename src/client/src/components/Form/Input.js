import React from "react";

export default function Input(props) {
  return props.type === "color" ? (
    <div className="mb-3">
      <label 
        htmlFor={props.id} 
        className="form-label"
      >
        {props.label}
      </label>
      <input
        type={props.type}
        className="form-control form-control-color"
        id={props.id}
        name={props.name ? props.name : null}
        autoComplete={props.autoComplete ? props.autoComplete : null}
        required={props.required ? props.required : null}
        placeholder={props.placeholder}
        title={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
      {props.invalidFeedback}
    </div>
  ) : (
    <div className="form-floating mb-3">
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        name={props.name ? props.name : null}
        autoComplete={props.autoComplete ? props.autoComplete : null}
        required={props.required ? props.required : null}
        placeholder={props.placeholder}
        title={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
      <label 
        htmlFor={props.id} 
        className="form-label"
      >
        {props.label}
      </label>
      {props.invalidFeedback}
    </div>
  );
}