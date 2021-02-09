import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from "axios";
import {useStateCallback, uuidv4} from "../../services/Helpers";
import {useLoc} from "../../services/Loc";
import {useAuth} from "../../services/Auth";
import Header from "../../components/Header/Header";
import SignUp from "../Auth/SignUp";
import SignIn from "../Auth/SignIn";
import ForgotPassword from "../Auth/ForgotPassword";
import Home from "../Home/Home";
import Profile from "../Account/Profile";
import Subscription from "../Account/Subscription";
import MyEvents from "../Events/MyEvents";
import MyCalendars from "../Calendars/MyCalendars";
import PublicCalendars from "../Calendars/PublicCalendars";

export default function App() {
  const [languages, setLanguages] = useState([]);
  const [messages, setMessages] = useStateCallback([]);
  const {
    account,
    authenticated,
    signUp,
    signIn,
    signOut,
    getAccount,
    updateAccount,
    createPasswordReset
  } = useAuth(messages, setMessages, uuidv4);
  const {getLocData, translate} = useLoc(account, languages);

  useEffect(() => {
    getLocData();
    getLanguages();
  }, [])

  function getLanguages() {
    axios({
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      url: `${process.env.REACT_APP_API}/loc/languages`,
    }).then(res => {
      setLanguages(res.data);
    })
  }

  function switchLanguage(languageId) {
    updateAccount({languageId: languageId});
  }

  function clearMessage(id) {
    setMessages(messages.filter(m => m.id !== id));
  }

  function clearMessages(scene, cb) {
    if (cb) {
      setMessages(messages.filter(m => m.scene !== scene), () => {
        cb();
      });
    } else {
      setMessages(messages.filter(m => m.scene !== scene));
    }
  }

  return (
    <main className="App">
      <Router>
        <Header
          languages={languages}
          languageId={account.languageId}
          authenticated={authenticated}
          translate={translate}
          signOut={signOut}
          switchLanguage={switchLanguage}
        />
        <Switch>
          <Route path="/sign-in">
            <SignIn
              signIn={signIn}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/sign-up">
            <SignUp
              signUp={signUp}
              authenticated={authenticated}
              translate={translate}
              messages={messages.filter(m => m.scene === "SignUp")}
              clearMessage={clearMessage}
              clearMessages={() => clearMessages("SignUp")}
            />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword
              createPasswordReset={createPasswordReset}
              authenticated={authenticated}
              translate={translate}
              messages={messages.filter(m => m.scene === "ForgotPassword")}
              clearMessage={clearMessage}
              clearMessages={() => clearMessages("ForgotPassword")}
            />
          </Route>
          <Route path="/profile">
            <Profile
              account={account}
              updateAccount={updateAccount}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/subscription">
            <Subscription
              account={account}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/my-events">
            <MyEvents
              account={account}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/my-calendars">
            <MyCalendars
              account={account}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/public-calendars">
            <PublicCalendars
              account={account}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/">
            <Home
              translate={translate}
            />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}
