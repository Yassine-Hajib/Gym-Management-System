import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "../Style/Dashboard.css"; 
import { Link } from "react-router-dom";

const currencyFormat = (num) => { 
    if (typeof num === 'number') {
        return `${num.toLocaleString()} DH`;
    }
    return '0 DH'; 
};

const OwnerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState("month"); 

    
    const [metrics, setMetrics] = useState({
        members: 0,
        coaches: 0,
        revenue: 0,
        expenses: 0,
        profit: 0, 
        paidThisMonth: 0,
        memberReclam: 0,
        coachReclam: 0,
    });

    
    const fetchDashboardData = async () => {
    try {
        // RÉCUPÉRATION DU TOKEN
        const token = localStorage.getItem("token"); 
        
        const response = await axios.get("http://127.0.0.1:8000/api/dashboard-stats", {
            headers: {
                Authorization: `Bearer ${token}` // PROUVE QUI EST L'OWNER
            }
        });
        
        setMetrics(prev => ({
            ...prev,
            members: response.data.memberCount,
            coaches: response.data.coachCount,
            revenue: response.data.totalRevenue || 0, 
            expenses: response.data.totalExpenses || 0,
            profit: response.data.profit || 0,
            paidThisMonth: response.data.paidThisMonth || 0
        }));
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        if(error.response?.status === 401) {
            alert("Session expirée, veuillez vous reconnecter");
        }
    }
};



    useEffect(() => {
        fetchDashboardData();
    }, [timeFilter]); 

    return (
        <div className="dashboard-container">
            
            <div className="topbar">
                <button
                    className="menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>

                <h2>Owner Dashboard</h2>

                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Year</option>
                </select>
            </div>

           
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/owner/GestionMember">Gestion Members</Link>
                <Link to="/owner/GestionFinance">Gestion Finance</Link>
                <Link to="/owner/Coach">Gestion Coaches</Link>
            </div>

           
            <div className="dashboard-content">
                <div className="cards-container">
                    
                    <div className="card">
                        <h3>Members</h3>
                        <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{metrics.members}</p>
                    </div>

                    <div className="card">
                        <h3>Coaches</h3>
                        <p style={{fontSize: '2rem', fontWeight: 'bold'}}>{metrics.coaches}</p>
                    </div>

                    <div className="card revenue-card">
                        <h3>Chiffre d’Affaire</h3>
                        <p className="stat-value">{currencyFormat(metrics.revenue)}</p>
                    </div>

                    <div className="card expenses-card">
                        <h3>Dépenses</h3>
                        <p className="stat-value">{currencyFormat(metrics.expenses)}</p>
                    </div>

                    <div className="card profit-card">
                        <h3>Net Profit</h3>
                        <p className="stat-value">{currencyFormat(metrics.profit)}</p>
                    </div>

                    <div className="card">
                        <h3>Members Paid This Month</h3>
                        <p className="stat-value">{metrics.paidThisMonth}</p>
                    </div>

                    <div className="card">
                        <h3>Membres Réclamations</h3>
                        <p className="stat-value">{metrics.memberReclam}</p>
                    </div>

                    <div className="card">
                        <h3>Coachs Réclamations</h3>
                        <p className="stat-value">{metrics.coachReclam}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;