import React, { useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1, faMoneyBillAlt, faMoneyBillTransfer, faMoneyBills } from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));
const requestTypes = [
  { label: 'Approved Earnings', icon: faMoneyBills },
  { label: 'Pending Earnings', icon: faMoneyBillAlt },
  { label: 'Rejected Earnings', icon: faMoneyBill1 },
  { label: 'Total Earnings', icon: faMoneyBillTransfer },
];

function Dashboard() {
  const [filteredData, setFilteredData] = useState(null);

  const dataRequests = [
    {
      id: 1,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 2',
      amount: 30000,
      winning_date: '2023-08-10',
    },
    {
      id: 2,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 6',
      amount: 150.0,
      winning_date: '2023-08-11',
    },
    {
      id: 3,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 8',
      amount: 15000,
      winning_date: '2023-08-12',
    },
    {
      id: 4,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 8',
      amount: 1500.0,
      winning_date: '2023-08-12',
    },
    {
      id: 5,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 19',
      amount: 30000,
      winning_date: '2023-08-15',
    },
    {
      id: 6,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 23',
      amount: 150.0,
      winning_date: '2023-08-17',
    },
    {
      id: 7,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 23',
      amount: 150000,
      winning_date: '2023-08-17',
    },
    {
      id: 8,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 28',
      amount: 300.0,
      winning_date: '2023-08-20',
    },
    {
      id: 9,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 35',
      amount: 215000,
      winning_date: '2023-08-24',
    },
    {
      id: 10,
      pricing_category: 'SURVIVAL ROUND-TIE, STARTING 7',
      match_number: 'Match 37',
      amount: 225.0,
      winning_date: '2023-08-25',
    },
    {
      id: 11,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 41',
      amount: 330000,
      winning_date: '2023-08-28',
    },
    {
      id: 12,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 43',
      amount: 150.0,
      winning_date: '2023-08-30',
    },
    {
      id: 13,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 49',
      amount: 30000,
      winning_date: '2023-09-02',
    },
    {
      id: 14,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 53',
      amount: 30000,
      winning_date: '2023-09-05',
    },
  ];

  const getRequest = (label) => {
    if (label === 'Total Earnings') {
      return dataRequests.length;
    }
    const statusMapping = {
      'Approved Earnings': 'Approved',
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
          getRequest('Approved Earnings'),
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
    <>
      <section className="dashboard-section">
        <Container fluid>
          <Row className="mt-4 ">
            <Col lg={12}>
              <div className="mb-4">
                <DashboardBreadcrumb data={'Dashboard'} />
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
      </section>
    </>
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
