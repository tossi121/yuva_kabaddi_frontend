import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import Link from 'next/link';
import {
  getMatchDetails,
  getOtp,
  getRole,
  getSignup,
  getSeries,
  getMatchPlayers,
  checkUser,
} from '@/_services/services_api';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ReusableDropdown = dynamic(import('./ReusableDropdown'));
const VerifyOtp = dynamic(import('./VerifyOtp'));

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
    if (showOtpPopup) {
      handleOtp();
    }
  }, [showOtpPopup, oneTimePassword]);

  useEffect(() => {
    handleRole();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      handleSeries();
    }
  }, [selectedRole]);

  useEffect(() => {
    if (selectedSeries) {
      handleMatch();
    }
  }, [selectedSeries]);

  useEffect(() => {
    if (selectedMatch.teamId) {
      handleMatchPlayers();
    }
  }, [selectedMatch]);

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
    if (selectedSeries.tournamentId) {
      const res = await getMatchDetails(selectedSeries.tournamentId);
      if (res?.status) {
        const data = res.data;
        setMatchData(data);
      }
    }
  }

  async function handleMatchPlayers() {
    if (selectedMatch.teamId) {
      const res = await getMatchPlayers(selectedMatch.teamId);
      if (res?.status) {
        const data = res.data;
        setPlayerData(data);
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async () => {
    const params = {
      contactno: formValues.mobile,
      email: formValues.email,
      user_name: formValues.user,
      user_role: selectedRole.user_role,
      player_id: selectedPlayer.playerId,
      team_id: selectedMatch.teamId,
      series_id: selectedSeries.tournamentId,
      otp: oneTimePassword,
    };
    const isMobileAlreadyRegistered = await handleCheckUser();
    if (!isMobileAlreadyRegistered && oneTimePassword !== null) {
      const res = await getSignup(params);
      if (res?.status) {
        router.push('/login');
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
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        await handleSignup();
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
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

  const validate = () => {
    const errors = {};
    if (!formValues.email) {
      errors.email = 'Please enter an email address';
    } else if (!validEmail(formValues.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formValues.user) {
      errors.user = 'Please enter a full name';
    } else if (!validName(formValues.user)) {
      errors.user = 'Please enter a valid name';
    }

    if (!formValues.mobile) {
      errors.mobile = 'Please enter a mobile number';
    } else if (!validMobile(formValues.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!selectedRole.user_role) {
      errors.user_role = 'Please select a role';
    }
    if (!selectedSeries.tournamentName) {
      errors.tournamentName = 'Please select a series';
    }
    if (!selectedMatch.teamName) {
      errors.teamName = 'Please select a match';
    }
    if (!selectedPlayer.fullName) {
      errors.fullName = 'Please select a player';
    }

    return errors;
  };
  const handleCheckUser = async () => {
    if (formValues.mobile) {
      const params = {
        contactno: formValues.mobile,
        email: formValues.email,
        player_id: selectedPlayer.playerId,
      };
      const res = await checkUser(params);
      if (!res?.status) {
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
      const isMobileAlreadyRegistered = await handleCheckUser();
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
