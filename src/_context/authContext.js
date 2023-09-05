import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  async function checkUserAuthentication() {
    const token = Cookies.get('token');
    const isAuthenticated = !!token;
    setIsLoggedIn(isAuthenticated);
    return isAuthenticated;
  }

  useEffect(() => {
    async function redirectToCorrectRoute() {
      const isAuthenticated = await checkUserAuthentication();
      const currentPath = router.pathname;

      if (!isAuthenticated && (currentPath === '/signup' || currentPath === '/login')) {
        return;
      }

      if (!isAuthenticated) {
        router.push('/login');
      }
    }

    redirectToCorrectRoute();
  }, []);

  return <AuthContext.Provider value={{ isLoggedIn, checkUserAuthentication }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
