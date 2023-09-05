import React from 'react';
import dynamic from 'next/dynamic';

const AddTds = dynamic(import('@/components/SuperAdmin/AddTds'));

function DefaultPage() {
  return (
    <>
      <AddTds />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
