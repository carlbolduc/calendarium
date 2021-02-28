import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from "axios";
import {useLoc} from "../../services/Loc";
import {useAuth} from "../../services/Auth";
import {useSubscription} from "../../services/Subscription";
import {useCalendar} from "../../services/Calendar";
import {useEvent} from "../../services/Event";
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
import Calendar from "../Calendars/Calendar";

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
  const { getLocData, translate, language } = useLoc(account, languages);
  const {customerCreated, subscribed, createCustomer, createSubscription, updateSubscription} = useSubscription(token, account, getAccount);
  const {calendars, calendar, getCalendars, getCalendar, createCalendar, updateCalendar, deleteCalendar} = useCalendar(token, subscribed);
  const {events, getEvents, createEvent} = useEvent(token);

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
          <Route exact path="/sign-in">
            <SignIn
              signIn={signIn}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route exact path="/sign-up">
            <SignUp
              signUp={signUp}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword
              createPasswordReset={createPasswordReset}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route exact path="/password-resets/:id">
            <PasswordReset
              resetPassword={resetPassword}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route exact path="/profile">
            <Profile
              account={account}
              updateAccount={updateAccount}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route exact path="/subscription">
            <Subscription
              account={account}
              authenticated={authenticated}
              translate={translate}
              customerCreated={customerCreated}
              subscribed={subscribed}
              createCustomer={createCustomer}
              createSubscription={createSubscription}
              updateSubscription={updateSubscription}
            />
          </Route>
          <Route exact path="/my-events">
            <MyEvents
              account={account}
              authenticated={authenticated}
              translate={translate}
              events={events}
              getEvents={getEvents}
              createEvent={createEvent}
            />
          </Route>
          <Route exact path="/my-calendars">
            <MyCalendars
              account={account}
              authenticated={authenticated}
              subscribed={subscribed}
              translate={translate}
              language={language}
              calendars={calendars}
              getCalendars={getCalendars}
              createCalendar={createCalendar}
            />
          </Route>
          <Route exact path="/public-calendars">
            <PublicCalendars
              account={account}
              authenticated={authenticated}
              translate={translate}
              language={language}
            />
          </Route>
          <Route exact path="/:link">
            <Calendar
              authenticated={authenticated}
              translate={translate}
              language={language}
              calendar={calendar}
              getCalendar={getCalendar}
              subscribed={subscribed}
              updateCalendar={updateCalendar}
              deleteCalendar={deleteCalendar}
              createEvent={createEvent}
            />
          </Route>
          <Route path="/">
            <Home
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
        </Switch>
      </Router>
    </main>
  );
}
