import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isContextLoaded, setIsContextLoaded] = useState(true);

  const router = useRouter();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push('/dashboard');
  //     getUserData();
  //   } else {
  //     router.push('/login');
  //   }
  // }, [isContextLoaded, isLoggedIn]);

  function getUserData() {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      setIsContextLoaded(true);
    } else {
      setIsLoggedIn(false);
      setIsContextLoaded(true);
    }
  }

  return <AuthContext.Provider value={{ getUserData, isContextLoaded, isLoggedIn }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
