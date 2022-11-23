import React from "react";

export default function Account(props) {

  function signOut(e) {
    e.preventDefault();
    props.signOut(() => {
      props.goTo(e, "/");
    });
  }

  //TODO: when signed in, we could insert a gravatar picture on the left of "Account"
  return (
    <li className="nav-item dropdown">
      <button className="link-button nav-link dropdown-toggle" id="dropdown-account" data-bs-toggle="dropdown" aria-expanded="false">
        {props.translate("Account")}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdown-account">
        <li><button className="link-button dropdown-item" onClick={e => props.goTo(e, "/profile")}>{props.translate("My profile")}</button></li>
        <li><button className="link-button dropdown-item" onClick={e => props.goTo(e, "/subscription")}>{props.translate("My subscription")}</button></li>
        <li><button className="link-button dropdown-item" onClick={signOut}>{props.translate("Sign out")}</button></li>
      </ul>
    </li>
  );
}