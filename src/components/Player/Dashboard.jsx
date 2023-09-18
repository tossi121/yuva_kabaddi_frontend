import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getPriceMoney, getWithdrawnRequests } from '@/_services/services_api';
import WithdrawalsChart from './Chart/WithdrawalsChart';
import EarningChart from './Chart/EarningChart';

import {
  faFilter,
  faSearch,
  faMoneyBillAlt,
  faMoneyBillTransfer,
  faMoneyBills,
} from '@fortawesome/free-solid-svg-icons';

import { faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';
import UserEarnings from './UserEarnings';
import { useAuth } from '@/_context/authContext';

const DashboardBreadcrumbComponent = dynamic(import('../Layouts/DashboardBreadcrumbar'));
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [earningsData, setEarningsData] = useState([]);
  const [withdrawalsData, setWithdrawalsData] = useState([]);
  const [filterChart, setFilterChart] = useState([]);
  const [chart, setChart] = useState(false);
  const { currentUser } = useAuth();
  const [show, setShow] = useState(true);

  const requestTypes = [
    { label: 'Paid Withdrawals', icon: faMoneyBills },
    { label: 'Pending Withdrawals', icon: faMoneyBillAlt },
    { label: 'Rejected Withdrawals', icon: faMoneyBill1 },
    { label: 'Total Withdrawals', icon: faMoneyBillTransfer },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [priceMoneyResponse, withdrawnRequestsResponse] = await Promise.all([
          getPriceMoney(),
          getWithdrawnRequests(),
        ]);

        if (priceMoneyResponse?.status) {
          setEarningsData(priceMoneyResponse.data);
        }

        if (withdrawnRequestsResponse?.status) {
          setWithdrawalsData(withdrawnRequestsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [startDate, endDate, filterChart]);

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const getRequest = (label) => {
    if (label === 'Total Withdrawals') {
      return withdrawalsData.length;
    }
    const statusMapping = {
      'Paid Withdrawals': 'Paid',
      'Pending Withdrawals': 'Pending',
      'Rejected Withdrawals': 'Reject',
    };

    const status = statusMapping[label];
    if (status) {
      return withdrawalsData.filter((request) => request.status === status).length;
    }
    return 0;
  };

  const colorsWithdrawals = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];
  const filteredRequestTypes = requestTypes.filter((type) => type.label);

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setChart(false);
  };

  const filterEarningsData = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return earningsData;
    }

    const filteredData = earningsData.filter((entry) => {
      const entryDate = new Date(entry.Date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    return filteredData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const filteredEarningsData = filterEarningsData(startDate, endDate);
    setEarningsData(filteredEarningsData);

    const filteredData = withdrawalsData.filter((request) => {
      const createdAt = new Date(request.createdAt);
      return startDate <= createdAt && createdAt < nextDay;
    });

    const requestCountsByDate = filteredData.reduce((counts, request) => {
      const { createdAt, status } = request;
      const date = new Date(createdAt).toISOString().split('T')[0];
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

    const updatedChartData = {
      labels: Object.keys(requestCountsByDate),
      datasets: filteredRequestTypes.map((type, index) => ({
        label: type.label,
        data: Object.values(requestCountsByDate).map((counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0),
        backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
        barThickness: 60,
        maxBarThickness: 40,
      })),
    };

    setFilterChart(updatedChartData);
    setChart(true);
  };

  return (
    <div className="dashboard-section">
      <Container fluid>
        {currentUser?.comment != null && (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <spna>{currentUser?.comment}</spna>
          </Alert>
        )}
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
                <FontAwesomeIcon icon={faFilter} width={20} height={20} />
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
                          maxDate={new Date()}
                          onChange={handleChangeStartDate}
                          placeholderText="Select Start Date"
                          showTimeSelect={false}
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
                            minDate={startDate}
                            maxDate={new Date()}
                            dateFormat="dd-MMM-yyyy"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          />
                        </Form.Group>
                      </div>
                    </Col>

                    <Col xl={3} lg={4} md={6}>
                      <div className="d-flex align-items-center filters-dropdown-btn">
                        <Button className="common-btn px-3 text-nowrap" type="Submit" disabled={!startDate && !endDate}>
                          <span className="me-2">
                            <FontAwesomeIcon icon={faSearch} width={18} height={18} />
                          </span>
                          Search
                        </Button>
                        <Button
                          className="common-outline-btn px-4 ms-2"
                          onClick={handleReset}
                          type="reset"
                          disabled={!startDate && !endDate}
                        >
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

        <UserEarnings />
        <Row className="my-4">
          {requestTypes.map((type, index) => (
            <Col key={type.label}>
              <DashboardCard icon={type.icon} label={type.label} count={getRequest(type.label)} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col lg={earningsData.length > 0 ? 6 : 12}>
            {withdrawalsData.length > 0 && (
              <WithdrawalsChart withdrawalsData={withdrawalsData} filterChart={filterChart} chart={chart} />
            )}
          </Col>
          <Col lg={withdrawalsData.length > 0 ? 6 : 12}>
            {earningsData.length > 0 && <EarningChart earningsData={earningsData} />}
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
