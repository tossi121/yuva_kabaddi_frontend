import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const EditUser = dynamic(import('@/components/SuperAdmin/EditUser'));

function DefaultPage() {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <EditUser id={id?.[0]} />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
