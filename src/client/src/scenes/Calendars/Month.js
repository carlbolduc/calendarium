import {dayNumber, getLocale, nextWeekDay, uuidv4} from "../../services/Helpers";
import {Info} from "luxon";
import Week from "./Week";

export default function Month(props) {
  function renderMonth() {
    const result = [];
    let week = [];
    let dayOfWeek = dayNumber(props.startWeekOn);
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

  return renderMonth();
}