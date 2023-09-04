import React from 'react';
import dynamic from 'next/dynamic';

const Signup = dynamic(import('@/components/Player/Signup'));

function DefaultPage() {
  return (
    <>
      <Signup />
    </>
  );
}
export default DefaultPage;
