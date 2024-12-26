import React from "react";


const ChapterlistSkeleton = ({ rowLimit }) => {
  return (
    <>
     
        <div className="d-flex justify-content-center align-items-center p-1 mt-2 ">
        <div
          style={{
            width: "100%",
            height: "52px",
            background: "radial-gradient(circle at 18.7% 37.8%, rgb(224, 218, 218) 0%, rgb(225, 234, 238) 90%)",
            marginTop:"5px",
            borderRadius:"5px"
          }}
        ></div>
        </div>
     
    </>
  );
};

export default ChapterlistSkeleton;
