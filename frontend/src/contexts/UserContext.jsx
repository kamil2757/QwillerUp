import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  async function GetUser() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/userInfo/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        console.log('Успешный вход')
        setAuthorized(true)
      } else {
        UpdateTokens(GetUser);
      }
    } catch (err) {
      console.log("Ошибка");
      console.log(err);
    }
  }

  useEffect(() => {
    GetUser();
  }, []);

  async function UpdateTokens(callbackF) {
    try {
      const refresh = localStorage.getItem("refresh");
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/token/refresh/",
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
        console.log(data);
        localStorage.setItem('access', data['access'])
        callbackF()
      } else {
        if (window.location.pathname != "/login"){
          setAuthorized(false)
          localStorage.clear()
          window.location.href = "/login";
        } else {
          return
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <UserContext.Provider value={{ userData, setUserData, authorized, setAuthorized}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
