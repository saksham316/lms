// ------------------------------------------------Imports----------------------------------------------
import React, { useEffect } from "react";
import "./Feedback.css";
import feedback from "../../assets/images/feedback.png";
import { useForm } from "react-hook-form";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { sendFeedback } from "../../features/actions/Feedback/feedbackActions";
import { resetFeedbackStatus } from "../../features/slices/Feedback/feedbackSlice";
import { TailSpin } from "react-loader-spinner";
// -----------------------------------------------------------------------------------------------------

const Feedback = () => {
  // -------------------------------------------------States----------------------------------------------
  // -----------------------------------------------------------------------------------------------------
  // --------------------------------------------------Hooks----------------------------------------------
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { isFeedbackSent, isLoading } = useSelector((state) => state.feedback);

  // -----------------------------------------------------------------------------------------------------
  // -----------------------------------------------Functions---------------------------------------------
  const feedbackSubmitHandler = (data) => {
    try {
      confirmAlert({
        title: "NOTE!",
        message: "Are You Sure! You want to send the feedback",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              const { name, email, feedbackContent } = data;
              dispatch(sendFeedback({ name, email, feedbackContent }));
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error?.message);
    }
  };
  // -----------------------------------------------------------------------------------------------------

  // ---------------------------------------useEffect-----------------------------------------------------
  useEffect(() => {
    if (isFeedbackSent) {
      console.log("feedback sent");
      dispatch(resetFeedbackStatus(false));
      toast.success("Feedback Sent Successfully");
      reset();
    }
  }, [isFeedbackSent]);
  // -----------------------------------------------------------------------------------------------------

  return (
    <>
      {isLoading && (
        <div className={`loadingAfterSubmit`}>
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <div className="container" id="feedback_wrapper">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card border-0 h-100">
              <div className="card-body border-0">
                <div className="row h-100">
                  <div className="col-md-6 h-100">
                    <div className="feedback_image d-flex align-items-center justify-content-center h-100">
                      <img src={feedback} alt="feedback" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feedback_form p-3">
                      <h2 className="my-3">FeedBack Form</h2>
                      <form onSubmit={handleSubmit(feedbackSubmitHandler)}>
                        <div className="form-row">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            {...register("name", {
                              required: {
                                value: true,
                                message: "Name is required",
                              },
                            })}
                          />
                          {errors.name && (
                            <div className="text-danger pt-1">
                              {errors.name.message || "Name is Required"}
                            </div>
                          )}
                        </div>
                        <div className="form-row my-3">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            {...register("email", {
                              required: {
                                value: true,
                                message: "Email is required",
                              },
                            })}
                          />
                          {errors.email && (
                            <div className="text-danger pt-1">
                              {errors.email.message || "Email is Required"}
                            </div>
                          )}
                        </div>
                        <div className="form-row my-2">
                          <textarea
                            name=""
                            id=""
                            cols="49"
                            rows="10"
                            className="form-control"
                            placeholder="Write your Feedback"
                            {...register("feedbackContent", {
                              required: {
                                value: true,
                                message: "Feedback Content is required",
                              },
                            })}
                          ></textarea>
                          {errors.feedbackContent && (
                            <div className="text-danger pt-1">
                              {errors.feedbackContent.message ||
                                "Feedback Content is Required"}
                            </div>
                          )}
                        </div>
                        <div className="feedback_button text-center">
                          <button className="btn btn-dark w-100 my-3">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
