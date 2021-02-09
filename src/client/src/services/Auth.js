import {useState, useEffect} from "react";
import axios from "axios";
import {uuidv4} from "./Helpers";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [account, setAccount] = useState({name: "", email: "", languageId: 1});
  const authenticated = token !== null;

  useEffect(() => {
    if (token !== null) {
      getAccount();
    }
  }, [token]);

  function signUp(data, cb) {
    // set currently active locale as the language id for the new account
    data["languageId"] = account.languageId;
    axios.post(`${process.env.REACT_APP_API}/auth/sign-up`, data).then(res => {
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      cb();
    }).catch(err => {
      const error = {id: uuidv4(), scene: "SignUp", type: "error", message: err.message};
      cb();
    });
  }

  function signIn(data) {
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function signOut(e) {
    if (e) {
      e.preventDefault();
    }
    localStorage.removeItem("token");
    setToken(null);
  }

  function getAccount() {
    if (token !== null) {
      axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts`,
      }).then(res => {
        setAccount(res.data);
      }).catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      });
    }
  }

  function updateAccount(data, cb) {
    const updatedAccount = {...account};
    const keys = Object.keys(data);
    for (let key of keys) {
      updatedAccount[key] = data[key];
    }
    if (token !== null) {
      axios({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        url: `${process.env.REACT_APP_API}/accounts/${account.accountId}`,
        data: updatedAccount
      }).then(res => {
        setAccount(res.data);
        if (cb) {
          const result = {
            success: true,
            message: "Profile successfully updated"
          }
          cb(result);
        }
      }).catch(err => {
        if (cb) {
          const result = {
            success: false,
            message: err.message
          }
          cb(result);
        }
      });
    } else {
      setAccount(updatedAccount);
    }
  }

  function createPasswordReset(data, cb) {
    axios.post(`${process.env.REACT_APP_API}/auth/password-resets`, data).then(() => {
      const success = {id: uuidv4(), scene: "ForgotPassword", type: "success", message: "Bravo"};
      cb();
    }).catch(err => {
      const error = {id: uuidv4(), scene: "ForgotPassword", type: "error", message: err.message};
      if (cb) cb();
    });
  }

  return {account, authenticated, signUp, signIn, signOut, getAccount, updateAccount, createPasswordReset};
}
