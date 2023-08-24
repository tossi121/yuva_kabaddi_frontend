import React from 'react';
import dynamic from 'next/dynamic';

const MyProfile = dynamic(import('@/components/MyProfile/MyProfile'));


function DefaultPage() {
  return (
    <>
      <MyProfile />
    </>
  );
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
