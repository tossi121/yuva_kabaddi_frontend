import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAuth } from '@/_context/authContext';
import {
  maxLengthCheck,
  validAccountNumber,
  validBankIFSC,
  validEmail,
  validMobile,
  validName,
  validPAN,
} from '@/_helper/regex';
import { cityListData, stateListData, updateUserDetails } from '@/_services/services_api';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));
const ReusableDropdown = dynamic(import('./ReusableDropdown'));

function MyProfile() {
  const initialFormValues = {
    user_name: '',
    email: '',
    mobile: '',
    address: '',
    pancard: '',
    bankIfsc: '',
    bankName: '',
    acNumber: '',
    bankBranch: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [profileFileData, setProfileFileData] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [cityData, setCityData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [panImagePreview, setPanImagePreview] = useState(null);
  const [passbookImagePreview, setPassbookImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [panFileData, setPanFileData] = useState(null);
  const [passbookFileData, setPassbookFileData] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(false);
  const { handleUser, currentUser } = useAuth();

  useEffect(() => {
    if (updatedUser) {
      handleUser();
      setUpdatedUser(false);
    } else {
      setUpdatedUser(false);
    }
  }, [updatedUser]);

  useEffect(() => {
    if (currentUser || updatedUser) {
      const values = {
        user_name: currentUser.user_name || '',
        email: currentUser.email || '',
        mobile: currentUser.contactno || '',
        address: currentUser.address || '',
        pancard: currentUser.pan_no || '',
        bankIfsc: currentUser.ifsc_code || '',
        bankName: currentUser.bank_name || '',
        acNumber: currentUser.account_number || '',
        bankBranch: currentUser.branch_name || '',
      };

      setFormValues(values);
      setPanImagePreview(currentUser.pan_image);
      setPassbookImagePreview(currentUser.passbook_image);
      setProfileImagePreview(currentUser.profile_image);
    }
  }, [currentUser, updatedUser]);

  useEffect(() => {
    handleState();
  }, []);

  useEffect(() => {
    if (stateData && currentUser) {
      const selectedStateId = stateData.find((item) => item.id === currentUser.state_id);
      setSelectedState(selectedStateId);
    }
  }, [stateData, currentUser]);

  useEffect(() => {
    if (selectedState.id) {
      handleCity();
    }
  }, [selectedState?.id]);

  useEffect(() => {
    if (cityData && currentUser) {
      const selectedCityId = cityData.find((item) => item.id === currentUser.city_id);
      setSelectedCity(selectedCityId);
    }
  }, [cityData, currentUser]);

  async function handleState() {
    try {
      const stateRes = await stateListData();
      if (stateRes?.status) {
        setStateData(stateRes.data);
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  }

  async function handleCity() {
    const res = await cityListData(selectedState.id);
    if (res?.status) {
      const data = res.data;
      setCityData(data);
    }
  }

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFileData(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanFileData(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPanImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePassbookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassbookFileData(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setPassbookImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

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
    if (!formValues.address) {
      errors.address = 'Please enter a full address';
    }
    if (!selectedState) {
      errors.selectedState = 'Please select state';
    }
    if (!selectedCity) {
      errors.selectedCity = 'Please select city';
    }

    if (!formValues.mobile) {
      errors.mobile = 'Please enter a mobile number';
    } else if (!validMobile(formValues.mobile)) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formValues.pancard) {
      errors.pancard = 'Please enter a PAN number';
    } else if (!validPAN(formValues.pancard)) {
      errors.pancard = 'Please enter valid PAN number';
    }

    if (!formValues.bankIfsc) {
      errors.bankIfsc = 'Please enter a bank IFSC code';
    } else if (!validBankIFSC(formValues.bankIfsc)) {
      errors.bankIfsc = 'Please enter a valid bank IFSC code';
    }

    if (!formValues.acNumber) {
      errors.acNumber = 'Please enter an account number';
    } else if (!validAccountNumber(formValues.acNumber)) {
      errors.acNumber = 'Please enter a valid account number';
    }

    if (!formValues.bankBranch) {
      errors.bankBranch = 'Please enter a bank branch name';
    }
    if (!formValues.bankName) {
      errors.bankName = 'Please enter a bank name';
    }
    if (!panFileData && !panImagePreview) {
      errors.panFileData = 'Please upload PAN card  ';
    }
    if (!passbookFileData && !passbookImagePreview) {
      errors.passbookFileData = 'Please passbook card  ';
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
          pan_image: panFileData,
          passbook_image: passbookFileData,
          profile_image: profileFileData,
          state_id: selectedState?.id,
          city_id: selectedCity?.id,
        };
        setLoading(true);
        const res = await updateUserDetails(params);
        if (res?.status) {
          toast.success(res.message);
          setUpdatedUser(true);
        }
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="My Profile" data={'Dashboard'} />
        </div>
        <Row className="py-4 ">
          <Col lg={12}>
            <Card className="card-border rounded-4 mb-4">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">My profile</h4>
              </div>
              <Card.Body>
                <Form>
                  <div className="box-profile-image mb-4 d-flex align-items-center circular-image-container">
                    <Image
                      src={profileImagePreview || '/images/user.png'}
                      alt="image"
                      width={100}
                      height={100}
                      className="rounded-circle me-4 circular-image"
                    />
                    <div>
                      <Form.Control
                        type="file"
                        id="uploadImage"
                        onChange={handleProfileFileChange}
                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                        className="d-none"
                      />
                      <label className="common-btn py-2 px-3 fs-14 cursor-pointer text-nowrap" htmlFor="uploadImage">
                        Upload Avatar
                      </label>
                    </div>
                  </div>

                  <Row>
                    <Col lg={6}>
                      <div className="mb-4">
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
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
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
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Mobile Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Your Mobile Number"
                            name="mobile"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            id="mobile"
                            value={formValues.mobile || '12345677890'}
                            onChange={handleChange}
                            maxLength="10"
                            onKeyPress={handleKeyPress}
                            onInput={maxLengthCheck}
                            disabled
                          />
                          {formErrors.mobile && <p className="text-danger fs-14 error-message">{formErrors.mobile}</p>}
                        </Form.Group>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="position-relative">
                        <Form.Label className="fs-16 fw-400 base-color">State</Form.Label>
                        <ReusableDropdown
                          options={stateData}
                          selectedValue={selectedState?.name || 'Select State'}
                          onSelect={setSelectedState}
                          placeholder="State"
                          displayKey="name"
                          valueKey="id"
                        />
                        {formErrors.selectedState && (
                          <p className="text-danger fs-14 error-message">{formErrors.selectedState}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">City</Form.Label>

                          <ReusableDropdown
                            options={cityData}
                            selectedValue={selectedCity ? selectedCity.city : 'Select City'}
                            onSelect={setSelectedCity}
                            placeholder="City"
                            displayKey="city"
                            valueKey="id"
                          />
                          {formErrors.selectedCity && (
                            <p className="text-danger fs-14 error-message">{formErrors.selectedCity}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-14 fw-400 base-color">Add Address</Form.Label>
                          <Form.Control
                            type="text"
                            as="textarea"
                            name="address"
                            placeholder="Enter Your Address"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3 card-border rounded-1 text-area"
                            value={formValues.address}
                            onChange={handleChange}
                          />
                          {formErrors.address && (
                            <p className="text-danger fs-14 error-message">{formErrors.address}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Bank Details</h4>
              </div>
              <Card.Body className="box-padding">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <div className="box-profile-image mb-4">
                        <div className="img-profile me-3"></div>
                        <div className="info-profile pan-card-upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {panImagePreview && (
                            <Image
                              src={panImagePreview}
                              alt="PAN Card"
                              width={150}
                              height={150}
                              className="img-fluid rounded-3"
                            />
                          )}
                          <FontAwesomeIcon icon={faCloudUpload} className="base-color-2 mb-3" width={35} height={35} />
                          <div>
                            <Form.Control
                              type="file"
                              id="pan"
                              onChange={handlePanFileChange}
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              className="d-none"
                              aria-describedby="passwordHelpBlock"
                            />
                            <label className="common-btn py-2 px-3 fs-14 me-2 cursor-pointer" htmlFor="pan">
                              <span className="d-inline-flex align-middle">Upload PAN Card</span>
                            </label>
                          </div>
                        </div>
                        {formErrors.panFileData && (
                          <p className="text-danger fs-14 error-message">{formErrors.panFileData}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="box-profile-image mb-4">
                        <div className="img-profile me-3"></div>
                        <div className="info-profile pan-card-upload p-3 d-flex justify-content-center flex-column align-items-center">
                          {passbookImagePreview && (
                            <Image
                              src={passbookImagePreview}
                              alt="Bank Passbook"
                              width={150}
                              height={150}
                              className="img-fluid rounded-3"
                            />
                          )}
                          <FontAwesomeIcon icon={faCloudUpload} className="base-color-2 mb-3" width={35} height={35} />
                          <div>
                            <Form.Control
                              type="file"
                              id="passbook"
                              onChange={handlePassbookFileChange}
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              className="d-none"
                              aria-describedby="passwordHelpBlock"
                            />
                            <label className="common-btn py-2 px-3 fs-14 me-2 cursor-pointer" htmlFor="passbook">
                              <span className="d-inline-flex align-middle">Upload Bank Passbook</span>
                            </label>
                          </div>
                        </div>
                        {formErrors.passbookFileData && (
                          <p className="text-danger fs-14 error-message">{formErrors.passbookFileData}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter PAN Card No.</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter PAN Card No."
                            name="pancard"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.pancard}
                            onChange={handleChange}
                          />
                          {formErrors.pancard && (
                            <p className="text-danger fs-14 error-message">{formErrors.pancard}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Bank IFSC Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Bank IFSC Code"
                            name="bankIfsc"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.bankIfsc}
                            onChange={handleChange}
                          />
                          {formErrors.bankIfsc && (
                            <p className="text-danger fs-14 error-message">{formErrors.bankIfsc}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Bank Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Bank Name"
                            name="bankName"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.bankName}
                            onChange={handleChange}
                          />
                          {formErrors.bankName && (
                            <p className="text-danger fs-14 error-message">{formErrors.bankName}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Bank Branch Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Bank Branch Name"
                            name="bankBranch"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.bankBranch}
                            onChange={handleChange}
                          />
                          {formErrors.bankBranch && (
                            <p className="text-danger fs-14 error-message">{formErrors.bankBranch}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color">Enter Account Number</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Enter Account Number"
                            name="acNumber"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.acNumber}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                          />
                          {formErrors.acNumber && (
                            <p className="text-danger fs-14 error-message">{formErrors.acNumber}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>

                  <Button type="submit" className="common-btn py-2 px-3 mt-3 fs-14 d-flex align-items-center">
                    <Image
                      src="/images/team-roster/apply.svg"
                      alt="Save Change"
                      width={18}
                      height={18}
                      className="me-1 img-fluid"
                    />
                    Save Change
                    {loading && <Spinner animation="border" size="sm" variant="white" className="ms-1 spinner" />}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default MyProfile;
