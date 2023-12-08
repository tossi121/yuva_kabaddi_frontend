import React from 'react';
import dynamic from 'next/dynamic';

const PriceMasterAdd = dynamic(import('@/components/SuperAdmin/PriceMasterAdd'));

function DefaultPage() {
  return (
    <>
      <PriceMasterAdd />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
