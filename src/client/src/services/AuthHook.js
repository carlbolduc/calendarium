import {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {errorCallback} from "./Helpers";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [account, setAccount] = useState({accountId: null, name: "", email: "", languageId: 1, stripeCusId: null, createdAt: new Date().getTime() / 1000, subscription: null});
  const authenticated = token !== null;

  const saveToken = useCallback((token) => {
    localStorage.setItem("token", token);
    setToken(token);
  }, []);

  const getAccount = useCallback(() => {
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
  }, [token]);

  useEffect(() => {
    if (token !== null) {
      getAccount();
    }
  }, [token, getAccount]);

  const signUp = useCallback((data, cb) => {
    // set currently active locale as the language id for the new account
    data["languageId"] = account.languageId;
    axios.post(`${process.env.REACT_APP_API}/auth/sign-up`, data).then(res => {
      saveToken(res.data.token);
      if (cb) {
        const result = {
          success: true
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }, [account.languageId, saveToken]);

  const signIn = useCallback((data, cb) => {
    const base64StringOfUserColonPassword = btoa(`${data.email}:${data.password}`);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API}/auth/sign-in`,
      headers: {
        Authorization: "Basic " + base64StringOfUserColonPassword,
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
  }, [saveToken]);

  function signOut(e) {
    if (e) {
      e.preventDefault();
    }
    localStorage.removeItem("token");
    setToken(null);
  }

  const updateAccount = useCallback((data, cb) => {
    // TODO: check usage of this function, it can cause loops since it updates accout and is triggered by account
    const updatedAccount = {
      accountId: account.accountId,
      name: data["name"] === undefined ? account.name : data["name"],
      email: data["email"] === undefined ? account.email : data["email"],
      languageId: data["languageId"] === undefined ? account.languageId : data["languageId"],
      stripeCusId: account.stripeCusId,
      createdAt: account.createdAt,
      subscription: account.subscription
    };
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
            success: true
          }
          cb(result);
        }
      }).catch(err => {
        errorCallback(err, cb);
      });
    } else {
      setAccount(updatedAccount);
    }
  }, [token, account.accountId, account.name, account.email, account.languageId, account.stripeCusId, account.createdAt, account.subscription]);

  const updateAccountLanguageId = useCallback((languageId, cb) => {
      if (languageId !== account.languageId) {
        const updatedAccount = { ...account };
        updatedAccount.languageId = languageId;
        if (token !== null) {
          axios({
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            url: `${process.env.REACT_APP_API}/accounts/${account.accountId}`,
            data: updatedAccount,
          })
            .then((res) => {
              setAccount(res.data);
              if (cb) {
                const result = {
                  success: true,
                };
                cb(result);
              }
            })
            .catch((err) => {
              errorCallback(err, cb);
            });
        } else {
          setAccount(updatedAccount);
        }
      }
    },
    [token, account]
  );

  const createPasswordReset = useCallback((data, cb) => {
    axios.post(`${process.env.REACT_APP_API}/auth/password-resets`, data).then(() => {
      if (cb) {
        const result = {
          success: true
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }, []);

  const resetPassword = useCallback((data, cb) => {
    axios.put(`${process.env.REACT_APP_API}/auth/password-resets/${data.id}`, {
      id: data.id,
      password: data.password
    }).then(res => {
      saveToken(res.data.token);
      if (cb) {
        const result = {
          success: true
        }
        cb(result);
      }
    }).catch(err => {
      errorCallback(err, cb);
    });
  }, [saveToken]);



  return {token, account, authenticated, signUp, signIn, signOut, getAccount, updateAccount, updateAccountLanguageId, createPasswordReset, resetPassword, saveToken};
}
