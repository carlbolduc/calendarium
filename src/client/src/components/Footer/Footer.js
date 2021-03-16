import { DateTime } from "luxon";

export default function Footer() {
  const year = DateTime.now().year;
  const separator = <span>⁂</span>;
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <p className="text-muted text-center"><small><a href="mailto:grove@codebards.io">Contact us</a> {separator} <a href="/terms">Terms and conditions</a> {separator} <a href="/privacy">Our privacy policy</a><br />
        © {year} Code Bards. All rights reserved.</small></p>
      </div>
    </footer>
  );
}