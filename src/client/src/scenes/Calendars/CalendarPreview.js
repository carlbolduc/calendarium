import React from "react";
import { Link } from "react-router-dom";
import { textColor, decideWhatToDisplay } from "../../services/Helpers";

export default function CalendarPreview(props) {
  const link = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.linkEn, props.calendar.linkFr);
  const name = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.nameEn, props.calendar.nameFr);
  const description = decideWhatToDisplay(props.localeId, props.calendar.enableEn, props.calendar.enableFr, props.calendar.descriptionEn, props.calendar.descriptionFr);

  return (
    <div className="col-12 col-md-6 col-xl-4 col-xxl-3">
      <div className={`calendar-preview card mb-4 ${textColor(props.calendar.primaryColor)}`} style={{ backgroundColor: props.calendar.primaryColor }}>
        <h5 className="card-header">{name}</h5>
        <div className="card-body overflow-auto">
          <p className="card-text">{description}</p>
          <Link className="stretched-link" to={`/${link}`}></Link>
        </div>
      </div>
    </div>

  )
}