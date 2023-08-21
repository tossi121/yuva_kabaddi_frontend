import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import { maxLengthCheck } from '@/_helper/regex';
import dynamic from 'next/dynamic';
import WithdrawalModal from './WithdrawalModal';

const DashboardBreadcrumb = dynamic(import('../Layouts/Breadcrumb/DashboardBreadcrumbar'));

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [roleName, setRoleName] = useState('Select Role');
  const [searchRole, setSearchRole] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [show, setShow] = useState(false);
  const columns = [
    { heading: 'Pricing Category', field: 'pricing_category' },
    { heading: 'Match Number', field: 'match_number' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  // Sample data for demonstration purposes
  const data = [
    {
      id: 1,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 2',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 2,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 6',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 3,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 8',
      amount: 15000,
      status: 'Approved',
    },
    {
      id: 4,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 8',
      amount: 1500.0,
      status: 'Approved',
    },
    {
      id: 5,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 19',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 6,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 23',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 7,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 23',
      amount: 150000,
      status: 'Approved',
    },
    {
      id: 8,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 28',
      amount: 300.0,
      status: 'Approved',
    },
    {
      id: 9,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 35',
      amount: 215000,
      status: 'Approved',
    },
    {
      id: 10,
      pricing_category: 'SURVIVAL ROUND-TIE, STARTING 7',
      match_number: 'Match 37',
      amount: 225.0,
      status: 'Approved',
    },
    {
      id: 11,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 41',
      amount: 330000,
      status: 'Approved',
    },
    {
      id: 12,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 43',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 13,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 49',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 14,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 53',
      amount: 30000,
      status: 'Approved',
    },
  ];

  const tableOptions = {
    columns: {
      render: {
        Action: (value, row) => renderWithdrawalModal(row.id),
      },
    },
  };

  function renderWithdrawalModal(id) {
    const handleClick = () => {
      setShow(true);
    };

    return (
      <Button className="common-btn fs-12 mx-auto text-center" onClick={handleClick}>
        Withdrawal
      </Button>
    );
  }

  // Toggle the filter box
  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  // Handle role selection
  const handleSelectRole = (id, name) => {
    setRoleId(id);
    setRoleName(name);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission logic here
  };

  // Handle reset form
  const handleReset = () => {
    // Reset form fields
    setUserEmail('');
    setPhoneNumber('');
  };

  return (
    <>
      <WithdrawalModal show={show} setShow={setShow} />
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 align-items-stretch h-100">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb data={'Home'} />
                <div className="d-sm-flex justify-content-between align-items-center ">
                  <div className="add-filter d-flex mt-sm-0 mt-2">
                    <Button
                      className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                      onClick={toggleFilterBox}
                    >
                      <FontAwesomeIcon icon={faFilter} className="fs-18" />
                    </Button>
                    <Link href={'users/add-user'}>
                      <Button className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={faPlus} className="fs-18" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">View Users Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-4">
                          <Form.Group className="position-relative" controlId="formBasicEmail">
                            <Form.Label className="fs-14 fw-500 base-color-2">Select User</Form.Label>
                            <div className="form-select-catgory">
                              <Dropdown className="form-control px-0 py-0 card-border">
                                <Dropdown.Toggle
                                  variant="none"
                                  className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                  id="dropdown-basic"
                                >
                                  <span className="text-truncate pe-3">{roleName}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 card-border banner-filter-menu">
                                  <div className="px-2 mb-2">
                                    <input
                                      type="search"
                                      placeholder="Search Role"
                                      onChange={(e) => setSearchRole(e.target.value)}
                                      className="form-control shadow-none card-border fs-14 select-search-box"
                                    />
                                  </div>
                                  {/* {getRoleList &&
                                  roleSearchItem.map((items, key) => {
                                    return (
                                      <Dropdown.Item
                                        key={key}
                                        className="py-2 fs-14 base-color"
                                        value={items.id}
                                        onClick={() => handleSelectRole(items.id, items.name)}
                                      >
                                        <span>{items.name}</span>
                                      </Dropdown.Item>
                                    );
                                  })} */}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-2">
                          <Form.Group className="position-relative" controlId="formBasicEmail">
                            <Form.Label className="fs-14 fw-500 base-color-2">Enter Email</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Email Address"
                              name="email"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              value={userEmail || ''}
                              onChange={(e) => setUserEmail(e.target.value)}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-4">
                          <Form.Group className="position-relative" controlId="formBasicEmail">
                            <Form.Label className="fs-14 fw-500 base-color-2">Enter Mobile No.</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter Mobile Number"
                              name="mobile"
                              maxLength={18}
                              onInput={maxLengthCheck}
                              min={8}
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3 card-border rounded-1"
                              value={phoneNumber || ''}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="d-flex align-items-center  filters-dropdown-btn">
                          <Button className="common-btn px-3 text-nowrap" type="Submit">
                            <span className="me-2">
                              <FontAwesomeIcon icon={faSearch} width={18} height={18} />
                            </span>
                            Search
                          </Button>
                          <Button className="common-outline-btn px-4 ms-2" onClick={handleReset} type="reset">
                            Reset
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="bg-white rounded-4 card-border mb-4">
                <Card.Body className="box-padding">
                  <h5 className="common-heading">Rajendra Bhakar</h5>
                  <div className="d-flex align-items-center">
                    <div>
                      <h6 className="section-subtitle">Total Earning:</h6>
                      <h6 className="section-subtitle">Match Fee Earnings:</h6>
                      <h6 className="section-subtitle">Award Earnings:</h6>
                    </div>
                    <div className="ms-4">
                      <h6 className="section-subtitle">&#8377;15,725.00</h6>
                      <h6 className="section-subtitle">&#8377;6,725.00</h6>
                      <h6 className="section-subtitle">&#8377;9,000.00</h6>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">View Users</h4>
                </div>
                <Card.Body className="box-padding">
                  <CustomDataTable
                    handleCheckKey={setUserSelect}
                    handleSingleSelect={userSelect}
                    rows={data}
                    columns={columns}
                    options={tableOptions}
                    // hadelUpdateStatus={hadelUpdateUserStatus}
                    // handleDelete={handleDeleteUser}
                    // showStatusBtn={showDataTableFilter}
                    // showDeleteFilter={isShowCancelFilter}
                    selectNull={userSelect}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Dashboard;
