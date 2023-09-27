import React from 'react';
import dynamic from 'next/dynamic';

const AddUser = dynamic(import('@/components/SuperAdmin/AddUser'));

function DefaultPage() {
  return <AddUser />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
