import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function AddTds() {
  const initialFormValues = {
    tdsAmount: '',
    tdsPercentage: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.tdsAmount.trim()) {
      errors.tdsAmount = 'TDS Amount is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.tdsAmount)) {
      errors.tdsAmount = 'Invalid TDS Amount';
    }

    if (!values.tdsPercentage.trim()) {
      errors.tdsPercentage = 'TDS Percentage is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(values.tdsPercentage)) {
      errors.tdsPercentage = 'Invalid TDS Percentage';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
    }
  };

  return (
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="Add TDS" data={'Home'} />
        </div>
        <Row className="py-4 ">
          <Col lg={12}>
            <Card className="bg-white common-card-box">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Add TDS</h4>
              </div>
              <Card.Body className="box-padding">
                <Row className="justify-content-between">
                  <Col md={7}>
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter TDS Amount</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter TDS Amount"
                            name="tdsAmount"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="tdsAmount"
                            value={formValues.tdsAmount}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.tdsAmount && (
                            <p className="text-danger fs-14 error-message">{formErrors.tdsAmount}</p>
                          )}
                        </Form.Group>

                        <Form.Group className="position-relative mt-4">
                          <Form.Label className="fs-16 fw-400 base-color">Enter TDS Percentage</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter TDS Percentage"
                            name="tdsPercentage"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="tdsPercentage"
                            value={formValues.tdsPercentage}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.tdsPercentage && (
                            <p className="text-danger fs-14 error-message">{formErrors.tdsPercentage}</p>
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
                          alt="Post New Job"
                          width={18}
                          height={18}
                          className="me-1 img-fluid"
                        />
                        Add TDS
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

export default AddTds;
