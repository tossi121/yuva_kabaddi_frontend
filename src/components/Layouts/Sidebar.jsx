import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBank, faUserCheck, faUserEdit, faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '@/_context/authContext';

const commonLinks = [
  { href: '/dashboard', label: 'Dashboard', iconSrc: faUsersGear },
  { href: '/dashboard/view-price-money', label: 'View Price Money', iconSrc: faMoneyBillAlt },
  { href: '/dashboard/profile', label: 'My Profile', iconSrc: faUserEdit },
];

const sidebarLinks = {
  PLAYER: [...commonLinks],
  SUPER_ADMIN: [
    { href: '/super-admin/dashboard', label: 'Dashboard', iconSrc: faUsersGear },
    { href: '/super-admin/users', label: 'Users Approval', iconSrc: faUsersGear },
    { href: '/super-admin/withdrawal-approval', label: 'Withdrawal Approval', iconSrc: faBank },
    { href: '/super-admin/account-approval', label: 'Account Approval', iconSrc: faUserCheck },
  ],
  COACH: [...commonLinks],
};

function SidebarLink({ href, label, iconSrc }) {
  const router = useRouter();
  const isActive = router.asPath === href ? 'active' : '';

  return (
    <li className="nav-item position-relative">
      <Link href={href}>
        <div className={`nav-link fs-16 fw-500 base-color-2 ${isActive}`}>
          <FontAwesomeIcon icon={iconSrc} width={21} height={21} className="me-3" />
          {label && <span className="text-nowrap">{label}</span>}
        </div>
      </Link>
    </li>
  );
}

function Sidebar({ toggle, ToggleFun, toggleResponsive }) {
  const { role } = useAuth();
  const links = sidebarLinks[role] || [];

  return (
    <section
      className={`sidebar-section bg-white position-fixed ${!toggle ? 'sidebar-sm' : ''} ${
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
          {links.map(({ href, label, iconSrc }) => (
            <SidebarLink key={href} href={href} label={toggle ? label : ''} iconSrc={iconSrc} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
