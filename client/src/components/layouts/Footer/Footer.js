import React from "react";
import logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import fb from "../../../assets/images/facebook.png";
import lnkdn from "../../../assets/images/lnkdn.png";
import tweet from "../../../assets/images/twitter.png";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdOutlineMail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer_section}>
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center">
              <div className={styles.footer_logo}>
                <Link>
                  <img src={logo} alt="logo" width="200px" />
                </Link>
                <p className="my-3">
                  At Gravita, our mission is to provide comprehensive expertise
                  in reviewing home health charts and related services. We are
                  dedicated to ensuring the accuracy, compliance, and quality of
                  documentation, ultimately supporting the delivery of
                  exceptional patient care. Through our specialized knowledge
                  and commitment to excellence, we strive to streamline
                  processes, optimize revenue, and reduce denials for home
                  health agencies. Our mission is to be a trusted partner,
                  empowering healthcare providers to focus on their core mission
                  of improving patient outcomes while we handle the intricacies
                  of chart review with expertise and diligence
                </p>
              </div>
            </div>
            {/* <div className="col-md-2"></div> */}
            <div className="col-md-3">
              <div className={styles.useful_links_container}>
                <h5 className="my-3">Useful links</h5>
                <ul className={styles.useful_links}>
                  <li className={styles.list_items}>
                    <Link
                      target="_blank"
                      to="https://www.gravitaoasisreview.com/about-us"
                    >
                      About us
                    </Link>
                  </li>
                  <li className={styles.list_items}>
                    <Link
                      target="_blank"
                      to="https://www.gravitaoasisreview.com/contact"
                    >
                      Contact us
                    </Link>
                  </li>
                  <li className={styles.list_items}>
                    <Link to="/tap">Terms & Policies</Link>
                  </li>
                  <li className={styles.list_items}>
                    <Link to="/feedback">Feedback</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className={`${styles.helpLinks}`}
                style={{ paddingLeft: "5px", listStyle: "none" }}
              >
                <h5 className="my-3">Help and Support</h5>
                <div className="call_details" style={{ cursor: "pointer" }}>
                  <p>
                    <FaPhoneAlt style={{ color: "#2e75ac" }} /> +91 8019198037
                  </p>
                  <p>
                    <FaPhoneAlt style={{ color: "#2e75ac" }} /> +1 786-870-1556
                  </p>
                </div>
                <div className="email_details" style={{ cursor: "pointer" }}>
                  <p>
                    <MdEmail style={{ color: "#2e75ac" }} />{" "}
                    info@gravitaoasisreview.com
                  </p>
                  <p>
                    <MdEmail style={{ color: "#2e75ac" }} />{" "}
                    vinod@gravitaoasisreview.com
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="newsletter">
                <h5 className="my-3">Newsletter</h5>
                <p>Signup and recieve the latest tips via email</p>
                <form>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                  />
                  <button className="btn btn-info my-2 w-100 text-white">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={styles.footer_bottom}>
              <p>© 2023, Gravita Oasis Review</p>
              <div className={styles.social_icons}>
                <Link
                  to="https://www.linkedin.com/company/gravita-oasis-review-solutions-pvt-ltd/about/"
                  target="_blank"
                >
                  <img
                    src={lnkdn}
                    alt="fb"
                    width={30}
                    height={30}
                    className={styles.social_img}
                  />
                </Link>
                <Link
                  to="https://www.facebook.com/gravitaoasisreviewsolutions/"
                  target="_blank"
                >
                  <img
                    src={fb}
                    alt="fb"
                    width={30}
                    height={30}
                    className="social_img"
                  />
                </Link>
                <Link>
                  <img
                    src={tweet}
                    alt="fb"
                    width={30}
                    height={30}
                    className="social_img"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
