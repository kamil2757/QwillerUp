import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // async function UpdateTokens() {
  //   console.log("Ошибка"); тут будет логика получение нового access токена
  // }

  // useEffect(() => {
  //   console.log(userData)
  // }, [userData]);

  // async function GetUser() {
  //   try {
  //     console.log(localStorage);
  //     const response = await fetch(
  //       "http://127.0.0.1:8000/api/users/userInfo/",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access")}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     setUserData(data);
  //     console.log(userData);
  //   } catch (err) {
  //     console.log("Ошибка");
  //   }
  // }

  // useEffect(() => {
  //   GetUser();
  // }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
