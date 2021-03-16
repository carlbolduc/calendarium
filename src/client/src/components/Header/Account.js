export default function Account(props) {

  //TODO: when signed in, we could insert a gravatar picture on the left of "Account"

  return (
    <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" href="#" id="dropdown-account" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        {props.translate("Account")}
      </a>
      <ul className="dropdown-menu" aria-labelledby="dropdown-account">
        <li>{props.authenticated 
          ? <a className="dropdown-item" onClick={e => props.goTo(e, "/profile")}>{props.translate("My profile")}</a>
          : <a className="dropdown-item" onClick={e => props.goTo(e, "/sign-up")}>{props.translate("Sign up")}</a>}</li>
        {props.authenticated 
          ? <li><a className="dropdown-item" onClick={e => props.goTo(e, "/subscription")}>{props.translate("My subscription")}</a></li>
          : null}
        <li>{props.authenticated 
          ? <a className="dropdown-item" href="#" onClick={props.signOut}>{props.translate("Sign out")}</a> 
          : <a className="dropdown-item" onClick={e => props.goTo(e, "/sign-in")}>{props.translate("Sign in")}</a>}</li>
      </ul>
    </li>
  );
}