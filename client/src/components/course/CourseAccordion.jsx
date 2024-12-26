// -----------------------------------------------Imports-------------------------------------------
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { BiLock } from "react-icons/bi";
import { BsFileEarmarkLock } from "react-icons/bs";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import CourseAccordionBodyData from "./CourseAccordionBodyData";
// --------------------------------------------------------------------------------------------------

const CourseAccordion = ({ chapter, chapterIndex, courseData }) => {
  // ------------------------------------------------States---------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  // ------------------------------------------------Hooks---------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  // ------------------------------------------------Functions-------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  // ------------------------------------------------useEffects------------------------------------------
  // ---------------------------------------------------------------------------------------------------
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey={`${chapterIndex}`} key={chapterIndex} className="my-3">
          <Accordion.Header>{chapter?.chapterName}</Accordion.Header>
          <Accordion.Body>
            {chapter?.chapterVideos?.map((chapterVideo, videoIndex) => {
              return (
                <CourseAccordionBodyData
                  courseData={courseData}
                  chapterIndex={chapterIndex}
                  chapter={chapter}
                  chapterVideo={chapterVideo}
                  key={videoIndex}
                  videoIndex={videoIndex}
                />
              );
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default CourseAccordion;
