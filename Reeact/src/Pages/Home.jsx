import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Home.css";

import Bannerr from "../img/Bannerr.png";
import img1_description from "../img/img1_description.jpg";
import img2_description from "../img/immg2.png"; 
import effectImg1 from "../img/tr.jpeg";
import effectImg2 from "../img/Dscrpt.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(`/signup/${role}`);
  };
  
  return (
    
    <div className="home-container">
      <div className="hero-banner">
        <img src={Bannerr} alt="Gym Banner" className="hero-img" />
        <div className="hero-text">
          <h1 className="gym-title">FITNESS</h1>
          <h2 className="service-title">MANAGEMENT</h2>
          <h2 className="service-title">PLATFORM</h2>
          <button className="discover-btn" onClick={() => { 
            document.querySelector('.role-buttons').scrollIntoView({ behavior: 'smooth' });
          }}>
            DISCOVER ACCESS
          </button>
        </div>
      </div>

      
      <h2 className="home-title">Choose Your Access Role</h2>
      <div className="role-buttons">
        <button className="role-btn" onClick={() => handleRoleClick("owner")}>Owner</button>
        <button className="role-btn" onClick={() => handleRoleClick("member")}>Member</button>
        <button className="role-btn" onClick={() => handleRoleClick("coach")}>Coach</button>
      </div>

     
      <div className="description-section">
        <div className="description-text">
          <h3>Optimizing Fitness Operations</h3>
          <p>
            Our platform specializes in delivering innovative IT solutions tailored for the fitness industry. 
            We provide modern, efficient, and scalable gym management systems designed to automate daily 
            operations, from membership tracking and finance to coach scheduling, ensuring optimal performance.
          </p>
        </div>
        <div className="description-image">
          <img src={img1_description} alt="Platform Services" className="desc-img" />
        </div>
      </div>

      
      <div className="description-section inverse"> 
        <div className="description-text">
          <h3>Data-Driven Growth & Transparency</h3>
          <p>
            We combine robust technology with financial oversight to provide gym owners with a seamless 
            management experience. Our tools offer real-time analytics on revenue, expenses, and member activity, 
            helping you make informed decisions and grow your business sustainably.
          </p>
        </div>
        <div className="description-image">
          <img src={img2_description}  className="desc-img" />
        </div>
      </div>

 
      <div className="image-effect-section">
        <div className="effect-image">
          <img src={effectImg1} />
          <div className="overlay">Centralized Management</div>
        </div>
        <div className="effect-image">
          <img src={effectImg2} />
          <div className="overlay">Financial Transparency</div>
        </div>
      </div>

      
      <footer className="footer">
        <p>© 2025 FitManager Platform. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default Home;