import React from "react";
import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{userData, setUserData}}>{children}</UserContext.Provider>
  );
};

export default UserContext;
