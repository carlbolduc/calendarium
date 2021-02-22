import React from "react";

export default function Input(props) {
  const classes = props.type === "color"
    ? "form-control form-control-color"
    : "form-control";

  return (
    <div className="form-floating mb-3">
      <input
        type={props.type}
        className={classes}
        id={props.id}
        name={props.name ? props.name : null}
        autoComplete={props.autoComplete ? props.autoComplete : null}
        required={props.required ? props.required : null}
        placeholder={props.placeholder}
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