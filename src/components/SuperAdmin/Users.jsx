import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faFilter, faSearch, faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { deleteUser, getMatchDetails, getRole, getSeries, getUsersList } from '@/_services/services_api';
import toast from 'react-hot-toast';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));
const ReusableDropdown = dynamic(import('../Player/ReusableDropdown'));
const DeleteModal = dynamic(import('./DeleteModal'));
const CommentModal = dynamic(import('./CommentlModal'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));

function Users() {
  const [expanded, setExpanded] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [checkBulk, setCheckBulk] = useState(false);
  const [seriesData, setSeriesData] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [checkedFilter, setCheckedFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  const columns = [
    { heading: 'Name', field: 'user_name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'Mobile Number', field: 'contactno' },
    { heading: 'User Type', field: 'user_role' },
    { heading: 'Series Name', field: 'series_name' },
    { heading: 'Team Name', field: 'team_name' },
    { heading: 'Status', field: 'verify_status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

  useEffect(() => {
    if (expanded) {
      handleRole();
      handleSeries();
    }
  }, [expanded]);

  useEffect(() => {
    if (selectedSeries.tournamentId) {
      handleMatch();
    }
  }, [selectedSeries.tournamentId]);

  useEffect(() => {
    handleUser();
  }, []);

  async function handleSeries() {
    const res = await getSeries();
    if (res?.status) {
      const data = res.data;
      setSeriesData(data);
    }
  }

  async function handleMatch() {
    if (selectedSeries.tournamentId) {
      const res = await getMatchDetails(selectedSeries.tournamentId);
      if (res?.status) {
        const data = res.data;
        setMatchData(data);
      }
    }
  }

  async function handleRole() {
    const res = await getRole();
    if (res?.status) {
      const data = res.data;
      setRoleData(data);
    }
  }

  async function handleUser() {
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
        team_name: renderTeamName,
        series_name: renderSeriesName,
        action: renderWithdrawalModal,
        verify_status: renderSatus,
      },
    },
  };

  function renderTeamName(value, row) {
    return <>{row.teamDetails.teamName}</>;
  }

  function renderSeriesName(value, row) {
    return <>{row.seriesDetails.tournamentName}</>;
  }

  function renderWithdrawalModal(value, row) {
    const handleClick = () => {
      setShow(true);
      setReviewId(row);
    };
    const handleDelete = () => {
      setDeleteId(row);
      setShowModal(true);
    };

    return (
      <>
        <Dropdown className={(row.verify_status != 'Approved' && 'user-bar action-bar') || 'action-bar approval-bar'}>
          <Dropdown.Toggle variant="" className="border-0 p-0" id="dropdown-basic">
            <FontAwesomeIcon width={15} height={15} icon={faEllipsisH} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="d-flex justify-content-around">
              <Dropdown.Item className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center">
                <Link href={`users/${row.id}`} className="text-white">
                  <FontAwesomeIcon icon={faUserEdit} width={15} height={15} title="Edit User" />
                </Link>
              </Dropdown.Item>
              <Dropdown.Item
                className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrashAlt} width={15} height={15} title="Delete User" />
              </Dropdown.Item>
              {row.verify_status != 'Approved' && (
                <Dropdown.Item
                  className="text-white m-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faCommentAlt} width={15} height={15} title="Review User" />
                </Dropdown.Item>
              )}
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </>
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
        <Badge pill bg={statusColors[row.verify_status]} className="fs-12">
          {row.verify_status}
        </Badge>
      </>
    );
  }

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredData = tableData.filter((user) => {
      if (selectedRole && user.user_role.toLowerCase() !== selectedRole.user_role.toLowerCase()) {
        return false;
      }

      if (selectedSeries) {
        if (
          user.seriesDetails &&
          user.seriesDetails.tournamentName &&
          user.seriesDetails.tournamentName.toLowerCase() !== selectedSeries.tournamentName.toLowerCase()
        ) {
          return false;
        }
      }

      if (selectedMatch) {
        if (
          user.teamDetails &&
          user.teamDetails.teamName &&
          user.teamDetails.teamName.toLowerCase() !== selectedMatch.teamName.toLowerCase()
        ) {
          return false;
        }
      }

      if (
        (selectedFilters.approved && user.verify_status === 'Approved') ||
        (selectedFilters.pending && user.verify_status === 'Pending') ||
        (selectedFilters.rejected && user.verify_status === 'Rejected')
      ) {
        return true;
      }

      return false;
    });
    setFilterData(filteredData);
  };

  const handleReset = () => {
    setSelectedRole('');
    setSelectedMatch('');
    setSelectedSeries('');
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

  async function handleDeleteUser() {
    const params = {
      userId: deleteId.id,
    };

    const response = await deleteUser(params);
    if (response?.status) {
      toast.success(response?.message);
      setShowModal(false);
      handleUser();
    } else {
      toast.error(response?.message);
    }
  }

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
          setSelectedIds={setSelectedIds}
          setCheckBulk={setCheckBulk}
        />
      )}

      {showModal && (
        <DeleteModal showModal={showModal} setShowModal={setShowModal} handleDelete={handleDeleteUser} text="user" />
      )}

      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 ">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <DashboardBreadcrumb breadcrumbTitle="Users Approval" data={'Dashboard'} />
                <div className="d-sm-flex justify-content-between align-items-center ">
                  <div className="d-flex mt-sm-0 mt-2">
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
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-user mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0"> Users Approval Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col lg={4} md={6}>
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
                      <Col lg={4} md={6}>
                        <Form.Label className="fs-16 fw-400 base-color">Select Series</Form.Label>
                        <ReusableDropdown
                          options={seriesData}
                          selectedValue={selectedSeries?.tournamentName || 'Select Series'}
                          onSelect={setSelectedSeries}
                          placeholder="Series"
                          displayKey="tournamentName"
                          valueKey="id"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <Form.Label className="fs-16 fw-400 base-color">Select Team</Form.Label>
                        <ReusableDropdown
                          options={matchData}
                          selectedValue={selectedMatch?.teamName || 'Select Team'}
                          onSelect={setSelectedMatch}
                          placeholder="Team"
                          displayKey="teamName"
                          valueKey="teamId"
                        />
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="mb-4 text-truncate">
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
                                Rejected
                              </Form.Label>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="d-flex align-items-center filters-dropdown-btn">
                          <Button
                            className="common-btn px-3 text-nowrap"
                            type="Submit"
                            disabled={!selectedRole && !selectedMatch && !selectedSeries && !checkedFilter}
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
                            disabled={!selectedRole && !selectedMatch && !selectedSeries && !checkedFilter}
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
                  <h4 className="common-heading mb-0">Users Approval</h4>
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

export default Users;
