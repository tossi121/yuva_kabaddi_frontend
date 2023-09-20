import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faFilter, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDataTable from '../DataTable/CustomDataTable';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import DeleteModal from './DeleteModal';
import ReusableDropdown from '../Player/ReusableDropdown';
import { deleteUser, getRole, playerWithdrawRequestsList } from '@/_services/services_api';
import toast from 'react-hot-toast';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Withdrawals() {
  const columns = [
    { heading: 'Name', field: 'user_name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'User Type', field: 'user_role' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'TDS Amount', field: 'tds_amount' },
    { heading: 'Date', field: 'updatedAt' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  const [expanded, setExpanded] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [checkBulk, setCheckBulk] = useState(false);
  const [checkedFilter, setCheckedFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  useEffect(() => {
    handleRole();
    handleWithdrawals();
    setFilterData(tableData);
  }, [JSON.stringify(tableData)]);

  async function handleRole() {
    const res = await getRole();
    if (res?.status) {
      const data = res.data;
      setRoleData(data);
    }
  }

  async function handleWithdrawals() {
    const res = await playerWithdrawRequestsList();
    if (res?.status) {
      const data = res.data;
      setTableData(data);
    }
  }

  const tableOptions = {
    columns: {
      render: {
        action: renderWithdrawalModal,
        status: renderSatus,
        updatedAt: renderWithdraDate,
      },
    },
  };

  function renderWithdraDate(value, row) {
    return <span>{moment(row.updatedAt).format('DD-MMMM-YYYY')} </span>;
  }

  function renderWithdrawalModal(value, row) {
    const handleClick = () => {
      setShow(true);
      setReviewId(row);
    };
    return (
      <div className="d-flex justify-content-center">
        {(row.status != 'Approved' && (
          <Button className="common-btn fs-14" onClick={handleClick}>
            Review
          </Button>
        )) || (
          <div className="text-success">
            <FontAwesomeIcon icon={faCheckCircle} width={25} height={25} />
          </div>
        )}
      </div>
    );
  }

  function renderSatus(value, row) {
    const statusColors = {
      Approved: 'success',
      Rejected: 'danger',
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

    const filteredData = tableData.filter((user) => {
      const userUpdatedAt = moment(user.updatedAt);
      const nextDay = moment(endDate).add(1, 'day'); // Use moment.js for date operations

      const isWithinDateRange = !startDate || userUpdatedAt.isBetween(startDate, nextDay, null, '[]');
      const isRoleMatch = !selectedRole || user.user_role.toLowerCase() === selectedRole.user_role.toLowerCase();

      const isStatusMatch =
        (selectedFilters.approved && user.status === 'Approved') ||
        (selectedFilters.pending && user.status === 'Pending') ||
        (selectedFilters.rejected && user.status === 'Rejected');

      return isWithinDateRange && isRoleMatch && isStatusMatch;
    });

    setFilterData(filteredData);
  };

  const handleReset = () => {
    setSelectedRole('');
    setSelectedFilters({
      approved: true,
      pending: true,
      rejected: true,
    });
    setStartDate(null);
    setEndDate(null);
    setFilterData(tableData);
    setCheckedFilter(false);
  };

  const handleFilterChange = (filterName) => {
    const isFilterSelected = selectedFilters[filterName];
    const numberOfSelectedFilters = Object.values(selectedFilters).filter(Boolean).length;

    if (numberOfSelectedFilters === 1 && isFilterSelected) {
      return;
    }

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !isFilterSelected,
    }));

    setCheckedFilter(true);
  };

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  return (
    <>
      {show && (
        <CommentModal
          show={show}
          setShow={setShow}
          modalText={'Withdrawal Approval'}
          reviewId={reviewId}
          selectedIds={selectedIds}
          handleData={handleWithdrawals}
          setCheckBulk={setCheckBulk}
        />
      )}

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
                      <FontAwesomeIcon icon={faFilter} width={20} height={20} />
                    </Button>
                  </div>
                </div>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0"> Withdrawal Approval Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col>
                        <div className="mb-3">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color">Select Role</Form.Label>
                            <ReusableDropdown
                              options={roleData}
                              selectedValue={selectedRole.user_role || 'Select Role'}
                              onSelect={setSelectedRole}
                              placeholder="Role"
                              displayKey="user_role"
                              valueKey="id"
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      <Col>
                        <Form.Label className="fs-16 fw-400 base-color">Select Start Date</Form.Label>
                        <div className="mb-2 d-flex flex-column">
                          <ReactDatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate}
                            maxDate={new Date()}
                            onChange={handleChangeStartDate}
                            placeholderText="Select Start Date"
                            showTimeSelect={false}
                            dateFormat="dd-MMM-yyyy"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="mb-2">
                          <Form.Group className="d-flex flex-column">
                            <Form.Label className="fs-16 fw-400 base-color">Select End Date</Form.Label>
                            <ReactDatePicker
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              placeholderText="Select End Date"
                              showTimeSelect={false}
                              minDate={startDate}
                              maxDate={new Date()}
                              dateFormat="dd-MMM-yyyy"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            />
                          </Form.Group>
                        </div>
                      </Col>

                      <Col>
                        <div className="mb-4">
                          <Form.Group>
                            <Form.Label className="fs-16 fw-400 base-color"> Filter Status</Form.Label>
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
                                  checked={selectedFilters.rejected}
                                  onChange={() => handleFilterChange('rejected')}
                                />
                                Reject
                              </Form.Label>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="d-flex align-items-center filters-dropdown-btn">
                          <Button
                            className="common-btn px-3 text-nowrap"
                            type="Submit"
                            disabled={!selectedRole && !checkedFilter && !startDate && !endDate}
                          >
                            <span className="me-2">
                              <FontAwesomeIcon icon={faSearch} width={18} height={18} />
                            </span>
                            Search
                          </Button>
                          <Button
                            className="common-outline-btn px-4 ms-2"
                            onClick={handleReset}
                            type="reset"
                            disabled={!selectedRole && !checkedFilter && !startDate && !endDate}
                          >
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
                  <CustomDataTable
                    rows={filterData}
                    columns={columns}
                    options={tableOptions}
                    showCheckboxes={true}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    setShow={setShow}
                    checkBulk={checkBulk}
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

export default Withdrawals;
