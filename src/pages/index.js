import { useAuth } from '@/_context/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isContextLoaded, isLoggedIn } = useAuth();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     router.push('/dashboard');
  //   } else {
  //     router.push('/login');
  //   }
  // }, [isContextLoaded, isLoggedIn, router]);

  return <></>;
}
