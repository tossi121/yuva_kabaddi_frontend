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
  { label: 'Paid Earnings', icon: faMoneyBills },
  { label: 'Pending Earnings', icon: faMoneyBillAlt },
  { label: 'Rejected Earnings', icon: faMoneyBill1 },
  { label: 'Total Earnings', icon: faMoneyBillTransfer },
];

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const dataRequests = [
    {
      id: 1,
      amount: 30000,
      status: 'Reject',
      date: '2023-08-10',
    },
    {
      id: 2,
      amount: 150.0,
      status: 'Reject',
      date: '2023-08-11',
    },
    {
      id: 3,
      amount: 15000,
      status: 'Reject',
      date: '2023-08-12',
    },
    {
      id: 4,
      amount: 1500.0,
      status: 'Reject',
      date: '2023-08-12',
    },
    {
      id: 5,
      amount: 30000,
      status: 'Pending',
      date: '2023-08-15',
    },
    {
      id: 6,
      amount: 150.0,
      status: 'Paid',
      date: '2023-08-17',
    },
    {
      id: 7,
      amount: 150000,
      status: 'Reject',
      date: '2023-08-17',
    },
    {
      id: 8,
      amount: 300.0,
      status: 'Paid',
      date: '2023-08-20',
    },
    {
      id: 9,
      amount: 215000,
      status: 'Pending',
      date: '2023-08-24',
    },
    {
      id: 10,
      amount: 225.0,
      status: 'Reject',
      date: '2023-08-25',
    },
    {
      id: 11,
      amount: 330000,
      status: 'Paid',
      date: '2023-08-28',
    },
    {
      id: 12,
      amount: 150.0,
      status: 'Pending',
      date: '2023-08-30',
    },
    {
      id: 13,
      amount: 30000,
      status: 'Paid',
      date: '2023-09-02',
    },
    {
      id: 14,
      amount: 30000,
      status: 'Pending',
      date: '2023-09-05',
    },
  ];

  const getRequest = (label) => {
    if (label === 'Total Earnings') {
      return dataRequests.length;
    }
    const statusMapping = {
      'Paid Earnings': 'Paid',
      'Pending Earnings': 'Pending',
      'Rejected Earnings': 'Reject',
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
      counts[date] = { pending: 0, paid: 0, rejected: 0 };
    }

    if (status === 'Pending') {
      counts[date].pending++;
    } else if (status === 'Paid') {
      counts[date].paid++;
    } else if (status === 'Reject') {
      counts[date].rejected++;
    }

    return counts;
  }, {});

  const colors = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];

  const filteredRequestTypes = requestTypes.filter((type) => type.label !== 'Total Earnings');

  const data = {
    labels: Object.keys(requestCountsByDate),
    datasets: filteredRequestTypes.map((type, index) => ({
      label: type.label,
      data: Object.values(requestCountsByDate).map((counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0),
      backgroundColor: colors[index % colors.length],
    })),
  };

  const doughnutData = {
    labels: ['Paid', 'Pending', 'Rejected', 'Total'],
    datasets: [
      {
        data: [
          getRequest('Paid Earnings'),
          getRequest('Pending Earnings'),
          getRequest('Rejected Earnings'),
          getRequest('Total Earnings'),
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
        counts[date] = { pending: 0, paid: 0, rejected: 0 };
      }

      if (status === 'Pending') {
        counts[date].pending++;
      } else if (status === 'Paid') {
        counts[date].paid++;
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
                <h4 className="common-heading mb-0">Price Money Filter</h4>
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
                <h5 className="common-heading">Price Money Chart</h5>
                <Bar data={filteredData || data} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
              <Card.Body>
                <h5 className="common-heading">Price Money Chart</h5>
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
        <Link href={`/dashboard/view-price-money?label=${label}`}>
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
