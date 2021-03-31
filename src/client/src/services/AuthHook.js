import {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {errorCallback} from "./Helpers";

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [account, setAccount] = useState(emptyAccount());
  const authenticated = token !== null;

  function emptyAccount() {
    return {accountId: null, name: "", email: "", languageId: 1, stripeCusId: null, createdAt: new Date().getTime() / 1000, subscription: null};
  }

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

  function signOut() {
    localStorage.removeItem("token");
    setAccount(emptyAccount());
    setToken(null);
  }

  const updateAccount = useCallback((data, cb) => {
    // TODO: check usage of this function, it can cause loops since it updates account and is triggered by account
    // TODO: split in different update functions
    if (token !== null) {
      const updatedAccount = {
        name: data["name"] === undefined || data["name"] === "" ? account.name : data["name"],
        email: data["email"] === undefined || data["email"] === "" ? account.email : data["email"],
        currentPassword: data["currentPassword"] === undefined ? null : data["currentPassword"],
        newPassword: data["newPassword"] === undefined ? null : data["newPassword"],
        languageId: data["languageId"] === undefined ? account.languageId : data["languageId"],
      };
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
    }
  }, [token, account.accountId, account.name, account.email, account.languageId]);

  const updateAccountLanguageId = useCallback((languageId, cb) => {
      if (languageId !== account.languageId) {
        const updatedAccount = {
          name: account.name,
          email: account.email,
          currentPassword: null,
          newPassword: null,
          languageId: languageId,
        };
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
          const updatedAccount = { ...account };
          account.languageId = languageId;
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
