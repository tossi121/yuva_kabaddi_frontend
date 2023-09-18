import { useAuth } from '@/_context/authContext';
import { validWithdrawalAmount } from '@/_helper/regex';
import { getTdsData, playerTransactionCreated } from '@/_services/services_api';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Form, Modal, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

function WithdrawalModal(props) {
  const { setShow, show, handleWithdrawnRequests } = props;
  const [formValues, setFormValues] = useState({
    totalAmount: '',
    withdrawalAmount: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tdsData, setTdsData] = useState([]);
  const { currentUser } = useAuth();
  const amountLeft = currentUser?.Total_Earninig - currentUser?.sumAprovedEarning;
  const total = parseFloat(formValues.totalAmount);
  const formattedAmount = total?.toFixed(2).toLocaleString('en-IN');
  const tdsRate = tdsData?.tds_percentage / 100;
  const tdsAmount = formValues.withdrawalAmount * tdsRate;
  const remaining = useEffect(() => {
    if (currentUser) {
      const value = {
        withdrawalAmount: '',
        totalAmount: amountLeft,
      };
      setFormValues(value);
    }
    handleTdsData();
    if (!show) {
      handleCloseModal();
    }
  }, [currentUser, show]);

  async function handleTdsData() {
    const res = await getTdsData();
    if (res?.status) {
      const data = res.data.tdsConfig;
      setTdsData(data);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
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

  async function handleWithdrawal() {
    const params = {
      amount: formValues?.withdrawalAmount,
      tds_amount: tdsAmount,
    };

    const res = await playerTransactionCreated(params);
    if (res?.status) {
      toast.success(res.message);
      handleWithdrawnRequests();
    } else {
      toast.error(res.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      setLoading(false);
      handleWithdrawal();
      setShow(false);
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
      <Modal.Header closeButton>
        <h4 className="base-color mb-0">Withdrawal Amount </h4>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-2">
            <Form.Group className="position-relative">
              <Form.Label className="fs-16 fw-400 base-color">Amount Available</Form.Label>
              <Form.Control
                type="text"
                name="totalAmount"
                className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                value={formattedAmount}
                readOnly
              />
            </Form.Group>
          </div>
          <div className="mb-2">
            <Form.Group className="position-relative">
              <Form.Label className="fs-16 fw-400 base-color">Enter Amount to Withdrawal</Form.Label>
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
          {formValues?.withdrawalAmount > 0 && (
            <div>
              <Badge pill bg={'info'} className="fs-12">
                Summary
              </Badge>

              <div className="d-flex align-items-center my-2">
                <Badge pill bg={'success'} className="fs-12 me-2">
                  Paid
                </Badge>
                <p className="fs-14 fw-500 base-color mb-0"></p>

                {(formValues?.withdrawalAmount > tdsData?.tds_amount_min && (
                  <p className="fs-14 fw-500 base-color mb-0">
                    {parseFloat(formValues.withdrawalAmount - tdsAmount)?.toFixed(2)}
                  </p>
                )) || <p className="fs-14 fw-500 base-color mb-0">{formValues.withdrawalAmount}</p>}
              </div>
              <div className="d-flex align-items-center my-2">
                <Badge pill bg={'warning'} className="fs-12 me-2">
                  Remaining
                </Badge>

                {(formValues?.withdrawalAmount > tdsData?.tds_amount_min && (
                  <p className="fs-14 fw-500 base-color mb-0">
                    {parseFloat(formValues.totalAmount - formValues?.withdrawalAmount - tdsAmount)?.toFixed(2)}
                  </p>
                )) || (
                  <p className="fs-14 fw-500 base-color mb-0">
                    {parseFloat(formValues.totalAmount - formValues?.withdrawalAmount)?.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="d-flex align-items-center my-2">
                <Badge pill bg={'danger'} className="fs-12 me-2">
                  TDS
                </Badge>
                {(formValues?.withdrawalAmount > tdsData?.tds_amount_min && (
                  <p className="fs-14 fw-500 base-color mb-0"> {tdsAmount?.toFixed(2)}</p>
                )) || <p className="fs-14 fw-500 base-color mb-0">0</p>}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="white"
              className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
              disabled={loading}
              onClick={handleSubmit}
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
