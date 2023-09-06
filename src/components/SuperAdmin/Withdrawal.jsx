import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import CustomDataTable from '../DataTable/CustomDataTable';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useRouter } from 'next/router';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Withdrawal() {
  const data = [
    {
      id: 1,
      receiptNo: 'RCPT001',
      status: 'Approved',
      amount: 250.0,
      name: 'John Doe',
      date: '2023-04-18',
      email: 'john.doe@example.com',
      userType: 'Player',
    },
    {
      id: 2,
      receiptNo: 'RCPT002',
      status: 'Pending',
      amount: 150.0,
      name: 'Jane Smith',
      date: '2023-03-17',
      email: 'jane.smith@example.com',
      userType: 'Player',
    },
    {
      id: 3,
      receiptNo: 'RCPT003',
      status: 'Approved',
      amount: 350.0,
      name: 'Michael Johnson',
      date: '2023-02-16',
      email: 'michael.johnson@example.com',
      userType: 'Coach',
    },
    {
      id: 4,
      receiptNo: 'RCPT004',
      status: 'Pending',
      amount: 200.0,
      name: 'Emily Brown',
      date: '2023-08-10',
      email: 'emily.brown@example.com',
      userType: 'Coach',
    },
    {
      id: 5,
      receiptNo: 'RCPT005',
      status: 'Reject',
      amount: 180.0,
      name: 'David Lee',
      date: '2023-08-10',
      email: 'david.lee@example.com',
      userType: 'Player',
    },
    {
      id: 6,
      receiptNo: 'RCPT006',
      status: 'Pending',
      amount: 300.0,
      name: 'Sarah Johnson',
      date: '2023-12-21',
      email: 'sarah.johnson@example.com',
      userType: 'Player',
    },
    {
      id: 7,
      receiptNo: 'RCPT007',
      status: 'Reject',
      amount: 400.0,
      name: 'Robert Smith',
      date: '2023-12-30',
      email: 'robert.smith@example.com',
      userType: 'Coach',
    },
    {
      id: 8,
      receiptNo: 'RCPT008',
      status: 'Pending',
      amount: 220.0,
      name: 'Michelle White',
      date: '2023-08-10',
      email: 'michelle.white@example.com',
      userType: 'Coach',
    },
    {
      id: 9,
      receiptNo: 'RCPT009',
      status: 'Reject',
      amount: 270.0,
      name: 'Daniel Johnson',
      date: '2023-08-10',
      email: 'daniel.johnson@example.com',
      userType: 'Player',
    },
    {
      id: 10,
      receiptNo: 'RCPT010',
      status: 'Pending',
      amount: 130.0,
      name: 'Olivia Davis',
      date: '2023-08-17',
      email: 'olivia.davis@example.com',
      userType: 'Player',
    },
    {
      id: 11,
      receiptNo: 'RCPT011',
      status: 'Approved',
      amount: 320.0,
      name: 'William Brown',
      date: '2023-0-16',
      email: 'william.brown@example.com',
      userType: 'Coach',
    },
    {
      id: 12,
      receiptNo: 'RCPT012',
      status: 'Pending',
      amount: 190.0,
      name: 'Emma Johnson',
      date: '2023-09-10',
      email: 'emma.johnson@example.com',
      userType: 'Coach',
    },
    {
      id: 13,
      receiptNo: 'RCPT013',
      status: 'Reject',
      amount: 210.0,
      name: 'James Wilson',
      date: '2023-08-11',
      email: 'james.wilson@example.com',
      userType: 'Player',
    },
    {
      id: 14,
      receiptNo: 'RCPT014',
      status: 'Pending',
      amount: 280.0,
      name: 'Sophia Martin',
      date: '2023-08-10',
      email: 'sophia.martin@example.com',
      userType: 'Player',
    },
    {
      id: 15,
      receiptNo: 'RCPT015',
      status: 'Approved',
      amount: 370.0,
      name: 'Christopher Adams',
      date: '2023-08-02',
      email: 'christopher.adams@example.com',
      userType: 'Coach',
    },
    {
      id: 16,
      receiptNo: 'RCPT016',
      status: 'Pending',
      amount: 240.0,
      name: 'Ava Wilson',
      date: '2023-08-09',
      email: 'ava.wilson@example.com',
      userType: 'Coach',
    },
    {
      id: 17,
      receiptNo: 'RCPT017',
      status: 'Approved',
      amount: 290.0,
      name: 'Matthew Turner',
      date: '2023-08-10',
      email: 'matthew.turner@example.com',
      userType: 'Player',
    },
    {
      id: 18,
      receiptNo: 'RCPT018',
      status: 'Pending',
      amount: 170.0,
      name: 'Isabella Moore',
      date: '2023-08-17',
      email: 'isabella.moore@example.com',
      userType: 'Player',
    },
    {
      id: 19,
      receiptNo: 'RCPT019',
      status: 'Approved',
      amount: 420.0,
      name: 'Andrew Parker',
      date: '2023-04-11',
      email: 'andrew.parker@example.com',
      userType: 'Coach',
    },
    {
      id: 20,
      receiptNo: 'RCPT020',
      status: 'Pending',
      amount: 180.0,
      name: 'Mia Turner',
      date: '2023-06-10',
      email: 'mia.turner@example.com',
      userType: 'Coach',
    },
  ];

  const initialFormValues = {
    mobile: '',
    role: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [searchRole, setSearchRole] = useState('');
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    reject: true,
  });

  const router = useRouter();
  const { label } = router.query;

  useEffect(() => {
    if (label === 'Approved Requests') {
      setFilteredData(data.filter((item) => item.status === 'Approved'));
    } else if (label === 'Pending Requests') {
      setFilteredData(data.filter((item) => item.status === 'Pending'));
    } else if (label === 'Rejected Requests') {
      setFilteredData(data.filter((item) => item.status === 'Reject'));
    } else {
      setFilteredData(data);
    }
  }, [label]);

  const columns = [
    { heading: 'Name', field: 'name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'Date', field: 'date' },
    { heading: 'User Type', field: 'userType' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  const tableOptions = {
    columns: {
      render: {
        Action: (value, row) => renderWithdrawalModal(row.id),
        status: renderSatus,
        date: renderWithdraDate,
      },
    },
  };

  function renderWithdraDate(value, row) {
    return <span>{moment(row.date).format('DD-MMMM-YYYY')} </span>;
  }

  function renderWithdrawalModal() {
    const handleClick = () => {
      setShow(true);
    };

    return (
      <Button className="common-btn fs-14 mx-auto" onClick={handleClick}>
        Review
      </Button>
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
      const isWithinDateRange = !startDate || moment(item.date).isBetween(startDate, endDate, null, '[]');

      const isMatchingRole = !selectedRole || item.userType.toLowerCase() === selectedRole.toLowerCase();
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

  return (
    <>
      {show && <CommentModal show={show} setShow={setShow} modalText={'Withdrawal Approval'} />}
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 ">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb breadcrumbTitle="Withdrawal Approval" data={'Dashboard'} />
                <div className="d-sm-flex justify-content-between align-items-center ">
                  <div className="add-filter d-flex mt-sm-0 mt-2">
                    <Button
                      className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                      onClick={toggleFilterBox}
                    >
                      <FontAwesomeIcon icon={faFilter} className="fs-18" />
                    </Button>
                  </div>
                </div>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Withdrawal Approval Filter</h4>
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
                        <Form.Label className="fs-16 fw-400 base-color-1">Select Start Date</Form.Label>
                        <div className="mb-2 d-flex flex-column">
                          <ReactDatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Select Start Date"
                            showTimeSelect={false}
                            minDate={startDate}
                            dateFormat="dd-MMM-yyyy"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-2">
                          <Form.Group className="d-flex flex-column">
                            <Form.Label className="fs-16 fw-400 base-color-1">Select End Date</Form.Label>
                            <ReactDatePicker
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              placeholderText="Select End Date"
                              showTimeSelect={false}
                              dateFormat="dd-MMM-yyyy"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
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
                  <h4 className="common-heading mb-0">Withdrawal Approval</h4>
                </div>
                <Card.Body className="box-padding position-relative">
                  <div className="position-absolute end-0 me-4 review-btn mt-2">
                    <Button
                      className="common-btn fs-14 me-2"
                      disabled={selectedIds.length === 0}
                      onClick={() => setShow(true)}
                    >
                      Bulk Review
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

export default Withdrawal;
