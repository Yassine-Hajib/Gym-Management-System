import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Style/Dashboard.css"; 
import "../Style/MemberDashboard.css"; 

const API_BASE_URL = "http://127.0.0.1:8000";


const currentMember = {
    id: 1, 
    name: "Yassine Hajib",
    membership: "Premium",
    
    paymentHistory: [
        { id: 1, date: "2025-11-01", amount: 200, status: "Paid" },
        { id: 2, date: "2025-10-01", amount: 200, status: "Paid" },
    ]
};

function MemberDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [progress, setProgress] = useState([]);
    
    const [newEntry, setNewEntry] = useState({ 
        weight: "", 
        date: new Date().toISOString().slice(0, 10), 
        imageFile: null,
        imagePreview: ""
    });

    useEffect(() => {
        fetchProgressHistory();
    }, []);

    
    const fetchProgressHistory = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/progressions/${currentMember.id}`);
            setProgress(response.data);
        } catch (error) {
            console.error("Erreur progression:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewEntry(prev => ({ 
                ...prev, 
                imageFile: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleAddProgress = async (e) => {
        e.preventDefault();
        if (!newEntry.weight || !newEntry.date) return alert("Veuillez remplir les champs.");

        const formData = new FormData();
        formData.append("weight", newEntry.weight);
        formData.append("date", newEntry.date);
        formData.append("user_id", currentMember.id);
        if (newEntry.imageFile) formData.append("image", newEntry.imageFile);

        try {
            await axios.post(`${API_BASE_URL}/api/progressions`, formData);
            alert("Progrès enregistré !");
            fetchProgressHistory();
            setNewEntry({ weight: "", date: new Date().toISOString().slice(0, 10), imageFile: null, imagePreview: "" });
        } catch (error) {
            alert("Erreur serveur.");
        }
    };

    return (
        <div className="dashboard-container">
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Member Dashboard</h2>
                <div>Bienvenue, {currentMember.name}</div>
            </div>

            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/member/dashboard">🏠 Dashboard</Link>
                <Link to="/">🚪 Logout</Link>
            </div>

            <div className="dashboard-content">
                <h1 className="content-title">My Dashboard</h1>

                <div className="member-grid-layout">
                 

                    <div className="card progress-card">
                        <h3>📈 Progress Tracking</h3>
                        <form onSubmit={handleAddProgress} className="progress-form">
                            <input type="date" name="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="form-input" required />
                            <input type="number" name="weight" placeholder="Weight (kg)" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} className="form-input" required />
                            <input type="file" onChange={handleFileChange} className="form-input file-input" accept="image/*" />

                            {newEntry.imagePreview && (
                                <div className="image-preview-wrapper">
                                    <img src={newEntry.imagePreview} alt="Preview" className="upload-preview" />
                                </div>
                            )}

                            <button type="submit" className="action-btn primary-btn full-span">Save to Database</button>
                        </form>

                        <h4 className="history-title">Progression History ({progress.length})</h4>
                        <div className="progress-history-list">
                            {progress.map((entry) => (
                                <div key={entry.id} className="progress-entry">
                                    <div className="entry-details">
                                        <strong>Date:</strong> {entry.date} | <strong>Weight:</strong> {entry.weight} kg
                                    </div>
                                    {entry.image_path && (
                                        <img src={`${API_BASE_URL}/storage/${entry.image_path}`} alt="Progress" className="progress-thumbnail" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION PAIEMENTS (STATIQUE - DONNÉES EN DUR) */}
                    <div className="card payment-history-card">
                        <h3>💳 Payment History</h3>
                        <table className="data-table full-width">
                            <thead>
                                <tr>
                                    <th> Date </th>
                                    <th> Amount </th>
                                    <th> Status </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMember.paymentHistory.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.date}</td>
                                        <td>{p.amount.toFixed(2)} dh</td>
                                        <td className={`status-${p.status.toLowerCase()}`}>{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberDashboard;