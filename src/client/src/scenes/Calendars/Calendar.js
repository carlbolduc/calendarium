import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { dayNumber, nextWeekDay, uuidv4 } from "../../services/Helpers";
import Week from "./Week";

export default function Calendar(props) {
  let { link } = useParams();
  const [date, setDate] = useState(DateTime.now().plus({months:3}));
  const [currentDay, setCurrentDay] = useState(DateTime.now().day);

  useEffect(() => {
    props.getCalendar(link);
  }, [])

  function renderMonth() {
    const result = [];
    let week = [];
    let dayOfWeek = dayNumber(props.calendar.startDay);
    const monthStartWeekday = date.startOf("month").weekday;
    for (let i = 0; i < date.daysInMonth; i++) {
      // Prepend empty days
      while (dayOfWeek !== monthStartWeekday) {
        week.push(null);
        dayOfWeek = nextWeekDay(dayOfWeek);
      }
      week.push(i+1);
      if (week.length === 7) {
        result.push(
          <Week key={uuidv4()} days={week} currentDay={currentDay}/>
        );
        week = [];
      } else if (i === date.daysInMonth-1) {
        while (week.length < 7) {
          week.push(null);
        }
        result.push(
          <Week key={uuidv4()} days={week} currentDay={currentDay}/>
        );
      }
    }
    return result;
  }
  
  return props.authenticated ? (
    <div className="p-5">
      <h1>{link}</h1>
      <div>Le Calendar</div>
      <table className="table table-bordered text-center">
        <tbody>
          {props.calendar !== null ? renderMonth() : null}
        </tbody>
      </table>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in",
        state: {from: "/subscription"}
      }}
    />
  );
}