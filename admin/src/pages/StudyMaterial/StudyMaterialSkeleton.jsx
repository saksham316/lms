import React from "react";
import "../pagesCSS/StudyMaterialListSkeleton.css";

const StudyMaterialSkeleton = ({ rowLimit }) => {
  return (
    <>
      <tbody>
        <tr>
          <td className="loading">
            <div
              className="bar"
              style={{ height: "30px", width: "80%", background: "gray" }}
            ></div>
          </td>
          <td className="loading">
            <div
              className="bar"
              style={{ height: "30px", width: "80%", background: "gray" }}
            ></div>
          </td>
          <td className="loading">
            <div
              className="bar"
              style={{ height: "30px", width: "80%", background: "gray" }}
            ></div>
          </td>
          <td className="loading">
            <div
              className="bar"
              style={{ height: "30px", width: "80%", background: "gray" }}
            ></div>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default StudyMaterialSkeleton;
