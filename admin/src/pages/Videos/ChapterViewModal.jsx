import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";
import ViewvideoModal from "./ViewvideoModal";

function ChapterViewModal({ show, hide, chapterData }) {
  //   const [show, setShow] = useState(false);
  //   const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);
  const [fullscreen, setFullscreen] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState([]);
  // const [courseViewModal, setCourseViewModal] = useState(false);

  return (
    <>
      {/* <Button variant="primary" onClick={()=>Show}>
        Launch demo modal
      </Button> */}
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
                CHAPTER ID:{" "}
                <span style={{ backgroundColor: "#f5c1c1" }}>
                  {chapterData?._id}
                </span>
              </div>
              <h3></h3>
              <div>
                CHAPTER NAME:{" "}
                <span style={{ backgroundColor: "#f5c1c1" }}>
                  {chapterData?.chapterName}
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
                    <th scope="col">CHAPTER VIDEOS</th>
                    <th scope="col">TITLE</th>
                    <th scope="col">CHAPTER DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(chapterData?.chapterVideos) &&
                    chapterData?.chapterVideos.length > 0 &&
                    chapterData?.chapterVideos.map((video, index) => {
                      return (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td style={{ cursor: "pointer" }}>
                            <img
                              onClick={() => {
                                setIsVideoModalOpen(!isVideoModalOpen);
                                setVideoData(video?.videoLink);
                              }}
                              src={video?.thumbnail}
                              alt={video?.videoTitle}
                              className="img-thumbnail"
                              style={{ height: "150px", width: "200px" }}
                            />
                          </td>
                          <td>{video?.videoTitle}</td>
                          <td>{video?.videoDescription}</td>
                        </tr>
                      );
                    })}
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

export default ChapterViewModal;
