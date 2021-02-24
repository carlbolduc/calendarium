import { Link } from "react-router-dom";
import { textColor, decideWhatToDisplay } from "../../services/Helpers";

export default function CalendarPreview(props) {
  function link() {
    return decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.linkEn, props.calendar.linkFr);
  }

  function name() {
    return decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  }

  function description() {
    return decideWhatToDisplay(props.language, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr);
  }

  return (
    <div className="col-auto">
      <div className={`card mb-4 ${textColor(props.calendar.primaryColor)}`} style={{ width: "18rem", height: "18rem", backgroundColor: props.calendar.primaryColor }}>
        <h5 className="card-header">{name()}</h5>
        <div className="card-body overflow-auto">
          <p className="card-text">{description()}</p>
          <Link className="stretched-link" to={`/${link()}`}></Link>
        </div>
      </div>
    </div>

  )
}