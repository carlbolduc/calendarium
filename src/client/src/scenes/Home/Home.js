import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import IframeResizer from 'iframe-resizer-react';
import FeaturesList from "../../components/Content/FeaturesList";

export default function Home(props) {
  let history = useHistory();

  return props.authenticated ? (
    <Redirect
      to={{
        pathname: "/my-calendars",
        state: { from: "/" }
      }}
    />
  ) : (
    <article>
      <h1 className="mb-4">{props.translate("Welcome to Calendarium")}</h1>
      <h3 className="mb-4">{props.translate("Calendarium is a collaborative online calendar for people and organizations who want to privately or publicly share event dates and details.")}</h3>

      <div className="row align-items-center mb-4">
        <div id="start-trial-button" className="col-auto mx-auto p-3 cursor-pointer text-center bg-primary bg-gradient text-white rounded" onClick={() => history.push("/subscription?p=trial")}>
          <div className="fw-bold fs-5 mb-1">{props.translate("Try Calendarium for free")}</div>
          <div className="small">{props.translate("No credit card required. Cancel anytime.")}</div>
        </div>
      </div>

      <FeaturesList translate={props.translate} />

      <h5 className="my-4">{props.translate("Here is a real life example of an embedded calendar")}</h5>
      <IframeResizer
        src={`/embed/1?locale=${props.languageId == 1 ? "enCa" : "frCa"}&rand=${Math.round(Math.random() * 10000000)}`}
        heightCalculationMethod="taggedElement"
        style={{ width: '1px', minWidth: '100%'}}
      />

    </article>
  );
}