import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faSearch,
  faMoneyBillAlt,
  faMoneyBillTransfer,
  faMoneyBills,
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardBreadcrumbComponent = dynamic(import('../Layouts/DashboardBreadcrumbar'));

const requestTypes = [
  { label: 'Approved Requests', icon: faMoneyBills },
  { label: 'Pending Requests', icon: faMoneyBillAlt },
  { label: 'Rejected Requests', icon: faMoneyBill1 },
  { label: 'Total Requests', icon: faMoneyBillTransfer },
];

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const dataRequests = [
    {
      receiptNo: 'RCPT001',
      status: 'Approved',
      amount: 250.0,
      name: 'John Doe',
      date: '2023-04-18',
      email: 'john.doe@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT002',
      status: 'Pending',
      amount: 150.0,
      name: 'Jane Smith',
      date: '2023-03-17',
      email: 'jane.smith@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT003',
      status: 'Approved',
      amount: 350.0,
      name: 'Michael Johnson',
      date: '2023-02-16',
      email: 'michael.johnson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT004',
      status: 'Pending',
      amount: 200.0,
      name: 'Emily Brown',
      date: '2023-08-10',
      email: 'emily.brown@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT005',
      status: 'Reject',
      amount: 180.0,
      name: 'David Lee',
      date: '2023-08-10',
      email: 'david.lee@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT006',
      status: 'Pending',
      amount: 300.0,
      name: 'Sarah Johnson',
      date: '2023-12-21',
      email: 'sarah.johnson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT007',
      status: 'Reject',
      amount: 400.0,
      name: 'Robert Smith',
      date: '2023-12-30',
      email: 'robert.smith@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT008',
      status: 'Pending',
      amount: 220.0,
      name: 'Michelle White',
      date: '2023-08-10',
      email: 'michelle.white@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT009',
      status: 'Reject',
      amount: 270.0,
      name: 'Daniel Johnson',
      date: '2023-08-10',
      email: 'daniel.johnson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT010',
      status: 'Pending',
      amount: 130.0,
      name: 'Olivia Davis',
      date: '2023-08-17',
      email: 'olivia.davis@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT011',
      status: 'Approved',
      amount: 320.0,
      name: 'William Brown',
      date: '2023-0-16',
      email: 'william.brown@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT012',
      status: 'Pending',
      amount: 190.0,
      name: 'Emma Johnson',
      date: '2023-09-10',
      email: 'emma.johnson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT013',
      status: 'Reject',
      amount: 210.0,
      name: 'James Wilson',
      date: '2023-08-11',
      email: 'james.wilson@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT014',
      status: 'Pending',
      amount: 280.0,
      name: 'Sophia Martin',
      date: '2023-08-10',
      email: 'sophia.martin@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT015',
      status: 'Approved',
      amount: 370.0,
      name: 'Christopher Adams',
      date: '2023-08-02',
      email: 'christopher.adams@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT016',
      status: 'Pending',
      amount: 240.0,
      name: 'Ava Wilson',
      date: '2023-08-09',
      email: 'ava.wilson@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT017',
      status: 'Approved',
      amount: 290.0,
      name: 'Matthew Turner',
      date: '2023-08-10',
      email: 'matthew.turner@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT018',
      status: 'Pending',
      amount: 170.0,
      name: 'Isabella Moore',
      date: '2023-08-17',
      email: 'isabella.moore@example.com',
      userType: 'Player',
    },
    {
      receiptNo: 'RCPT019',
      status: 'Approved',
      amount: 420.0,
      name: 'Andrew Parker',
      date: '2023-04-11',
      email: 'andrew.parker@example.com',
      userType: 'Coach',
    },
    {
      receiptNo: 'RCPT020',
      status: 'Pending',
      amount: 180.0,
      name: 'Mia Turner',
      date: '2023-06-10',
      email: 'mia.turner@example.com',
      userType: 'Coach',
    },
  ];

  const getRequest = (label) => {
    if (label === 'Total Requests') {
      return dataRequests.length;
    }
    const statusMapping = {
      'Approved Requests': 'Approved',
      'Pending Requests': 'Pending',
      'Rejected Requests': 'Reject',
    };

    const status = statusMapping[label];
    if (status) {
      return dataRequests.filter((request) => request.status === status).length;
    }
    return 0;
  };

  const requestCountsByDate = dataRequests.reduce((counts, request) => {
    const { date, status } = request;
    if (!counts[date]) {
      counts[date] = { pending: 0, approved: 0, rejected: 0 };
    }

    if (status === 'Pending') {
      counts[date].pending++;
    } else if (status === 'Approved') {
      counts[date].approved++;
    } else if (status === 'Reject') {
      counts[date].rejected++;
    }

    return counts;
  }, {});

  const colors = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];

  const filteredRequestTypes = requestTypes.filter((type) => type.label !== 'Total Requests');

  const data = {
    labels: Object.keys(requestCountsByDate),
    datasets: filteredRequestTypes.map((type, index) => ({
      label: type.label,
      data: Object.values(requestCountsByDate).map((counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0),
      backgroundColor: colors[index % colors.length],
    })),
  };
  const doughnutData = {
    labels: ['Approved', 'Pending', 'Rejected', 'Total'],
    datasets: [
      {
        data: [
          getRequest('Approved Requests'),
          getRequest('Pending Requests'),
          getRequest('Rejected Requests'),
          getRequest('Total Requests'),
        ],
        backgroundColor: colors,
      },
    ],
  };
  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredRequests = dataRequests.filter((request) => {
      const requestDate = new Date(request.date);
      return (!startDate || requestDate >= startDate) && (!endDate || requestDate <= endDate);
    });

    const filteredRequestCountsByDate = filteredRequests.reduce((counts, request) => {
      const { date, status } = request;
      if (!counts[date]) {
        counts[date] = { pending: 0, approved: 0, rejected: 0 };
      }

      if (status === 'Pending') {
        counts[date].pending++;
      } else if (status === 'Approved') {
        counts[date].approved++;
      } else if (status === 'Reject') {
        counts[date].rejected++;
      }

      return counts;
    }, {});

    const filteredData = {
      labels: Object.keys(filteredRequestCountsByDate),
      datasets: requestTypes.map((type, index) => ({
        label: type.label,
        data: Object.values(filteredRequestCountsByDate).map(
          (counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0
        ),
        backgroundColor: colors[index % colors.length],
      })),
    };

    setFilteredData(filteredData);
  };

  return (
    <div className="dashboard-section">
      <Container fluid>
        <Row className="mt-4">
          <Col lg={12}>
            <div className="d-flex justify-content-between">
              <div className="mb-4">
                <DashboardBreadcrumbComponent data={'Dashboard'} />
              </div>
              <Button
                className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                onClick={toggleFilterBox}
              >
                <FontAwesomeIcon icon={faFilter} className="fs-18" />
              </Button>
            </div>

            <Card
              className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
            >
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">View Price Money Filter</h4>
              </div>

              <Card.Body className="box-padding">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xl={3} lg={4} md={6}>
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
                    <Col xl={3} lg={4} md={6}>
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

                    <Col xl={3} lg={4} md={6}>
                      <div className="d-flex align-items-center filters-dropdown-btn">
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
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className="bg-white rounded-4 card-border">
              <Card.Body className="box-padding">
                <h5 className="common-heading">Super Admin</h5>
                <div className="d-flex align-items-center">
                  <div>
                    <h6 className="section-subtitle">Total Spent:</h6>
                    <h6 className="section-subtitle">Match Fee Spent:</h6>
                    <h6 className="section-subtitle">Award Spent:</h6>
                  </div>
                  <div className="ms-4">
                    <h6 className="section-subtitle">&#8377;15,725.00</h6>
                    <h6 className="section-subtitle">&#8377;6,725.00</h6>
                    <h6 className="section-subtitle">&#8377;9,000.00</h6>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="my-4">
          {requestTypes.map((type, index) => (
            <Col key={type.label}>
              <DashboardCard icon={type.icon} label={type.label} count={getRequest(type.label)} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col lg={9}>
            <Card className="common-card-box common-card-shadow transition w-100">
              <Card.Body>
                <h5 className="common-heading">Withdrawal Requests Chart</h5>
                <Bar data={filteredData || data} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
              <Card.Body>
                <h5 className="common-heading">Withdrawal Requests Chart</h5>
                <Doughnut data={doughnutData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function DashboardCard({ icon, label, count }) {
  return (
    <Card className="common-card-box h-100 dashboard-home-card common-card-shadow transition">
      <Card.Body>
        <Link href={`/super-admin/withdrawal-approval?label=${label}`}>
          <div className="d-flex align-items-center">
            <div className="booking-image">
              <FontAwesomeIcon icon={icon} width={50} height={50} className="base-link-color" />
            </div>
            <div className="booking-count-box ms-4">
              <h3 className="home-card-heading fw-700 mb-1 base-color">{count}</h3>
              <p className="fs-18 base-color-2 mb-0">{label}</p>
            </div>
          </div>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default Dashboard;
