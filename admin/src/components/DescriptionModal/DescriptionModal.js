import React from 'react'
import swal from "sweetalert";


const DescriptionModal = ({title,text}) => {
  return (
    <div style={{cursor:'pointer',color:'red'}} onClick={()=>{
        swal({
          title: title,
          text: text,
        });
      }}>Read More...</div>
  )
}

export default DescriptionModal