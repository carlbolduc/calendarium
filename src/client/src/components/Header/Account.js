export default function Account(props) {

  //TODO: when signed in, we could insert a gravatar picture on the left of "Account"

  return (
    <li className="nav-item dropdown">
      <button className="link-button nav-link dropdown-toggle" id="dropdown-account" data-bs-toggle="dropdown" aria-expanded="false">
        {props.translate("Account")}
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdown-account">
        <li>{props.authenticated 
          ? <button className="link-button dropdown-item" onClick={e => props.goTo(e, "/profile")}>{props.translate("My profile")}</button>
          : <button className="link-button dropdown-item" onClick={e => props.goTo(e, "/sign-up")}>{props.translate("Sign up")}</button>}</li>
        {props.authenticated 
          ? <li><button className="link-button dropdown-item" onClick={e => props.goTo(e, "/subscription")}>{props.translate("My subscription")}</button></li>
          : null}
        <li>{props.authenticated 
          ? <button className="link-button dropdown-item" onClick={props.signOut}>{props.translate("Sign out")}</button>
          : <button className="link-button dropdown-item" onClick={e => props.goTo(e, "/sign-in")}>{props.translate("Sign in")}</button>}</li>
      </ul>
    </li>
  );
}