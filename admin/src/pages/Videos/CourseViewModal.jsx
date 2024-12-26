import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";

function CourseViewModal({ show, hide, course }) {
  //   const [show, setShow] = useState(false);
  //   const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);
  const [fullscreen, setFullscreen] = useState(true);

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
          contentClassName={styles.modalHeight}
          show={show}
          onHide={() => {
            hide();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Course Details</Modal.Title>
          </Modal.Header>
          <div className="d-flex justify-content-center align-items-center ">
            <Modal.Body>
              <table className="table">
                <tbody>
                  <tr className="thead-dark">
                    <th>#</th>
                    <td>1</td>
                  </tr>
                  <tr>
                    <th>COURSE ID</th>
                    <td>{course?._id}</td>
                  </tr>
                  <tr>
                    <th>THUMBNAIL</th>
                    <td>
                      <img
                        src={`${course?.courseThumbnail || ""}`}
                        alt="..."
                        className="img-thumbnail"
                        style={{ height: "150px", width: "200px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>COURSE NAME</th>
                    <td>{course?.courseName}</td>
                  </tr>
                  <tr>
                    <th>COURSE CHAPTERS</th>
                    <td>{course?.courseChapters.length}</td>
                  </tr>
                  <tr>
                    <th>COURSE DESCRIPTION</th>
                    <td>{course?.courseDescription}</td>
                  </tr>
                  
                  {/* <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td><img src="https://w0.peakpx.com/wallpaper/666/79/HD-wallpaper-berlin-netflix-money-heist-flash-graphy.jpg" alt="..." className="img-thumbnail" style={{height:"200px", width:"200px"}}/></td>
      <td>@fat</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td><img src="https://w0.peakpx.com/wallpaper/666/79/HD-wallpaper-berlin-netflix-money-heist-flash-graphy.jpg" alt="..." className="img-thumbnail" style={{height:"200px", width:"200px"}}/></td>
      <td>@twitter</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td><img src="https://w0.peakpx.com/wallpaper/666/79/HD-wallpaper-berlin-netflix-money-heist-flash-graphy.jpg" alt="..." className="img-thumbnail" style={{height:"200px", width:"200px"}}/></td>
      <td>@twitter</td>
      <td>@mdo</td>
    </tr> */}
                </tbody>
              </table>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default CourseViewModal;
