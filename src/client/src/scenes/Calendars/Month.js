import "./Month.scss";
import React from "react";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import useComponentBlur from "../../services/ComponentBlurHook";
import { dayNumber, nextWeekDay, uuidv4 } from "../../services/Helpers";
import Week from "./Week";
import MonthHeader from "./MonthHeader";

export default function Month(props) {
  const { ref } = useComponentBlur(props.hide !== undefined ? props.hide : null);
  const [date, setDate] = useState(DateTime.now());
  const [weeks, setWeeks] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const mobile = width <= 768;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  useEffect(() => {
    const page = document.getElementById("calendar-details-and-events");
    if (page !== null) {
      setTimeout(() => {
        const now = document.getElementById("now");
        if (now !== null) {
          now.scrollIntoView({ behavior: 'smooth' /*or auto*/, block: 'center' });
        }
      }, 200);
    }
  }, [props.selectedDate]);

  useEffect(() => {
    if (date !== null) {
      const result = [];
      let week = [];
      let dayOfWeek = dayNumber(props.startWeekOn);
      if (mobile) {
        let day = date.startOf("week");
        while (week.length < 7) {
          week.push(day);
          day = day.plus({days: 1})
        }
        result.push(week);
      } else {
        const startOfMonth = date.startOf("month");
        for (let i = 0; i < date.daysInMonth; i++) {
          // Prepend empty days
          while (dayOfWeek !== startOfMonth.weekday) {
            week.push(null);
            dayOfWeek = nextWeekDay(dayOfWeek);
          }
          const day =  startOfMonth.plus({days: i});
          week.push(day);
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
      }
      setWeeks(result);
      props.selectDay(date);
    }
  }, [date, props.startWeekOn, mobile]);

  function selectDay(d) {
    const selectedDate = d;
    setDate(d);
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

  function changeWeek(plusOrMinus) {
    let newDate;
    if (plusOrMinus === "plus") {
      newDate = date.plus({ weeks: 1 });
    } else if (plusOrMinus === "minus") {
      newDate = date.minus({ weeks: 1 });
    }
    setDate(newDate);
  }

  const calendar = weeks.map(week => (
    <Week
      key={uuidv4()}
      days={week}
      dots={props.dots !== undefined ? props.dots : []}
      selectedDate={props.selectedDate}
      selectDay={selectDay}
      hide={props.hide}
      primaryColor={props.primaryColor}
      secondaryColor={props.secondaryColor}
    />
  ));

  return (
    <table id={props.isEmbedded ? "month-embed" : "month-inapp"} className="table table-bordered text-center sticky-top" ref={ref}>
      <MonthHeader
        localeId={props.localeId}
        startWeekOn={props.startWeekOn}
        primaryColor={props.primaryColor}
        secondaryColor={props.secondaryColor}
        date={date}
        change={mobile ? changeWeek : changeMonth}
      />
      <tbody>
        {calendar}
      </tbody>
    </table>
  );
}
