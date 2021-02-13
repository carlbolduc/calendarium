import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from "axios";
import {useLoc} from "../../services/Loc";
import {useAuth} from "../../services/Auth";
import {useSubscription} from "../../services/Subscription";
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
import PasswordReset from "../Auth/PasswordReset";

export default function App() {
  const [languages, setLanguages] = useState([]);
  const {
    token,
    account,
    authenticated,
    signUp,
    signIn,
    signOut,
    getAccount,
    updateAccount,
    createPasswordReset,
    resetPassword
  } = useAuth();
  const {getLocData, translate} = useLoc(account, languages);
  const {customerCreated, subscribed, createCustomer, createSubscription} = useSubscription(token, account, getAccount);

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
            />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword
              createPasswordReset={createPasswordReset}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/password-resets/:id">
            <PasswordReset
              resetPassword={resetPassword}
              authenticated={authenticated}
              translate={translate}
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
              customerCreated={customerCreated}
              subscribed={subscribed}
              createCustomer={createCustomer}
              createSubscription={createSubscription}
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
