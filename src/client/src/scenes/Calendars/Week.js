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
      showDot={props.dots.indexOf(d) !== -1}
    />
  ));

  return (
    <tr>
      {days}
    </tr>
  );
}
