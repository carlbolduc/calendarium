import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.js';

export default function Account(props) {

  //TODO: when signed in, we could insert a gravatar picture on the left of "Account"

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdown-account" role="button" data-toggle="dropdown" aria-expanded="false">
        {props.translate("Account")}
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdown-account">
        <li>{props.authenticated 
          ? <Link className="dropdown-item" to="/profile">{props.translate("Profile")}</Link> 
          : <Link className="dropdown-item" to="/sign-up">{props.translate("Sign up")}</Link>}</li>
        <li>{props.authenticated 
          ? <a className="dropdown-item" href="#" onClick={props.signOut}>{props.translate("Sign out")}</a> 
          : <Link className="dropdown-item" to="sign-in">{props.translate("Sign in")}</Link>}</li>
      </ul>
    </li>
  );
}