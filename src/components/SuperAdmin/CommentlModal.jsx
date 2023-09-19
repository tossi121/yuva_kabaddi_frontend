import { getMatchPlayers, updatePlayerTransactionStatus, verifyUser } from '@/_services/services_api';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import ReusableDropdown from '../Player/ReusableDropdown';
import { useRouter } from 'next/router';

const CommentModal = (props) => {
  const { modalText, setShow, show, reviewId, handleData, selectedIds, setCheckBulk } = props;
  const [formValues, setFormValues] = useState({
    comment: '',
    status: 'Approved',
    squad: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const router = useRouter();
  const path = router.pathname;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === 'status') {
      setFormValues((prevValues) => ({ ...prevValues, comment: '' }));
    }
  };

  const validate = (values) => {
    const errors = {};

    if (values.status === 'rejected' && !values.comment) {
      errors.comment = 'Please enter a comment';
    }

    return errors;
  };

  useEffect(() => {
    if (reviewId?.match_id) {
      handleMatchPlayers();
    }
  }, []);

  useEffect(() => {
    const selectedPlayerData = playerData.find((i) => i.player_id === reviewId.player_id);
    if (selectedPlayerData) {
      setSelectedPlayer(selectedPlayerData);
    }
  }, [playerData]);

  async function handleMatchPlayers() {
    if (reviewId.match_id) {
      const res = await getMatchPlayers(reviewId.match_id);
      if (res?.status) {
        const data = res.data;
        setPlayerData(data);
      }
    }
  }

  const filteredData = selectedIds.map((user) => {
    return {
      id: user.id,
      playerId: user.player_id,
    };
  });

  const bulkData = filteredData.map((user) => ({
    ...user,
    status: formValues.status,
    comment: formValues.comment,
  }));

  async function handleVerifyUser() {
    const params = {
      users:
        bulkData.length > 0
          ? bulkData
          : [
              {
                id: reviewId.id,
                status: formValues.status,
                playerId: selectedPlayer.player_id,
                comment: formValues.comment,
              },
            ],
    };

    const res = await verifyUser(params);
    if (res?.status) {
      toast.success(res.message);
      setCheckBulk(true);
      handleData();
    } else {
      toast.error(res.message);
    }
  }

  console.log(reviewId);
  async function handleTransaction() {
    const params = {
      transaction_status: [
        {
          transactionId: reviewId.id,
          status: formValues.status,
          comment: formValues.comment,
        },
      ],
    };

    const res = await updatePlayerTransactionStatus(params);
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
      if (path === '/super-admin/users path') {
        handleVerifyUser();
      } else if (path === '/super-admin/withdrawal-approval') {
        handleTransaction();
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
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <h4 className="base-color mb-0">{modalText} </h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={12}>
            <Form onSubmit={handleSubmit} autoComplete="off">
              {selectedPlayer.player_name && (
                <div className="mb-3">
                  <Form.Group className="position-relative">
                    <Form.Label className="fs-16 fw-400 base-color">Select Player</Form.Label>
                    <ReusableDropdown
                      options={playerData}
                      selectedValue={selectedPlayer.player_name || 'Select Player'}
                      onSelect={setSelectedPlayer}
                      placeholder="Player"
                      displayKey="player_name"
                      valueKey="player_id"
                    />
                    {formErrors.player_name && (
                      <p className="text-danger fs-14 error-message">{formErrors.player_name}</p>
                    )}
                  </Form.Group>
                </div>
              )}

              <div className="mb-3">
                <Form.Check
                  inline
                  className="base-color-2 fs-14"
                  label="Approved"
                  type="radio"
                  id="approve"
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
                  id="rejected"
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
  );
};

export default CommentModal;
