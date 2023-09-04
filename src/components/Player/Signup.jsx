import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import VerifyOtp from './VerifyOtp';
import Link from 'next/link';
import {
  getMatchDetails,
  getOtp,
  getRole,
  getSignup,
  getSeries,
  getMatchPlayers,
  checkMobileNumber,
} from '@/_services/services_api';
import { Toaster, toast } from 'react-hot-toast';
import ReusableDropdown from './ReusableDropdown';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

function Signup() {
  const initialFormValues = {
    user: '',
    email: '',
    mobile: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [oneTimePassword, setOneTimePassword] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [seriesData, setSeriesData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [matchData, setMatchData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState('');
  const [playerData, setPlayerData] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [otpResendSeconds, setOtpResendSeconds] = useState(0);
  const [isTypingOtp, setIsTypingOtp] = useState(false);
  const [isMobileNumberRegistered, setIsMobileNumberRegistered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleRole();
    handleSeries();
    handleMatchPlayers();
    handleMatch();
    if (showOtpPopup) {
      handleOtp();
    }
  }, [showOtpPopup, oneTimePassword, selectedMatch.match_id, selectedPlayer.player_id, selectedSeries.id]);

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

  async function handleRole() {
    const res = await getRole();
    if (res?.status) {
      const data = res.data;
      setRoleData(data);
    }
  }

  async function handleSeries() {
    const res = await getSeries();
    if (res?.status) {
      const data = res.data;
      setSeriesData(data);
    }
  }

  async function handleMatch() {
    if (selectedSeries.id) {
      const res = await getMatchDetails(selectedSeries.id);
      if (res?.status) {
        const data = res.data;
        setMatchData(data);
      }
    }
  }

  async function handleMatchPlayers() {
    if (selectedMatch.match_id) {
      const res = await getMatchPlayers(selectedMatch.match_id);
      if (res?.status) {
        const data = res.data;
        setPlayerData(data);
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSignup = async () => {
    const params = {
      contactno: formValues.mobile,
      email: formValues.email,
      user_name: formValues.user,
      user_role: selectedRole.role_name,
      player_id: selectedPlayer.player_id,
      otp: oneTimePassword,
    };
    const isMobileAlreadyRegistered = await handleCheckMobileNumber();

    if (!isMobileAlreadyRegistered && oneTimePassword !== null) {
      const res = await getSignup(params);
      if (res?.status) {
        router.push('/dashboard');
        const token = res.data.access_token;
        Cookies.set('token', token);
        toast.success(res.message);
      } else {
        toast.error(res?.message);
      }
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      handleSignup();
    }
  };

  const handleOtp = async () => {
    if (formValues.mobile && !oneTimePassword && !isTypingOtp) {
      if (!isMobileNumberRegistered) {
        const params = {
          contactno: formValues.mobile,
        };
        const res = await getOtp(params);
        if (res?.status) {
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
      } else {
        toast.error('Mobile number is already registered.');
      }
    } else if (!formValues.mobile) {
      toast.error('Please enter a mobile number');
    }
  };

  const handleCheckMobileNumber = async () => {
    if (formValues.mobile) {
      const params = {
        contactno: formValues.mobile,
      };
      const res = await checkMobileNumber(params);
      if (res?.status) {
        setIsMobileNumberRegistered(true);
        toast.error(res?.message);
        return true;
      } else {
        setIsMobileNumberRegistered(false);
      }
    }
    return false;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const isMobileAlreadyRegistered = await handleCheckMobileNumber();
      if (!isMobileAlreadyRegistered) {
        setShowOtpPopup(true);
        setOtpResendSeconds(30);
      } else {
        setTimeout(() => {
          router.push('/login');
        }, 800);
      }
    }
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

    if (!selectedRole.role_name) {
      errors.role_name = 'Please select a role';
    }
    if (!selectedSeries.series_name) {
      errors.series_name = 'Please select a series';
    }
    if (!selectedMatch.match_number) {
      errors.match_number = 'Please select a match';
    }
    if (!selectedPlayer.player_name) {
      errors.player_name = 'Please select a player';
    }

    return errors;
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {(showOtpPopup && (
        <VerifyOtp
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
        <>
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
                                  selectedValue={selectedRole.role_name || 'Select Role'}
                                  onSelect={setSelectedRole}
                                  placeholder="Role"
                                  displayKey="role_name"
                                  valueKey="id"
                                />
                                {formErrors.role_name && (
                                  <p className="text-danger fs-14 error-message">{formErrors.role_name}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <Form.Group className="position-relative">
                              <Form.Label className="fs-16 fw-400 base-color">Select Series</Form.Label>

                              <ReusableDropdown
                                options={seriesData}
                                selectedValue={selectedSeries?.series_name || 'Select Series'}
                                onSelect={setSelectedSeries}
                                placeholder="Series"
                                displayKey="series_name"
                                valueKey="id"
                              />
                              {formErrors.series_name && (
                                <p className="text-danger fs-14 error-message">{formErrors.series_name}</p>
                              )}
                            </Form.Group>
                          </Col>

                          <Col lg={6}>
                            <Form.Group className="position-relative">
                              <Form.Label className="fs-16 fw-400 base-color">Select Match</Form.Label>
                              <ReusableDropdown
                                options={matchData}
                                selectedValue={selectedMatch?.match_number || 'Select Match'}
                                onSelect={setSelectedMatch}
                                placeholder="Match"
                                displayKey="match_number"
                                valueKey="match_id"
                              />
                              {formErrors.match_number && (
                                <p className="text-danger fs-14 error-message">{formErrors.match_number}</p>
                              )}
                            </Form.Group>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select Player</Form.Label>
                                <ReusableDropdown
                                  options={playerData}
                                  selectedValue={selectedPlayer?.player_name || 'Select Player'}
                                  onSelect={setSelectedPlayer}
                                  placeholder="Player"
                                  displayKey="player_name"
                                  valueKey="player_id"
                                />
                                {formErrors.player_name && (
                                  <p className="text-danger fs-14 error-message">{formErrors.player_name}</p>
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
                                {formErrors.user && (
                                  <p className="text-danger fs-14 error-message">{formErrors.user}</p>
                                )}
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
                                {formErrors.email && (
                                  <p className="text-danger fs-14 error-message">{formErrors.email}</p>
                                )}
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
                                {formErrors.mobile && (
                                  <p className="text-danger fs-14 error-message">{formErrors.mobile}</p>
                                )}
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
                            {loading && (
                              <Spinner animation="border" size="sm" variant="white" className="ms-1 spinner" />
                            )}
                          </Button>
                          <span className="base-color-2 me-2">Already have an account?</span>
                          <Link href={'/login'} className="base-link-color">
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
