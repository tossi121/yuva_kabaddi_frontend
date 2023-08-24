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

function AccountConfirmation() {
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
    { heading: 'User Type', field: 'user_type' },
    { heading: 'PAN Card No.', field: 'pan_card_no' },
    { heading: 'Bank Name', field: 'bank_name' },
    { heading: 'IFSC Code', field: 'ifsc_code' },
    { heading: 'Account Number', field: 'account_number' },
    { heading: 'Branch Name', field: 'branch_name' },
    { heading: 'Action', field: 'Action' },
  ];

  // Sample data for demonstration purposes

  const data = [
    {
      user_type: 'Player',
      name: 'John Smith',
      email: 'john.smith@example.com',
      pan_card_no: 'ABCD1234E',
      ifsc_code: 'EFGH5678901',
      bank_name: 'National Bank',
      branch_name: 'Downtown Branch',
      account_number: '98765432101234',
    },

    {
      user_type: 'Player',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      pan_card_no: 'WXYZ5678F',
      ifsc_code: 'UVWX1234567',
      bank_name: 'Local Credit Union',
      branch_name: 'Northside Branch',
      account_number: '56789012345678',
    },

    {
      user_type: 'Player',
      name: 'David Lee',
      email: 'david.lee@example.com',
      pan_card_no: 'LMNO5678G',
      ifsc_code: 'PQRS1234567',
      bank_name: 'Global Trust Bank',
      branch_name: 'West End Branch',
      account_number: '11223344556677',
    },

    {
      user_type: 'Player',
      name: 'John Smith',
      email: 'john.smith@example.com',
      pan_card_no: 'ABCD1234E',
      ifsc_code: 'EFGH5678901',
      bank_name: 'National Bank',
      branch_name: 'Downtown Branch',
      account_number: '98765432101234',
    },

    {
      user_type: 'Player',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      pan_card_no: 'WXYZ5678F',
      ifsc_code: 'UVWX1234567',
      bank_name: 'Local Credit Union',
      branch_name: 'Northside Branch',
      account_number: '56789012345678',
    },

    {
      user_type: 'Player',
      name: 'David Lee',
      email: 'david.lee@example.com',

      pan_card_no: 'LMNO5678G',
      ifsc_code: 'PQRS1234567',
      bank_name: 'Global Trust Bank',
      branch_name: 'West End Branch',
      account_number: '11223344556677',
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
        <Button className="common-btn fs-14 mx-auto" onClick={handleClick}>
          Review
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
      <CommentModal show={show} setShow={setShow} />
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 align-items-stretch h-100">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb breadcrumbTitle="Account Confirmation" data={'Dashboard'} />
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
                  <h4 className="common-heading mb-0">Account Confirmation Filter</h4>
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
                  <h4 className="common-heading mb-0">Account Confirmation</h4>
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

export default AccountConfirmation;
