import React, { useState, useEffect } from "react";
import "../Style/Dashboard.css";
import { Link } from "react-router-dom";
import MetricsCard from "./MetricsCard"; 

const INITIAL_METRICS = {
    members: 150,
    coaches: 5,
    revenue: 120000,
    expenses: 45000,
    profit: 75000, 
    paidThisMonth: 123,
    memberReclam: 3,
    coachReclam: 1,
};


const CARD_DEFINITIONS = [ //Definiton des cartes

    { key: 'members', title: 'Members', type: 'general' },
    { key: 'coaches', title: 'Coaches', type: 'general' },
    { key: 'revenue', title: 'Chiffre d’Affaire', type: 'revenue' },
    { key: 'expenses', title: 'Dépenses', type: 'expenses' },
    { key: 'profit', title: 'Net Profit', type: 'profit' },
    { key: 'paidThisMonth', title: 'Members Paid This Month', type: 'general' },
    { key: 'memberReclam', title: 'Membres Réclamations', type: 'general' },
    { key: 'coachReclam', title: 'Coachs Réclamations', type: 'general' },
];

const OwnerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState("month");

    // Load metrics from localStorage

    const [metrics, setMetrics] = useState(() => {
        const storedMetrics = localStorage.getItem('ownerDashboardMetrics');
        if (storedMetrics) {
            return { ...INITIAL_METRICS, ...JSON.parse(storedMetrics) };
        }
        return INITIAL_METRICS; //use defaults if nothing in localStorage
    });

    useEffect(() => {
        const newProfit = metrics.revenue - metrics.expenses;
        
        setMetrics(prevMetrics => ({
            ...prevMetrics, // keep other metrics unchanged
            profit: newProfit
        }));

        localStorage.setItem('ownerDashboardMetrics', JSON.stringify({
            ...metrics,
            profit: newProfit
        }));

    }, [metrics.revenue, metrics.expenses]); 
    
    return (
        <div className="dashboard-container">
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Owner Dashboard</h2>
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Year</option>
                </select>
            </div>

            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/owner/GestionMember">Gestion Members</Link>
                <Link to="/owner/GestionFinance">Gestion Finance</Link>
                <Link to="/owner/GestionAnnonce">Annonce</Link>
            </div>

            <div className="dashboard-content">
                
                
                <div className="cards-container"> 
                    {CARD_DEFINITIONS.map(card => ( // Generer Touts les cartes dynamiquement
                        <MetricsCard 
                            key={card.key}
                            title={card.title}
                            value={metrics[card.key]}
                            type={card.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;