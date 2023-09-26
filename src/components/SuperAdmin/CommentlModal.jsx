import { getMatchPlayers, updatePlayerTransactionStatus, verifyAccount, verifyUser } from '@/_services/services_api';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import ReusableDropdown from '../Player/ReusableDropdown';
import { useRouter } from 'next/router';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const ImagePreview = dynamic(import('./ImagePreview'));

const CommentModal = (props) => {
  const { modalText, setShow, show, reviewId, handleData, selectedIds, setCheckBulk, setSelectedIds } = props;
  const [formValues, setFormValues] = useState({
    comment: reviewId?.comment || '',
    account_verify_comment: reviewId?.account_verify_comment || '',
    status: 'Approved',
    account_verify_status: 'Approved',
    squad: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [panImage, setPanImage] = useState(false);
  const [passImage, setPassImage] = useState(false);
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    if (!show) {
      setSelectedIds([]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = (values) => {
    const errors = {};

    if (values.status === 'Rejected' && !values.comment) {
      errors.comment = 'Please enter a comment';
    }

    if (values.account_verify_status === 'Rejected' && !values.account_verify_comment) {
      errors.comment = 'Please enter a comment';
    }

    return errors;
  };

  useEffect(() => {
    if (reviewId.team_id) {
      handleMatchPlayers();
    }
  }, []);

  useEffect(() => {
    const selectedPlayer = playerData.find((player) => player.playerId === reviewId.player_id);
    if (selectedPlayer) {
      setSelectedPlayer(selectedPlayer);
    }
  }, [playerData, reviewId.player_id]);

  async function handleMatchPlayers() {
    if (path == '/super-admin/users') {
      if (reviewId.team_id) {
        const res = await getMatchPlayers(reviewId.team_id);
        if (res?.status) {
          const data = res.data;
          setPlayerData(data);
        }
      }
    }
  }
  const filteredData = selectedIds.map((user) => {
    return {
      id: user.id,
      playerId: user.player_id,
    };
  });

  const filtered = selectedIds.map((user) => {
    return {
      transactionId: user.id,
    };
  });

  const usersApprovalBulk = filteredData.map((user) => ({
    ...user,
    status: formValues.status,
    comment: (formValues.status == 'Rejected' && formValues.comment) || '',
  }));

  const accountApprovalBulk = filteredData.map((user) => ({
    ...user,
    status: formValues.account_verify_status,
    comment: (formValues.account_verify_status == 'Rejected' && formValues.account_verify_comment) || '',
  }));

  const bulkFilteredData = filtered.map((user) => ({
    ...user,
    status: formValues.status,
    comment: formValues.comment,
  }));

  async function handleVerifyUser() {
    const params = {
      users:
        usersApprovalBulk.length > 0
          ? usersApprovalBulk
          : [
              {
                id: reviewId.id,
                status: formValues.status,
                playerId: selectedPlayer.playerId,
                comment: (formValues.status == 'Rejected' && formValues.comment) || '',
              },
            ],
    };

    const res = await verifyUser(params);
    handleActionResult(res);
  }

  async function handleVerifyAccount() {
    const params = {
      users:
        accountApprovalBulk.length > 0
          ? accountApprovalBulk
          : [
              {
                id: reviewId.id,
                status: formValues.account_verify_status,
                playerId: selectedPlayer.playerId,
                comment: (formValues.account_verify_status == 'Rejected' && formValues.account_verify_comment) || '',
              },
            ],
    };

    const res = await verifyAccount(params);
    handleActionResult(res);
  }

  async function handleTransaction() {
    const params = {
      transaction_status:
        bulkFilteredData.length > 0
          ? bulkFilteredData
          : [
              {
                transactionId: reviewId.id,
                status: formValues.status,
                comment: formValues.comment,
              },
            ],
    };

    const res = await updatePlayerTransactionStatus(params);
    handleActionResult(res);
  }

  function handleActionResult(res) {
    if (res?.status) {
      toast.success(res.message);
      setCheckBulk(true);
      handleData();
    } else {
      toast.error(res.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      if (path === '/super-admin/users') {
        await handleVerifyUser();
      } else if (path === '/super-admin/account-approval') {
        await handleVerifyAccount();
      } else if (path === '/super-admin/withdrawal-approval') {
        await handleTransaction();
      }
      setLoading(false);
      setShow(false);
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setFormValues({ comment: '', status: 'Approved' });
    setFormErrors({});
    setSelectedPlayer('');
    setPlayerData([]);
  };

  return (
    <>
      <ImagePreview {...{ panImage, setPanImage, passImage, setPassImage, reviewId }} />
      <Modal show={show} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <h4 className="base-color mb-0">{modalText}</h4>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={12}>
              <div className="d-flex">
                <h6 className="fs-16 fw-500 base-color me-2">Name:-</h6>
                <h6 className="fs-16 fw-500 base-color">{reviewId?.user_name}</h6>
              </div>
              <Form onSubmit={handleSubmit} autoComplete="off">
                {path == '/super-admin/users' && (
                  <>
                    {!selectedIds.length > 0 && (
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Select Player</Form.Label>
                          <ReusableDropdown
                            options={playerData}
                            selectedValue={selectedPlayer.fullName || 'Select Player'}
                            onSelect={setSelectedPlayer}
                            placeholder="Player"
                            displayKey="fullName"
                            valueKey="playerId"
                          />
                        </Form.Group>
                      </div>
                    )}
                  </>
                )}

                {(path == '/super-admin/account-approval' && (
                  <>
                    <div>
                      <Form.Check
                        inline
                        className="base-color-2 fs-14"
                        label="Approved"
                        type="radio"
                        id="Approved"
                        value="Approved"
                        checked={formValues.account_verify_status === 'Approved'}
                        onChange={handleChange}
                        name="account_verify_status"
                      />
                      <Form.Check
                        inline
                        className="base-color-2 fs-14"
                        label="Reject"
                        type="radio"
                        id="Rejected"
                        value="Rejected"
                        checked={formValues.account_verify_status === 'Rejected'}
                        onChange={handleChange}
                        name="account_verify_status"
                      />
                    </div>
                    <div className="d-flex align-items-center my-3">
                      {(reviewId?.pan_image != null && (
                        <>
                          <div>
                            <p className="fs-16 fw-400 base-color-2 mb-2">PAN Image</p>
                            <div
                              className="preview-img position-relative cursor-pointer"
                              onClick={() => setPanImage(true)}
                            >
                              <Image src={reviewId?.pan_image} width={150} height={100} />
                            </div>
                          </div>
                        </>
                      )) ||
                        ''}
                      {(reviewId?.passbook_image != null && (
                        <>
                          <div className="ms-4">
                            <p className="fs-16 fw-400 base-color-2 mb-2">Passbook Image</p>
                            <div
                              className="preview-img position-relative cursor-pointer"
                              onClick={() => setPassImage(true)}
                            >
                              <Image src={reviewId?.passbook_image} width={150} height={100} />
                            </div>
                          </div>
                        </>
                      )) ||
                        ''}
                    </div>

                    <div className="mb-2">
                      <Form.Group className="position-relative">
                        <Form.Label className="fs-16 fw-400 base-color-2">Enter Comment</Form.Label>
                        <Form.Control
                          type="text"
                          name="account_verify_comment"
                          className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          value={formValues.account_verify_comment}
                          placeholder="Enter Comment"
                          onChange={handleChange}
                          disabled={formValues.account_verify_status !== 'Rejected'}
                        />
                      </Form.Group>
                      {formErrors.comment && <p className="text-danger fs-14 error-message">{formErrors.comment}</p>}
                    </div>
                  </>
                )) || (
                  <>
                    <div className="mb-3">
                      <Form.Check
                        inline
                        className="base-color-2 fs-14"
                        label="Approved"
                        type="radio"
                        id="Approved"
                        value="Approved"
                        checked={formValues.status === 'Approved'}
                        onChange={handleChange}
                        name="status"
                      />
                      <Form.Check
                        inline
                        className="base-color-2 fs-14"
                        label="Reject"
                        type="radio"
                        id="Rejected"
                        value="Rejected"
                        checked={formValues.status === 'Rejected'}
                        onChange={handleChange}
                        name="status"
                      />
                    </div>

                    <div className="mb-2">
                      <Form.Group className="position-relative">
                        <Form.Label className="fs-16 fw-400 base-color-2">Enter Comment</Form.Label>
                        <Form.Control
                          type="text"
                          name="comment"
                          className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          value={formValues.comment}
                          placeholder="Enter Comment"
                          onChange={handleChange}
                          disabled={formValues.status !== 'Rejected'}
                        />
                      </Form.Group>
                      {formErrors.comment && formValues.status === 'Rejected' && (
                        <p className="text-danger fs-14 error-message">{formErrors.comment}</p>
                      )}
                    </div>
                  </>
                )}
                <div className="text-center">
                  <Button
                    variant="white"
                    className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
                    disabled={loading}
                    type="submit"
                  >
                    Save
                    {loading && <Spinner animation="border" variant="white" size="sm" className="ms-2 spinner" />}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommentModal;
