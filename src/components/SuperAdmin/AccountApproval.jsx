import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCommentAlt, faEllipsisH, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { getRole, getUsersList } from '@/_services/services_api';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const ReusableDropdown = dynamic(import('../Player/ReusableDropdown'));
const CommentModal = dynamic(import('./CommentlModal'));

function AccountApproval() {
  const [expanded, setExpanded] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [checkBulk, setCheckBulk] = useState(false);
  const [checkedFilter, setCheckedFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    rejected: true,
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
    { heading: 'Status', field: 'account_verify_status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  useEffect(() => {
    if (expanded) {
      handleRole();
    }
  }, [expanded]);

  useEffect(() => {
    handleUsers();
  }, []);

  async function handleRole() {
    const res = await getRole();
    if (res?.status) {
      const data = res.data;
      setRoleData(data);
    }
  }

  async function handleUsers() {
    const res = await getUsersList();
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
        account_verify_status: renderSatus,
      },
    },
  };

  function renderWithdrawalModal(value, row) {
    const handleClick = () => {
      setShow(true);
      setReviewId(row);
    };

    return (
      <Dropdown className="withdrawal-action-bar action-bar">
        {(row.account_verify_status !== 'Approved' && (
          <Dropdown.Toggle variant="" className="border-0 p-0" id="dropdown-basic">
            <FontAwesomeIcon width={15} height={15} icon={faEllipsisH} />
          </Dropdown.Toggle>
        )) || (
          <FontAwesomeIcon
            width={22}
            height={22}
            title="Account Approved"
            className="text-success"
            icon={faCheckCircle}
          />
        )}
        <Dropdown.Menu>
          <div className="d-flex justify-content-around">
            {row.account_verify_status != 'Approved' && (
              <Dropdown.Item
                className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleClick}
              >
                <FontAwesomeIcon icon={faCommentAlt} width={15} height={15} title="Account Withdrawal" />
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
        <Badge pill bg={statusColors[row.account_verify_status]} className="fs-12">
          {row.account_verify_status}
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
      if (selectedRole && user.user_role.toLowerCase() !== selectedRole.user_role.toLowerCase()) {
        return false;
      }
      if (
        (selectedFilters.approved && user.account_verify_status === 'Approved') ||
        (selectedFilters.pending && user.account_verify_status === 'Pending') ||
        (selectedFilters.rejected && user.account_verify_status === 'Rejected')
      ) {
        return true;
      }

      return false;
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
    setCheckedFilter(false);
    setFilterData(tableData);
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

  return (
    <>
      {show && (
        <CommentModal
          show={show}
          setShow={setShow}
          modalText={'Account Approval'}
          reviewId={reviewId}
          selectedIds={selectedIds}
          handleData={handleUsers}
          setCheckBulk={setCheckBulk}
        />
      )}

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

              <Card className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box mb-4 ' : ''}`}>
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0"> Account Approval Filter</h4>
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
                      <Col xl={3} lg={4} md={6}>
                        <div className="d-flex align-items-center filters-dropdown-btn">
                          <Button
                            className="common-btn px-3 text-nowrap"
                            type="Submit"
                            disabled={!selectedRole && !checkedFilter}
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
                            disabled={!selectedRole && !checkedFilter}
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
                  <h4 className="common-heading mb-0">Account Approval</h4>
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

export default AccountApproval;
