import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { maxLengthCheck, validMobile } from '@/_helper/regex';
import { getLogin, getOtp, checkMobileNumber } from '@/_services/services_api';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

const VerifyOtp = dynamic(import('./VerifyOtp'));

function Login() {
  const router = useRouter();
  const [formValues, setFormValues] = useState({ mobile: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [oneTimePassword, setOneTimePassword] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpResendSeconds, setOtpResendSeconds] = useState(0);
  const [isMobileNumberRegistered, setIsMobileNumberRegistered] = useState(false);
  const [isTypingOtp, setIsTypingOtp] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    if (showOtpPopup && verifyStatus?.verify_status == 'Approved') {
      handleOtp();
    }
  }, [showOtpPopup, oneTimePassword]);

  useEffect(() => {
    if (otpResendSeconds > 0) {
      const timer = setInterval(() => {
        setOtpResendSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [otpResendSeconds]);

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

  const validate = () => {
    const errors = {};
    if (!formValues.mobile) {
      errors.mobile = 'Please enter a mobile number';
    } else if (!validMobile(formValues.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    return errors;
  };

  const handleOtp = async () => {
    if (formValues.mobile && !oneTimePassword && !isTypingOtp) {
      if (!isMobileNumberRegistered) {
        const params = {
          contactno: formValues.mobile,
        };
        const res = await getOtp(params);
        handleApiResponse(res);
      } else {
        toast.error('Mobile number is not registered');
      }
    } else if (!formValues.mobile) {
      toast.error('Please enter a mobile number');
    }
  };

  const checkMobileNumberAndRedirect = async () => {
    if (formValues.mobile) {
      const params = {
        contactno: formValues.mobile,
      };
      const res = await checkMobileNumber(params);
      if (!res?.status) {
        setIsMobileNumberRegistered(true);
        toast.error(res?.message);
        return true;
      } else {
        setVerifyStatus(res.data);
        if (res.data?.verify_status !== 'Approved') {
          toast.error('User is not approved ');
        }
      }
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        await handleLogin();
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApiResponse = (res) => {
    if (res?.status) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
  };

  const handleLogin = async () => {
    const params = {
      contactno: formValues.mobile,
      otp: oneTimePassword,
    };

    const res = await getLogin(params);
    handleApiResponse(res);
    if (res.status) {
      const token = res.data;
      Cookies.set('yuva_kabaddi_token', token.access_token, { expires: 30, path: '/' });
      Cookies.set('yuva_kabaddi_role', token.user_role, { expires: 30, path: '/' });
      router.push('/');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const isMobileAlreadyRegistered = await checkMobileNumberAndRedirect();
      if (!isMobileAlreadyRegistered) {
        setShowOtpPopup(true);
        setOtpResendSeconds(30);
      } else {
        router.push('/signup');
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {(verifyStatus?.verify_status == 'Approved' && showOtpPopup && (
        <VerifyOtp
          loading={loading}
          oneTimePassword={oneTimePassword}
          handleSubmit={handleSubmit}
          otpResendSeconds={otpResendSeconds}
          setShowOtpPopup={setShowOtpPopup}
          setOtpResendSeconds={setOtpResendSeconds}
          formValues={formValues}
          handleOtp={handleOtp}
          setIsTypingOtp={setIsTypingOtp}
          setOneTimePassword={setOneTimePassword}
        />
      )) || (
        <section className="login-page min-vh-100 d-flex align-items-center justify-content-center">
          <Container>
            <Row className="justify-content-center">
              <Col xl={9}>
                {verifyStatus?.comment == '' ||
                  (verifyStatus?.comment != null && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                      <span>{verifyStatus?.comment}</span>
                    </Alert>
                  ))}
                <Card className="border-0">
                  <Card.Body className="p-0">
                    <div className="d-sm-flex justify-content-center align-items-center">
                      <Image
                        src="/images/dashboard-images/port-kabaddi.webp"
                        alt="login"
                        className="rounded-start-3 d-none d-sm-block"
                        width={435}
                        height={415}
                      />
                      <div className="p-4 w-100">
                        <div className="text-center">
                          <h2 className="base-color fw-700">Welcome Back!</h2>
                          <h6 className="fs-14 fw-500 base-color-2">Login in to your account</h6>
                        </div>
                        <Form onSubmit={handleRegistration} autoComplete="off">
                          <div className="mb-3">
                            <Form.Group className="position-relative">
                              <Form.Label className="fs-16 fw-400 base-color">Enter Mobile Number</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Enter Your Mobile Number"
                                name="mobile"
                                className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                                id="mobile"
                                value={formValues.mobile.replace(/\s+/g, '')}
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
                              className="my-3 mt-4 w-50 mx-auto fw-400 fs-18 text-white common-btn shadow-none py-2"
                              disabled={loading}
                              type="submit"
                            >
                              Login
                              {loading && (
                                <Spinner animation="border" variant="white" size="sm" className="ms-1 spinner" />
                              )}
                            </Button>
                            <span className="base-color-2 me-2">Don&apos;t have an account?</span>
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
      )}
    </>
  );
}

export default Login;
