import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Style/Dashboard.css"; 
import "../Style/CoachDashboard.css"; 

function CoachDashboard() { 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [coachName, setCoachName] = useState("Coach");

    
    const [salaryHistory] = useState([
        { id: 1, date: "2025-11-30", amount: 5800.00, status: "Paid", description: "November Salary" },
        { id: 2, date: "2025-10-30", amount: 5800.00, status: "Paid", description: "October Salary" },
        { id: 3, date: "2025-12-30", amount: 6200.00, status: "Pending", description: "December Salary" },
    ]);

    const [assignedMembers] = useState([
        { id: 101, name: "Yassine", email: "Yassine@gmail.com", lastProgress: "2025-12-10" },
        { id: 102, name: "Nissrine", email: "Nissrine@gmail.com", lastProgress: "2025-12-05" },
        { id: 103, name: "Salma", email: "Salma@gmail.com", lastProgress: "2025-11-28" },
        { id: 104, name: "Brahim", email: "Brahim@gmail.com", lastProgress: "2025-12-12" },
    ]);

    useEffect(() => {
        // Récupère le nom de l'utilisateur stocké lors du login
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.name) {
            setCoachName(storedUser.name);
        }
    }, []);

    return (
        <div className="dashboard-container">
           
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Coach Dashboard</h2>
                <div className="user-badge">{coachName}</div>
            </div>

          
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/coach/dashboard">🏠 Dashboard</Link>
                <div className="sidebar-divider"></div>
                <Link to="/" className="logout-link" onClick={() => localStorage.clear()}>🚪 Logout</Link>
            </div>

            
            <div className="dashboard-content">
                <div className="content-header">
                    <h1 className="content-title">Welcome, {coachName}</h1>
                    <p className="subtitle">Track your assigned members and your monthly earnings.</p>
                </div>

                <div className="stats-container">
                    <div className="stat-card-mini">
                        <span className="stat-label">Total Assigned Members</span>
                        <span className="stat-value">{assignedMembers.length}</span>
                    </div>
                    <div className="stat-card-mini">
                        <span className="stat-label">Next Expected Salary</span>
                        <span className="stat-value">{salaryHistory[2].amount.toFixed(2)} DH</span>
                    </div>
                </div>

                <div className="coach-grid-layout">
                    <div className="card glass-effect">
                        <div className="card-header-flex">
                            <h3>💰 Payment History</h3>
                            <span className="badge-info">Latest activity</span>
                        </div>
                        <div className="table-wrapper">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaryHistory.map(p => (
                                        <tr key={p.id}>
                                            <td className="text-muted">{p.date}</td>
                                            <td className="font-bold">{p.amount.toFixed(2)} DH</td>
                                            <td>
                                                <span className={`status-pill ${p.status.toLowerCase()}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="text-small">{p.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="card glass-effect">
                        <div className="card-header-flex">
                            <h3>👥 Assigned Members</h3>
                            <span className="badge-count">{assignedMembers.length} Active</span>
                        </div>
                        <div className="member-list-compact">
                            {assignedMembers.map(member => (
                                <div key={member.id} className="member-item-row">
                                    <div className="member-avatar">{member.name.charAt(0)}</div>
                                    <div className="member-details">
                                        <span className="m-name">{member.name}</span>
                                        <span className="m-email">{member.email}</span>
                                    </div>
                                    <div className="m-progress">
                                        <span className="p-label">Last Check</span>
                                        <span className="p-date">{member.lastProgress}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="primary-action-btn">Manage My Team</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoachDashboard;