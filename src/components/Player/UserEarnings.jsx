import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useAuth } from '@/_context/authContext';
import toast from 'react-hot-toast';

function UserEarnings({ setShow, withdrawalShow }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <></>;
  }

  const { user_name, Total_Earninig, sumplayerEarningFee, sumPlayerOfAwards, sumAprovedEarning } = currentUser;
  const amountLeft = (Total_Earninig ?? 0) - (sumAprovedEarning ?? 0);

  function renderEarningsDetails() {
    return (
      <div>
        <h6 className="section-subtitle">Total Earnings:</h6>
        <h6 className="section-subtitle">Match Fee Earnings:</h6>
        <h6 className="section-subtitle">Award Earnings:</h6>
        <h6 className="section-subtitle">Total Approved Withdrawals:</h6>
        <h6 className="section-subtitle">Total Amount Left:</h6>
      </div>
    );
  }

  function handleUser() {
    if (currentUser?.account_verify_status == 'Approved') {
      setShow(true);
    } else {
      toast.error('Account not Approved');
    }
  }

  return (
    <>
      <Row>
        <Col>
          <Card className="bg-white rounded-4 card-border">
            <Card.Body className="box-padding">
              <div className="d-sm-flex justify-content-between">
                <div>
                  <h5 className="common-heading text-capitalize">{user_name}</h5>
                  <div className="d-flex align-items-center">
                    <div>{renderEarningsDetails()}</div>
                    <div className="ms-4">
                      <h6 className="section-subtitle">&#8377;{(Total_Earninig ?? 0).toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{(sumplayerEarningFee ?? 0).toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{(sumPlayerOfAwards ?? 0).toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{(sumAprovedEarning ?? 0).toFixed(2)}</h6>
                      <h6 className="section-subtitle">&#8377;{amountLeft.toFixed(2)}</h6>
                    </div>
                  </div>
                </div>
                {withdrawalShow === 1 && (
                  <div>
                    <Button className="common-btn" onClick={handleUser}>
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
