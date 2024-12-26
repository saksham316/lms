// ---------------------------------------------Imports----------------------------------------------------
import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./StudyMaterial.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ---------------------------------------------------------------------------------------------------------

const StudyMaterialModal = (props) => {
  // --------------------------------------------States------------------------------------------------------
  const { pdfName, pdfDescription, mediaFile } = props?.selectedStudyMaterial;
  // --------------------------------------------------------------------------------------------------------
  // ---------------------------------------------Hooks------------------------------------------------------
  const navigate = useNavigate();
  // --------------------------------------------------------------------------------------------------------
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className={styles.modal_container}
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {pdfName || "N/A"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <p>{pdfDescription || "N/A"}</p>
            {mediaFile && (
              <iframe
                src={`${mediaFile}` + "#toolbar=0"}
                width={`100%`}
                height={`500px`}
              />
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              props.onHide();
              navigate("/welcome-quiz", {
                state: { studyMaterial: props?.selectedStudyMaterial },
              });
              toast.success("Now Please Complete the quiz");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudyMaterialModal;
