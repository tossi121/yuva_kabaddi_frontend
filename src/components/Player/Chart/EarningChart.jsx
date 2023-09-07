import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';

function EarningChart({ chartDataFinal, chartOptions, earningsDoughnutData }) {
  return (
    <>
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
    </>
  );
}

export default EarningChart;
