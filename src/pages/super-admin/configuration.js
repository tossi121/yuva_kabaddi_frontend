import React from 'react';
import dynamic from 'next/dynamic';

const Configuration = dynamic(import('@/components/SuperAdmin/Configuration'));

function DefaultPage() {
  return (
    <>
      <Configuration />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default (DefaultPage);
