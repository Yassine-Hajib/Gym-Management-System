import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import MemberHome from "./Member/MemberDashboard";
import CoachHome from "./Coach/CoachDashboard"; 
import OwnerDashboard from "./Owner/OwnerDashboard";
import MemberGestion from "./Owner/GestionMember";
import GestionFinance from "./Owner/GestionFinance";
import CoachesGestion from "./Owner/GestionCoach";
import MemberDashboard from './Member/MemberDashboard';
import CoachDashboard from './Coach/CoachDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/member/home" element={<MemberHome />} />
        <Route path="/coach/home" element={<CoachHome />} />
        <Route path="/owner/GestionMember" element={<MemberGestion />} />
        <Route path="/owner/GestionFinance" element={<GestionFinance />} />
        <Route path="/owner/Coach" element={<CoachesGestion />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
       

      </Routes>
    </Router>
  );
}

export default App;