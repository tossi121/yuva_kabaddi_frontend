import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useAuth } from '@/_context/authContext';

function Topbar(props) {
  const { ToggleFun } = props;
  const router = useRouter();
  const { currentUser } = useAuth();
  const user = currentUser?.user_name;
  const userRole = currentUser?.user_role;
  const profileImg = currentUser?.profile_image;

  function logout() {
    Cookies.remove('yuva_kabaddi_token');
    Cookies.remove('yuva_kabaddi_role');
    router.push('/login');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }
  return (
    <>
      <div className="w-100 top-bar position-sticky top-0 bg-white">
        <Row className="mx-0 h-100 align-items-center">
          <Col lg={'12'}>
            <div className="d-flex align-items-center">
              <div className="d-flex justify-content-center logo-wrapper align-items-center">
                <Link href={'/'}>
                  <Image src="/images/logo.png" alt="logo" width={110} height={54} />
                </Link>
              </div>
              <button className="bg-transparent border-0  pt-2 toggle-btn d-lg-none d-block ms-auto">
                <Image
                  src="/images/dashboard-icons/toggle.svg"
                  onClick={ToggleFun}
                  width={26}
                  height={26}
                  alt="toggle-img"
                />
              </button>
              <div className="ms-auto  d-lg-block d-none me-3">
                <ul className="ps-0 mb-0 d-flex flex-row align-items-center navbar-nav py-0">
                  <li className="nav-item position-relative">
                    <div className="d-flex">
                      <div className="circular-image-top me-1">
                        <Image
                          src={profileImg || '/images/user.png'}
                          alt="image"
                          width={100}
                          height={100}
                          className="rounded-circle circular-image"
                        />
                      </div>

                      <div className="ms-2">
                        <span className="base-color fw-700 fs-14 text-capitalize">{user || 'Super Admin'}</span>
                        <div className="profile">
                          <Dropdown className="px-0 py-0 rounded-2">
                            <Dropdown.Toggle
                              variant="none"
                              className="text-start profile-box-dropdown base-color-3 bg-white p-0 border-0 d-flex align-items-center fs-12 fw-400 base-color-9"
                              id="dropdown-basic"
                            >
                              <span className="pe-3">{userRole || 'Super Admin'}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 rounded-4">
                              {!userRole == 'Super_Admin' && (
                                <Dropdown.Item className="py-2 fs-14 base-color-3">
                                  <Link href={'/dashboard/profile'}>
                                    <span className="base-color-3 d-block">Profile</span>
                                  </Link>
                                </Dropdown.Item>
                              )}
                              <Dropdown.Item className="py-2 fs-14 base-color-3" onClick={logout}>
                                Logout
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default Topbar;
