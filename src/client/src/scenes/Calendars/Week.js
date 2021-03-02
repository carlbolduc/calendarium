import { uuidv4 } from "../../services/Helpers";
import Day from "./Day"

export default function Week(props) {

  const days = props.days.map(d => (
    <Day 
      key={uuidv4()} 
      day={d} 
      currentDay={props.currentDay}
      selectDay={props.selectDay}
     />
  ));

  return (
    <tr>
      {days}
    </tr>
  );
}