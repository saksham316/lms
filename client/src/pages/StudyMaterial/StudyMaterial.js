// ---------------------------------------------Imports-------------------------------------------
import React, { useRef, useState } from "react";
import styles from "./StudyMaterial.module.css";
import useAuth from "../../hooks/useAuth";
import StudyMaterialModal from "./StudyMaterialModal";
import Button from "react-bootstrap/esm/Button";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

// ------------------------------------------------------------------------------------------------

const StudyMaterial = () => {
  // ----------------------------------------------States---------------------------------------------
  const [selectedStudyMaterial, setSelectedStudyMaterial] = useState({});
  const [modalShow, setModalShow] = useState(false);
  // ------------------------------------------------------------------------------------------------
  // ----------------------------------------------Hooks---------------------------------------------
  const { loggedInUserData } = useAuth();
  const btnRef = useRef();
  // ------------------------------------------------------------------------------------------------
  // ---------------------------------------------Functions-------------------------------------------
  // docHandler -- handler to show the alert when user tries to open the document
  const docHandler = () => {
    try {
      confirmAlert({
        title: "NOTE!",
        message:
          "You need to complete the quiz or else your result will be considered void",
        buttons: [
          {
            label: "Open Doc",
            onClick: () => {
              setModalShow(true);
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  // ------------------------------------------------------------------------------------------------
  return (
    <div className={`${styles.studyMaterialContainer}`}>
      <div className={`${styles.studyMaterialWrapper} d-flex flex-column`}>
        <div
          className={`${styles.studyMaterialTitle} col-md-12 col-sm-12 col-12 text-center pt-3`}
        >
          <h1>Study Material</h1>
        </div>
        <div
          className={`${styles.studyMaterialContent} col-md-12 col-sm-12 col-12 p-5`}
        >
          <p className={`${styles.studyMaterialNote}`}>
            <span>Note!</span> <br />
            You need to complete the quiz, if you open the documents shown below
            or else your result will be considered void
          </p>
          <div
            className={`${styles.studyMaterialCardContainer} col-md-12 col-12 col-sm-12 d-flex flex-wrap gap-2 justify-content-center align-items-center p-1`}
          >
            {Array.isArray(loggedInUserData?.assignedStudyMaterial) &&
              loggedInUserData?.assignedStudyMaterial.length > 0 &&
              loggedInUserData?.assignedStudyMaterial.map((studyMaterial) => {
                return (
                  <div
                    className={`${styles.studyMaterialCard} col-md-3 col-sm-6 col-12 m-2`}
                    onClick={() => {
                      btnRef.current.click();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className={`${styles.studyMaterialCardContent} col-md-12 col-12 col-sm-12`}
                    ></div>
                    <div
                      className={`${styles.studyMaterialCardBtn} col-md-12 col-12 col-sm-12 d-flex flex-column justify-content-center align-items-center p-1 `}
                    >
                      <button
                        className={`text-center d-none`}
                        ref={btnRef}
                        onClick={() => {
                          setSelectedStudyMaterial(studyMaterial);
                          docHandler();
                        }}
                      >
                        Open
                      </button>
                      <div
                        className={`${styles.studyMaterialCardContentTitle} col-md-12 col-sm-12 col-12 m-1`}
                      >
                        {studyMaterial?.pdfName?.toUpperCase() || "N/A"}
                      </div>
                      <div
                        className={`${styles.studyMaterialCardContentDescription} col-md-12 col-sm-12 col-12 m-1`}
                      >
                        {studyMaterial?.pdfDescription || "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <StudyMaterialModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        selectedStudyMaterial={selectedStudyMaterial}
      />
    </div>
  );
};

export default StudyMaterial;
