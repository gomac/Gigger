import React, {createContext, useContext, useEffect, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext(null);

// user loaded in a context for easy access
const AuthProvider = ({children}) => {
  // set up the listener
  const [user, loading, error] = useAuthState(auth());

  const [currentUser, setCurrentUser] = useState(user?._user);
  const [authLoading] = useState(loading);
  const [authError] = useState(error);

  // update the user when the listener detects a change of user
  useEffect(() => {
    if (user !== null && user._user !== 'undefined') {
      setCurrentUser(user._user);
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authLoading,
        authError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth is used by components under an AuthProvider to access
// the auth context value.
const useAuth = () => {
  const authFromContext = useContext(AuthContext);
  // has to be called under AuthProvider tag
  if (authFromContext == null) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return authFromContext;
};

export {AuthProvider, useAuth};
