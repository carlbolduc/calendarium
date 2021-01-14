import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.js';

export default function Account(props) {

  //TODO: when signed in, we could insert a gravatar picture on the left of "Account"

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdown-account" role="button" data-toggle="dropdown" aria-expanded="false">
        Account
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdown-account">
        <li>{props.authenticated ? <Link className="dropdown-item" to="/profile">Profile</Link> :
          <Link className="dropdown-item" to="/sign-up">Sign Up</Link>}</li>
        <li>{props.authenticated ? <a className="dropdown-item" href="#" onClick={props.signOut}>Sign Out</a> :
          <Link className="dropdown-item" to="sign-in">Sign In</Link>}</li>
      </ul>
    </li>
  );
}