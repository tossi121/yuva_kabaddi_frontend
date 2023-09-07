import React, { useEffect, useState } from 'react';
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
import { getEarnings, getPriceMoney, getWithdrawnRequests } from '@/_services/services_api';
import { useAuth } from '@/_context/authContext';

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
  const [filteredData, setFilteredData] = useState(null);
  const [filteredEarningsData, setFilteredEarningsData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [dataRequests, setDataRequests] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  async function fetchData() {
    const [earningsResponse, priceMoneyResponse, withdrawnRequestsResponse] = await Promise.all([
      getEarnings(),
      getPriceMoney(),
      getWithdrawnRequests(),
    ]);

    if (earningsResponse?.status) {
      setPlayerData(earningsResponse.data);
    }

    if (priceMoneyResponse?.status) {
      setEarningsData(priceMoneyResponse.data);
    }

    if (withdrawnRequestsResponse?.status) {
      setDataRequests(withdrawnRequestsResponse.data);
    }
  }

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

  const requestCountsByDate = dataRequests.reduce((counts, request) => {
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
  const colorsEarnings = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];

  const filteredRequestTypes = requestTypes.filter((type) => type.label !== 'Total Withdrawals');

  const withdrawalsChartData = {
    labels: Object.keys(requestCountsByDate),
    datasets: filteredRequestTypes.map((type, index) => ({
      label: type.label,
      data: Object.values(requestCountsByDate).map((counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0),
      backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
      barThickness: 60,
      maxBarThickness: 40,
    })),
  };

  const chartData = earningsData.reduce(
    (data, entry) => {
      const { Date, priceFor, priceAmount } = entry;

      if (!data.labels.includes(Date)) {
        data.labels.push(Date);
        data.matchFeePrices.push(0);
        data.awardPrices.push(0);
      }

      const dateIndex = data.labels.indexOf(Date);

      if (priceFor === 'match_fee') {
        data.matchFeePrices[dateIndex] += parseFloat(priceAmount);
      } else if (priceFor === 'award') {
        data.awardPrices[dateIndex] += parseFloat(priceAmount);
      }

      return data;
    },
    {
      labels: [],
      matchFeePrices: [],
      awardPrices: [],
    }
  );

  const chartDatasets = [
    {
      label: 'Match Fee',
      backgroundColor: colorsEarnings[0],
      data: chartData.matchFeePrices,
      barThickness: 60,
      maxBarThickness: 40,
    },
    {
      label: 'Award',
      backgroundColor: colorsEarnings[1],
      data: chartData.awardPrices,
      barThickness: 60,
      maxBarThickness: 40,
    },
  ];

  const chartDataFinal = {
    labels: chartData.labels,
    datasets: chartDatasets,
  };

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

  const doughnutData = {
    labels: ['Paid', 'Pending', 'Rejected', 'Total'],
    datasets: [
      {
        data: [
          getRequest('Paid Withdrawals'),
          getRequest('Pending Withdrawals'),
          getRequest('Rejected Withdrawals'),
          getRequest('Total Withdrawals'),
        ],
        backgroundColor: colorsWithdrawals,
      },
    ],
  };

  const earningsLeft = playerData?.Total_Earninig - playerData?.sumAprovedEarning;

  const earningsDoughnutData = {
    labels: ['Match Fee', 'Awards', 'Approved', 'Amount Left'],
    datasets: [
      {
        data: [
          playerData?.sumplayerEarningFee,
          playerData?.sumPlayerOfAwards,
          playerData?.sumAprovedEarning,
          earningsLeft,
        ],
        backgroundColor: colorsEarnings,
      },
    ],
  };

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData(null);
    setFilteredEarningsData(null);
  };

  const filterChartDataByDate = (start, end) => {
    if (!start || !end) {
      return withdrawalsChartData;
    }

    const adjustedEndDate = new Date(end);
    adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

    const filteredData = dataRequests.filter((request) => {
      const requestDate = new Date(request.createdAt);
      return start <= requestDate && requestDate < adjustedEndDate;
    });

    const requestCountsByDate = {};

    filteredData.forEach((request) => {
      const { createdAt, status } = request;
      const date = new Date(createdAt).toISOString().split('T')[0];

      if (!requestCountsByDate[date]) {
        requestCountsByDate[date] = { pending: 0, paid: 0, rejected: 0 };
      }

      if (status === 'Pending') {
        requestCountsByDate[date].pending++;
      } else if (status === 'Paid') {
        requestCountsByDate[date].paid++;
      } else if (status === 'Reject') {
        requestCountsByDate[date].rejected++;
      }
    });

    const labels = Object.keys(requestCountsByDate);
    const datasets = filteredRequestTypes.map((type, index) => ({
      label: type.label,
      data: labels.map((date) => requestCountsByDate[date][type.label.toLowerCase().split(' ')[0]] || 0),
      backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
      barThickness: 60,
      maxBarThickness: 40,
    }));

    const filteredChartData = {
      labels: labels,
      datasets: datasets,
    };

    return filteredChartData;
  };

  const filterEarningsData = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return earningsData;
    }

    const filteredData = earningsData.filter((entry) => {
      const entryDate = new Date(entry.Date);
      return entryDate >= startDate && entryDate < endDate;
    });

    return filteredData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredChartData = filterChartDataByDate(startDate, endDate);
    const filteredEarnings = filterEarningsData(startDate, endDate);
    console.log('filteredChartData:', filteredChartData);
    console.log('filteredEarnings:', filteredEarnings);
    setFilteredData(filteredChartData);
    setFilteredEarningsData(filteredEarnings);
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
                    <h6 className="section-subtitle">Total Earnings:</h6>
                    <h6 className="section-subtitle">Match Fee Earnings:</h6>
                    <h6 className="section-subtitle">Award Earnings:</h6>
                    <h6 className="section-subtitle">Total Approved Withdrawals:</h6>
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
        <Row className="align-items-baseline">
          <Col lg={9}>
            <Card className="common-card-box common-card-shadow transition w-100">
              <Card.Body>
                <h5 className="common-heading text-center">Withdrawals Chart</h5>
                <Bar data={filteredData || withdrawalsChartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
              <Card.Body>
                <h5 className="common-heading text-center">Withdrawals Chart</h5>
                <Doughnut data={doughnutData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="align-items-baseline">
          <Col lg={9}>
            <Card className="common-card-box common-card-shadow transition w-100">
              <Card.Body>
                <h5 className="common-heading text-center">Earning Chart</h5>
                <Bar data={chartDataFinal} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
              <Card.Body>
                <h5 className="common-heading text-center">Earning Chart</h5>
                <Doughnut data={earningsDoughnutData} />
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
