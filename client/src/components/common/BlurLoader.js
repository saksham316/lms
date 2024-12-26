import React from 'react'
import styles from './loader.module.css'

const BlurLoader = () => {
  return (
    <div className={`${styles.blur_loader} position-absolute w-100 h-100 d-flex justify-content-center align-items-center`}>
        <div className={`${styles.custom_loader}`}></div>
        </div>
  )
}

export default BlurLoader