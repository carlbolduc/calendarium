import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime } from "luxon";
import { dayNumber, nextWeekDay, uuidv4, decideWhatToDisplay } from "../../services/Helpers";
import Week from "./Week";

export default function Calendar(props) {
  let { link } = useParams();
  const [date, setDate] = useState(DateTime.now());
  const [currentDay, setCurrentDay] = useState(DateTime.now().day);

  useEffect(() => {
    props.getCalendar(link);
  }, [])

  function name() {
    let result = null;
    if (props.calendar !== null) {
      result =  decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
    }
    return result;
  }

  function description() {
    let result = null;
    if (props.calendar !== null) {
      result = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr);
    }
    return result;
  }

  function renderMonth() {
    const result = [];
    let week = [];
    let dayOfWeek = dayNumber(props.calendar.startWeekOn);
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
          <Week key={uuidv4()} days={week} currentDay={currentDay} setCurrentDay={setCurrentDay}/>
        );
        week = [];
      } else if (i === date.daysInMonth-1) {
        while (week.length < 7) {
          week.push(null);
        }
        result.push(
          <Week key={uuidv4()} days={week} currentDay={currentDay} setCurrentDay={setCurrentDay}/>
        );
      }
    }
    return result;
  }
  
  return props.authenticated ? (
    <div className="p-5">
      <h1>{name()}</h1>
      <div>{description()}</div>
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