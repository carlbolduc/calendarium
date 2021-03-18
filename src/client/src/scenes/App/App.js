import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import { useLoc } from "../../services/LocHook";
import { useAuth } from "../../services/AuthHook";
import { useSubscription } from "../../services/SubscriptionHook";
import { useCalendar } from "../../services/CalendarHook";
import { useEvent } from "../../services/EventHook";
import { useCollaborator } from "../../services/CollaboratorHook";
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
import AcceptInvitation from "../Calendars/AcceptInvitation";
import Footer from '../../components/Footer/Footer';
import Embed from "../Embed/Embed";

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
    resetPassword,
    saveToken
  } = useAuth();
  const { getLocData, translate, language } = useLoc(account, languages);
  const { customerCreated, subscribed, createCustomer, createSubscription, updateSubscription } = useSubscription(token, account, getAccount);
  const { calendars, calendar, getCalendars, getCalendar, createCalendar, updateCalendar, deleteCalendar, calendarEvents, getCalendarEvents, getCalendarEmbedEvents, clearCalendarEvents } = useCalendar(token, subscribed);
  const { events, createEvent, updateEvent, deleteEvent, searchEvents } = useEvent(token);
  const { collaborators, calendarAccess, getCalendarCollaborators, inviteCollaborator, getCalendarInvitation, acceptCalendarInvitation, deactivateCalendarAccess, activateCalendarAccess } = useCollaborator(token, saveToken);

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
    <Router>
      <Switch>
        <Route exact path="/embed/:id">
          <Embed
            calendar={calendar}
            getCalendar={getCalendar}
            calendarEvents={calendarEvents}
            getCalendarEvents={getCalendarEmbedEvents}
            language={language}
            translate={translate}
          />
        </Route>
        <Route>
          <header>
            <Header
              languages={languages}
              languageId={account.languageId}
              authenticated={authenticated}
              translate={translate}
              signOut={signOut}
              switchLanguage={switchLanguage}
            />
          </header>
          <main id="main-container" className="container flex-shrink-0">
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
              <Route exact path="/:link/accept-invitation">
                <AcceptInvitation
                  account={account}
                  authenticated={authenticated}
                  translate={translate}
                  language={language}
                  calendar={calendar}
                  getCalendar={getCalendar}
                  calendarAccess={calendarAccess}
                  getCalendarInvitation={getCalendarInvitation}
                  acceptCalendarInvitation={acceptCalendarInvitation}
                />
              </Route>
              <Route exact path="/:link">
                <Calendar
                  account={account}
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
                  clearCalendarEvents={clearCalendarEvents}
                  createEvent={createEvent}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  events={events}
                  searchEvents={searchEvents}
                  collaborators={collaborators}
                  getCalendarCollaborators={getCalendarCollaborators}
                  inviteCollaborator={inviteCollaborator}
                  deactivateCalendarAccess={deactivateCalendarAccess}
                  activateCalendarAccess={activateCalendarAccess}
                />
              </Route>
              <Route path="/">
                <Home
                  authenticated={authenticated}
                  translate={translate}
                />
              </Route>
            </Switch>
          </main>
          <Footer translate={translate} />
        </Route>
      </Switch>
    </Router>
  );
}
