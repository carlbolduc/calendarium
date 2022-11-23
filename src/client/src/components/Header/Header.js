import { useLocation, useHistory } from "react-router-dom";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js"
import Account from "./Account";
import Language from "./Language";
import React from "react";

export default function Header(props) {
  let location = useLocation();
  let history = useHistory();

  function navClassName(path) {
    return location.pathname.indexOf(path) !== -1 ? "link-button nav-link active" : "link-button nav-link";
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <button className="link-button navbar-brand" onClick={e => goTo(e, "/")}>
          <div className="row p-0 m-0">
            <div className="col-auto ps-0 pe-1"><img src="/img/logo.png" alt="Calendarium logo" height="24" className=""/></div>
            <div className="col p-0 mt-1">Calendarium</div>
          </div>
        </button>
        <button className="navbar-toggler shadow-none" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label={props.translate("Toggle navigation")}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse mt-1" id="main-navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {props.authenticated
              ? <li className="nav-item"><button className={navClassName("/my-calendars")} onClick={e => goTo(e, "/my-calendars")}>{props.translate("My calendars")}</button></li>
              : null}
            <li className="nav-item">
              <button className={navClassName("/public-calendars")} onClick={e => goTo(e, "/public-calendars")}>{props.translate("Public calendars")}</button>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="mailto:grove@codebards.io">{props.translate("Help")}</a>
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