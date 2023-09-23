import { getCurrentUsers } from '@/_services/services_api';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Badge, Button, Col, Modal, Row } from 'react-bootstrap';

function AccountModal({ showModal, setShowModal, reviewId }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    handleUser();
  }, []);

  async function handleUser() {
    if (reviewId) {
      const res = await getCurrentUsers(reviewId.userId);
      if (res?.status) {
        const data = res.data;
        setUserData(data);
      }
    }
  }

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <h4 className="base-color mb-0">Account Details </h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Row>
              <Col lg={6}>
                <div className="d-flex align-items-start text-nowrap flex-column">
                  <div >
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">User Name:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.user_name == null && 'N/A') || userData?.user_name}
                      </span>
                    </div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Email:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.email == null && 'N/A') || userData?.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Bank Name:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.bank_name == null && 'N/A') || userData?.bank_name}
                      </span>
                    </div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Account Number:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.account_number == null && 'N/A') || userData?.account_number}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="d-flex align-items-start text-nowrap flex-column">
                  <div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Passbook Verify:</span>

                      {(userData?.passbook_image_verify == null && (
                        <Badge pill bg={'danger'} className="fs-12">
                          Not Verified
                        </Badge>
                      )) || (
                        <Badge pill bg={'info'} className="fs-12">
                          {userData?.passbook_image_verify}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Pan Verify:</span>
                      {(userData?.pan_image_verify == null && (
                        <Badge pill bg={'danger'} className="fs-12">
                          Not Verified
                        </Badge>
                      )) || (
                        <Badge pill bg={'info'} className="fs-12">
                          {userData?.pan_image_verify}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">IFSC Code:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.ifsc_code == null && 'N/A') || userData?.ifsc_code}
                      </span>
                    </div>
                    <div>
                      <span className="fs-16 fw-500 base-color-2 me-2">Branch Name:</span>
                      <span className="fs-16 fw-500 base-color-2">
                        {(userData?.branch_name == null && 'N/A') || userData?.branch_name}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Link href={'/super-admin/account-approval'}>
              <Button className="common-btn py-2 px-3 mt-3 fs-14 m-auto">More Details</Button>
            </Link>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default AccountModal;
