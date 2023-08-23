import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCommentAlt, faEdit, faFilter, faPlus, faSearch, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import { maxLengthCheck } from '@/_helper/regex';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';

const DashboardBreadcrumb = dynamic(import('../Layouts/Breadcrumb/DashboardBreadcrumbar'));

function Users() {
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
    { heading: 'Mobile Number', field: 'mobile_number' },
    { heading: 'User Type', field: 'user_type' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  // Sample data for demonstration purposes

  const data = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile_number: '1234567890',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      mobile_number: '9876543210',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 3,
      name: 'Coach Johnson',
      email: 'coach@example.com',
      mobile_number: '5551234567',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 4,
      name: 'Coach Ramirez',
      email: 'ramirez@example.com',
      mobile_number: '4445678901',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 5,
      name: 'Michael Jordan',
      email: 'mj@example.com',
      mobile_number: '1112223333',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 6,
      name: 'Serena Williams',
      email: 'serena@example.com',
      mobile_number: '5555555555',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 7,
      name: 'Coach Smith',
      email: 'smith@example.com',
      mobile_number: '6667778888',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 8,
      name: 'LeBron James',
      email: 'lebron@example.com',
      mobile_number: '7778889999',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 9,
      name: 'Coach Brown',
      email: 'brown@example.com',
      mobile_number: '5554443333',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 10,
      name: 'Maria Sharapova',
      email: 'maria@example.com',
      mobile_number: '8889990000',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 11,
      name: 'Chris Paul',
      email: 'chris@example.com',
      mobile_number: '3332221111',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 12,
      name: 'Coach White',
      email: 'white@example.com',
      mobile_number: '4445556666',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 13,
      name: 'Lionel Messi',
      email: 'messi@example.com',
      mobile_number: '7776665555',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 14,
      name: 'Simone Biles',
      email: 'simone@example.com',
      mobile_number: '2223334444',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 15,
      name: 'Coach Anderson',
      email: 'anderson@example.com',
      mobile_number: '5556667777',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 16,
      name: 'Kobe Bryant',
      email: 'kobe@example.com',
      mobile_number: '1119998888',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 17,
      name: 'Coach Martinez',
      email: 'martinez@example.com',
      mobile_number: '3335557777',
      status: 'Approved',
      user_type: 'Coach',
    },
    {
      id: 18,
      name: 'Venus Williams',
      email: 'venus@example.com',
      mobile_number: '7778881111',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 19,
      name: 'Kevin Durant',
      email: 'kd@example.com',
      mobile_number: '4443335555',
      status: 'Approved',
      user_type: 'Player',
    },
    {
      id: 20,
      name: 'Coach Taylor',
      email: 'taylor@example.com',
      mobile_number: '6667779999',
      status: 'Approved',
      user_type: 'Coach',
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
        <Link href={`users/${id}`}>
          <Button className="common-btn py-1 px-2 text-white me-3" title="Edit User">
            <FontAwesomeIcon icon={faEdit} width={15} height={15} />
          </Button>
        </Link>
          <Button className="common-btn py-1 px-2 text-white me-3" title="Delete User">
            <FontAwesomeIcon icon={faTrash} width={15} height={15} />
          </Button>
        <Button variant="success" className="py-1 px-2 text-white me-3" title="Approved">
          <FontAwesomeIcon icon={faCheck} width={15} height={15} />
        </Button>
        <Button variant="danger" className="common-bt py-1 px-2 text-white me-3" title="Rejected">
          <FontAwesomeIcon icon={faTimes} width={15} height={15} />
        </Button>
        <Button className="common-btn py-1 px-2 text-white me-3" title="Add Comment" onClick={handleClick}>
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
                        <div className="mb-4">
                          <Form.Group className="position-relative" controlId="formBasicEmail">
                            <Form.Label className="fs-14 fw-500 base-color-2">Enter Mobile Number.</Form.Label>
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

export default Users;
