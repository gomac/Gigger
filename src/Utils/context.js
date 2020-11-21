import React, {useContext, useEffect, useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import auth from '@react-native-firebase/auth';

export const AuthContext = React.createContext(null);

// user loaded in a context for easy access
const AuthProvider = ({children}) => {
  const [newUser, setNewUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(null);
  const [authError, setAuthError] = useState(null);

  // set up the listener
  const [user, loading, error] = useAuthState(auth());

  // update the user when the listener detects a change of user
  useEffect(() => {
    if (user !== null && user._user !== 'undefined') {
      setNewUser(user._user);
    } else {
      setNewUser(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        newUser,
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
