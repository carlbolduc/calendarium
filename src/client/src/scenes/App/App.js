import React, {useCallback} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {useLoc} from "../../services/LocHook";
import {useAuth} from "../../services/AuthHook";
import {useSubscription} from "../../services/SubscriptionHook";
import {useCalendar} from "../../services/CalendarHook";
import {useEvent} from "../../services/EventHook";
import {useDot} from "../../services/DotHook";
import {useCollaborator} from "../../services/CollaboratorHook";
import Header from "../../components/Header/Header";
import SignIn from "../Auth/SignIn";
import ForgotPassword from "../Auth/ForgotPassword";
import Home from "../Home/Home";
import Profile from "../Account/Profile";
import Subscription from "../Account/Subscription";
import MyCalendars from "../Calendars/MyCalendars";
import PublicCalendars from "../Calendars/PublicCalendars";
import PasswordReset from "../Auth/PasswordReset";
import Calendar from "../Calendars/Calendar";
import AcceptInvitation from "../Calendars/AcceptInvitation";
import Footer from "../../components/Footer/Footer";
import Embed from "../Embed/Embed";

export default function App() {
  const {
    token,
    account,
    authenticated,
    signUpAndSubscribe,
    signIn,
    signUp,
    signOut,
    getAccount,
    updateAccount,
    updateAccountLanguageId,
    updateAccountPassword,
    createPasswordReset,
    resetPassword,
    saveToken
  } = useAuth();
  const { languages, localeId, translate } = useLoc(account);
  const { customerCreated, subscribed, createCustomer, createSubscription, cancelSubscription, reactivateSubscription, createCheckoutSession, updatePaymentMethod, startTrial } = useSubscription(token, account, getAccount);
  const { events, setEvents, createEvent, updateEvent, deleteEvent, searchEvents, clearEvents } = useEvent(token);
  const {
    calendars,
    calendar,
    getCalendars,
    getPublicCalendars,
    clearCalendars,
    getCalendar,
    createCalendar,
    updateCalendar,
    deleteCalendar,
    getCalendarEvents,
    getPublicCalendarEvents,
    clearCalendar
  } = useCalendar(token, subscribed, setEvents);
  const { dots, getDots, getPublicDots } = useDot(token);
  const { collaborators, calendarAccess, getCollaborators, inviteCollaborator, getCalendarInvitation, acceptCalendarInvitation, deactivateCalendarAccess, activateCalendarAccess } = useCollaborator(token, saveToken);

  const switchLanguage = useCallback((languageId) => {
    updateAccountLanguageId(languageId);
  }, [updateAccountLanguageId]);

  function signOutAndClearData(cb) {
    signOut();
    clearCalendars();
    clearCalendar();
    clearEvents();
    cb();
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/embed/:id">
          <Embed
            calendar={calendar}
            getCalendar={getCalendar}
            events={events}
            dots={dots}
            getDots={getPublicDots}
            getCalendarEvents={getPublicCalendarEvents}
            languages={languages}
            localeId={localeId}
            updateAccountLanguageId={updateAccountLanguageId}
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
              signOut={signOutAndClearData}
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
                  updateAccountPassword={updateAccountPassword}
                  authenticated={authenticated}
                  translate={translate}
                  localeId={localeId}
                />
              </Route>
              <Route exact path="/subscription">
                <Subscription
                  account={account}
                  authenticated={authenticated}
                  translate={translate}
                  localeId={localeId}
                  customerCreated={customerCreated}
                  subscribed={subscribed}
                  createCheckoutSession={createCheckoutSession}
                  createCustomer={createCustomer}
                  createSubscription={createSubscription}
                  cancelSubscription={cancelSubscription}
                  reactivateSubscription={reactivateSubscription}
                  startTrial={startTrial}
                  signUp={signUp}
                  signUpAndSubscribe={signUpAndSubscribe}
                  updatePaymentMethod={updatePaymentMethod}
                />
              </Route>
              <Route exact path="/my-calendars">
                <MyCalendars
                  account={account}
                  authenticated={authenticated}
                  subscribed={subscribed}
                  translate={translate}
                  localeId={localeId}
                  calendars={calendars}
                  calendar={calendar}
                  getCalendars={getCalendars}
                  clearCalendars={clearCalendars}
                  createCalendar={createCalendar}
                />
              </Route>
              <Route exact path="/public-calendars">
                <PublicCalendars
                  account={account}
                  authenticated={authenticated}
                  calendars={calendars}
                  getCalendars={getPublicCalendars}
                  translate={translate}
                  localeId={localeId}
                />
              </Route>
              <Route exact path="/:link/accept-invitation">
                <AcceptInvitation
                  account={account}
                  authenticated={authenticated}
                  translate={translate}
                  localeId={localeId}
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
                  localeId={localeId}
                  calendar={calendar}
                  getCalendar={getCalendar}
                  subscribed={subscribed}
                  updateCalendar={updateCalendar}
                  deleteCalendar={deleteCalendar}
                  getCalendarEvents={getCalendarEvents}
                  createEvent={createEvent}
                  updateEvent={updateEvent}
                  deleteEvent={deleteEvent}
                  events={events}
                  searchEvents={searchEvents}
                  dots={dots}
                  getDots={getDots}
                  collaborators={collaborators}
                  getCollaborators={getCollaborators}
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
