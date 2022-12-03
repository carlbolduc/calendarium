import React from "react";
import {textColor} from "../../services/Helpers";

export default function Day(props) {

  function selectDay() {
    if (props.day !== null) {
      props.selectDay(props.day.monthDay);
    }
  }
  function dayClassName() {
    let result = "";
    if (props.day !== null) {
      if (props.day.currentMonth) {
        if (props.selectedDate.day === props.day.monthDay) {
          if (props.primaryColor === undefined || props.primaryColor === "#ffffff") {
            result = "table-primary";
          } else {
            result = textColor(props.primaryColor);
          }
        }
      } else {
        result = "text-muted";
      }
    }
    return result;
  }

  function dotClassName() {
    let result = "d-none";
    if (props.day !== null) {
      if (props.showDot && props.primaryColor !== undefined) {
        if (props.selectedDate.day === props.day.monthDay) {
          result = props.primaryColor === "#ffffff" ? "d-block" : `d-block ${textColor(props.primaryColor)}`
        } else {
          result = "d-block";
        }
      }
    }
    return result;
  }

  function dayStyle() {
    let result = {};
    if (props.day !== null) {
      if (props.day.currentMonth) {
        if (props.selectedDate.day === props.day.monthDay) {
          if (props.primaryColor === undefined || props.primaryColor === "#ffffff") {
            result = { cursor: "pointer" };
          } else {
            result = { cursor: "pointer", backgroundColor: props.primaryColor };
          }
        } else {
          result = { cursor: "pointer" };
        }
      }
    }
    return result;
  }

  function dotStyle() {
    let result = {};
    if (props.day !== null) {
      if (props.showDot && props.secondaryColor !== undefined) {
        if (props.secondaryColor === "#ffffff") {
          result = { marginTop: '-30px', height: '34px', fontSize: '200%' };
        } else {
          result =  { color: props.secondaryColor, marginTop: '-30px', height: '34px', fontSize: '200%' };
        }
      }
    }
    return result;
  }

  return (
    <td className={dayClassName()} style={dayStyle()} onMouseDown={selectDay} onMouseUp={props.hide}>
      {props.day !== null ? props.day.monthDay : null}
      <div className={dotClassName()} style={dotStyle()}>.</div>
    </td>
  )
}
