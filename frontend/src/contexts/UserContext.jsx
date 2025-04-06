import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true)
  const domain = 'qwillerup-production.up.railway.app'
  const protocol = 'https'

  // const domain = '127.0.0.1:8000'
  // const protocol = 'http'

  async function GetUser() {
    setLoading(true)
    setAuthorized(false);
    try {
      const response = await fetch(
        `${protocol}://${domain}/api/users/userInfo/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      
      const data = await response.json();

      if (response.ok) {
        setUserData(data)
        setAuthorized(true);
        setLoading(false)
      } else {
        UpdateTokens(GetUser);
      }
    } catch (err) {
      setLoading(false)
      console.log(err);
    }
  }

  useEffect(() => {
    GetUser();
  }, []);

  async function UpdateTokens(callbackF = null) {
    setLoading(true)
    console.log('рефреш делаем')
    try {
      const refresh = localStorage.getItem("refresh_token");
      const response = await fetch(
        `${protocol}://${domain}/api/users/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log('рефреш удался')

        localStorage.setItem("access_token", data["access"]);
        if (!(callbackF == null)) {
          await callbackF();
        }
      } else {
        if (
          window.location.pathname != "/login" &&
          window.location.pathname != "/" &&
          window.location.pathname != "/registration"
        ) {
          setAuthorized(false);
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setAuthorized(false);
          return;
        }
      }
    } catch (err) {
      console.log(localStorage.getItem("refresh_token"))
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        authorized,
        setAuthorized,
        UpdateTokens,
        GetUser,
        loading,
        domain,
        protocol
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
