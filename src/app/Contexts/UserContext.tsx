"use client";
import React, { createContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { UserSessionInfo } from "../Interfaces/interfaces";
import { UserLocation } from "../Classes/UserLocation";
import { getAllUserLocations } from "../Util/APICalls";

interface UserContextType {
  userInfo: UserSessionInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserSessionInfo | null>>;
  userLocations: UserLocation[] | null;
  setUserLocations: React.Dispatch<React.SetStateAction<UserLocation[] | null>>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: null,
  setUserInfo: () => {},
  userLocations: null,
  setUserLocations: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserSessionInfo | null>(null);
  const [userLocations, setUserLocations] = useState<UserLocation[] | null>(
    null
  );

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

  useEffect(() => {
    if (userInfo && userInfo.id) {
      const fetchUserLocations = async () => {
        try {
          const fetchedUserLocs = await getAllUserLocations(userInfo.id);
          if (fetchedUserLocs) {
            setUserLocations(fetchedUserLocs);
            console.log("UserContext fetch", fetchedUserLocs)
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserLocations();
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, userLocations, setUserLocations }}
    >
      {children}
    </UserContext.Provider>
  );
};
