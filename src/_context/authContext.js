import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [user, setUser] = useState('');
  const router = useRouter();

  const checkUserAuthentication = async () => {
    const token = Cookies.get('token');
    const isAuthenticated = !!token;
    setIsLoggedIn(isAuthenticated);
    return isAuthenticated;
  };
  
  const redirectToCorrectRoute = async () => {
    const currentPath = router.pathname;
    setRole(Cookies.get('role'));
    setUser(Cookies.get('user'));
  
    const isAuthenticated = await checkUserAuthentication();
  
    if (isAuthenticated && role) {
      if (currentPath === '/signup' || currentPath === '/login') {
        router.push('/');
      }
    } else if (currentPath !== '/signup' && currentPath !== '/login') {
      router.push('/login');
    }
  };
  

  useEffect(() => {
    redirectToCorrectRoute();
  }, [role, user, router]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, user, checkUserAuthentication }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
