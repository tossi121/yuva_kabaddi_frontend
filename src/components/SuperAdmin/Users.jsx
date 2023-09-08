import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFilter, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import { maxLengthCheck } from '@/_helper/regex';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import DeleteModal from './DeleteModal';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Users() {
  const columns = [
    { heading: 'Name', field: 'name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'Mobile Number', field: 'mobile_number' },
    { heading: 'User Type', field: 'user_type' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  const data = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile_number: '1234567890',
      status: 'Reject',
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
      status: 'Reject',
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
      status: 'Reject',
      user_type: 'Coach',
    },
    {
      id: 8,
      name: 'LeBron James',
      email: 'lebron@example.com',
      mobile_number: '7778889999',
      status: 'Reject',
      user_type: 'Player',
    },
    {
      id: 9,
      name: 'Coach Brown',
      email: 'brown@example.com',
      mobile_number: '5554443333',
      status: 'Pending',
      user_type: 'Coach',
    },
    {
      id: 10,
      name: 'Maria Sharapova',
      email: 'maria@example.com',
      mobile_number: '8889990000',
      status: 'Pending',
      user_type: 'Player',
    },
    {
      id: 11,
      name: 'Chris Paul',
      email: 'chris@example.com',
      mobile_number: '3332221111',
      status: 'Reject',
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
      status: 'Reject',
      user_type: 'Player',
    },
    {
      id: 15,
      name: 'Coach Anderson',
      email: 'anderson@example.com',
      mobile_number: '5556667777',
      status: 'Pending',
      user_type: 'Coach',
    },
    {
      id: 16,
      name: 'Kobe Bryant',
      email: 'kobe@example.com',
      mobile_number: '1119998888',
      status: 'Pending',
      user_type: 'Player',
    },
    {
      id: 17,
      name: 'Coach Martinez',
      email: 'martinez@example.com',
      mobile_number: '3335557777',
      status: 'Pending',
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
      status: 'Pending',
      user_type: 'Coach',
    },
  ];

  const initialFormValues = {
    email: '',
    mobile: '',
    role: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [roleName, setRoleName] = useState('Select Role');
  const [searchRole, setSearchRole] = useState('');
  const [show, setShow] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    reject: true,
  });

  const tableOptions = {
    columns: {
      render: {
        Action: (value, row) => renderWithdrawalModal(row.id),
        status: renderSatus,
      },
    },
  };

  function renderWithdrawalModal(id) {
    const handleClick = () => {
      setShow(true);
    };
    const handleDelete = (id) => {
      setDeleteId(id);
      setShowModal(true);
    };

    return (
      <div className="d-flex justify-content-center">
        <Link href={`users/${id}`}>
          <Button variant="success" className="py-1 px-2 me-3" title="Edit User">
            <FontAwesomeIcon icon={faEdit} width={15} height={15} />
          </Button>
        </Link>
        <Button variant="danger" className="py-1 px-2 me-3" title="Delete User" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} width={15} height={15} />
        </Button>
        <Button className="common-btn fs-14" onClick={handleClick}>
          Review
        </Button>
      </div>
    );
  }

  function renderSatus(value, row) {
    const statusColors = {
      Approved: 'success',
      Reject: 'danger',
      Pending: 'warning',
    };
    return (
      <>
        <Badge pill bg={statusColors[row.status]} className="fs-12">
          {row.status}
        </Badge>
      </>
    );
  }

  // Toggle the filter box
  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter the data based on the selected criteria
    const filteredData = data.filter((user) => {
      // Role Filtering
      if (selectedRole && user.user_type.toLowerCase() !== selectedRole.toLowerCase()) {
        return false;
      }

      // Email Filtering
      if (formValues.email && !user.email.toLowerCase().includes(formValues.email.toLowerCase())) {
        return false;
      }

      // Mobile Filtering
      if (formValues.mobile && !user.mobile_number.includes(formValues.mobile)) {
        return false;
      }

      // Status Filtering (checkboxes)
      if (
        (selectedFilters.approved && user.status === 'Approved') ||
        (selectedFilters.pending && user.status === 'Pending') ||
        (selectedFilters.reject && user.status === 'Reject')
      ) {
        return true;
      }

      return false;
    });

    setFilteredData(filteredData);
  };

  const handleReset = () => {
    setFormValues(initialFormValues);
    setFormErrors({});
    setRoleName('Select Role');
    setSelectedRole('');
    setSearchRole('');
    setSelectedFilters({
      approved: true,
      pending: true,
      reject: true,
    });

    setFilteredData(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRoleName(value);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setSelectedRole(selectedRole);
    setSearchRole('');
    setFormValues((prevData) => ({ ...prevData, role: selectedRole }));
    setFormErrors((prevErrors) => ({ ...prevErrors, role: '' }));
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };
  return (
    <>
      {show && <CommentModal show={show} setShow={setShow} modalText={'User Approval'} />}
      {showModal && (
        <DeleteModal showModal={showModal} setShowModal={setShowModal} handleDelete={deleteId} text="User" />
      )}
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 ">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb breadcrumbTitle="Users Approval" data={'Dashboard'} />
                <div className="d-sm-flex justify-content-between align-items-center ">
                  <div className="add-filter d-flex mt-sm-0 mt-2">
                    <Button
                      className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                      onClick={toggleFilterBox}
                    >
                       <FontAwesomeIcon icon={faFilter} width={20} height={20} />
                    </Button>
                    <Link href={'/super-admin/users/add-user'}>
                      <Button className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={faPlus}  width={20} height={20} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0"> Users Approval Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col>
                        <div className="mb-4">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color">Select Role</Form.Label>
                            <div className="form-select-catgory">
                              <Dropdown className="form-control px-0 py-0 card-border">
                                <Dropdown.Toggle
                                  variant="none"
                                  className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                  id="dropdown-basic"
                                >
                                  <span className="text-truncate pe-3">{selectedRole || 'Select Role'}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 card-border ">
                                  <div className="px-2 mb-2">
                                    <input
                                      type="search"
                                      placeholder="Search Role"
                                      onChange={(e) => setSearchRole(e.target.value)}
                                      className="form-control shadow-none card-border fs-14 hight-50"
                                    />
                                  </div>

                                  {['Player', 'Coach']
                                    .filter((role) => role.toLowerCase().includes(searchRole.toLowerCase()))
                                    .map((role) => (
                                      <Dropdown.Item
                                        key={role}
                                        className={`py-2 fs-14 base-color ${selectedRole === role ? 'active' : ''}`}
                                        onClick={() => handleRoleSelect(role)}
                                      >
                                        {role}
                                      </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                            {formErrors.role && <p className="text-danger fs-14 error-message">{formErrors.role}</p>}
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-4">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color">Enter Email Address</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Email Address"
                              name="email"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              value={formValues.email}
                              onChange={handleChange}
                            />
                            {formErrors.email && <p className="text-danger fs-14 error-message">{formErrors.email}</p>}
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-4">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color">Enter Mobile Number</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Mobile Number"
                              name="mobile"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              id="mobile"
                              value={formValues.mobile}
                              onChange={handleChange}
                              maxLength="10"
                              onKeyPress={handleKeyPress}
                              onInput={maxLengthCheck}
                            />
                            {formErrors.mobile && (
                              <p className="text-danger fs-14 error-message">{formErrors.mobile}</p>
                            )}
                          </Form.Group>
                        </div>
                      </Col>

                      <Col>
                        <div className="mb-4">
                          <Form.Group>
                            <Form.Label className="fs-16 fw-400 base-color-1"> Filter Status</Form.Label>
                            <div className="mt-2">
                              <Form.Label className="cursor-pointer user-select-none base-color-2" htmlFor="approved">
                                <input
                                  type="checkbox"
                                  name="approved"
                                  id="approved"
                                  className="me-2"
                                  checked={selectedFilters.approved}
                                  onChange={() => handleFilterChange('approved')}
                                />
                                Approved
                              </Form.Label>
                              <Form.Label
                                className="cursor-pointer user-select-none base-color-2 mx-3"
                                htmlFor="pending"
                              >
                                <input
                                  type="checkbox"
                                  name="pending"
                                  id="pending"
                                  className="me-2"
                                  checked={selectedFilters.pending}
                                  onChange={() => handleFilterChange('pending')}
                                />
                                Pending
                              </Form.Label>
                              <Form.Label className="cursor-pointer user-select-none base-color-2" htmlFor="reject">
                                <input
                                  type="checkbox"
                                  name="reject"
                                  id="reject"
                                  className="me-2"
                                  checked={selectedFilters.reject}
                                  onChange={() => handleFilterChange('reject')}
                                />
                                Reject
                              </Form.Label>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center  filters-dropdown-btn">
                          <Button className="common-btn px-3 text-nowrap" >
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
                  <h4 className="common-heading mb-0">Users Approval</h4>
                </div>
                <Card.Body className="box-padding position-relative">
                  <div className="position-absolute end-0 me-4 review-btn mt-2 d-flex">
                    <Button
                      className="common-btn fs-14 me-2"
                      disabled={selectedIds.length === 0}
                      onClick={() => setShow(true)}
                    >
                      Bulk Review
                    </Button>
                    <Button
                      className="common-btn fs-14 me-2"
                      disabled={selectedIds.length === 0}
                      onClick={() => setShowModal(true)}
                    >
                      Bulk Delete
                    </Button>
                  </div>
                  <CustomDataTable
                    rows={filteredData}
                    columns={columns}
                    options={tableOptions}
                    showCheckboxes={true}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
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
