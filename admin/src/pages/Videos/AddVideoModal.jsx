// --------------------------------------------Imports----------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "./modal.module.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../features/actions/Video/videoActions";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import { VideoProgressBar } from "../../components/Loader/VideoProgressBar/VideoProgressBar";

// ------------------------------------------------------------------------------------------------

const AddVideoModal = ({ show, hide, viewEvent, courseId }) => {
  // ---------------------------------------------States-----------------------------------------------
  const [duration, setDuration] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(0);
  // --------------------------------------------------------------------------------------------------

  // ----------------------------------------------Hooks-----------------------------------------------
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const videoRef = useRef(null);

  const { isLoading, videoProgress } = useSelector((state) => state?.video);

  const dispatch = useDispatch();
  // --------------------------------------------------------------------------------------------------

  // --------------------------------------------Functions---------------------------------------------

  // addVideoHandler - handler to add the video to the database
  const addVideoHandler = (data) => {
    try {
      const formData = new FormData();

      const { videoTitle, videoDescription, thumbnail, video } = data;
      const videoObj = {
        videoTitle,
        videoDescription,
        courseId,
        videoDuration: duration,
      };

      // formData.append("videoLink", thumbnail[0]);
      // formData.append("videoLink", video[0]);
      // formData.append("videoObj", JSON.stringify(videoObj));

      if (courseId) {
        dispatch(
          addVideo({
            thumbnail: thumbnail[0],
            video: video[0],
            videoObj: videoObj,
          })
        );
      } else {
        toast.error("Course Id not found ! Try Again");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // handleVideoDuration -- function to handle the video duration when selected
  const handleVideoDuration = (e) => {
    try {
      const videoSrc = URL.createObjectURL(e.target.files[0]);
      videoRef.current.src = videoSrc;
      videoRef.current.addEventListener("loadedmetadata", () => {
        const duration = videoRef.current.duration;
        setDuration(duration);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  // --------------------------------------------------------------------------------------------------

  // -----------------------------------------------useEffect------------------------------------------
  useEffect(() => {
    if (isLoading) {
      setVideoUploaded(videoProgress);
    }
  }, [videoProgress]);
  // --------------------------------------------------------------------------------------------------

  return (
    <section>
      <Modal
        show={show}
        onHide={() => hide()}
        aria-labelledby="shop-details-modal"
        backdrop="static"
        keyboard={false}
        dialogClassName={styles.modalWidth}
        contentClassName={styles.modalHeight}
      >
        <Modal.Header closeButton>
          <Modal.Title id="shop-details-modal">Add Video</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isLoading ? (
            <div className={`${styles.spiner} row`}>
              {/* <TailSpin
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              /> */}
              <div className="col-md-12 text-center">
                <h2>Uploading to the Cloud...</h2>
              </div>
              <VideoProgressBar videoUploaded={videoUploaded} />
              <div className="col-md-12">
                <h6 style={{ color: "blue" }} className="text-center">
                  <span style={{ color: "black", fontSize: "large" }}>
                    Note
                    <br />
                  </span>
                  After the completion of the upload process, there will be a
                  delay in the cloud's processing and listing of media files
                  within the bucket. Therefore ,
                  <strong style={{ color: "red" }}> please refrain </strong>
                  from promptly assigning the course to the student immediately
                  after uploading. It is advisable to wait for a minimum of
                  <strong style={{ color: "red" }}> 30 minutes </strong> before
                  proceeding with the course assignment.
                </h6>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(addVideoHandler)}
              className={`row g-3 ${styles.responsive_modal}`}
            >
              <div className="col-12">
                <label for="videoTitle" className="form-label">
                  Video Title
                </label>
                <input
                  {...register("videoTitle", { required: true })}
                  type="text"
                  className="form-control"
                  id="videoTitle"
                  placeholder="Video Title"
                />
                {errors.videoTitle && (
                  <span className="text-danger">This field is required</span>
                )}
              </div>
              <div className="col-12 mb-3">
                <label for="videoDescription" className="form-label">
                  Video Description
                </label>
                <textarea
                  {...register("videoDescription", { required: true })}
                  className="form-control"
                  id="videoDescription"
                  rows="6"
                ></textarea>
                {errors.videoDescription && (
                  <span className="text-danger">This field is required</span>
                )}
              </div>
              <div className="mb-3 col-md-6">
                <label for="thumbnail" className="form-label">
                  Thumbnail
                </label>
                <input
                  {...register("thumbnail", { required: true })}
                  className="form-control"
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                />
                {errors.thumbnail && (
                  <span className="text-danger">This field is required</span>
                )}
              </div>
              <div className="mb-3 col-md-6">
                <label for="videos" className="form-label">
                  Video
                </label>
                <input
                  {...register("video", {
                    required: true,
                    onChange: (e) => {
                      handleVideoDuration(e);
                    },
                  })}
                  className="form-control"
                  type="file"
                  id="videos"
                  accept="video/*"
                />
                {errors.videos && (
                  <span className="text-danger">This field is required</span>
                )}
                <video ref={videoRef} style={{ display: "none" }} />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Save Video
                </button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default AddVideoModal;
