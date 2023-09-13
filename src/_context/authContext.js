import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUserDetails } from '@/_services/services_api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    handleUser();
  }, [isLoggedIn]);

  async function handleUser() {
    if (role == 'PLAYER' || role == 'COACH') {
      const res = await getCurrentUserDetails();
      if (res?.status) {
        setCurrentUser(res?.data);
      }
    }
  }

  const checkUserAuthentication = async () => {
    const token = Cookies.get('token');
    const isAuthenticated = !!token;
    setIsLoggedIn(isAuthenticated);
    return isAuthenticated;
  };

  const redirectToCorrectRoute = async () => {
    const currentPath = router.pathname;
    setRole(Cookies.get('role'));
    const isAuthenticated = await checkUserAuthentication();

    if (isAuthenticated) {
      if (currentPath === '/signup' || currentPath === '/login') {
        router.push('/');
      }
    } else {
      if (currentPath !== '/signup' && currentPath !== '/login') {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    redirectToCorrectRoute();
  }, [role, router, currentUser]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, currentUser, handleUser, checkUserAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
