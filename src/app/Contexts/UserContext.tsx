"use client";
import React, { createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { UserSessionInfo } from "../Interfaces/interfaces";

interface UserContextType {
  userInfo: UserSessionInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserSessionInfo | null>>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserSessionInfo | null>(null);

  useEffect(() => {
    const getUserSessionInfo = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUserInfo(session.user as UserSessionInfo);
        }
      } catch (error) {
        console.error("Error fetching user session from UserContext:", error);
      }
    };
    getUserSessionInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
