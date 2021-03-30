import React from "react";

export default function FeaturesList(props) {
  // TODO: list calendarium features and wrap with {props.translate("")}
  return (
    <>
    <h5>{props.translate("Calendarium can do all these cool tricks")}</h5>
    <ul className="list-group list-group-flush">
      <li className="list-group-item">
        First feature
      </li>
      <li className="list-group-item">
        Second feature
      </li>
      <li className="list-group-item">
        Third feature
      </li>
      <li className="list-group-item">
        Fourth feature
      </li>
    </ul>
    </>
  );
}