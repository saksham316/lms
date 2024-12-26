import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "./TopCarousel.module.css"
import s1 from "../../assets/images/slideImage1.jpeg";
import s2 from "../../assets/images/slideImage2.jpeg";
import s3 from "../../assets/images/slideImage3.jpeg";
import s4 from "../../assets/images/slideImage4.jpeg";
import s5 from "../../assets/images/slideImage5.jpg";
import s6 from "../../assets/images/slideImage6.JPG";
import s7 from "../../assets/images/slideImage7.JPG";
import s8 from "../../assets/images/slideImage8.jpg";
import s9 from "../../assets/images/sliderImage9.jpg";
import s10 from "../../assets/images/sliderImage10.jpg";
import s11 from "../../assets/images/sliderImage11.jpg";
import s12 from "../../assets/images/sliderImage12.jpg";
import s13 from "../../assets/images/sliderImage13.jpg";
import s14 from "../../assets/images/sliderImage14.jpg";

// -----------------------------------------------------------------------------------------------
let imageArray = [s1, s2, s3, s4, s5, s6, s7,s8,s9,s10,s11,s12,s13,s14];

// ------------------------------------------------------------------------------------------------
const TopCarousel = () => {
  return (
    <div className={styles.carousel_parent}>
      <Carousel>
        {Array?.isArray(imageArray) &&
          imageArray?.length > 0 &&
          imageArray?.map((image) => {
            return (
              <Carousel.Item className={styles.carousel_item} style={{height:"600px"}}>
                <img src={`${image}`} alt="" />
              </Carousel.Item>
            );
          })}
      </Carousel>
    </div>
  );
};

export default TopCarousel;
