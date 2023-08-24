import React from 'react';
import dynamic from 'next/dynamic';

const AccountConfirmation = dynamic(import('@/components/SuperAdmin/AccountConfirmation'));

function DefaultPage() {
  return (
    <>
      <AccountConfirmation />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
