import React, { useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function AddUser() {
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
    <section className="login-page min-vh-100 d-flex align-items-center justify-content-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center">
                  <h2 className="base-color fw-700">Welcome!</h2>
                  <h6 className="fs-14 fw-500 base-color-2">Create your account</h6>
                </div>
                <Form autoComplete="off" onSubmit={handleRegistration}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Select Role</Form.Label>
                          <ReusableDropdown
                            options={roleData}
                            selectedValue={selectedRole.user_role || 'Select Role'}
                            onSelect={setSelectedRole}
                            placeholder="Role"
                            displayKey="user_role"
                            valueKey="id"
                          />
                          {formErrors.user_role && (
                            <p className="text-danger fs-14 error-message">{formErrors.user_role}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="position-relative">
                        <Form.Label className="fs-16 fw-400 base-color">Select Series</Form.Label>
                        <ReusableDropdown
                          options={seriesData}
                          selectedValue={selectedSeries?.tournamentName || 'Select Series'}
                          onSelect={setSelectedSeries}
                          placeholder="Series"
                          displayKey="tournamentName"
                          valueKey="id"
                        />
                        {formErrors.tournamentName && (
                          <p className="text-danger fs-14 error-message">{formErrors.tournamentName}</p>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <Form.Group className="position-relative">
                        <Form.Label className="fs-16 fw-400 base-color">Select Team</Form.Label>
                        <ReusableDropdown
                          options={matchData}
                          selectedValue={selectedMatch?.teamName || 'Select Team'}
                          onSelect={setSelectedMatch}
                          placeholder="Team"
                          displayKey="teamName"
                          valueKey="teamId"
                        />
                        {formErrors.teamName && (
                          <p className="text-danger fs-14 error-message">{formErrors.teamName}</p>
                        )}
                      </Form.Group>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Select Player</Form.Label>
                          <ReusableDropdown
                            options={playerData}
                            selectedValue={selectedPlayer?.fullName || 'Select Player'}
                            onSelect={setSelectedPlayer}
                            placeholder="Player"
                            displayKey="fullName"
                            valueKey="playerId"
                          />
                          {formErrors.fullName && (
                            <p className="text-danger fs-14 error-message">{formErrors.fullName}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Full Name</Form.Label>
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
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Email Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Email Address"
                            name="email"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.email}
                            onChange={handleChange}
                          />
                          {formErrors.email && <p className="text-danger fs-14 error-message">{formErrors.email}</p>}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Mobile Number</Form.Label>
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
                          {formErrors.mobile && <p className="text-danger fs-14 error-message">{formErrors.mobile}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center">
                    <Button
                      variant="white"
                      type="submit"
                      className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
                      disabled={loading}
                    >
                      Signup
                      {loading && <Spinner animation="border" size="sm" variant="white" className="ms-1 spinner" />}
                    </Button>
                    <span className="base-color-2 me-2">Already have an account?</span>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AddUser;
