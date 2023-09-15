import { useAuth } from '@/_context/authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { role } = useAuth();
  useEffect(() => {
    if (role == 'SUPER_ADMIN') {
      router.push('/super-admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  }, [role, router]);

  return <></>;
}
