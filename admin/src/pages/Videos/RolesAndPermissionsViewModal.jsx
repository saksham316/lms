import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";

function RolesAndPermissionsViewModal({ show, hide, user }) {
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
            <Modal.Title>Roles &  Permissions</Modal.Title>
          </Modal.Header>
          <div >
            <Modal.Body>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">USER ID</th>
                    <th scope="col">USERNAME</th>
                    <th scope="col">ASSIGNED ROLE</th>
                    <th scope="col">ASSIGNED PERMISSIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>{user?._id}</td>
                    <td>
                      {user?.userName}
                    </td>
                    <td>{user?.role}</td>

                    {/* chapters in course */}
                    <td>
                      <ul>
                        {user?.permissions.map((permission) => {
                          return <li>{permission}</li>;
                        })}
                      </ul>
                    </td>
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

export default RolesAndPermissionsViewModal;
