import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import CustomDataTable from '../DataTable/CustomDataTable';
import { maxLengthCheck } from '@/_helper/regex';
import dynamic from 'next/dynamic';
import WithdrawalModal from './WithdrawalModal';

const DashboardBreadcrumb = dynamic(import('../Layouts/Breadcrumb/DashboardBreadcrumbar'));

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [roleName, setRoleName] = useState('Select Role');
  const [searchRole, setSearchRole] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [totalAmount, setTotalAmount] = useState('');
  const [show, setShow] = useState(false);
  const columns = [
    { heading: 'Pricing Category', field: 'pricing_category' },
    { heading: 'Match Number', field: 'match_number' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'Status', field: 'status' },
    { heading: 'Action', field: 'Action' },
  ];

  // Sample data for demonstration purposes
  const data = [
    {
      id: 1,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 2',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 2,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 6',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 3,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 8',
      amount: 15000,
      status: 'Approved',
    },
    {
      id: 4,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 8',
      amount: 1500.0,
      status: 'Approved',
    },
    {
      id: 5,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 19',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 6,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 23',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 7,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 23',
      amount: 150000,
      status: 'Approved',
    },
    {
      id: 8,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 28',
      amount: 300.0,
      status: 'Approved',
    },
    {
      id: 9,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 35',
      amount: 215000,
      status: 'Approved',
    },
    {
      id: 10,
      pricing_category: 'SURVIVAL ROUND-TIE, STARTING 7',
      match_number: 'Match 37',
      amount: 225.0,
      status: 'Approved',
    },
    {
      id: 11,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 41',
      amount: 330000,
      status: 'Approved',
    },
    {
      id: 12,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 43',
      amount: 150.0,
      status: 'Approved',
    },
    {
      id: 13,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 49',
      amount: 30000,
      status: 'Approved',
    },
    {
      id: 14,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 53',
      amount: 30000,
      status: 'Approved',
    },
  ];

  const tableOptions = {
    columns: {
      render: {
        Action: (value, row) => renderWithdrawalModal(row?.id),
      },
    },
  };

  function renderWithdrawalModal(rowId) {
    const handleClick = () => {
      setShow(true);
      const selectedRow = data.find((row) => row.id === rowId);
      if (selectedRow) {
        setTotalAmount(selectedRow.amount);
      }
    };

    return (
      <Button className="common-btn fs-12 mx-auto text-center" onClick={handleClick}>
        Withdrawal
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
      <WithdrawalModal
        {...{
          totalAmount,
          show,
          setShow,
        }}
      />
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 align-items-stretch h-100">
            <Col lg={12}>
              <div className="mb-4">
                <DashboardBreadcrumb data={'Home'} />
              </div>

              <Card className="bg-white rounded-4 card-border mb-4">
                <Card.Body className="box-padding">
                  <h5 className="common-heading">Rajendra Bhakar</h5>
                  <div className="d-flex align-items-center">
                    <div>
                      <h6 className="section-subtitle">Total Earning:</h6>
                      <h6 className="section-subtitle">Match Fee Earnings:</h6>
                      <h6 className="section-subtitle">Award Earnings:</h6>
                    </div>
                    <div className="ms-4">
                      <h6 className="section-subtitle">&#8377;15,725.00</h6>
                      <h6 className="section-subtitle">&#8377;6,725.00</h6>
                      <h6 className="section-subtitle">&#8377;9,000.00</h6>
                    </div>
                  </div>
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

export default Dashboard;
