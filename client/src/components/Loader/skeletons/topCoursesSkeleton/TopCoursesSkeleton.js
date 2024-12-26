import React from 'react'
import "./topcoursesskeleton.css"

const TopCoursesSkeleton = () => {
  return (
    <div className='d-flex gap-4 justify-content-around'>
    <span className="skeleton-loading"></span>   
    <span className="skeleton-loading"></span> 
    <span className="skeleton-loading"></span> 
  </div>
  )
}

export default TopCoursesSkeleton