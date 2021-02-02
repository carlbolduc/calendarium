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



export default function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null);
  const [account, setAccount] = useState({languageId: 1});
  const [languages, setLanguages] = useState([]);
  const { getLocData, translate } = useLoc(account, languages);
  // const api = Api(signOut);

  useEffect(() => {
     //TODO: bug - after signing in, the state doesn't contain the account, we need to reload the page for it to be in the state
    getLocData();
    getLanguages();
  }, [])

  useEffect(() => {
    if (authenticated) {
      getUser();
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

  function getUser() {
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

  function updateAccount(data) {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts/${account.accountId}`,
        data: data
      }).then(res => {
        setAccount(res.data);
      });
    }
  }

  function switchLanguage(languageId) {
    const data = {
      name: account.name,
      email: account.email,
      languageId: languageId
    };
    updateAccount(data);
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
              signIn={signIn}
              authenticated={authenticated}
              translate={translate}
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
              setAccount={setAccount}
              authenticated={authenticated}
              translate={translate}
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