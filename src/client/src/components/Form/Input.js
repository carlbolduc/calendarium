import React from "react";

export default function Input(props) {
  return props.type === "color" ? (
    // This is for input type: color
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
        readOnly={props.readOnly ? props.readOnly : null}
        placeholder={props.placeholder}
        title={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
      {props.invalidFeedback}
    </div>
  ) : (
    // This is for input types: text, email, password
    <div className="form-floating mb-3">
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        name={props.name ? props.name : null}
        autoComplete={props.autoComplete ? props.autoComplete : null}
        required={props.required ? props.required : null}
        readOnly={props.readOnly ? props.readOnly : null}
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