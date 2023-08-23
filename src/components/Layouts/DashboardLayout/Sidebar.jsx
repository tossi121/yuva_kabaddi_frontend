import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

function SidebarLink({ href, label, iconSrc }) {
  const router = useRouter();
  const isActive = router.asPath === href ? 'active' : '';

  return (
    <li className="nav-item position-relative">
      <Link href={href}>
        <div className={`nav-link fs-16 fw-500 base-color-2 d-flex align-items-center ${isActive}`}>
          <Image src={iconSrc} width={20} height={20} className="sidebar-icons me-4" alt="sidebar-img" />
          <span className="text-nowrap">{label}</span>
        </div>
      </Link>
    </li>
  );
}

function Sidebar(props) {
  const { toggle, ToggleFun, toggleResponsive, setToggleResponsive } = props;

  return (
    <section
      className={`sidebar-section bg-white position-fixed  ${toggle || 'sidebar-sm'} ${
        toggleResponsive ? 'hide-sidebar' : 'full-width'
      }`}
    >
      <div className="menu-wrapper position-relative">
        <span
          className={`btn-expanded card-border rounded-circle position-absolute justify-content-center p-2 bg-white  d-lg-flex d-none cursor-pointer`}
          onClick={ToggleFun}
        >
          <Image
            src="/images/team-roster/arrow-right.svg"
            width={20}
            height={20}
            className={`img-fluid ${toggle ? 'arrow-left-icon' : ''}`}
            alt="arrow-right"
          />
        </span>
        <ul className="navbar-nav px-3 py-3 vh-100">
          <SidebarLink href="/dashboard" label="Dashboard" iconSrc="/images/dashboard-icons/Dashboard.svg" />
          <SidebarLink href="/dashboard/profile" label="My Profile" iconSrc="/images/dashboard-icons/profiles.svg" />
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
