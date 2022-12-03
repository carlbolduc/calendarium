import React from "react";
import { uuidv4 } from "../../services/Helpers";
import Day from "./Day"

export default function Week(props) {

  const days = props.days.map(d => (
    <Day
      key={uuidv4()}
      day={d}
      selectDay={props.selectDay}
      hide={props.hide}
      selectedDate={props.selectedDate}
      primaryColor={props.primaryColor}
      secondaryColor={props.secondaryColor}
      showDot={d !== null ? props.dots.indexOf(d.monthDay) !== -1 : false}
    />
  ));

  return (
    <tr>
      {days}
    </tr>
  );
}
