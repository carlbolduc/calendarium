import React from "react";
import { textColor } from "../../services/Helpers";

export default function Day(props) {

  function selectDay() {
    if (props.day !== null) {
      props.selectDay(props.day);
    }
  }
  const dayClassName = props.date.day === props.day 
    ? props.primaryColor === undefined || props.primaryColor === "#ffffff"
      ? "table-primary" 
      : textColor(props.primaryColor) 
    : "";
  const dayStyle = props.date.day === props.day 
    ? props.primaryColor === undefined || props.primaryColor === "#ffffff"
      ? { cursor: "pointer" }
      : { cursor: "pointer", backgroundColor: props.primaryColor } 
    : { cursor: "pointer" };
  const dotClassName = props.showDot && props.primaryColor !== undefined
    ? props.date.day === props.day
      ? props.primaryColor === undefined || props.primaryColor === "#ffffff"
        ? "d-block"
        : `d-block ${textColor(props.primaryColor)}`
      : "d-block"
    : "d-none";
  const dotStyle = props.showDot && props.secondaryColor !== undefined
    ? props.secondaryColor === "#ffffff"
      ? { marginTop: '-30px', height: '34px', fontSize: '200%' }
      : { color: props.secondaryColor, marginTop: '-30px', height: '34px', fontSize: '200%' }
    : null;
  return (
    <td className={dayClassName} style={dayStyle} onMouseDown={selectDay} onMouseUp={props.hide}>
      {props.day}
      <div className={dotClassName} style={dotStyle}>.</div>
    </td>
  )
}
