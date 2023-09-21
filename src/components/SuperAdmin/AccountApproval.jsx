import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import CustomDataTable from '../DataTable/CustomDataTable';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import { getUsersList } from '@/_services/services_api';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function AccountApproval() {
  const initialFormValues = {
    mobile: '',
    role: '',
    email: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [searchRole, setSearchRole] = useState('');
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [checkBulk, setCheckBulk] = useState(false);
  const [filteredData, setFilteredData] = useState(tableData);
  const [selectedRole, setSelectedRole] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    reject: true,
  });
  const columns = [
    { heading: 'Name', field: 'user_name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'User Type', field: 'user_role' },
    { heading: 'PAN Card No.', field: 'pan_no' },
    { heading: 'Bank Name', field: 'bank_name' },
    { heading: 'IFSC Code', field: 'ifsc_code' },
    { heading: 'Account Number', field: 'account_number' },
    { heading: 'Branch Name', field: 'branch_name' },
    { heading: 'Comment', field: 'account_verify_comment' },
    { heading: 'Status', field: 'account_verify_status' },
    { heading: 'Action', field: 'Action' },
  ];
  useEffect(() => {
    // handleRole();
    handleUser();
    setFilteredData(tableData);
  }, [JSON.stringify(tableData)]);
  async function handleUser() {
    const res = await getUsersList();
    if (res?.status) {
      const data = res.data;
      setTableData(data);
    }
  }
  const tableOptions = {
    columns: {
      render: {
        Action: (value, row) => renderWithdrawalModal(row),
        account_verify_status: renderSatus,
      },
    },
  };

  function renderWithdrawalModal(row) {
    const handleClick = () => {
      setShow(true);
      setReviewId(row);
    };

    return (
      <div className="d-flex justify-content-center">
        {(row.account_verify_status != 'Approved' && (
          <Button className="common-btn fs-14" onClick={handleClick}>
            Review
          </Button>
        )) || (
          <div className="text-success">
            <FontAwesomeIcon title='Approved'  icon={faCheckCircle} width={33} height={33} />
          </div>
        )}
      </div>
    );
  }

  const handleRoleSelect = (selectedRole) => {
    setSelectedRole(selectedRole);
    setFormValues((prevData) => ({ ...prevData, role: selectedRole }));
    setFormErrors((prevErrors) => ({ ...prevErrors, role: '' }));
  };
  // Toggle the filter box
  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredData = data.filter((item) => {
      const isWithinDateRange = !startDate || moment(item.withdrawal_date).isBetween(startDate, endDate, null, '[]');

      const isMatchingRole = !selectedRole || item.user_type.toLowerCase() === selectedRole.toLowerCase();
      const isMatchingEmail = !formValues.email || item.email.toLowerCase().includes(formValues.email.toLowerCase());

      const isStatusMatching =
        (selectedFilters.approved && item.status === 'Approved') ||
        (selectedFilters.pending && item.status === 'Pending') ||
        (selectedFilters.reject && item.status === 'Reject');

      return isWithinDateRange && isMatchingRole && isMatchingEmail && isStatusMatching;
    });

    setFilteredData(filteredData);
  };

  // Handle reset form
  const handleReset = () => {
    setFormValues(initialFormValues);
    setFormErrors({});
    setSelectedRole('');
    setSearchRole('');
    setSelectedFilters({
      approved: true,
      pending: true,
      reject: true,
    });
    setStartDate(null);
    setEndDate(null);
    setFilteredData(data);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };
  
  function renderSatus(value, row) {
    const statusColors = {
      Approved: 'success',
      Rejected: 'danger',
      Pending: 'warning',
    };

    return (
      <>
        <Badge pill bg={statusColors[row.account_verify_status]} className="fs-12">
          {row.account_verify_status}
        </Badge>
      </>
    );
  }

  const handleChange = (e)  => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRoleName(value);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  return (
    <>
    {show && (
        <CommentModal
          show={show}
          setShow={setShow}
          modalText={'User Approval'}
          reviewId={reviewId}
          selectedIds={selectedIds}
          handleData={handleUser}
          setCheckBulk={setCheckBulk}
        />
      )}
      {/* <CommentModal show={show} setShow={setShow} modalText="Account Approval" /> */}
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 ">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb breadcrumbTitle="Account Approval" data={'Dashboard'} />
                <div className="d-sm-flex justify-content-between align-items-center ">
                  <div className="add-filter d-flex mt-sm-0 mt-2">
                    <Button
                      className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                      onClick={toggleFilterBox}
                    >
                      <FontAwesomeIcon icon={faFilter} width={20} height={20} />
                    </Button>
                  </div>
                </div>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Account Approval Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xl={3} lg={4} md={6}>
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
                      <Col xl={3} lg={4} md={6}>
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
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-4">
                          <Form.Group>
                            <Form.Label className="fs-14 fw-500 base-color-2"> Filter Status</Form.Label>
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
                      <Col xl={3} lg={4} md={6}>
                        <div className="d-flex align-items-center  filters-dropdown-btn">
                          <Button className="common-btn px-3 text-nowrap">
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
                  <h4 className="common-heading mb-0">Account Approval</h4>
                </div>
                <Card.Body className='box-padding position-relative'>
                  <CustomDataTable
                    rows={filteredData}
                    columns={columns}
                    options={tableOptions}
                    showCheckboxes={true}
                    selectedIds={selectedIds}
                    setShow={setShow}
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

export default AccountApproval;
