import React, { useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';

import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import VerifyOtp from './VerifyOtp';
import Link from 'next/link';

function Signup() {
  const initialFormValues = {
    user: '',
    email: '',
    mobile: '',
    role: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRoleName(value);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setSelectedRole(selectedRole);
    setFormValues((prevData) => ({ ...prevData, role: selectedRole }));
    setFormErrors((prevErrors) => ({ ...prevErrors, role: '' }));
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Please enter an email address';
    } else if (!validEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!values.user) {
      errors.user = 'Please enter a full name';
    } else if (!validName(values.user)) {
      errors.user = 'Please enter a valid name';
    }

    if (!values.mobile) {
      errors.mobile = 'Please enter a mobile number';
    } else if (!validMobile(values.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!values.role) {
      errors.role = 'Please select a role';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const phoneNumber = `+91 ${formValues.mobile}`;
      setMobileNumber(phoneNumber);
    }
  };

  return (
    <>
      {(mobileNumber && <VerifyOtp {...{ mobileNumber }} />) || (
        <>
          <section className="login-page min-vh-100 d-flex align-items-center justify-content-center">
            <Container>
              <Row className="justify-content-center">
                <Col xl={6}>
                  <Card>
                    <Card.Body className="p-4">
                      <div className="text-center">
                        <h2 className="base-color fw-700">Welcome!</h2>
                        <h6 className="fs-14 fw-500 base-color-2">Create your account</h6>
                      </div>
                      <Form onSubmit={handleSubmit} autoComplete="off">
                        <div className="mb-4">
                          <Form.Group className="position-relative" controlId="formBasicEmail">
                            <Form.Label className="fs-16 fw-400 base-color-1">Select User</Form.Label>
                            <div className="form-select-catgory">
                              <Dropdown className="form-control px-0 py-0 card-border">
                                <Dropdown.Toggle
                                  variant="none"
                                  className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                  id="dropdown-basic"
                                >
                                  <span className="text-truncate pe-3">{selectedRole || 'Select Role'}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="w-100 card-border banner-filter-menu">
                                  <Dropdown.Item
                                    className={`py-2 fs-14 base-color ${selectedRole === 'Players' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('Players')}
                                  >
                                    Players
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    className={`py-2 fs-14 base-color ${selectedRole === 'Coaches' ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect('Coaches')}
                                  >
                                    Coaches
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                            {formErrors.role && <p className="text-danger fs-14 error-message">{formErrors.role}</p>}
                          </Form.Group>
                        </div>

                        <div className="mb-2">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color-1">Enter Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Full Name"
                              name="user"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              value={formValues.user}
                              onChange={handleChange}
                            />
                            {formErrors.user && <p className="text-danger fs-14 error-message">{formErrors.user}</p>}
                          </Form.Group>
                        </div>

                        <div className="mb-2">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color-1">Enter Email</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter Your Email Address"
                              name="email"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              value={formValues.email}
                              onChange={handleChange}
                            />
                            {formErrors.email && <p className="text-danger fs-14 error-message">{formErrors.email}</p>}
                          </Form.Group>
                        </div>
                        <div className="mb-2">
                          <Form.Group className="position-relative">
                            <Form.Label className="fs-16 fw-400 base-color-1">Enter Mobile Number</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your Mobile Number"
                              name="mobile"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                              id="mobile"
                              value={formValues.mobile}
                              onChange={handleChange}
                              maxLength="10"
                              onKeyPress={handleKeyPress}
                              onInput={maxLengthCheck}
                            />
                            {formErrors.mobile && (
                              <p className="text-danger fs-14 error-message">{formErrors.mobile}</p>
                            )}
                          </Form.Group>
                        </div>

                        <div className="text-center">
                          <Button
                            variant="white"
                            type="submit"
                            className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
                          >
                            Signup
                            {loading && <Spinner animation="border" variant="white" className="ms-1 spinner" />}
                          </Button>
                          <span className="purple-light-color me-2">Already have an account?</span>
                          <Link href={'/login'} className="purple-color">
                            Login Here
                          </Link>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </>
      )}
    </>
  );
}

export default Signup;
