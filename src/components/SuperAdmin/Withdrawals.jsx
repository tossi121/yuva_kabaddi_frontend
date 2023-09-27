import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCommentAlt,
  faEllipsisH,
  faFilter,
  faSearch,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import CustomDataTable from '../DataTable/CustomDataTable';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import ReusableDropdown from '../Player/ReusableDropdown';
import { getRole, playerWithdrawRequestsList } from '@/_services/services_api';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import AccountModal from './AccountModal';
import { useRouter } from 'next/router';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Withdrawals() {
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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { label } = router.query;
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  const setSelectedFiltersByLabel = (newLabel) => {
    const updatedFilters = {
      approved: newLabel === 'Approved Withdrawals',
      pending: newLabel === 'Pending Withdrawals',
      rejected: newLabel === 'Rejected Withdrawals',
    };

    setSelectedFilters(updatedFilters);
  };

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

  useEffect(() => {
    if (tableData && label != undefined) {
      setSelectedFiltersByLabel(label);
      if (label === 'Approved Withdrawals') {
        setFilterData(tableData.filter((item) => item.status === 'Approved'));
      } else if (label === 'Pending Withdrawals') {
        setFilterData(tableData.filter((item) => item.status === 'Pending'));
      } else if (label === 'Rejected Withdrawals') {
        setFilterData(tableData.filter((item) => item.status === 'Rejected'));
      } else {
        setFilterData(tableData);
      }
    }
  }, [label, tableData]);

  useEffect(() => {
    if (expanded) {
      handleRole();
    }
  }, [expanded]);

  useEffect(() => {
    handleWithdrawals();
  }, []);

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
      setFilterData(data);
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

    const handleModal = () => {
      setShowModal(true);
      setReviewId(row);
    };

    return (
      <Dropdown className="action-bar">
        <Dropdown.Toggle variant="" className="border-0 p-0" id="dropdown-basic">
          <FontAwesomeIcon width={15} height={15} icon={faEllipsisH} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <div className="d-flex justify-content-around">
            <Dropdown.Item
              className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
              onClick={handleModal}
            >
              <FontAwesomeIcon icon={faUserGear} width={15} height={15} title="Account Details" />
            </Dropdown.Item>

            {row.status != 'Approved' && (
              <Dropdown.Item
                className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleClick}
              >
                <FontAwesomeIcon icon={faCommentAlt} width={15} height={15} title="Review Withdrawal " />
              </Dropdown.Item>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
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
    if (label === 'Approved Withdrawals' && filterName !== 'approved') {
      return;
    }
    if (label === 'Pending Withdrawals' && filterName !== 'pending') {
      return;
    }
    if (label === 'Rejected Withdrawals' && filterName !== 'reject') {
      return;
    }

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

      {showModal && <AccountModal {...{ showModal, setShowModal, reviewId }} />}

      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4">
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
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box mb-4 ' : ''}`}
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
                        <div className="mb-4 text-nowrap">
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
                              <Form.Label className="cursor-pointer user-select-none base-color-2" htmlFor="rejected">
                                <input
                                  type="checkbox"
                                  name="rejected"
                                  id="rejected"
                                  className="me-2"
                                  checked={selectedFilters.rejected}
                                  onChange={() => handleFilterChange('rejected')}
                                />
                                Rejected
                              </Form.Label>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
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
