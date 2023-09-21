import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';

function WithdrawalsChart(props) {
  const { withdrawalsChartData, chartOptions, } = props;

  return (
    <>
      <Row className="align-items-baseline">
        <Col>
          <Card className="common-card-box common-card-shadow w-100">
            <Card.Body>
              <h5 className="card-heading text-center">Withdrawals Chart</h5>
              <Bar data={withdrawalsChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default WithdrawalsChart;
