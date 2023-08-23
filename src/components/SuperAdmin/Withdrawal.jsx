import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCommentAlt, faFilter, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import { maxLengthCheck } from '@/_helper/regex';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';

const DashboardBreadcrumb = dynamic(import('../Layouts/Breadcrumb/DashboardBreadcrumbar'));

function Withdrawal() {
  const [expanded, setExpanded] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [roleName, setRoleName] = useState('Select Role');
  const [searchRole, setSearchRole] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [show, setShow] = useState(false);
  const columns = [
    { heading: 'Name', field: 'name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'User Type', field: 'userType' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  // Sample data for demonstration purposes

  const data = [
    {
      receiptNo: 'RCPT001',
      status: 'Approved',
      amount: 250.0,
      name: 'John Doe',
      email: 'john.doe@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT002',
      status: 'Pending',
      amount: 150.0,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT003',
      status: 'Approved',
      amount: 350.0,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT004',
      status: 'Pending',
      amount: 200.0,
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT005',
      status: 'Approved',
      amount: 180.0,
      name: 'David Lee',
      email: 'david.lee@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT006',
      status: 'Pending',
      amount: 300.0,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT007',
      status: 'Approved',
      amount: 400.0,
      name: 'Robert Smith',
      email: 'robert.smith@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT008',
      status: 'Pending',
      amount: 220.0,
      name: 'Michelle White',
      email: 'michelle.white@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT009',
      status: 'Approved',
      amount: 270.0,
      name: 'Daniel Johnson',
      email: 'daniel.johnson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT010',
      status: 'Pending',
      amount: 130.0,
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT011',
      status: 'Approved',
      amount: 320.0,
      name: 'William Brown',
      email: 'william.brown@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT012',
      status: 'Pending',
      amount: 190.0,
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT013',
      status: 'Approved',
      amount: 210.0,
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT014',
      status: 'Pending',
      amount: 280.0,
      name: 'Sophia Martin',
      email: 'sophia.martin@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT015',
      status: 'Approved',
      amount: 370.0,
      name: 'Christopher Adams',
      email: 'christopher.adams@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT016',
      status: 'Pending',
      amount: 240.0,
      name: 'Ava Wilson',
      email: 'ava.wilson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT017',
      status: 'Approved',
      amount: 290.0,
      name: 'Matthew Turner',
      email: 'matthew.turner@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT018',
      status: 'Pending',
      amount: 170.0,
      name: 'Isabella Moore',
      email: 'isabella.moore@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT019',
      status: 'Approved',
      amount: 420.0,
      name: 'Andrew Parker',
      email: 'andrew.parker@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT020',
      status: 'Pending',
      amount: 180.0,
      name: 'Mia Turner',
      email: 'mia.turner@example.com',
      userType: 'Coach',
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
      <div className="d-flex justify-content-center">
        <Button variant="success" className="py-1 px-2  text-white" title="Approved">
          <FontAwesomeIcon icon={faCheck} width={15} height={15} />
        </Button>
        <Button variant="danger" className="common-bt py-1 px-2  text-white mx-3" title="Rejected">
          <FontAwesomeIcon icon={faTimes} width={15} height={15} />
        </Button>
        <Button className="common-btn py-1 px-2  text-white" title="Add Comment" onClick={handleClick}>
          <FontAwesomeIcon icon={faCommentAlt} width={15} height={15} />
        </Button>
      </div>
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
      <CommentModal show={show} setShow={setShow} />
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
                    <Link href={'/super-admin/add-user'}>
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
                  <h4 className="common-heading mb-0">Users Withdrawal Filter</h4>
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
                            <Form.Label className="fs-14 fw-500 base-color-2">Enter Email Address</Form.Label>
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

              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Users Withdrawal Amount</h4>
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

export default Withdrawal;
