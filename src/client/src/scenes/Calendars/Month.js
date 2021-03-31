import React from "react";
import { useState, useEffect } from "react";
import { DateTime, Info } from "luxon";
import useComponentBlur from "../../services/ComponentBlurHook";
import { dayNumber, getLocale, nextWeekDay, uuidv4, textColor } from "../../services/Helpers";
import Week from "./Week";
import ArrowLeft from "../../components/Icons/ArrowLeft";
import ArrowRight from "../../components/Icons/ArrowRight";

export default function Month(props) {
  const { ref } = useComponentBlur(props.hide !== undefined ? props.hide : null);
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
  }, [date, props.startWeekOn]);

  function daysWithDot() {
    const dots = [];
    for (let event of props.events) {
      const startAt = DateTime.fromSeconds(event.startAt);
      const endAt = DateTime.fromSeconds(event.endAt);
      if (date.month === startAt.month) {
        if (dots.indexOf(startAt.day) === -1) {
          dots.push(startAt.day);
        }
        if (endAt.startOf("day") !== startAt.startOf("day")) {
          if (endAt.year !== startAt.year || endAt.month !== startAt.month) {
            // fill all day of the month
            for (let x = startAt.day; x < date.endOf("month").day; x++) {
              if (dots.indexOf(x+1) === -1) {
                dots.push(x+1);
              }
            }
          } else {
            for (let x = startAt.day; x < endAt.day; x++) {
              if (dots.indexOf(x+1) === -1) {
                dots.push(x+1);
              }
            }
          }
        }
      } else if (date.month === endAt.month) {
        if (dots.indexOf(date.startOf("month").day) === -1) {
          dots.push(1);
        }
        for (let x = 2; x === endAt.day; x++) {
          if (dots.indexOf(x) === -1) {
            dots.push(x);
          }
        }
      }
    }
    return dots;
  }

  function selectDay(d) {
    const selectedDate = date.set({ day: d });
    setDate(selectedDate);
    props.selectDay(selectedDate);
  }

  function changeMonth(plusOrMinus) {
    let newDate;
    if (plusOrMinus === "plus") {
      newDate = date.plus({ months: 1 });
    } else if (plusOrMinus === "minus") {
      newDate = date.minus({ months: 1 });
    }
    setDate(newDate.startOf("month"));
  }

  function renderHeader() {
    const dayOfWeek = dayNumber(props.startWeekOn);
    const locale = getLocale(props.language);
    const weekdayRowClassName = props.secondaryColor === undefined || props.secondaryColor === "#ffffff" 
      ? "text-muted" 
      : `${textColor(props.secondaryColor)}`;
    const weekdayRowStyle = props.secondaryColor === undefined 
      ? null 
      : { backgroundColor: props.secondaryColor };
    const monthRowTextColor = props.primaryColor === undefined 
      ? null 
      : textColor(props.primaryColor);
    const monthRowStyle = props.primaryColor === undefined 
      ? null 
      : { backgroundColor: props.primaryColor };
    return (
      <thead>
        <tr className={monthRowTextColor} style={monthRowStyle}>
          <th className="border-0 p-1">
            <button
              className={`btn ${monthRowTextColor} btn-icon p-0`}
              type="button"
              id="button-arrow-left"
              onClick={() => changeMonth("minus")}
            >
              <ArrowLeft />
            </button>
          </th>
          <th className="border-0 p-1" colSpan={5}>{date.setLocale(getLocale(props.language)).monthLong} {date.year}</th>
          <th className="border-0 p-1">
            <button
              className={`btn ${monthRowTextColor} btn-icon p-0`}
              type="button"
              id="button-arrow-left"
              onClick={() => changeMonth("plus")}
            >
              <ArrowRight />
            </button>
          </th>
        </tr>
        <tr className={weekdayRowClassName} style={weekdayRowStyle}>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[dayOfWeek - 1]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[dayOfWeek % 7]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 1) % 7]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 2) % 7]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 3) % 7]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 4) % 7]}</th>
          <th className="fw-normal">{Info.weekdays("narrow", { locale: locale })[(dayOfWeek + 5) % 7]}</th>
        </tr>
      </thead>
    );
  }

  const month = weeks.map(week => (
    <Week
      key={uuidv4()}
      days={week}
      dots={props.events !== undefined ? daysWithDot() : []}
      selectedDate={props.selectedDate}
      selectDay={selectDay}
      hide={props.hide}
      primaryColor={props.primaryColor}
      secondaryColor={props.secondaryColor}
    />
  ));

  return (
    <table className="table table-bordered text-center" ref={ref}>
      {renderHeader()}
      <tbody>
        {month}
      </tbody>
    </table>
  );
}
