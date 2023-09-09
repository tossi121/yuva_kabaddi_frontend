import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getSpent, getWithdrawnRequestsList } from '@/_services/services_api';
import { useAuth } from '@/_context/authContext';
import WithdrawalsChart from './Chart/WithdrawalsChart';

import {
  faFilter,
  faSearch,
  faMoneyBillAlt,
  faMoneyBillTransfer,
  faMoneyBills,
} from '@fortawesome/free-solid-svg-icons';

import { faMoneyBill1 } from '@fortawesome/free-regular-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardBreadcrumbComponent = dynamic(import('../Layouts/DashboardBreadcrumbar'));

const requestTypes = [
  { label: 'Paid Withdrawals', icon: faMoneyBills },
  { label: 'Pending Withdrawals', icon: faMoneyBillAlt },
  { label: 'Rejected Withdrawals', icon: faMoneyBill1 },
  { label: 'Total Withdrawals', icon: faMoneyBillTransfer },
];

function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [dataRequests, setDataRequests] = useState([]);
  const [earningsData, setEarningsData] = useState([]);
  const [earningsChartData, setEarningsChartData] = useState([]);
  const [withdrawalsChartData, setWithdrawalsChartData] = useState({
    labels: [],
    datasets: [],
  });

  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const [earningsResponse, withdrawnRequestsResponse] = await Promise.all([
          getSpent(),
          getWithdrawnRequestsList(),
        ]);

        if (earningsResponse?.status) {
          setPlayerData(earningsResponse.data);
        }

        if (withdrawnRequestsResponse?.status) {
          const data = withdrawnRequestsResponse.data;

          const requestCountsByDate = data.reduce((counts, request) => {
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

          const colorsWithdrawals = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];

          const filteredRequestTypes = requestTypes.filter((type) => type.label !== 'Total Withdrawals');

          const updatedChartData = {
            labels: Object.keys(requestCountsByDate),
            datasets: filteredRequestTypes.map((type, index) => ({
              label: type.label,
              data: Object.values(requestCountsByDate).map(
                (counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0
              ),
              backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
              barThickness: 60,
              maxBarThickness: 40,
            })),
          };

          setWithdrawalsChartData(updatedChartData);
          setDataRequests(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [startDate, endDate]);

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const getRequest = (label) => {
    if (label === 'Total Withdrawals') {
      return dataRequests.length;
    }
    const statusMapping = {
      'Paid Withdrawals': 'Paid',
      'Pending Withdrawals': 'Pending',
      'Rejected Withdrawals': 'Reject',
    };

    const status = statusMapping[label];
    if (status) {
      return dataRequests.filter((request) => request.status === status).length;
    }
    return 0;
  };

  const colorsWithdrawals = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];

  const filteredRequestTypes = requestTypes.filter((type) => type.label !== 'Total Withdrawals');

  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
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
    const filteredData = dataRequests.filter((request) => {
      const createdAt = new Date(request.createdAt);
      return startDate <= createdAt && createdAt < nextDay;
    });

    const requestCountsByDateFiltered = filteredData.reduce((counts, request) => {
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

    const filteredChartData = {
      labels: Object.keys(requestCountsByDateFiltered),
      datasets: filteredRequestTypes.map((type, index) => ({
        label: type.label,
        data: Object.values(requestCountsByDateFiltered).map(
          (counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0
        ),
        backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
        barThickness: 60,
        maxBarThickness: 40,
      })),
    };

    setWithdrawalsChartData(filteredChartData);
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
                <h5 className="common-heading text-capitalize">{user}</h5>
                <div className="d-flex align-items-baseline">
                  <div>
                    <h6 className="section-subtitle">Total Money Spent:</h6>
                    <h6 className="section-subtitle">Fees Paid for Matches:</h6>
                    <h6 className="section-subtitle">Used for Awards:</h6>
                    <h6 className="section-subtitle">Total Accepted Expenses:</h6>
                  </div>
                  <div className="ms-4">
                    <h6 className="section-subtitle">&#8377;{playerData?.Total_Earninig}</h6>
                    <h6 className="section-subtitle">&#8377;{playerData?.sumplayerEarningFee}</h6>
                    <h6 className="section-subtitle">&#8377;{playerData?.sumPlayerOfAwards}</h6>
                    <h6 className="section-subtitle">&#8377;{playerData?.sumAprovedEarning}</h6>
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

        <WithdrawalsChart
          withdrawalsChartData={withdrawalsChartData || filteredChartData}
          chartOptions={chartOptions}
          getRequest={getRequest}
          colorsWithdrawals={colorsWithdrawals}
        />
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
