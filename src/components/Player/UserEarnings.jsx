import { useAuth } from '@/_context/authContext';
import { getEarnings } from '@/_services/services_api';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

function UserEarnings({ setShow, withdrawalShow }) {
  const { currentUser } = useAuth();
  const user = currentUser?.user_name;

  const amountLeft = currentUser?.Total_Earninig - currentUser?.sumAprovedEarning;
  return (
    <>
      <Row>
        <Col>
          <Card className="bg-white rounded-4 card-border">
            <Card.Body className="box-padding">
              <div className="d-flex justify-content-between">
                <div>
                  <h5 className="common-heading text-capitalize">{user}</h5>
                  <div className="d-flex align-items-center">
                    <div>
                      <h6 className="section-subtitle">Total Earnings:</h6>
                      <h6 className="section-subtitle">Match Fee Earnings:</h6>
                      <h6 className="section-subtitle">Award Earnings:</h6>
                      <h6 className="section-subtitle">Total Approved Withdrawals:</h6>
                      <h6 className="section-subtitle">Total Amount Left:</h6>
                    </div>
                    <div className="ms-4">
                      <h6 className="section-subtitle">&#8377;{currentUser?.Total_Earninig?.toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{currentUser?.sumplayerEarningFee?.toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{currentUser?.sumPlayerOfAwards?.toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{currentUser?.sumAprovedEarning?.toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377; {amountLeft?.toFixed(2)}</h6>
                    </div>
                  </div>
                </div>
                {withdrawalShow == 1 && (
                  <div>
                    <Button className="common-btn" onClick={() => setShow(true)}>
                      Withdraw Amount
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default UserEarnings;
