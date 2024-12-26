import React from 'react'
import { Container,Row,Col } from 'react-bootstrap'
import styles from "../../pages/pagesCSS/Course.module.css"

const VideosSkeleton = () => {
  return (
    <Container>
        <Row>
        <Col>
              <div>
                <h1 className={styles.title} ></h1>
              </div>
              <div>
                <input
                style={{background:"rgb(243 239 239)"}}
                  className={styles.chapterName}
                  disabled
                 
                />
               
              </div>
              <div>
                <h1 className={styles.title}></h1>
              </div>
              <div>
                <textarea
                disabled
                  className={`${styles.description} pt-4`}
                  style={{background:"rgb(243 239 239)"}}
                ></textarea>
              </div>
              <div>
                <h1 className={styles.title}></h1>
              </div>
              <div
                className={`${styles.contentDiv} d-flex justify-content-between flex-wrap gap-2`} 
              >
                <div
                  className={styles.contentBox}
                  style={{background:"rgb(243 239 239)"}}
                >
                  
                </div>
                {/* hidden file input element  */}
               
                <div className={styles.contentBox} style={{background:"rgb(243 239 239)"}}></div>
                <div
                  className={styles.contentBox}
                  style={{background:"rgb(243 239 239)"}}
                >
            
                </div>
                
              </div>
              <div className={styles.nextPrevButtonDiv} >
                <div className="d-flex justify-content-center">
                  <button
                   
                    className={`${styles.submit}  mx-2`}
                    style={{background:"rgb(243 239 239)", width:"100px", height:"40px"}}
                  >
                  
                  </button>
                  <button
                  
                    className={`${styles.submit} mx-2`} style={{background:"rgb(243 239 239)", width:"100px", height:"40px"}}
                 
                  >
                    {" "}
                   
                  </button>
                </div>
              </div>
            </Col>
        </Row>
    </Container>
  )
}

export default VideosSkeleton;