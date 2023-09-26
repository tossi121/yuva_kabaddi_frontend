import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getTdsData, tdsDataUpdate } from '@/_services/services_api';
import toast from 'react-hot-toast';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function Configuration() {
  const initialFormValues = {
    minimum_amount_for_withdrawal: '',
    tds_amount_min: '',
    tds_percentage: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tdsData, setTdsData] = useState([]);

  useEffect(() => {
    handleTdsData();
  }, []);

  useEffect(() => {
    if (tdsData) {
      const value = {
        minimum_amount_for_withdrawal: tdsData.minimum_amount_for_withdrawal,
        tds_amount_min: tdsData.tds_amount_min,
        tds_percentage: tdsData.tds_percentage,
      };

      setFormValues(value);
    }
  }, [tdsData]);

  async function handleTdsData() {
    const res = await getTdsData();
    if (res?.status) {
      const data = res.data.tdsConfig;
      setTdsData(data);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const validate = () => {
    const errors = {};

    if (!formValues.minimum_amount_for_withdrawal) {
      errors.minimum_amount_for_withdrawal = 'Withdrawal minimum amount is required';
    }

    if (!formValues.tds_amount_min) {
      errors.tds_amount_min = 'TDS amount is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formValues.tds_amount_min)) {
      errors.tds_amount_min = 'Invalid TDS amount';
    }

    if (!formValues.tds_percentage) {
      errors.tds_percentage = 'TDS percentage is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formValues.tds_percentage)) {
      errors.tds_percentage = 'Invalid TDS percentage';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const params = {
          ...formValues,
        };
        setLoading(true);
        const res = await tdsDataUpdate(params);
        if (res?.status) {
          toast.success(res.message);
          handleTdsData();
        }
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="Configuration" data={'Home'} />
        </div>
        <Row className="py-4 ">
          <Col lg={12}>
            <Card className="bg-white common-card-box">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Configuration</h4>
              </div>
              <Card.Body className="box-padding">
                <Row className="justify-content-between">
                  <Col md={7}>
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Minimum Withdrawal Amount</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Minimum Withdrawal Amount"
                            name="minimum_amount_for_withdrawal"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="minimum_amount_for_withdrawal"
                            value={formValues.minimum_amount_for_withdrawal}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.minimum_amount_for_withdrawal && (
                            <p className="text-danger fs-14 error-message">
                              {formErrors.minimum_amount_for_withdrawal}
                            </p>
                          )}
                        </Form.Group>
                      </div>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Minimum TDS Amount</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Minimum TDS Amount"
                            name="tds_amount_min"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="tds_amount_min"
                            value={formValues.tds_amount_min}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.tds_amount_min && (
                            <p className="text-danger fs-14 error-message">{formErrors.tds_amount_min}</p>
                          )}
                        </Form.Group>
                      </div>
                      <div className="mb-3">
                        <Form.Group className="position-relative mt-4">
                          <Form.Label className="fs-16 fw-400 base-color">Enter TDS Percentage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter TDS Percentage"
                            name="tds_percentage"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="tds_percentage"
                            value={formValues.tds_percentage}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.tds_percentage && (
                            <p className="text-danger fs-14 error-message">{formErrors.tds_percentage}</p>
                          )}
                        </Form.Group>
                      </div>

                      <Button
                        className="common-btn py-2 px-3 mt-4 fs-14 d-flex align-items-center"
                        disabled={loading}
                        type="submit"
                      >
                        <Image
                          src="/images/team-roster/apply.svg"
                          alt="Add Configuration"
                          width={18}
                          height={18}
                          className="me-1 img-fluid"
                        />
                        Add Configuration
                        {loading && <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />}
                      </Button>
                    </Form>
                  </Col>
                  <Col md={4} className="text-end d-md-block d-none">
                    <div className="img-wrapper text-end h-100 d-flex align-items-end w-100 justify-content-end">
                      <Image
                        src="/images/dashboard-images/add-facuilities-2.webp"
                        alt="add-user"
                        width={490}
                        height={370}
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Configuration;
