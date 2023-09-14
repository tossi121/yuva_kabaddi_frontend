import { verifyUser } from '@/_services/services_api';
import React, { useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row, Spinner } from 'react-bootstrap';

const CommentModal = (props) => {
  const { modalText, setShow, show, reviewId } = props;
  const [selectedSquad, setSelectedSquad] = useState('');
  const [searchSquad, setSearchSquad] = useState('');

  const [formValues, setFormValues] = useState({
    comment: '',
    status: 'approved',
    squad: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === 'status') {
      setFormValues((prevValues) => ({ ...prevValues, comment: '' }));
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.comment) {
      errors.comment = 'Please enter a comment';
    }

    return errors;
  };

  console.log(reviewId, "id")
  async function handleVerifyUser() {
    const params = {
      users: [
        {
          id: id,
          status: 'Rejected',
          playerId: player_id,
        },
      ],
    };
    const res = await verifyUser(params);
    if (res?.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShow(false);
      }, 1500);
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setFormValues({ comment: '', status: 'approved' });
    setFormErrors({});
  };

  const handleSquadSelect = (selectedSquad) => {
    setSelectedSquad(selectedSquad);
    setSearchSquad('');
    setFormValues((prevData) => ({ ...prevData, squad: selectedSquad }));
    setFormErrors((prevErrors) => ({ ...prevErrors, squad: '' }));
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
              <div className="mb-3">
                <Form.Group className="position-relative">
                  <Form.Label className="fs-16 fw-400 base-color-2">Select Squad</Form.Label>
                  <div className="form-select-catgory">
                    <Dropdown className="form-control px-0 py-0 card-border">
                      <Dropdown.Toggle
                        variant="none"
                        className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                        id="dropdown-basic"
                      >
                        <span className="text-truncate pe-3">{selectedSquad || 'Select Squad'}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100 card-border overflow-auto dropdown-height">
                        <div className="px-2 mb-2">
                          <input
                            type="search"
                            placeholder="Search Squad"
                            onChange={(e) => setSearchSquad(e.target.value)}
                            className="form-control shadow-none card-border fs-14 hight-50"
                          />
                        </div>

                        {[
                          'Velavan Muruganantham',
                          'Kesavan Raja',
                          'S Manikandan Sudalaimani',
                          'S Marimuthu Selvam',
                          'Manikandan Nesamani',
                          'Surya Selvam',
                          'S Santhosh Srinivasan',
                          'Ajainandha Krishna',
                          'Balaganapathi Manikam',
                          'S Abikumar',
                          'Ezhumalai Moorthy',
                        ]
                          .filter((squad) => squad.toLowerCase().includes(searchSquad.toLowerCase()))
                          .map((squad) => (
                            <Dropdown.Item
                              key={squad}
                              className={`py-2 fs-14 base-color ${selectedSquad === squad ? 'active' : ''}`}
                              onClick={() => handleSquadSelect(squad)}
                            >
                              {squad}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  {formErrors.squad && <p className="text-danger fs-14 error-message">{formErrors.squad}</p>}
                </Form.Group>
              </div>

              <div className="mb-3">
                <Form.Check
                  inline
                  className="base-color-2 fs-14"
                  label="Approved"
                  type="radio"
                  id="approve"
                  value="approved"
                  checked={formValues.status === 'approved'}
                  onChange={handleChange}
                  name="status"
                />
                <Form.Check
                  inline
                  className="base-color-2 fs-14"
                  label="Reject"
                  type="radio"
                  id="rejected"
                  value="rejected"
                  checked={formValues.status === 'rejected'}
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
                    disabled={formValues.status !== 'rejected'}
                  />
                </Form.Group>
                {formErrors.comment && formValues.status === 'rejected' && (
                  <p className="text-danger fs-14 error-message">{formErrors.comment}</p>
                )}
              </div>
              <div className="text-center">
                <Button
                  variant="white"
                  className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
                  disabled={loading}
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
