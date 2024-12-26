import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import styles from "./Dashboard.module.css"
const DashboardModal = (props) => {
          const data = props?.data || []
          const index = props?.index || 1;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Dashboard</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ overflow: "scroll", height: "500px", maxWidth: "95vw" }}
      >
        <Table striped="columns">
          <thead className={styles.fontSize}>
            <tr>
              <th scope="col">#</th>
              <th scope="col">User Name</th>
              <th scope="col">Chapter Name</th>
              <th scope="col">No of questions</th>
              <th scope="col">Un-attempted</th>
              <th scope="col">Score</th>
              <th scope="col">Completion rate of chapter</th>
            </tr>
          </thead>
          <tbody className={styles.fontSize}>
            <tr>
              <th scope="row">{index}</th>
              <td>{data?.fullName}</td>
              <td>
                <ul>
                  {data?.assignedCategories?.map(
                    (categories) =>
                      categories?.courseChapters?.map(
                        (chapters) => (
                          <>
                            <li className={styles.Nestedheight}>
                              {chapters?.chapterName}
                            </li>
                            <hr />
                          </>
                        )
                      )
                    // <td>{ el?._id}</td>
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {data?.assignedCategories?.map(
                    (categories) =>
                      categories?.courseChapters?.map(
                        (chapters) => (
                          <>
                            <li className={styles.Nestedheight}>
                              {chapters?.chapterQuizzes?.length}
                            </li>
                            <hr />
                          </>
                        )
                      )
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {data?.assignedCategories?.map(
                    (categories) =>
                      categories?.courseChapters?.map(
                        (chapters) => (
                          <>
                            <li className={styles.Nestedheight}>0</li>
                            <hr />
                          </>
                        )
                      )
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {data?.assignedCategories?.map((categories) =>
                    categories?.courseChapters?.map((chapters) => (
                      <>
                        <li className={styles.Nestedheight}>
                          {`${Math.ceil(chapters?.score)}`}
                        </li>
                        <hr />
                      </>
                    ))
                  )}
                </ul>
              </td>
              <td>
                <ul>
                  {data?.assignedCategories?.map((categories) =>
                    categories?.courseChapters?.map((chapters) => (
                      <>
                        <li className={styles.Nestedheight}>
                          {`${Math.ceil(chapters?.videoStatus?.completion)}%`}
                        </li>
                        <hr />
                      </>
                    ))
                  )}
                </ul>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DashboardModal;
