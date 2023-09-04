import React from 'react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const Sidebar = dynamic(import('./Sidebar'));
const Topbar = dynamic(import('./Topbar'));

function DashboardLayout(props) {
  const { children } = props;

  const [isSidebar, setisSidebar] = useState(true);
  const [toggleResponsive, setToggleResponsive] = useState(true);
  const [responsiveSidebar, setResponsiveSidebar] = useState(false);

  function SidebarToggle() {
    setisSidebar(!isSidebar);
    setToggleResponsive(!toggleResponsive);
  }
  function responsiveToggle() {
    setToggleResponsive(!toggleResponsive);
  }

  return (
    <>
      {/* {(isLoggedIn && ( */}
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Topbar ToggleFun={SidebarToggle} />
        <div className="d-flex h-100 layout-wrapper w-100">
          <Sidebar
            responisveToggle={responsiveSidebar}
            setResponsiveSidebar={setResponsiveSidebar}
            toggle={isSidebar}
            ToggleFun={SidebarToggle}
            setisSidebar={setisSidebar}
            responsiveToggle={responsiveToggle}
            toggleResponsive={toggleResponsive}
            setToggleResponsive={setToggleResponsive}
          />
          <div
            className={`dashboard-content-section ms-auto py-4 px-md-3 px-2 ${
              (!isSidebar && 'dashboard-content-sm') || ''
            }`}
          >
            {children}
          </div>
        </div>
      </>
      {/* )) ||
        ''} */}
    </>
  );
}
export default DashboardLayout;
