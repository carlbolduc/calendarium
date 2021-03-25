import { DateTime } from "luxon";
import React from "react";

export default function Footer(props) {
  const year = DateTime.now().year;
  const separator = <span>⁂</span>;
  return (
    <footer className="footer mt-auto pt-3 bg-light">
      <div className="container">
        <p className="text-muted text-center"><small><a href="mailto:grove@codebards.io">{props.translate("Contact us")}</a> {separator} <a href="http://codebards.io/policies/terms/">{props.translate("Terms of service")}</a> {separator} <a href="http://codebards.io/policies/privacy/">{props.translate("Privacy policy")}</a><br />
        © {year} <a href="http://codebards.io/">Code Bards</a>. {props.translate("All rights reserved")}.</small></p>
      </div>
    </footer>
  );
}