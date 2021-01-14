import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import axios from 'axios';
import { useLoc } from '../../services/Loc';
import Header from '../../components/Header/Header';
import SignUp from '../Auth/SignUp';
import SignIn from '../Auth/SignIn';
import ForgotPassword from '../Auth/ForgotPassword';
import Home from '../Home/Home';
import Profile from '../Account/Profile';



export default function App() {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null);
  const [userAccount, setUserAccount] = useState(false);
  const { getLocData, translate } = useLoc();
  // const api = Api(signOut);

  useEffect(() => {
    getUser();
    getLocData();
  }, [])

  function signIn(data) {
    localStorage.setItem('token', data.token);
    setAuthenticated(true);
  }

  function signOut(e) {
    if (e) { e.preventDefault(); }
    localStorage.removeItem('token');
    setAuthenticated(false);
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
        url: `${process.env.REACT_APP_API}/user-accounts`,
      }).then(res => {
        setUserAccount(res.data);
      })
    }
  }

  return (
    <main className="App">
      <Router>
        <Header
          authenticated={authenticated}
          signOut={signOut}
        />
        <Switch>
          <Route path="/sign-in">
            <SignIn
              signIn={signIn}
              authenticated={authenticated}
            />
          </Route>
          <Route path="/sign-up">
            <SignUp
              signIn={signIn}
              authenticated={authenticated}
            />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword
              authenticated={authenticated}
            />
          </Route>
          <Route path="/profile">
            <Profile
              userAccount={userAccount}
              setUserAccount={setUserAccount}
              authenticated={authenticated}
            />
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </Router>
    </main>
  );
}