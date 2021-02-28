import { Link, useLocation } from 'react-router-dom';
import Account from './Account';
import Language from './Language';

export default function Header(props) {
  let location = useLocation();

  function navClassName(path) {
    return location.pathname.indexOf(path) !== -1 ? "nav-link active" : "nav-link";
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Calendarium</Link>
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
              ? <li className="nav-item"><Link className={navClassName("/my-calendars")} to="/my-calendars">{props.translate("My calendars")}</Link></li>
              : null}
            <li className="nav-item">
              <Link className={navClassName("/public-calendars")} to="/public-calendars">{props.translate("Public calendars")}</Link>
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