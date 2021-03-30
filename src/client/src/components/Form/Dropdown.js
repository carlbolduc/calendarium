import React from "react";
import "bootstrap/dist/js/bootstrap.bundle.js";

export default function Dropdown(props) {
  // TODO: generate options with a map of props.options
  return (
    <div className="dropdown">
      <div className="btn-group">
        <button type="button" className="btn btn-secondary">{props.defaultValue}</button>
        <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" id={props.id} data-toggle="dropdown" aria-expanded="false">
          <span className="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu" aria-labelledby={props.id}>
          <li><button className="dropdown-item" type="button">{props.options[0]}</button></li>
          <li><button className="dropdown-item" type="button">{props.options[1]}</button></li>
        </ul>
      </div>
    </div>
  );
}