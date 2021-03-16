import { DateTime } from "luxon";

export default function Footer(props) {
  const year = DateTime.now().year;
  const separator = <span>⁂</span>;
  return (
    <footer className="footer mt-auto pt-3 bg-light">
      <div className="container">
        <p className="text-muted text-center"><small><a href="mailto:grove@codebards.io">{props.translate("Contact us")}</a> {separator} <a href="/terms">{props.translate("Terms and conditions")}</a> {separator} <a href="/privacy">{props.translate("Our privacy policy")}</a><br />
        © {year} Code Bards. {props.translate("All rights reserved")}.</small></p>
      </div>
    </footer>
  );
}