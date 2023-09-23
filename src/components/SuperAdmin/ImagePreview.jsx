import Image from 'next/image';
import React from 'react';
import { Modal } from 'react-bootstrap';

function ImagePreview(props) {
  const { panImage, setPanImage, passImage, setPassImage, reviewId } = props;
  return (
    <>
      <Modal show={panImage} onHide={() => setPanImage(false)} size="xl" centered className="modal-img-view">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="unset-img">
            <Image src={reviewId?.pan_image} layout="fill" className="custom-img" />
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={passImage} onHide={() => setPassImage(false)} size="xl" centered className="modal-img-view">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="unset-img">
            <Image src={reviewId?.passbook_image} layout="fill" className="custom-img" />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImagePreview;
