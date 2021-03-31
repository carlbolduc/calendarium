import React from "react";
import { uuidv4 } from "../../services/Helpers";
import Day from "./Day"

export default function Week(props) {

  const days = props.days.map(d => (
    <Day
      key={uuidv4()}
      day={d}
      currentDay={props.currentDay}
      selectDay={props.selectDay}
      hide={props.hide}
      date={props.date}
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
