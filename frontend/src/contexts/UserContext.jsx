import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true)

  async function GetUser() {
    setLoading(true)
    setAuthorized(false);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/userInfo/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setUserData(data);
        console.log("Успешный вход");
        setAuthorized(true);
        setLoading(false)
      } else {
        console.log("Неуспешный вход");
        console.log(response);
        UpdateTokens(GetUser);
      }
    } catch (err) {
      console.log("Ошибка");
      setLoading(false)
      console.log(err);
    }
  }

  useEffect(() => {
    GetUser();
  }, []);

  async function UpdateTokens(callbackF = null) {
    setLoading(true)
    console.log("Обновление токена access");
    try {
      const refresh = localStorage.getItem("refresh_token");
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
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
