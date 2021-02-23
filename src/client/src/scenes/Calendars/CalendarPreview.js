import { Link } from "react-router-dom";

export default function CalendarPreview(props) {
  function link() {
    let result;
    if (props.language === 1 && props.calendar.enableEn) {
      result = props.calendar.linkEn; // We're in English and the calendar has English enabled
    } else if (props.language === 2 && props.calendar.enableFr) {
      result = props.calendar.linkFr; // We're in French and the calendar has French enabled
    } else if (props.calendar.linkEn !== "") {
      result = props.calendar.linkEn; // None of the above and the calendar has an English link
    } else {
      result = props.calendar.linkFr; // None of the above and the calendar has a French link
    }
    return result;
  }

  function name() {
    let result;
    if (props.language === 1 && props.calendar.enableEn) {
      result = props.calendar.nameEn; // We're in English and the calendar has English enabled
    } else if (props.language === 2 && props.calendar.enableFr) {
      result = props.calendar.nameFr; // We're in French and the calendar has French enabled
    } else if (props.calendar.nameEn !== "") {
      result = props.calendar.nameEn; // None of the above and the calendar has an English name
    } else {
      result = props.calendar.nameFr; // None of the above and the calendar has a French name
    }
    return result;
  }

  function description() {
    let result;
    if (props.language === 1 && props.calendar.enableEn) {
      result = props.calendar.descriptionEn; // We're in English and the calendar has English enabled
    } else if (props.language === 2 && props.calendar.enableFr) {
      result = props.calendar.descriptionFr; // We're in French and the calendar has French enabled
    } else if (props.calendar.descriptionEn !== "") {
      result = props.calendar.descriptionEn; // None of the above and the calendar has an English description
    } else {
      result = props.calendar.descriptionFr; // None of the above and the calendar has a French description
    }
    return result;
  }

  return (
    <div className="col-auto">
      <div className="card mb-4" style={{ width: "18rem" }}>
        <svg className="card-img-top" width="100%" height="60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill={props.calendar.primaryColor} /></svg>
        <svg className="card-img-middle" width="100%" height="30" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Image cap" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill={props.calendar.secondaryColor} /></svg>
        <div className="card-body">
          <h5 className="card-title">{name()}</h5>
          <p className="card-text">{description()}</p>
          <Link className="stretched-link" to={`/my-calendars/${link()}`}></Link>
        </div>
      </div>
    </div>
  )
}