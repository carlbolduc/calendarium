import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { useLoc } from '../../services/Loc';
import Header from '../../components/Header/Header';
import SignUp from '../Auth/SignUp';
import SignIn from '../Auth/SignIn';
import ForgotPassword from '../Auth/ForgotPassword';
import Home from '../Home/Home';
import Profile from '../Account/Profile';
import Subscription from '../Account/Subscription';
import MyEvents from '../Events/MyEvents';
import MyCalendars from '../Calendars/MyCalendars';
import PublicCalendars from '../Calendars/PublicCalendars';



export default function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null);
  const [account, setAccount] = useState({name: '', email: '', languageId: 1});
  const [languages, setLanguages] = useState([]);
  const [messages, setMessages] = useState([]);
  const { getLocData, translate } = useLoc(account, languages);
  // const api = Api(signOut);

  useEffect(() => {
    getLocData();
    getLanguages();
  }, [])

  useEffect(() => {
    if (authenticated) {
      getAccount();
    }
  }, [authenticated])

  function signIn(data) {
    localStorage.setItem('token', data.token);
    setAuthenticated(true);
  }

  function signOut(e) {
    if (e) { e.preventDefault(); }
    localStorage.removeItem('token');
    setAuthenticated(false);
  }

  function getLanguages() {
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${process.env.REACT_APP_API}/loc/languages`,
    }).then(res => {
      setLanguages(res.data);
    })
  }

  function getAccount() {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts`,
      }).then(res => {
        setAccount(res.data);
      });
    }
  }

  function signUp(data, cb) {
    // set currently active locale as the language id for the new account
    data["languageId"] = account.languageId;
    axios.post(`${process.env.REACT_APP_API}/auth/sign-up`, data).then(res => {
      localStorage.setItem("token", res.data.token);
      setAuthenticated(true);
      getAccount();
      cb();
    }).catch(err => {
      const error = {id: uuidv4(), scene: 'SignUp', type: 'error', message: err.message};
      setMessages(messages.concat([error]));
      cb();
    });
  }

  function updateAccount(data, cb) {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const updatedAccount = {...account};
      const keys = Object.keys(data);
      for (let key of keys) {
        updatedAccount[key] = data[key];
      }
      axios({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts/${account.accountId}`,
        data: updatedAccount
      }).then(res => {
        setAccount(res.data);
        if (cb) cb();
      }).catch(err => {
        const error = {id: uuidv4(), scene: 'Profile', type: 'error', message: err.message};
        setMessages(messages.concat([error]));
        if (cb) cb();
      });
    }
  }

  function switchLanguage(languageId) {
    if (authenticated) {
      updateAccount({languageId: languageId });
    } else {
      setAccount({languageId: languageId});
    }
  }

  function clearMessage(id) {
    setMessages(messages.filter(m => m.id !== id));
  }

  function clearMessages(scene) {
    setMessages(messages.filter(m => m.scene !== scene));
  }

  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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
              messages={messages.filter(m => m.scene === 'SignUp')}
              clearMessage={clearMessage}
              clearMessages={() => clearMessages('SignUp')}
            />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword
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
              messages={messages.filter(m => m.scene === 'Profile')}
              clearMessage={clearMessage}
              clearMessages={() => clearMessages('Profile')}
            />
          </Route>
          <Route path="/subscription">
            <Subscription
              account={account}
              setAccount={setAccount}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/my-events">
            <MyEvents
              account={account}
              setAccount={setAccount}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/my-calendars">
            <MyCalendars
              account={account}
              setAccount={setAccount}
              authenticated={authenticated}
              translate={translate}
            />
          </Route>
          <Route path="/public-calendars">
            <PublicCalendars
              account={account}
              setAccount={setAccount}
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