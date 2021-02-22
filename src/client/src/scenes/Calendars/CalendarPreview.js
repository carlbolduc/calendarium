import {Link} from "react-router-dom";
export default function CalendarPreview(props) {
  function name() {
    let result;
    if (props.calendar.nameEn !== null) {
      result = props.calendar.nameEn;
    } else {
      result = props.calendar.nameFr;
    }
    return result;
  }
  return (
    <div><Link to={`/my-calendars/${name()}`}>{name()}</Link></div>
  )
}