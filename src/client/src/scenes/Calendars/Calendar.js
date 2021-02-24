import { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { DateTime, Info } from "luxon";
import { dayNumber, nextWeekDay, uuidv4, decideWhatToDisplay, getLocale } from "../../services/Helpers";
import Week from "./Week";
import ArrowLeft from "../../components/Icons/ArrowLeft";
import ArrowRight from "../../components/Icons/ArrowRight";

export default function Calendar(props) {
  let { link } = useParams();
  const [date, setDate] = useState(DateTime.now());
  const [currentDay, setCurrentDay] = useState(DateTime.now().day);

  useEffect(() => {
    props.getCalendar(link);

  }, [])

  function renderName() {
    let result = null;
    if (props.calendar !== null) {
      result = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
    }
    return result;
  }

  function renderDescription() {
    let result = null;
    if (props.calendar !== null) {
      result = decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr);
    }
    return result;
  }

  function changeMonth(plusOrMinus) {
    if (plusOrMinus === "plus") {
      setDate(date.plus({ months: 1 }));
    } else if (plusOrMinus === "minus") {
      setDate(date.minus({ months: 1 }));
    }
  }

  function renderMonthHeader() {
    return (
      <>
        <th>
          <button
            className="btn text-secondary btn-icon p-0"
            type="button"
            id="button-arrow-left"
            onClick={() => changeMonth("minus")}
          >
            <ArrowLeft />
          </button>
        </th>
        <th colSpan="5">{date.setLocale(getLocale(props.language)).monthLong} {date.year}</th>
        <th>
          <button
            className="btn text-secondary btn-icon p-0"
            type="button"
            id="button-arrow-left"
            onClick={() => changeMonth("plus")}
          >
            <ArrowRight />
          </button>
        </th>
      </>
    );
  }

  function renderMonth() {
    const result = [];
    let week = [];
    let dayOfWeek = dayNumber(props.calendar.startWeekOn);
    const monthStartWeekday = date.startOf("month").weekday;
    // Weekdays line
    const locale = getLocale(props.language);
    result.push(
      <tr className="text-muted">
        <td>{Info.weekdays("narrow", { locale: locale })[dayOfWeek - 1]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[dayOfWeek]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 1) % 7]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 2) % 7]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 3) % 7]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 4) % 7]}</td>
        <td>{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 5) % 7]}</td>
      </tr>
    );
    // Calendar days
    for (let i = 0; i < date.daysInMonth; i++) {
      // Prepend empty days
      while (dayOfWeek !== monthStartWeekday) {
        week.push(null);
        dayOfWeek = nextWeekDay(dayOfWeek);
      }
      week.push(i + 1);
      if (week.length === 7) {
        result.push(
          <Week key={uuidv4()} days={week} currentDay={currentDay} setCurrentDay={setCurrentDay} />
        );
        week = [];
      } else if (i === date.daysInMonth - 1) {
        while (week.length < 7) {
          week.push(null);
        }
        result.push(
          <Week key={uuidv4()} days={week} currentDay={currentDay} setCurrentDay={setCurrentDay} />
        );
      }
    }
    return result;
  }

  return props.authenticated ? (
    <div className="p-5">
      <h1>{renderName()}</h1>
      <div>{renderDescription()}</div>
      <div className="container mt-4 px-0">
        <div className="row justify-content-center">
          <div className="col-auto">
            <table className="table table-bordered text-center">
              <thead>
                {props.calendar !== null ? renderMonthHeader() : null}
              </thead>
              <tbody>
                {props.calendar !== null ? renderMonth() : null}
              </tbody>
            </table>
          </div>
          <div className="col">
            <h2>Events go here</h2>
          </div>
        </div>
      </div>
    </div>
  ) : (
      <Redirect
        to={{
          pathname: "/sign-in",
          state: { from: "/subscription" }
        }}
      />
    );
}