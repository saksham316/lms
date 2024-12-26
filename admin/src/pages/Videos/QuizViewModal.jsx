import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";
import ViewvideoModal from "./ViewvideoModal";

function QuizViewModal({ show, hide, quizData }) {
  const [fullscreen, setFullscreen] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState([]);


  return (
    <>
      <div
        style={{ height: "inherit" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Modal
          style={{ height: "fit content !important" }}
          dialogClassName={styles.modalWidth}
          //    fullscreen={fullscreen}
          //  contentClassName={styles.modalHeight}
          show={show}
          onHide={() => {
            hide();
          }}
        >
          <Modal.Header closeButton>
            <div className="d-flex justify-content-between  w-100">
              <div>
                QUIZ ID:{" "}
                <span style={{ backgroundColor: "#f5c1c1" }}>
                  {quizData?._id}
                </span>
              </div>
            </div>
          </Modal.Header>
          <div className="d-flex justify-content-center align-items-center ">
            <Modal.Body>
              <table className={`${styles.table} table`}>
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">CHAPTER ID</th>
                    <th scope="col">QUIZ QUESTION</th>
                    <th scope="col">QUIZ OPTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{ 1}</th>
                    <td>{quizData?.chapterId}</td>
                    <td>{quizData?.question}</td>
                    <td>
                      <ul>
                        {Array.isArray(quizData?.options) &&
                          quizData?.options?.length > 0 &&
                          quizData?.options?.map((option) => {
                            return (
                              <li
                                style={{ color: `${option?.isCorrect ? "green" : ""}` }}
                              >
                                {option?.option}
                              </li>
                            );
                          })}
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>

              {isVideoModalOpen && (
                <ViewvideoModal
                  //  course={individualCourseData}
                  videoData={videoData}
                  show={isVideoModalOpen}
                  hide={() => setIsVideoModalOpen(false)}
                />
              )}
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default QuizViewModal;
