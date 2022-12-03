import React from "react";
import PropTypes from "prop-types";
import {dayNumber, getLocale, textColor} from "../../services/Helpers";
import ArrowLeft from "../../components/Icons/ArrowLeft";
import ArrowRight from "../../components/Icons/ArrowRight";
import {Info} from "luxon";

export default function MonthHeader(props) {

  const dayOfWeek = dayNumber(props.startWeekOn);
  const locale = getLocale(props.localeId);
  const weekdayRowClassName = props.secondaryColor === undefined || props.secondaryColor === "#ffffff"
    ? "text-muted"
    : `${textColor(props.secondaryColor)}`
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
          onClick={() => props.change("minus")}
        >
          <ArrowLeft />
        </button>
      </th>
      <th className="border-0 p-1" colSpan={5}>{props.date.setLocale(getLocale(props.localeId)).monthLong} {props.date.year}</th>
      <th className="border-0 p-1">
        <button
          className={`btn ${monthRowTextColor} btn-icon p-0`}
          type="button"
          id="button-arrow-left"
          onClick={() => props.change("plus")}
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

MonthHeader.propTypes = {
  localeId: PropTypes.string,
  startWeekOn: PropTypes.string,
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
  date: PropTypes.object,
  change: PropTypes.func,
}