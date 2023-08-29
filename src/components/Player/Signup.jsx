import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import { maxLengthCheck, validEmail, validMobile, validName } from '@/_helper/regex';
import VerifyOtp from './VerifyOtp';
import Link from 'next/link';
import { getSignup } from '@/_services/services_api';
import { Toaster, toast } from 'react-hot-toast';

function Signup() {
  const initialFormValues = {
    user: '',
    email: '',
    mobile: '',
    role: '',
    tournament: '',
    team: '',
    squad: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedSquad, setSelectedSquad] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchTournament, setSearchTournament] = useState('');
  const [searchTeam, setSearchTeam] = useState('');
  const [searchSquad, setSearchSquad] = useState('');

  async function handleSignup() {
    const params = {
      contactno: '5714573708',
      email: 'tosif.geekologix@gmail.com',
      name: 'Tossi',
      user_role: 'PLAYER',
      otp: '2468',
    };
    const res = await getSignup(params);
    // if (res?.status) {
    //   toast.success(res?.message);
    // } else {
    //   toast.error(res?.message);
    // }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role' || name === 'tournament' || name === 'team' || name === 'squad') {
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
    setSearchRole('');
    setFormValues((prevData) => ({ ...prevData, role: selectedRole }));
    setFormErrors((prevErrors) => ({ ...prevErrors, role: '' }));
  };

  const handleTournamentSelect = (selectedTournament) => {
    setSelectedTournament(selectedTournament);
    setSearchTournament('');
    setFormValues((prevData) => ({ ...prevData, tournament: selectedTournament }));
    setFormErrors((prevErrors) => ({ ...prevErrors, tournament: '' }));
  };

  const handleTeamSelect = (selectedTeam) => {
    setSelectedTeam(selectedTeam);
    setSearchTeam('');
    setFormValues((prevData) => ({ ...prevData, team: selectedTeam }));
    setFormErrors((prevErrors) => ({ ...prevErrors, team: '' }));
  };

  const handleSquadSelect = (selectedSquad) => {
    setSelectedSquad(selectedSquad);
    setSearchSquad('');
    setFormValues((prevData) => ({ ...prevData, squad: selectedSquad }));
    setFormErrors((prevErrors) => ({ ...prevErrors, squad: '' }));
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
    if (!values.tournament) {
      errors.tournament = 'Please select a tournament';
    }
    if (!values.team) {
      errors.team = 'Please select a team';
    }
    if (!values.squad) {
      errors.squad = 'Please select a squad';
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
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      {(mobileNumber && <VerifyOtp {...{ mobileNumber }} />) || (
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
                      <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Row>
                          <Col lg={6}>
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

                                      {['Player', 'Coach']
                                        .filter((role) => role.toLowerCase().includes(searchRole.toLowerCase()))
                                        .map((role) => (
                                          <Dropdown.Item
                                            key={role}
                                            className={`py-2 fs-14 base-color ${selectedRole === role ? 'active' : ''}`}
                                            onClick={() => handleRoleSelect(role)}
                                          >
                                            {role}
                                          </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                                {formErrors.role && (
                                  <p className="text-danger fs-14 error-message">{formErrors.role}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select Tournament</Form.Label>
                                <div className="form-select-catgory">
                                  <Dropdown className="form-control px-0 py-0 card-border">
                                    <Dropdown.Toggle
                                      variant="none"
                                      className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                      id="dropdown-basic"
                                    >
                                      <span className="text-truncate pe-3">
                                        {selectedTournament || 'Select Tournament'}
                                      </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100 card-border ">
                                      <div className="px-2 mb-2">
                                        <input
                                          type="search"
                                          placeholder="Search Tournament"
                                          onChange={(e) => setSearchTournament(e.target.value)}
                                          className="form-control shadow-none card-border fs-14 hight-50"
                                        />
                                      </div>

                                      {[
                                        'Yuva Kabaddi Series Summer Edition, 2023',
                                        'KMP YKS IDYL 2023',
                                        'MONSOON EDITION 2022',
                                        'Geekologix Series Winter Edition, 2023',
                                      ]
                                        .filter((tournament) =>
                                          tournament.toLowerCase().includes(searchTournament.toLowerCase())
                                        )
                                        .map((tournament) => (
                                          <Dropdown.Item
                                            key={tournament}
                                            className={`py-2 fs-14 base-color ${
                                              selectedTournament === tournament ? 'active' : ''
                                            }`}
                                            onClick={() => handleTournamentSelect(tournament)}
                                          >
                                            {tournament}
                                          </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                                {formErrors.tournament && (
                                  <p className="text-danger fs-14 error-message">{formErrors.tournament}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select Team</Form.Label>
                                <div className="form-select-catgory">
                                  <Dropdown className="form-control px-0 py-0 card-border">
                                    <Dropdown.Toggle
                                      variant="none"
                                      className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                      id="dropdown-basic"
                                    >
                                      <span className="text-truncate pe-3">{selectedTeam || 'Select Team'}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100 card-border ">
                                      <div className="px-2 mb-2">
                                        <input
                                          type="search"
                                          placeholder="Search Team"
                                          onChange={(e) => setSearchTeam(e.target.value)}
                                          className="form-control shadow-none card-border fs-14 hight-50"
                                        />
                                      </div>

                                      {['Chola Veerans', 'Chambal Challengers', 'Nilgiri Knights', 'Sindh Sonics']
                                        .filter((team) => team.toLowerCase().includes(searchTeam.toLowerCase()))
                                        .map((team) => (
                                          <Dropdown.Item
                                            key={team}
                                            className={`py-2 fs-14 base-color ${selectedTeam === team ? 'active' : ''}`}
                                            onClick={() => handleTeamSelect(team)}
                                          >
                                            {team}
                                          </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                                {formErrors.team && (
                                  <p className="text-danger fs-14 error-message">{formErrors.team}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select Squad</Form.Label>
                                <div className="form-select-catgory">
                                  <Dropdown className="form-control px-0 py-0 card-border">
                                    <Dropdown.Toggle
                                      variant="none"
                                      className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                      id="dropdown-basic"
                                    >
                                      <span className="text-truncate pe-3">{selectedSquad || 'Select Squad'}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100 card-border overflow-auto dropdown-height">
                                      <div className="px-2 mb-2">
                                        <input
                                          type="search"
                                          placeholder="Search Squad"
                                          onChange={(e) => setSearchSquad(e.target.value)}
                                          className="form-control shadow-none card-border fs-14 hight-50"
                                        />
                                      </div>

                                      {[
                                        'Velavan Muruganantham',
                                        'Kesavan Raja',
                                        'S Manikandan Sudalaimani',
                                        'S Marimuthu Selvam',
                                        'Manikandan Nesamani',
                                        'Surya Selvam',
                                        'S Santhosh Srinivasan',
                                        'Ajainandha Krishna',
                                        'Balaganapathi Manikam',
                                        'S Abikumar',
                                        'Ezhumalai Moorthy',
                                      ]
                                        .filter((squad) => squad.toLowerCase().includes(searchSquad.toLowerCase()))
                                        .map((squad) => (
                                          <Dropdown.Item
                                            key={squad}
                                            className={`py-2 fs-14 base-color ${
                                              selectedSquad === squad ? 'active' : ''
                                            }`}
                                            onClick={() => handleSquadSelect(squad)}
                                          >
                                            {squad}
                                          </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                                {formErrors.squad && (
                                  <p className="text-danger fs-14 error-message">{formErrors.squad}</p>
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
                                  type="email"
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
                          >
                            Signup
                            {loading && <Spinner animation="border" variant="white" className="ms-1 spinner" />}
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
