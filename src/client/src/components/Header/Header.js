import { useLocation, useHistory } from "react-router-dom";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js"
import Account from "./Account";
import Language from "./Language";

export default function Header(props) {
  let location = useLocation();
  let history = useHistory();

  function navClassName(path) {
    return location.pathname.indexOf(path) !== -1 ? "nav-link active" : "nav-link";
  }

  function collapseMenu() {
    const nav = document.getElementById("main-navbar");
    if (nav.classList.contains("show")) {
      new bootstrap.Collapse(nav);
    }
  }

  function goTo(e, link) {
    e.preventDefault();
    history.push(link);
    collapseMenu();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={e => goTo(e, "/")}>Calendarium</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* TODO: reenable My events section at a later dev phase */}
            {/* {props.authenticated
              ? <li className="nav-item"><Link className="nav-link" to="/my-events">{props.translate("My events")}</Link></li>
              : null} */}
            {props.authenticated
              ? <li className="nav-item"><a className={navClassName("/my-calendars")} onClick={e => goTo(e, "/my-calendars")}>{props.translate("My calendars")}</a></li>
              : null}
            <li className="nav-item">
              <a className={navClassName("/public-calendars")} onClick={e => goTo(e, "/public-calendars")}>{props.translate("Public calendars")}</a>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="mailto:grove@codebards.io">Help</a>
            </li>
            <Account
              authenticated={props.authenticated}
              signOut={props.signOut}
              translate={props.translate}
              goTo={goTo}
            />
            <Language
              languages={props.languages}
              languageId={props.languageId}
              translate={props.translate}
              switchLanguage={props.switchLanguage}
              collapseMenu={collapseMenu}
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}