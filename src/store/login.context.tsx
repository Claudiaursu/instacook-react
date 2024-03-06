import { createContext, useContext, useState } from "react";
import React from 'react';

interface LoginData {
  username: string;
  password: string;
  userToken: string;
  setLoginData: Function;
}

export const LoginFormContext = createContext<LoginData>({
  username: "",
  password: "",
  userToken: "",
  setLoginData: () => {},
});

export const useLoginFormContext = () => {
  return useContext(LoginFormContext);
};

export const useLoginFormUsername = () => {
  return useContext(LoginFormContext).username;
};

export const LoginFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [{ username, password, userToken }, setLoginData] = useState({
    username: "",
    password: "",
    userToken: ""
  });


  return (
    <LoginFormContext.Provider
      value={{
        username,
        password,
        userToken,
        setLoginData,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
};
