import React, { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  console.log("hello world");

  // async function UpdateTokens() {
  //   console.log("Ошибка"); тут будет логика получение нового access токена
  // }

  // async function GetUser() { тут получение данных польвзаотеля при входе в аккаунт
  //   try {
  //     console.log(localStorage)
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
