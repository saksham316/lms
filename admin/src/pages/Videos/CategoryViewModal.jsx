import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";

function CategoryViewModal({ show, hide, category }) {
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
          //    fullscreen={fullscreen}
          contentClassName={styles.modalHeight}
          show={show}
          onHide={() => {
            hide();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Category</Modal.Title>
          </Modal.Header>
          <div className="d-flex justify-content-center align-items-center ">
            <Modal.Body>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">CATEGORY ID</th>
                    <th scope="col">CATEGORY NAME</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>{category?._id}</td>
                    <td>{category?.categoryName}</td>
                  </tr>
                </tbody>
              </table>
            </Modal.Body>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default CategoryViewModal;
