import React from 'react'
import './categoryskeleton.css'

const categoryskeleton = () => {
  return (
    <div className='d-flex gap-4'>
  <span className="skeletonloading"></span>   
  <span className="skeletonloading"></span> 
  <span className="skeletonloading"></span> 
</div>
  )
}

export default categoryskeleton