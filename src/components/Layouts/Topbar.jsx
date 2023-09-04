import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

function Topbar(props) {
  const { ToggleFun } = props;
  const router = useRouter();

  function logout() {
    Cookies.remove('token');
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
                <Link href={'/dashboard'}>
                  <Image src="/images/logo.png" alt="" width={110} height={54} />
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
                  <li className="nav-item ms-2 position-relative">
                    <div className="member-login d-flex align-items-center">
                      <Image
                        src="/images/team-roster/user-details.png"
                        width={45}
                        height={45}
                        alt="user"
                        className="img-fluid rounded-circle"
                      />
                      <div className="info-member ms-2">
                        <span className="base-color fw-700 fs-14">Rajendra</span>
                        <div className="Profile">
                          <Dropdown className="px-0 py-0 rounded-2">
                            <Dropdown.Toggle
                              variant="none"
                              className="text-start Profile-box-dropdown base-color-3 bg-white p-0 border-0
                 d-flex align-items-center fs-12 fw-400 base-color-9"
                              id="dropdown-basic"
                            >
                              <span className="pe-3">Player</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="w-100 rounded-4">
                              <Dropdown.Item className="py-2 fs-14 base-color-3">
                                <Link href={'/dashboard/profile'}>
                                  <span className="base-color-3 d-block"> Profile</span>
                                </Link>
                              </Dropdown.Item>
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
