// --------------------------------------------Imports----------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// ------------------------------------------------------------------------------------------------

const VideoDescriptionModal = ({ show, hide, videoDetails }) => {
  // ---------------------------------------------States-----------------------------------------------
  // --------------------------------------------------------------------------------------------------

  // ----------------------------------------------Hooks-----------------------------------------------
  const {
    register,
    formState: { errors },
  } = useForm();

  const videoRef = useRef(null);

  // --------------------------------------------------------------------------------------------------

  // --------------------------------------------Functions---------------------------------------------

  // --------------------------------------------------------------------------------------------------

  // -----------------------------------------------useEffect------------------------------------------

  // --------------------------------------------------------------------------------------------------

  return (
    <section>
      <Modal
        show={show}
        onHide={() => hide()}
        aria-labelledby="shop-details-modal"
        backdrop="static"
        keyboard={false}
        dialogClassName={styles.modalWidth}
        contentClassName={styles.modalHeight}
      >
        <Modal.Header closeButton>
          <Modal.Title id="shop-details-modal">Video Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className={`row g-3 ${styles.responsive_modal}`}>
            <div className="col-12">
              <label for="videoTitle" className="form-label">
                Video Title
              </label>
              <input
                value={videoDetails?.videoTitle}
                type="text"
                className="form-control"
                id="videoTitle"
                placeholder="Video Title"
              />
              {errors.videoTitle && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
            <div className="col-12 mb-3">
              <label for="videoDescription" className="form-label">
                Video Description
              </label>
              <textarea
                value={videoDetails?.videoDescription}
                className="form-control"
                id="videoDescription"
                rows="6"
              ></textarea>
              {errors.videoDescription && (
                <span className="text-danger">This field is required</span>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default VideoDescriptionModal;
