import React from 'react';
import { Link } from 'react-router-dom';
import Account from './Account';
import Language from './Language';

export default function Header(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Calendarium</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
            {/* TODO: set className="nav-link active" when we are on that page */}
            {props.authenticated
              ? <li className="nav-item"><Link className="nav-link" to="/my-events">{props.translate("My events")}</Link></li>
              : null}
            {props.authenticated
              ? <li className="nav-item"><Link className="nav-link" to="/my-calendars">{props.translate("My calendars")}</Link></li>
              : null}
            <li className="nav-item">
              <Link className="nav-link" to="/public-calendars">{props.translate("Public calendars")}</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
            <Account
              authenticated={props.authenticated}
              signOut={props.signOut}
              translate={props.translate}
            />
            <Language
              languages={props.languages}
              languageId={props.languageId}
              translate={props.translate}
              switchLanguage={props.switchLanguage}
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}