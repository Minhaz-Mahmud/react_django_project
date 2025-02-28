/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import "./main_home.css";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

// CountUp component for animated counting
function CountUp({ start = 0, end, duration = 2 }) {
  const [count, setCount] = useState(start);
  const stepRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (start !== null) {
      startTimeRef.current = Date.now();
      const totalSteps = Math.floor(duration * 60); // 60fps
      stepRef.current = (end - start) / totalSteps;

      const animateCount = () => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // in seconds

        if (elapsedTime < duration) {
          const progress = elapsedTime / duration;
          const easedProgress = 1 - (1 - progress) * (1 - progress);
          setCount(Math.floor(start + (end - start) * easedProgress));
          requestAnimationFrame(animateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animateCount);
    }

    return () => {
      startTimeRef.current = null;
    };
  }, [start, end, duration]);

  return <>{Math.floor(count).toLocaleString()}</>;
}

function MainHome() {
  const [showUpButton, setShowUpButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowUpButton(true);
      } else {
        setShowUpButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="main-home-div bg-dark">
        <div className="text-center">
          <h1 className="text-light">
            We help you to get your Dream Job easily
          </h1>
          <h5 className="text-center">
            Discover thousands of job opportunities and find the perfect match
            for your skills and career goals.
          </h5>
          <Link className="center-button" to="/job-feed">
            See Jobs
          </Link>
        </div>
      </div>
      <div>
        <NumericSection />
      </div>
      <div>
        <LookingForJobSection />
      </div>
      {showUpButton && (
        <button className="up-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
}

//looking for job section
function LookingForJobSection() {
  return (
    <div className="py-5 lookingfor-job-section">
      <div className="row">
        <div className="looking-left col-md-6">
          <h2 className="text-center section-title">Apply for a Job?</h2>
          <p>
            We have a wide range of job opportunities for you. Find the job that
            suits your skills and career goals.
          </p>
          <Link to="/registration" className="applybtn btn">
            Sign up and Apply
          </Link>
        </div>
        <div className="looking-right col-md-6">
          <img
            src="https://cdn.pixabay.com/photo/2018/03/01/09/33/business-3190206_960_720.jpg"
            alt="Looking for a Job"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

// NumericSection component
function NumericSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [stats, setStats] = useState({
    total_job_posts: 0,
    total_candidates: 0,
    total_companies: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/sum/total/numbers"
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div className="numeric-section py-5" ref={sectionRef}>
      <div className="numeric-section-inside-div">
        <h2 className="section-title text-center mb-5">
          Our Impact By Numbers
        </h2>
        <div className="row">
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-building"></i>
              </div>
              <div className="stat-content">
                <h2 className="stat-number">
                  <CountUp
                    end={stats.total_companies}
                    duration={1.5}
                    start={isVisible ? 0 : null}
                  />
                </h2>
                <p className="stat-label">Companies</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <h2 className="stat-number">
                  <CountUp
                    end={stats.total_candidates}
                    duration={1.5}
                    start={isVisible ? 0 : null}
                  />
                </h2>
                <p className="stat-label">Candidates</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="stat-content">
                <h2 className="stat-number">
                  <CountUp
                    end={stats.total_job_posts}
                    duration={1.5}
                    start={isVisible ? 0 : null}
                  />
                </h2>
                <p className="stat-label">Job Posts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainHome;
