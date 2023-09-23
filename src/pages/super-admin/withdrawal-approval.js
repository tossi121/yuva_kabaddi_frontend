import React from 'react';
import dynamic from 'next/dynamic';

const Withdrawal = dynamic(import('@/components/SuperAdmin/Withdrawals'));

function DefaultPage() {
  return (
    <>
      <Withdrawal />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
