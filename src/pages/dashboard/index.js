import React from 'react';
import dynamic from 'next/dynamic';

const Dashboard = dynamic(import('@/components/Player/Dashboard'));

function DefaultPage() {
  return <Dashboard />;
}
DefaultPage.layout = 'DashboardLayout';
export default DefaultPage;
