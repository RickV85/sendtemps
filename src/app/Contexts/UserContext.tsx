'use client';
import { getSession } from 'next-auth/react';
import React, { createContext, useState, useEffect } from 'react';

import { UserLocation } from '../Classes/UserLocation';
import { UserSessionInfo } from '../Interfaces/interfaces';
import { getAllUserLocations } from '../Util/DatabaseApiCalls';

type UserLocationsStatus = 'idle' | 'loading' | 'success' | 'error';

interface UserContextType {
  setUserInfo: React.Dispatch<React.SetStateAction<UserSessionInfo | null | undefined>>;
  setUserLocations: React.Dispatch<React.SetStateAction<UserLocation[] | null>>;
  userInfo: UserSessionInfo | null | undefined;
  userLocations: UserLocation[] | null;
  userLocationsError: string | null;
  userLocationsStatus: UserLocationsStatus;
}

export const UserContext = createContext<UserContextType>({
  setUserInfo: () => {},
  setUserLocations: () => {},
  userInfo: null,
  userLocations: null,
  userLocationsError: null,
  userLocationsStatus: 'idle',
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserSessionInfo | null | undefined>(undefined);
  const [userLocations, setUserLocations] = useState<UserLocation[] | null>(null);
  const [userLocationsError, setUserLocationsError] = useState<string | null>(null);
  const [userLocationsStatus, setUserLocationsStatus] = useState<UserLocationsStatus>('idle');

  useEffect(() => {
    const getUserSessionInfo = async () => {
      try {
        const session = await getSession();
        if (session?.user) {
          setUserInfo(session.user as UserSessionInfo);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Error fetching user session from UserContext:', error);
      }
    };
    getUserSessionInfo();
  }, []);

  useEffect(() => {
    // userInfo starts as undefined, then moves to null if not signed in
    if (userInfo !== undefined && userInfo?.id) {
      const fetchUserLocations = async () => {
        setUserLocationsStatus('loading');
        try {
          const fetchedUserLocs = await getAllUserLocations(userInfo.id);
          if (fetchedUserLocs) {
            setUserLocations(fetchedUserLocs);
          }
          setUserLocationsStatus('success');
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'An unknown error occurred';
          console.error('Error fetching userLocations from UserContext:', error);
          setUserLocationsError(message);
          setUserLocationsStatus('error');
        }
      };
      fetchUserLocations();
    } else if (userInfo === null) {
      setUserLocations([]);
      setUserLocationsStatus('success');
    }
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        setUserInfo,
        setUserLocations,
        userInfo,
        userLocations,
        userLocationsError,
        userLocationsStatus,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
