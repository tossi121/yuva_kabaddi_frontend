import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Dropdown, Form, Row, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import {
  maxLengthCheck,
  validAccountNumber,
  validBankIFSC,
  validEmail,
  validMobile,
  validName,
  validPAN,
} from '@/_helper/regex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { cityListData, getCurrentUserDetails, stateListData, updateUserDetails } from '@/_services/services_api';
import { toast } from 'react-hot-toast';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function MyProfile() {
  const initialFormValues = {
    user_name: '',
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
  const [imageFileData, setImageFileData] = useState(null);
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
  const [panFileData, setPanFileData] = useState(null);
  const [passbookFileData, setPassbookFileData] = useState(null);
  const [profileFileData, setProfileFileData] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [panImagePreview, setPanImagePreview] = useState(null);
  const [passbookImagePreview, setPassbookImagePreview] = useState(null);
  useEffect(() => {
    handleWithdrawnRequest();
    getStateList();
  }, []);

  async function getStateList() {
    try {
      const response = await stateListData();
      console.log('API Response:', response);

      if (response.status) {
        setGetAllStatesList(response.data);
        // No need to set selectState or call getCityList here.
      }
    } catch (error) {
      console.error('Error fetching state list:', error);
    } 
  }
  useEffect(() => {
    // This useEffect runs whenever getAllStatesList, selectStateId, or selectCityId changes.
    // Place the logic that depends on these states here.
    if (getAllStatesList.length > 0 && selectStateId) {
      const selectedState = getAllStatesList.find((item) => item.id === selectStateId);
      if (selectedState) {
        console.log('Selected State:', selectedState.name);
        setSelectState(selectedState.name);
        getCityList(selectedState.id);
      }
    }
  }, [getAllStatesList, selectStateId, selectCityId]);
  useEffect(() => {
    if (getAllCityList.length > 0 && selectCityId != null) {
      const selectedCity = getAllCityList.find((item) => item.id === selectCityId);
      if (selectedCity) {
        console.log('Selected City:', selectedCity.city);
        setSelectCity(selectedCity.city);
      }
    }
  }, [getAllCityList, selectCityId]);
  // useEffect(()=>{
  //   getAllStatesList.map((items, key) => {
  //     // console.log('this is item',items.id)
  //     // console.log(selectStateId)
  //     if(items.id===selectStateId){
  //       console.log('this is item',items)
  //       setSelectState(items.name)
  //       getCityList(items.id)
  //       return items.name

  //     }
  //   })
  // })
  async function handleWithdrawnRequest() {
    const resw = await getCurrentUserDetails();
    const userData = resw?.data;
    if (resw?.status) {
      setFormValues({
        user_name: userData.user_name || '',
        email: userData.email || '',
        mobile: userData.contactno || '',
        state: userData.state_id || '',
        city: userData.city_id || '',
        address: userData.address || '',
        pancard: userData.pan_no || '',
        bankIfsc: userData.ifsc_code || '',
        bankName: userData.bank_name || '',
        acNumber: userData.account_number || '',
        bankBranch: userData.branch_name || '',
      });
      setPanImagePreview(userData.pan_image);
      setPassbookImagePreview(userData.passbook_image);
      setProfileImagePreview(userData.profile_image);
      setSelectStateId(userData.state_id || '');
      setSelectCityId(userData.city_id || '');
      // setPassbookFileData(userData.passbook_image)

      // toast.success(resw?.message);
    } else {
      // toast.error(resw?.message);
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      setRoleName(value);
    } else {
      setFormValues((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleKeyPress = (e) => {
    const key = e.key;
    if (key === 'e' || key === '+' || key === '-') {
      e.preventDefault();
    }
  };
  // console.log('sdjkdhaf dffhjk ak v fdvfd jkdfh ===', getAllStatesList)
  const stateSearchItem = getAllStatesList.filter((item) => {
    if (searchState == '') {
      return item;
    } else if (item.name.toLowerCase().includes(searchState.toLowerCase())) {
      return item;
    }
  });

  async function getCityList(id) {
    // const state_id: selectStateId
    const response = await cityListData(id);
    if (response.status) {
      setGetAllCityList(response?.data);
    }
  }

  function handleSelectCity(id, name) {
    setSelectCity(name);
    setSelectCityId(id);
  }
  function handleSelectState(id, name) {
    setSelectState(name);
    setSelectStateId(id);
    getCityList(id);
  }
  const handlePanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanFileData(file);

      const reader = new FileReader();
      console.log(file, panFileData);
      reader.onload = (e) => {
        setPanImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFileData(file);

      const reader = new FileReader();
      console.log(file, panFileData);
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handlePassbookFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassbookFileData(file);
      console.log(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        setPassbookImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
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
    if (!values.user_name) {
      errors.user_name = 'Please enter a full name';
    } else if (!validName(values.user_name)) {
      errors.user_name = 'Please enter a valid name';
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
    if (!values.imageFileData) {
      errors.imageFileData = 'Please upload PAN card  ';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    const params = {
      ...formValues,
      pan_image: panFileData,
      passbook_image: passbookFileData,
      profile_image: profileFileData,
      state_id: selectStateId,
      city_id: selectCityId,
    };
    console.log('this is params', params.state_id, params.city_id);
    // updateUserDetails()
    const res = await updateUserDetails(params);
    // handleApiResponse(res);
    console.log(res, "Rs")
    if (res?.status) {
      console.log('responce is', res);
      toast.success(res.message);
    }
    // console.log(data)
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
              <Card.Body className="box-padding">
                <Form>
                  <div className="box-profile-image mb-4 d-flex align-items-center">
                    <div className="img-profile me-3"></div>
                    <Image
                      src={(profileImagePreview && profileImagePreview) || '/images/team-roster/user-details.png'}
                      alt="image"
                      width={100}
                      height={100}
                      className="img-fluid rounded-3 me-4"
                    />
                    <div className="info-profile d-flex align-items-center">
                      <Form.Control
                        type="file"
                        id="uploadImage"
                        onChange={handleProfileFileChange}
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
                      <div className="mb-4">
                        <Form.Group className="position-relative">
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
                              <Dropdown.Menu className="w-100 card-border ">
                                <div className="px-2 mb-2">
                                  <input
                                    type="search"
                                    placeholder="Search City"
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="form-control shadow-none card-border fs-14 hight-50"
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
                        <Form.Group className="position-relative">
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
                              <Dropdown.Menu className="w-100 card-border ">
                                <div className="px-2 mb-2">
                                  <input
                                    type="search"
                                    placeholder="Search State"
                                    onChange={(e) => setSearchState(e.target.value)}
                                    className="form-control shadow-none card-border fs-14 hight-50"
                                  />
                                </div>
                                {getAllStatesList &&
                                  stateSearchItem.map((items, key) => {
                                    return (
                                      <Dropdown.Item
                                        key={key}
                                        className="py-2 fs-14 base-color"
                                        value={items.id}
                                        defaultValue={selectStateId}
                                        defaultChecked={selectStateId}
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
                        <Form.Group className="position-relative">
                          <Form.Label className="fs-14 fw-500 base-color-2">Add Address</Form.Label>
                          <Form.Control
                            type="text"
                            as="textarea"
                            name="address"
                            placeholder="Enter Your Address"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3 card-border rounded-1 text-area"
                            value={formValues.address}
                            // defaultValue={userAllDetails?.address}
                            onChange={handleChange}
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
                              name="imageFileData"
                              aria-describedby="passwordHelpBlock"
                            />
                            <label className="common-btn py-2 px-3 fs-14 me-2 cursor-pointer" htmlFor="pan">
                              <span className="d-inline-flex align-middle">Upload PAN Card</span>
                            </label>
                          </div>
                        </div>
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
                              name="imageFileData"
                              aria-describedby="passwordHelpBlock"
                            />
                            <label className="common-btn py-2 px-3 fs-14 me-2 cursor-pointer" htmlFor="passbook">
                              <span className="d-inline-flex align-middle">Upload Bank Passbook</span>
                            </label>
                          </div>
                        </div>
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

                  <Button className="common-btn py-2 px-3 mt-3 fs-14" onClick={handleSubmit}>
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
