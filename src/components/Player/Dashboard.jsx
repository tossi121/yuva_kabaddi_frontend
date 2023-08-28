import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Dashboard() {
  return (
    <>
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4 ">
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
        </Container>
      </section>
    </>
  );
}

export default Dashboard;
