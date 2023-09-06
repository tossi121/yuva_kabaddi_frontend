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
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="Add User" data={'Home'} />
        </div>
        <Row className="py-4 ">
          <Col lg={12}>
            <Card className="bg-white common-card-box">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Add New User</h4>
              </div>
              <Card.Body className="box-padding">
                <Row>
                  <Col md={7}>
                    <Form onSubmit={handleSubmit} autoComplete="off">
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Select Role</Form.Label>
                          <div className="form-select-catgory">
                            <Dropdown className="form-control px-0 py-0 card-border">
                              <Dropdown.Toggle
                                variant="none"
                                className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                id="dropdown-basic"
                              >
                                <span className="text-truncate pe-3">{selectedRole || 'Select Role'}</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="w-100 card-border ">
                                <div className="px-2 mb-2">
                                  <input
                                    type="search"
                                    placeholder="Search Role"
                                    onChange={(e) => setSearchRole(e.target.value)}
                                    className="form-control shadow-none card-border fs-14 hight-50"
                                  />
                                </div>
                                <Dropdown.Item
                                  className={`py-2 fs-14 base-color ${selectedRole === 'Player' ? 'active' : ''}`}
                                  onClick={() => handleRoleSelect('Player')}
                                >
                                  Player
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className={`py-2 fs-14 base-color ${selectedRole === 'Coach' ? 'active' : ''}`}
                                  onClick={() => handleRoleSelect('Coach')}
                                >
                                  Coach
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          {formErrors.role && <p className="text-danger fs-14 error-message">{formErrors.role}</p>}
                        </Form.Group>
                      </div>

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

                      <Button className="common-btn py-2 px-3 mt-4 fs-14 d-flex align-items-center" >
                        <Image
                          src="/images/team-roster/apply.svg"
                          alt="Post New Job"
                          width={18}
                          height={18}
                          className="me-1 img-fluid"
                        />
                        Add User
                        {loading && <Spinner animation="border" variant="white" className="ms-1 spinner" />}
                      </Button>
                    </Form>
                  </Col>
                  <Col md={4} className="text-end d-md-block d-none">
                    <div className="img-wrapper text-end h-100 d-flex align-items-end w-100 justify-content-end">
                      <img src="/images/dashboard-images/facuilty-manager.webp" alt="add-user" className="img-fluid" />
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

export default AddUser;
