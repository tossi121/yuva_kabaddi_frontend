import { maxLengthCheck, validMobile } from '@/_helper/regex';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import VerifyOtp from './VerifyOtp';
import Image from 'next/image';

function Login() {
  const initialValues = {
    mobile: '',
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  function validate(values) {
    const errors = {};

    if (!values.mobile) {
      errors.mobile = 'Please enter a mobile number';
    } else if (!validMobile(values.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    const errObj = validate(formValues);
    if (Object?.keys(errObj).length == 0) {
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
                <Col xl={9}>
                  <Card className="border-0">
                    <Card.Body className="p-0">
                      <div className="d-flex justify-content-center align-items-center">
                        <Image
                          src="/images/dashboard-images/port-kabaddi.webp"
                          alt="login"
                          className="rounded-start-3"
                          width={435}
                          height={415}
                        />
                        <div className="p-4 w-100">
                          <div className="text-center">
                            <h2 className="base-color fw-700">Welcome Back!</h2>
                            <h6 className="fs-14 fw-500 base-color-2">Login in to your account</h6>
                          </div>
                          <Form onSubmit={handleSubmit} autoComplete="off">
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
                                Login
                                {loading && <Spinner animation="border" variant="white" className="ms-1 spinner" />}
                              </Button>
                              <span className="base-color-2 me-2">Don&apos; have an account?</span>
                              <Link href={'/signup'} className="base-link-color">
                                Signup Here
                              </Link>
                            </div>
                          </Form>
                        </div>
                      </div>
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

export default Login;
