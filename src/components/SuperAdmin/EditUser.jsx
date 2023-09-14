import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getCurrentUsers, getRole, updateUser } from '@/_services/services_api';
import ReusableDropdown from '../Player/ReusableDropdown';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const DashboardBreadcrumb = dynamic(() => import('../Layouts/DashboardBreadcrumbar'));

function EditUser({ id }) {
  const userId = id;
  const initialFormValues = {
    user_name: '',
    email: '',
    contactno: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [user, setUser] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await handleRole();
        await handleUsers();
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (userId && user) {
      const values = {
        user_name: user.user_name || '',
        email: user.email || '',
        contactno: user.contactno || '',
      };
      setFormValues(values);
      setSelectedRole(user || '');
    }
  }, [userId, user]);

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

    if (!formValues.email) {
      errors.email = 'Please enter an email address';
    } else if (!validEmail(formValues.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formValues.user_name) {
      errors.user_name = 'Please enter a full name';
    } else if (!validName(formValues.user_name)) {
      errors.user_name = 'Please enter a valid name';
    }

    if (!formValues.contactno) {
      errors.contactno = 'Please enter a mobile number';
    } else if (!validMobile(formValues.contactno)) {
      errors.contactno = 'Please enter a valid 10-digit mobile number';
    }

    if (!selectedRole) {
      errors.user_role = 'Please select a role';
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
          userId: userId,
          user_role: selectedRole.user_role,
        };
        setLoading(true);
        const res = await updateUser(params);
        if (res?.status) {
          toast.success(res.message);
          router.push('/super-admin/users');
        }
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRole = async () => {
    const res = await getRole();
    if (res?.status) {
      const data = res.data;
      setRoleData(data);
    }
  };

  const handleUsers = async () => {
    const res = await getCurrentUsers(id);
    if (res?.status) {
      const data = res.data;
      setUser(data);
    }
  };

  return (
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="Edit User" data={'Dashboard'} />
        </div>
        <Row className="py-4 ">
          <Col lg={12}>
            <Card className="bg-white common-card-box">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Edit User</h4>
              </div>
              <Card.Body className="box-padding">
                <Row>
                  <Col md={7}>
                    <Form onSubmit={handleSubmit} autoComplete="off">
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

                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Full Name"
                            name="user_name"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.user_name}
                            onChange={handleChange}
                          />
                          {formErrors.user_name && (
                            <p className="text-danger fs-14 error-message">{formErrors.user_name}</p>
                          )}
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
                            name="contactno"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="contactno"
                            value={formValues.contactno}
                            onChange={handleChange}
                            maxLength="10"
                            onKeyPress={handleKeyPress}
                            onInput={maxLengthCheck}
                          />
                          {formErrors.contactno && (
                            <p className="text-danger fs-14 error-message">{formErrors.contactno}</p>
                          )}
                        </Form.Group>
                      </div>

                      <Button
                        className="common-btn py-2 px-3 mt-4 fs-14 d-flex align-items-center"
                        type="submit"
                        disabled={loading}
                      >
                        <Image
                          src="/images/team-roster/apply.svg"
                          alt="Update User"
                          width={18}
                          height={18}
                          className="me-1 img-fluid"
                        />
                        Update User
                        {loading && <Spinner animation="border" size="sm" variant="white" className="ms-1 spinner" />}
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

export default EditUser;
