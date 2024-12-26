import React from "react";

const WatchHistory = () => {

  const videoData= [
    {
      videoName: "Event Driven programming",
      thumbnail:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp",
      chapterName:"Mern Developement",
      courseName:"full stack development"
    },
    {
      videoName: "Modules in Node js",
      thumbnail:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp",
      chapterName:"Mern Developement",
      courseName:"full stack development"
    },
    {
      videoName: "Introduction to Node js",
      thumbnail:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp",
      chapterName:"Mern Developement",
      courseName:"full stack development"
    },
    {
      videoName: "React Hooks",
      thumbnail:"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp",
      chapterName:"React Js tutorial",
      courseName:"Front end development"
    },
  ]
  return (
    <>
      <section className="h-100 h-custom" style={{ backgroundColor: " #fff" }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div
                className="card "
                style={{
                  boxShadow:
                    "0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)",
                }}
              >
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-12">
                      <h5 className="mb-3">
                        <a href="#!" className="text-body">
                          <i className="fas fa-long-arrow-alt-left me-2"></i>My
                          watch history
                        </a>
                      </h5>
                      <hr />
                      {/* 
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <p className="mb-1">Shopping cart</p>
                    <p className="mb-0">You have 4 items in your cart</p>
                  </div>
                  <div>
                    <p className="mb-0"><span className="text-muted">Sort by:</span> <a href="#!"
                        className="text-body">price <i className="fas fa-angle-down mt-1"></i></a></p>
                  </div>
                </div> */}

                {
                  videoData?.map((data)=>{
                    return (
                      <div className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp"
                                className="img-fluid rounded-3"
                                alt="Shopping item"
                                style={{ width: "65px" }}
                              />
                            </div>
                            <div className="ms-3">
                              <h5>{data?.videoName}</h5>
                              <p className="small mb-0">{data?.chapterName}</p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center">
                            {/* <div style={{width: "50px"}}>
                        <h5 className="fw-normal mb-0">2</h5>
                      </div> */}
                            <div style={{ width: "280px" }}>
                              <h5 className="mb-0">{data?.courseName}</h5>
                            </div>
                            <a href="#!" style={{ color: "#cecece" }}>
                              <i className="fas fa-trash-alt"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    )
                  })
                }
                     

                 
                     

             
                   
                   
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WatchHistory;
