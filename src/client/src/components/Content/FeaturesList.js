import React from "react";

export default function FeaturesList(props) {
  return (
    <>
      <h5>{props.translate("Calendarium can do all these cool tricks")}</h5>
      <ul className="mt-3">
        <li className="mb-2">
          {props.translate("Create and manage private and public calendars to share event dates in a secured centralised online place.")}
        </li>
        <li className="mb-2">
          {props.translate("Embed your customised calendars on your company’s website: select start of week day, match your website colours, use different embed links for English and French.")}
        </li>
        <li className="mb-2">
          {props.translate("Decide who can contribute events to your calendars: invite people from your organisation and outside.")}
        </li>
        <li className="mb-2">
          {props.translate("Use a thorough event publishing workflow: create events as draft, send them for approval, publish or unpublish them.")}
        </li>
        <li className="mb-2">
          {props.translate("Create bilingual calendars and events content: select if your calendars support English, French, or both languages.")}
        </li>
        <li className="mb-2">
          {props.translate("Use a bilingual user interface that supports English and French.")}
        </li>
      </ul>
    </>
  );
}

