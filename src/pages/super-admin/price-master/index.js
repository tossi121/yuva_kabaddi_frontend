import React from 'react';
import dynamic from 'next/dynamic';

const PriceMaster = dynamic(import('@/components/SuperAdmin/PriceMaster'));

function DefaultPage() {
  return (
    <>
      <PriceMaster />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
