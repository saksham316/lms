import React from 'react'
import { TailSpin } from 'react-loader-spinner'
import styles from "../../pages/pagesCSS/Course.module.css"

const SpinnerLoader = () => {
  return (
    <div className={`${styles.spiner} ${styles.aftersubmitLoading}`}>
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
  )
}

export default SpinnerLoader