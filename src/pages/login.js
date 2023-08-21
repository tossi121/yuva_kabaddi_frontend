import React from 'react';
import dynamic from 'next/dynamic';

const Login = dynamic(import('@/components/Registration/Login'));

function DefaultPage() {
  return (
    <>
      <Login />
    </>
  );
}
export default DefaultPage;
