import {useState, useEffect} from "react";
import {dayNumber, getLocale, nextWeekDay, uuidv4} from "../../services/Helpers";
import {DateTime, Info} from "luxon";
import Week from "./Week";
import ArrowLeft from "../../components/Icons/ArrowLeft";
import ArrowRight from "../../components/Icons/ArrowRight";

export default function Month(props) {
  const [date, setDate] = useState(DateTime.now());
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    if (date !== null) {
      const result = [];
      let week = [];
      let dayOfWeek = dayNumber(props.startWeekOn);
      const monthStartWeekday = date.startOf("month").weekday;
      for (let i = 0; i < date.daysInMonth; i++) {
        // Prepend empty days
        while (dayOfWeek !== monthStartWeekday) {
          week.push(null);
          dayOfWeek = nextWeekDay(dayOfWeek);
        }
        week.push(i + 1);
        if (week.length === 7) {
          result.push(week);
          week = [];
        } else if (i === date.daysInMonth - 1) {
          while (week.length < 7) {
            week.push(null);
          }
          result.push(week);
        }
      }
      setWeeks(result);
    }
  }, [date]);

  function selectDay(d) {
    const selectedDate = date.set({day: d});
    props.selectDay(selectedDate);
  }

  function changeMonth(plusOrMinus) {
    if (plusOrMinus === "plus") {
      setDate(date.plus({ months: 1 }));
    } else if (plusOrMinus === "minus") {
      setDate(date.minus({ months: 1 }));
    }
  }

  function renderHeader() {
    const dayOfWeek = dayNumber(props.startWeekOn);
    const locale = getLocale(props.language);
    return (
      <thead>
      <tr>
        <th className="border-0 p-1">
          <button
            className="btn text-secondary btn-icon p-0"
            type="button"
            id="button-arrow-left"
            onClick={() => changeMonth("minus")}
          >
            <ArrowLeft />
          </button>
        </th>
        <th className="border-0 p-1" colSpan="5">{date.setLocale(getLocale(props.language)).monthLong} {date.year}</th>
        <th className="border-0 p-1">
          <button
            className="btn text-secondary btn-icon p-0"
            type="button"
            id="button-arrow-left"
            onClick={() => changeMonth("plus")}
          >
            <ArrowRight />
          </button>
        </th>
      </tr>
      <tr className="text-muted">
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[dayOfWeek - 1]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[dayOfWeek]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 1) % 7]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 2) % 7]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 3) % 7]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 4) % 7]}</th>
        <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 5) % 7]}</th>
      </tr>
      </thead>
    );
  }

  const month = weeks.map(week =>(
    <Week key={uuidv4()} days={week} currentDay={props.currentDay} selectDay={selectDay} />
  ));

  return (
    <table className="table table-bordered text-center">
      {renderHeader()}
      <tbody>
      {month}
      </tbody>
    </table>
  );
}