import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import OtpInput from 'react18-input-otp';

function VerifyOtp(props) {
  const {
    oneTimePassword,
    handleSubmit,
    formValues,
    otpResendSeconds,
    setOtpResendSeconds,
    handleOtp,
    setIsTypingOtp,
    setOneTimePassword,
  } = props;

  function handleResendOTP() {
    handleOtp();
    setOneTimePassword(null);
    setIsTypingOtp(false);
    setOtpResendSeconds(30);
  }

  return (
    <>
      <section className="login-page min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col xxl={4} lg={6} md={7}>
              <Form className="login-form bg-white shadow p-5 rounded-2">
                <div className="circle-container d-flex justify-content-center align-items-center m-auto rounded-circle">
                  <Image width={70} height={70} src={'/images/mobiles.png'} alt="otp-icon" />
                </div>
                <div className="text-center">
                  <p className="mb-0 base-color-2 mt-2">We have sent you an OTP on</p>
                  <p className="base-link-color">{formValues.mobile}</p>
                </div>
                <div className="otp-inputs">
                  <OtpInput
                    value={oneTimePassword}
                    onChange={(otp) => {
                      setOneTimePassword(otp);
                      setIsTypingOtp(true);
                    }}
                    shouldAutoFocus={true}
                    numInputs={4}
                    isInputNum={true}
                    onSubmit={true}
                  />
                </div>

                <div className="text-center my-3">
                  {(otpResendSeconds == 0 && (
                    <span className="base-link-color cursor-pointer me-2 fw-500" onClick={handleResendOTP}>
                      Resend OTP
                    </span>
                  )) || (
                    <span className="base-color-2 user-select-none me-2">
                      Resend OTP in {otpResendSeconds.toString().padStart(2, '0')} sec
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    className="common-btn w-100 mb-3"
                    onClick={handleSubmit}
                    disabled={oneTimePassword?.length !== 4}
                  >
                    Verify
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default VerifyOtp;
