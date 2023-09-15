import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faEdit, faFilter, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import dynamic from 'next/dynamic';
import CommentModal from './CommentlModal';
import DeleteModal from './DeleteModal';
import ReusableDropdown from '../Player/ReusableDropdown';
import { deleteUser, getRole, getUsersList } from '@/_services/services_api';
import toast from 'react-hot-toast';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Users() {
  const columns = [
    { heading: 'Name', field: 'user_name' },
    { heading: 'Email Address', field: 'email' },
    { heading: 'Mobile Number', field: 'contactno' },
    { heading: 'User Type', field: 'user_role' },
    { heading: 'Status', field: 'verify_status' },
    { heading: 'Action', field: 'action', align: 'center' },
  ];

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
  const [selectedFilters, setSelectedFilters] = useState({
    approved: true,
    pending: true,
    rejected: true,
  });

  useEffect(() => {
    handleRole();
    handleUser();
    setFilterData(tableData);
  }, [JSON.stringify(tableData)]);

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
    }
  }

  const tableOptions = {
    columns: {
      render: {
        action: renderWithdrawalModal,
        verify_status: renderSatus,
      },
    },
  };

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
      <div className="d-flex justify-content-center">
        <div>
          <Link href={`users/${row.id}`} className="text-white">
            <Button variant="success" className="py-1 px-2 me-3" title="Edit User">
              <FontAwesomeIcon icon={faEdit} width={15} height={15} />
            </Button>
          </Link>
          <Button variant="danger" className="py-1 px-2 me-3" title="Delete User" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} width={15} height={15} />
          </Button>
        </div>
        {(row.verify_status != 'Approved' && (
          <Button className="common-btn fs-14" onClick={handleClick}>
            Review
          </Button>
        )) || (
          <div className="text-success">
            <FontAwesomeIcon icon={faCheckCircle} width={33} height={33} />
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
        <Badge pill bg={statusColors[row.verify_status]} className="fs-12">
          {row.verify_status}
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
    setSelectedFilters({
      approved: true,
      pending: true,
      rejected: true,
    });

    setFilterData(tableData);
  };

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
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
          handleUser={handleUser}
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
                  <h4 className="common-heading mb-0"> Users Approval Filter</h4>
                </div>
                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col lg={4}>
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
                                  checked={selectedFilters.rejected}
                                  onChange={() => handleFilterChange('reject')}
                                />
                                Rejected
                              </Form.Label>
                            </div>
                          </Form.Group>
                        </div>
                      </Col>
                      <Col>
                        <div className="d-flex align-items-center  filters-dropdown-btn">
                          <Button className="common-btn px-3 text-nowrap" type="submit">
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
                  <CustomDataTable
                    rows={filterData}
                    columns={columns}
                    options={tableOptions}
                    showCheckboxes={true}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    setShow={setShow}
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
