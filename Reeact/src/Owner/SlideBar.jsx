import React from "react";
import { Link } from "react-router-dom";
import "../Style/Sliderbar.css";

const Sidebar = ({ open, toggleOpen }) => {
  return (
    <>

      <div className="topbar">
        <button className="menu-btn" onClick={toggleOpen}>
          ☰
        </button>
        <div className="topbar-title">Owner Dashboard</div>
      </div>

     
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-logo">🏋️‍♂️ Owner</div>

        <nav>
          <ul>
            <li><Link to="/owner" onClick={() => window.scrollTo(0,0)}>Dashboard</Link></li>
            <li><Link to="/owner/members">👥 Member Gestion</Link></li>
            <li><Link to="/owner/finance">💰 Finance Gestion</Link></li>
            <li><Link to="/owner/coaches">🏆 Coaches Gestion</Link></li>
            <Link to="/owner/payments">💰 Gérer les Paiements</Link>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <small>Logged as: Owner</small>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
