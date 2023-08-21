import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import OtpInput from 'react18-input-otp';

function VerifyOtp({ mobileNumber }) {
  const [oneTimePassword, setOneTimePassword] = useState(null);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setSeconds(30);
    }
  }, [seconds]);
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return (
    <>
          <section className="login-page min-vh-100 d-flex align-items-center justify-content-center">
        <Container>
          <Row className="justify-content-center">
            <Col xxl={4} lg={6} md={7}>
              <Form className="login-form bg-white shadow p-5 rounded-2">
                <div class="circle-container d-flex justify-content-center align-items-center rounded-circle m-auto">
                  <Image width={70} height={70} src={'/images/mobiles.png'} alt="otp-icon" />
                </div>
                <div className="text-center">
                  <p className="mb-0 purple-light-color mt-2">We have sent you an OTP on</p>
                  <p className="purple-color">{mobileNumber}</p>
                </div>
                <div className="otp-inputs">
                  <OtpInput
                    value={oneTimePassword}
                    onChange={setOneTimePassword}
                    shouldAutoFocus={true}
                    numInputs={4}
                    isInputNum={true}
                    onSubmit={true}
                  />
                </div>
                <div className="text-center my-3">
                  <span className="purple-color cursor-pointer me-2">Resend OTP in</span>
                  <span className="purple-light-color mb-0">{formattedSeconds}sec</span>
                </div>
                <div className="text-center">
                  <Button className="common-btn w-100 mb-3" disabled={oneTimePassword?.length != 4} type="submit">
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
