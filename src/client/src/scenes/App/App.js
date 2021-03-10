import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useLoc } from "../../services/Loc";
import { useAuth } from "../../services/Auth";
import { useSubscription } from "../../services/Subscription";
import { useCalendar } from "../../services/Calendar";
import { useEvent } from "../../services/Event";
import { useCollaborator } from "../../services/Collaborator";
import Header from "../../components/Header/Header";
import SignUp from "../Auth/SignUp";
import SignIn from "../Auth/SignIn";
import ForgotPassword from "../Auth/ForgotPassword";
import Home from "../Home/Home";
import Profile from "../Account/Profile";
import Subscription from "../Account/Subscription";
import MyCalendars from "../Calendars/MyCalendars";
import PublicCalendars from "../Calendars/PublicCalendars";
import PasswordReset from "../Auth/PasswordReset";
import Calendar from "../Calendars/Calendar";
import Terms from "../Static/Terms";
import Privacy from "../Static/Privacy";

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
  const { customerCreated, subscribed, createCustomer, createSubscription, updateSubscription } = useSubscription(token, account, getAccount);
  const { calendars, calendar, getCalendars, getCalendar, createCalendar, updateCalendar, deleteCalendar, calendarEvents, getCalendarEvents } = useCalendar(token, subscribed);
  const { events, createEvent, updateEvent, deleteEvent, searchEvents } = useEvent(token);
  const { collaborators, getCalendarCollaborators, inviteCollaborator } = useCollaborator(token);

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
    updateAccount({ languageId: languageId });
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
        <div className="container">
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
            <Route exact path="/password-reset">
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
                language={language}
              />
            </Route>
            <Route exact path="/terms">
              <Terms
                language={language}
              />
            </Route>
            <Route exact path="/privacy">
              <Privacy
                language={language}
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
                calendarEvents={calendarEvents}
                getCalendarEvents={getCalendarEvents}
                createEvent={createEvent}
                updateEvent={updateEvent}
                deleteEvent={deleteEvent}
                events={events}
                searchEvents={searchEvents}
                collaborators={collaborators}
                getCalendarCollaborators={getCalendarCollaborators}
                inviteCollaborator={inviteCollaborator}
              />
            </Route>
            <Route path="/">
              <Home
                authenticated={authenticated}
                translate={translate}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    </main>
  );
}
