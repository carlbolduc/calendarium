import {useState, useEffect} from "react";
import axios from "axios";

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
      saveToken(res.data.token);
      if (cb) {
        const result = {
          success: true,
          message: "Account created successfully."
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }

  function signIn(data, cb) {
    const base64StringOfUserColonPassword = btoa(`${data.email}:${data.password}`);
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API}/auth/sign-in`,
      headers: {
        Authorization: 'Basic ' + base64StringOfUserColonPassword,
      },
    }).then(res => {
        if (res.status === 200) {
          saveToken(res.data.token)
        } else {
          // authentication failed
        }
      }).catch(err => {
        errorCallback(err, cb);
      });
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
            message: "Profile successfully updated."
          }
          cb(result);
        }
      }).catch(err => {
        errorCallback(err, cb);
      });
    } else {
      setAccount(updatedAccount);
    }
  }

  function createPasswordReset(data, cb) {
    axios.post(`${process.env.REACT_APP_API}/auth/password-resets`, data).then(() => {
      if (cb) {
        const result = {
          success: true,
          message: "Password reset requested successfully."
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }

  function resetPassword(data, cb) {
    axios.put(`${process.env.REACT_APP_API}/auth/password-resets/${data.id}`, {
      id: data.id,
      password: data.password
    }).then(res => {
      saveToken(res.data.token);
      if (cb) {
        const result = {
          success: true,
          message: "Password has been reset successfully."
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }

  function errorCallback(err, cb) {
    if (cb) {
      const result = {
        success: false,
        message: err.message,
        errorCode: err.response.status
      }
      cb(result);
    }
  }

  function saveToken(token) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  return {account, authenticated, signUp, signIn, signOut, updateAccount, createPasswordReset, resetPassword};
}
