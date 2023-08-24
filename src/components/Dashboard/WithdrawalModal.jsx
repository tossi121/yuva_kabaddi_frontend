import { validWithdrawalAmount } from '@/_helper/regex';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';

function WithdrawalModal(props) {
  const { setShow, show, totalAmount } = props;
  const [formValues, setFormValues] = useState({
    totalAmount: totalAmount,
    withdrawalAmount: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      totalAmount: totalAmount,
    }));
  }, [totalAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleKeyPress = (e) => {
    const { key } = e;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.withdrawalAmount) {
      errors.withdrawalAmount = 'Please enter withdrawal amount';
    } else if (!validWithdrawalAmount(values.withdrawalAmount)) {
      errors.withdrawalAmount = 'Please enter a valid amount';
    } else if (parseFloat(values.withdrawalAmount) > parseFloat(values.totalAmount)) {
      errors.withdrawalAmount = 'Withdrawal amount cannot exceed the available amount';
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
        setFormValues((prevValues) => ({ ...prevValues, withdrawalAmount: '' }));
        setFormErrors({});
      }, 1500);
    } else {
      setFormErrors(errors);
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setFormValues((prevValues) => ({ ...prevValues, withdrawalAmount: '' }));
    setFormErrors({});
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-2">
            <Form.Group className="position-relative">
              <Form.Label className="fs-16 fw-400 base-color-1">Amount Available</Form.Label>
              <Form.Control
                type="text"
                name="totalAmount"
                className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                value={formValues.totalAmount}
                readOnly
              />
            </Form.Group>
          </div>
          <div className="mb-2">
            <Form.Group className="position-relative">
              <Form.Label className="fs-16 fw-400 base-color-1">Enter Amount to Withdrawal</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Amount to Withdraw"
                name="withdrawalAmount"
                className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                value={formValues.withdrawalAmount}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              {formErrors.withdrawalAmount && (
                <p className="text-danger fs-14 error-message">{formErrors.withdrawalAmount}</p>
              )}
            </Form.Group>
          </div>
          <div className="text-center">
            <Button
              variant="white"
              type="submit"
              className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
              disabled={loading}
            >
              Withdrawal
              {loading && <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default WithdrawalModal;
