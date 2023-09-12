import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';

function WithdrawalsChart(props) {
  const { withdrawalsChartData, chartOptions, getRequest, colorsWithdrawals } = props;
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

  return (
    <>
      <Row className="align-items-baseline">
        <Col>
          <Card className="common-card-box common-card-shadow transition w-100">
            <Card.Body>
              <h5 className="card-heading text-center">Withdrawals Chart</h5>
              <Bar data={withdrawalsChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
          {/* <Col lg={3}>
            <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
              <Card.Body>
                <h5 className="common-heading text-center">Withdrawals Chart</h5>
                <Doughnut data={doughnutData} />
              </Card.Body>
            </Card>
          </Col> */}
      </Row>
    </>
  );
}

export default WithdrawalsChart;
