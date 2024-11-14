import NavbarComponent from "../navbar/navbar";
import FooterComponent from "../footer/footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main_home.css";

function MainHome() {
  return (
    <div>
      <div className="main-home-div">
        <NavbarComponent />
        <div className="home-div-class container d-flex flex-row text-center">
          <div className="left-div col-lg-6">
            <div className="hero-caption">
              <h1>Find the most exciting startup jobs</h1>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <form
                  action=""
                  className="search-box d-flex flex-wrap justify-content-center"
                >
                  <div className="input-form me-2">
                    <input
                      type="text"
                      placeholder="Job Title or keyword"
                      className="form-control"
                    />
                  </div>
                  <div className="select-form me-2">
                    <div className="select-itms">
                      <select
                        name="select"
                        id="select1"
                        className="form-select"
                      >
                        <option value="">Location BD</option>
                        <option value="">Location PK</option>
                        <option value="">Location US</option>
                        <option value="">Location UK</option>
                      </select>
                    </div>
                  </div>
                  <div className="search-form">
                    <button type="submit" className="btn btn-primary">
                      Find job
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="right-div col-lg-6">
            <img
              src="/assets/home-bg.jpg"
              alt="Startup jobs"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default MainHome;
