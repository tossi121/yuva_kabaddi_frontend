import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import ReusableDropdown from '../Player/ReusableDropdown';
import { getMatchGroup, getRole, getSeries, priceMasterUpdate } from '@/_services/services_api';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function PriceMasterAdd() {
  const initialFormValues = {
    forStarting7: 'yes',
    forWinningTeam: 'win',
    priceType: '',
    amount: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [seriesData, setSeriesData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [matchGroup, setMatchGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({ ...prevData, [name]: value }));
  };

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
      handleMatchGroup();
    }
  }, [selectedSeries]);

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
  async function handleMatchGroup() {
    const res = await getMatchGroup(selectedSeries.tournamentId);
    if (res?.status) {
      const data = res.data;
      setMatchGroup(data);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    setLoading(true);

    if (Object.keys(errors).length === 0) {
      const params = buildParams();
      const res = await priceMasterUpdate(params);
      handleSignupResponse(res);
    }
    setLoading(false);
  };

  const buildParams = () => {
    return {
      roleId: getRoleId(),
      type: formValues.priceType,
      amount: formValues.amount,
      tournamentId: selectedSeries.tournamentId,
      matchGroup: selectedGroup.group,
      forStarting7: (formValues.forStarting7 == 'yes' && 'Y') || 'N',
      forSubstitute: (formValues.forStarting7 !== 'yes' && 'Y') || 'N',
      forWinningTeam: (formValues.forWinningTeam == 'win' && 'Y') || 'N',
      forLosingTeam: (formValues.forWinningTeam == 'lose' && 'Y') || 'N',
      forTieTeam: (formValues.forWinningTeam == 'tie' && 'Y') || 'N',
    };
  };

  const getRoleId = () => {
    return (selectedRole.user_role === 'PLAYER' && 1) || 0;
  };

  const handleSignupResponse = (res) => {
    if (res?.status) {
      router.push('//super-admin/price-master');
      toast.success(res.message);
    } else {
      toast.error(res?.message);
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };

  const validate = () => {
    const errors = {};

    if (!selectedRole.user_role) {
      errors.user_role = 'Please select a role';
    }
    if (!selectedSeries.tournamentName) {
      errors.tournamentName = 'Please select a series';
    }

    if (!selectedGroup.group) {
      errors.group = 'Please select a match group';
    }

    if (!formValues.priceType) {
      errors.priceType = 'Please enter price type';
    }

    if (!formValues.amount) {
      errors.amount = 'Please enter amount';
    }

    return errors;
  };

  return (
    <>
      <section className="dashboard-section">
        <Container fluid>
          <Row className="mt-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between">
                <div className="mb-4">
                  <DashboardBreadcrumb breadcrumbTitle="Price Master Add" data={'Home'} />
                </div>
              </div>

              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Price Master Add</h4>
                </div>
                <Card.Body className="box-padding">
                  <Row className="justify-content-between">
                    <Col md={12}>
                      <Form onSubmit={handleSubmit} autoComplete="off">
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
                            <div className="mb-3">
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
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select Match Group</Form.Label>
                                <ReusableDropdown
                                  options={matchGroup}
                                  selectedValue={selectedGroup?.group || 'Select Match Group'}
                                  onSelect={setSelectedGroup}
                                  placeholder="Match Group"
                                  displayKey="group"
                                  valueKey="id"
                                />
                                {formErrors.group && (
                                  <p className="text-danger fs-14 error-message">{formErrors.group}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Enter Price Type</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Price Type"
                                  name="priceType"
                                  className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                                  value={formValues.priceType.trimStart().replace(/  +/g, ' ')}
                                  onChange={handleChange}
                                />
                                {formErrors.priceType && (
                                  <p className="text-danger fs-14 error-message">{formErrors.priceType}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Enter Amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter Amount"
                                  name="amount"
                                  className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                                  id="amount"
                                  value={formValues.amount.replace(/\s+/g, '')}
                                  onChange={handleChange}
                                  onKeyPress={handleKeyPress}
                                />
                                {formErrors.amount && (
                                  <p className="text-danger fs-14 error-message">{formErrors.amount}</p>
                                )}
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="d-flex gap-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select For Starting 7</Form.Label>
                                <div className="mb-3">
                                  <Form.Check
                                    inline
                                    className="fw-400 base-color-2"
                                    label="Starting 7"
                                    type="radio"
                                    id="YesforStarting7"
                                    value="yes"
                                    checked={formValues.forStarting7 === 'yes'}
                                    onChange={handleChange}
                                    name="forStarting7"
                                  />
                                </div>
                              </Form.Group>

                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select For Substitute</Form.Label>
                                <div className="mb-3">
                                  <Form.Check
                                    inline
                                    className="fw-400 base-color-2"
                                    label="Substitute"
                                    type="radio"
                                    id="YesforSubstitute"
                                    value="no"
                                    checked={formValues.forStarting7 === 'no'}
                                    onChange={handleChange}
                                    name="forStarting7"
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="d-flex gap-3">
                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select For Winning Team</Form.Label>
                                <div className="mb-3">
                                  <Form.Check
                                    inline
                                    className="fw-400 base-color-2"
                                    label="Winning Team"
                                    type="radio"
                                    id="YesforWinningTeam"
                                    value="win"
                                    checked={formValues.forWinningTeam === 'win'}
                                    onChange={handleChange}
                                    name="forWinningTeam"
                                  />
                                </div>
                              </Form.Group>

                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select For Losing Team</Form.Label>
                                <div className="mb-3">
                                  <Form.Check
                                    inline
                                    className="fw-400 base-color-2"
                                    label="Losing Team"
                                    type="radio"
                                    id="YesforLosingTeam"
                                    value="lose"
                                    checked={formValues.forWinningTeam === 'lose'}
                                    onChange={handleChange}
                                    name="forWinningTeam"
                                  />
                                </div>
                              </Form.Group>

                              <Form.Group className="position-relative">
                                <Form.Label className="fs-16 fw-400 base-color">Select For Tie Team</Form.Label>
                                <div className="mb-3">
                                  <Form.Check
                                    inline
                                    className="fw-400 base-color-2"
                                    label="Tie Team"
                                    type="radio"
                                    id="YesforTieTeam"
                                    value="tie"
                                    checked={formValues.forWinningTeam === 'tie'}
                                    onChange={handleChange}
                                    name="forWinningTeam"
                                  />
                                </div>
                              </Form.Group>
                            </div>
                          </Col>
                          <Col lg={12}>
                            <Button
                              className="common-btn py-2 px-3 mt-4 fs-14 d-flex align-items-center"
                              type="submit"
                              disabled={loading}
                            >
                              <Image
                                src="/images/team-roster/apply.svg"
                                alt="Add Price"
                                width={18}
                                height={18}
                                className="me-1 img-fluid"
                              />
                              Add Price
                              {loading && (
                                <Spinner animation="border" size="sm" variant="white" className="ms-1 spinner" />
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default PriceMasterAdd;
