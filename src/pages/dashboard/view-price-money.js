import React from 'react';
import dynamic from 'next/dynamic';

const ViewPriceMoney = dynamic(import('@/components/Player/ViewPriceMoney'));

function DefaultPage() {
  return (
    <>
      <ViewPriceMoney />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
