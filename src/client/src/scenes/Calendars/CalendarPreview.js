import {Link} from "react-router-dom";

export default function CalendarPreview(props) {
  function link() {
    let result;
    if (props.calendar.linkEn !== null) {
      result = props.calendar.linkEn;
    } else {
      result = props.calendar.linkFr;
    }
    return result;
  }
  return (
    <div><Link to={`/my-calendars/${link()}`}>{link()}</Link></div>
  )
}