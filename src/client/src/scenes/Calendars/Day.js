import React from "react";
import { textColor } from "../../services/Helpers";

export default function Day(props) {

  function selectDay() {
    if (props.day !== null) {
      props.selectDay(props.day);
    }
  }
  const className = props.date.day === props.day 
    ? props.primaryColor === undefined || props.primaryColor === "#ffffff"
      ? "table-primary" 
      : textColor(props.primaryColor) 
    : "";
  const style = props.date.day === props.day 
    ? props.primaryColor === undefined || props.primaryColor === "#ffffff"
      ? { cursor: "pointer" }
      : { cursor: "pointer", backgroundColor: props.primaryColor } 
    : { cursor: "pointer" };
  return (
    <td className={className} style={style} onMouseDown={selectDay} onMouseUp={props.hide}>{props.day}</td>
  )
}
