import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

function CommentModal(props) {
  const { setShow, show } = props;

  const [formValues, setFormValues] = useState({
    rejected: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors('');
  };

  const validate = (values) => {
    const errors = {};

    if (!values.rejected) {
      errors.rejected = 'Please enter comment';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);

    if (Object.keys(errors).length === 0) {
      // Handle form submission here (e.g., API call)
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
    setFormValues('');
    setFormErrors({});
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-2">
            <Form.Group className="position-relative">
              <Form.Label className="fs-16 fw-400 base-color-1"> Enter Comment</Form.Label>
              <Form.Control
                type="text"
                name="rejected"
                className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                value={formValues.rejected}
                placeholder="Enter Comment"
                onChange={handleChange}
              />
            </Form.Group>
            {formErrors.rejected && <p className="text-danger fs-14 error-message">{formErrors.rejected}</p>}
          </div>
          <div className="text-center">
            <Button
              variant="white"
              type="submit"
              className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
              disabled={loading}
            >
              Add Comment
              {loading && <Spinner animation="border" variant="white" size="sm" className="ms-2 spinner" />}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CommentModal;
