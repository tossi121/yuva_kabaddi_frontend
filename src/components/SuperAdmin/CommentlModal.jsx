import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';

const CommentModal = ({ setShow, show }) => {
  const [formValues, setFormValues] = useState({
    comment: '',
    status: 'approved',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      // Simulate API call delay
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

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Body>
        <Row>
          <Col lg={12}>
            <Form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-3">
                <Form.Check
                  inline
                  className="base-color-2 fs-14"
                  label="Approved"
                  type="radio"
                  id="approved"
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
                {formErrors.comment && <p className="text-danger fs-14 error-message">{formErrors.comment}</p>}
              </div>
              <div className="text-center">
                <Button
                  variant="white"
                  type="submit"
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
