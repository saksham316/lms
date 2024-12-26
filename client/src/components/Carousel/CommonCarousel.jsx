// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import styles from "./CommonCarousel.module.css";

// import required modules
import { Navigation } from "swiper/modules";
// --------------------------------------------------------------------------------------------------

const CommonCarousel = ({ images }) => {
  return (
    <>
      <Swiper
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
        style={{ borderRadius: "20px", boxShadow: "2px 2px 4px 4px grey" }}
      >
        {Array?.isArray(images) && images?.length > 0 ? (
          images?.map((image) => {
            return (
              <SwiperSlide className={`${styles.carousel}`}>
                <img
                  className={`${styles.slideImage}`}
                  src={`${image}`}
                  alt="No Image Found"
                  srcSet=""
                />
              </SwiperSlide>
            );
          })
        ) : (
          <SwiperSlide className={`${styles.carousel}`}>
            <img
              className={`${styles.slideImage}`}
              src="https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="No Image Found"
              srcSet=""
            />
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
};

export default CommonCarousel;
