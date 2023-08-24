import React, { useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';

import DashboardBreadcrumb from '@/components/Layouts/Breadcrumb/DashboardBreadcrumbar';
import {
  maxLengthCheck,
  validAccountNumber,
  validBankIFSC,
  validEmail,
  validMobile,
  validName,
  validPAN,
} from '@/_helper/regex';

function MyProfile() {
  const initialFormValues = {
    user: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    address: '',
    pancard: '',
    bankIfsc: '',
    bankName: '',
    acNumber: '',
    bankBranch: '',
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState();
  const [profileImages, setProfileImages] = useState();

  const [getAllStatesList, setGetAllStatesList] = useState([]);
  const [selectState, setSelectState] = useState('Select State');
  const [selectStateId, setSelectStateId] = useState('');
  const [searchState, setSearchState] = useState('');

  const [getAllCityList, setGetAllCityList] = useState([]);
  const [selectCity, setSelectCity] = useState('Select City');
  const [selectCityId, setSelectCityId] = useState('');
  const [searchCity, setSearchCity] = useState('');

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

  const stateSearchItem = getAllStatesList.filter((item) => {
    if (searchState == '') {
      return item;
    } else if (item.name.toLowerCase().includes(searchState.toLowerCase())) {
      return item;
    }
  });

  async function getCityList() {
    const params = {
      state_id: selectStateId,
    };
    const response = await cityListData(params);
    if (response.status) {
      setGetAllCityList(response?.data);
    }
  }

  function handleSelectCity(id, name) {
    setSelectCity(name);
    setSelectCityId(id);
  }

  const citySearchItem = getAllCityList.filter((item) => {
    if (searchCity == '') {
      return item;
    } else if (item.name.toLowerCase().includes(searchCity.toLowerCase())) {
      return item;
    }
  });

  function getImagePreviewURL(image) {
    if (typeof image === 'string') return image;
    return URL.createObjectURL(image);
  }

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

    if (!values.pancard) {
      errors.pancard = 'Please enter a PAN number';
    } else if (!validPAN(values.pancard)) {
      errors.pancard = 'Please enter valid PAN number';
    }

    if (!values.bankIfsc) {
      errors.bankIfsc = 'Please enter a bank IFSC code';
    } else if (!validBankIFSC(values.bankIfsc)) {
      errors.bankIfsc = 'Please enter a valid bank IFSC code';
    }

    if (!values.acNumber) {
      errors.acNumber = 'Please enter an account number';
    } else if (!validAccountNumber(values.acNumber)) {
      errors.acNumber = 'Please enter a valid account number';
    }

    if (!values.bankBranch) {
      errors.bankBranch = 'Please enter a bank branch name';
    }
    if (!values.bankName) {
      errors.bankName = 'Please enter a bank name';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
  };

  return (
    <section className="dashboard-section">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center">
          <DashboardBreadcrumb breadcrumbTitle="My Profile" data={'Dashboard'} />
        </div>
        <Row className="py-4 align-items-stretch h-100">
          <Col lg={12}>
            <Card className="card-border rounded-4 mb-4">
              <div className="card-head card-head-padding border-bottom">
                <h4 className="common-heading mb-0">Update your profile</h4>
              </div>
              <Card.Body className="box-padding">
                <Form>
                  <div className="box-profile-image mb-4 d-flex align-items-center">
                    <div className="img-profile me-3">
                      {/* {imageFileData && (
                        <Image
                          src={getImagePreviewURL(imageFileData)}
                          alt="profile"
                          width={100}
                          height={100}
                          className="img-fluid rounded-3"
                        />
                      )}
                      {!imageFileData && profileImages && (
          ""
          )} */}
                    </div>
                    <Image
                      src={(profileImage && profileImages) || '/images/team-roster/user-details.png'}
                      alt="image"
                      width={100}
                      height={100}
                      className="img-fluid rounded-3 me-4"
                    />
                    <div className="info-profile d-flex align-items-center">
                      <Form.Control
                        type="file"
                        id="uploadImage"
                        onChange={(e) => setImageFileData(e.target.files[0])}
                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                        className="d-none"
                        name="imageFileData"
                        // value={imageFileData}
                        aria-describedby="passwordHelpBlock"
                      />
                      <label
                        className="common-btn py-2 px-3 fs-14 me-2 cursor-pointer"
                        htmlFor="uploadImage"
                        title="Upload Image"
                      >
                        <span className="d-inline-flex align-middle">Upload Avatar</span>
                      </label>
                      {/* <span className="text-decoration-underline fs-14  base-color"> Delete</span> */}
                    </div>
                  </div>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Full Name</Form.Label>
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
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Email Address</Form.Label>
                          <Form.Control
                            type="email"
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
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Mobile Number</Form.Label>
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

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative" controlId="formBasicEmail">
                          <Form.Label className="fs-14 fw-500 base-color-2">City</Form.Label>
                          <div className="form-select-catgory">
                            <Dropdown className="form-control px-0 py-0 card-border">
                              <Dropdown.Toggle
                                variant="none"
                                className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                id="dropdown-basic"
                              >
                                <span className="text-truncate pe-3">
                                  {(selectCity && selectCity) || 'Select City'}
                                </span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="w-100 card-border banner-filter-menu">
                                <div className="px-2 mb-2">
                                  <input
                                    type="search"
                                    placeholder="Search City"
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="form-control shadow-none card-border fs-14 select-search-box"
                                  />
                                </div>
                                {getAllCityList &&
                                  citySearchItem.map((items, key) => {
                                    return (
                                      <Dropdown.Item
                                        key={key}
                                        className="py-2 fs-14 base-color"
                                        value={items.id}
                                        onClick={() => handleSelectCity(items.id, items.city)}
                                      >
                                        <span>{items.city}</span>
                                      </Dropdown.Item>
                                    );
                                  })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative" controlId="formBasicEmail">
                          <Form.Label className="fs-14 fw-500 base-color-2">State</Form.Label>
                          <div className="form-select-catgory">
                            <Dropdown className="form-control px-0 py-0 card-border">
                              <Dropdown.Toggle
                                variant="none"
                                className="w-100 hight-50 text-start filter-box-dropdown base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
                                id="dropdown-basic"
                              >
                                <span className="text-truncate pe-3">{selectState || 'Select State'}</span>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="w-100 card-border banner-filter-menu">
                                <div className="px-2 mb-2">
                                  <input
                                    type="search"
                                    placeholder="Search State"
                                    onChange={(e) => setSearchState(e.target.value)}
                                    className="form-control shadow-none card-border fs-14 select-search-box"
                                  />
                                </div>
                                {getAllStatesList &&
                                  stateSearchItem.map((items, key) => {
                                    return (
                                      <Dropdown.Item
                                        key={key}
                                        className="py-2 fs-14 base-color"
                                        value={items.id}
                                        onClick={() => handleSelectState(items.id, items.name)}
                                      >
                                        <span>{items.name}</span>
                                      </Dropdown.Item>
                                    );
                                  })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </Form.Group>
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative" controlId="formBasicEmail">
                          <Form.Label className="fs-14 fw-500 base-color-2">Add Address</Form.Label>
                          <Form.Control
                            type="text"
                            as="textarea"
                            placeholder="Enter Your Address"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3 card-border rounded-1 text-area"
                            // value={userAddress || ''}
                            // defaultValue={userAllDetails?.address}
                            onChange={(e) => setUserAddress(e.target.value)}
                          />
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
                <Form>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-4">
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter PAN Card No.</Form.Label>
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
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Bank IFSC Code</Form.Label>
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
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Bank Name</Form.Label>
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
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Bank Branch Name</Form.Label>
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
                          <Form.Label className="fs-16 fw-400 base-color-1">Enter Account Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Account Number"
                            name="acNumber"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            value={formValues.acNumber}
                            onChange={handleChange}
                          />
                          {formErrors.acNumber && (
                            <p className="text-danger fs-14 error-message">{formErrors.acNumber}</p>
                          )}
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>

                  <Button className="common-btn py-2 px-3 mt-3 fs-14" type="submit" onClick={handleSubmit}>
                    <Image
                      src="/images/team-roster/apply.svg"
                      alt="Save Change"
                      width={18}
                      height={18}
                      className="me-1 img-fluid"
                    />
                    <span className="d-inline-flex align-middle">Save Change</span>
                    {loading && <Spinner animation="border" variant="white" className="ms-1 spinner" />}
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