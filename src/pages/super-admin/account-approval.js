import React from 'react';
import dynamic from 'next/dynamic';

const AccountApproval = dynamic(import('@/components/SuperAdmin/AccountApproval'));

function DefaultPage() {
  return (
    <>
      <AccountApproval />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
