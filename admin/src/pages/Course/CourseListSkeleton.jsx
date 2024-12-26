import React from "react";
import "../pagesCSS/CourseListskeleton.css";

const CourseListSkeleton = ({ rowLimit }) => {
  return (
    <>
     
     
        
        <tbody>
      <tr>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
        <td className="loading">
          <div className="bar" style={{height:"30px", width:"80%", background:"gray"}}></div>
        </td>
      </tr>
    </tbody>
              

     
    </>
  );
};

export default CourseListSkeleton;
