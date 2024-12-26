import styles from "./Logout.module.css";
import logout from "../../../assets/images/logout.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import React from "react";

const Logout = () => {
  return (
    <Container
      className={`${styles.container} d-flex justify-content-center align-items-center`}
    >
      <Row className={`${styles.row} py-4 px-2`}>
        <Col className={styles.displaynone}>
          <div>
            <img className={styles.img} src={logout} alt="logout" />
          </div>
        </Col>
        <Col>
          <div className="my-3">
            <h1 className={styles.heading}>Logout?</h1>
          </div>
          <div className="my-2">
            <p className={styles.paragraph}>
              Are you sure you want to logout? <br></br>We can’t notify you once
              you logout.
            </p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <button className={`${styles.btn} my-2`}>Logout</button>
            <button className={`${styles.btn} my-2`}>Cancel</button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Logout;
