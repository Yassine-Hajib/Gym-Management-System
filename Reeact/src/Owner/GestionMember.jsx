import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'; 
import "../Style/Dashboard.css";
import "../Style/Gestion.css"; 

export default function GestionMember() { 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [members, setMembers] = useState([]); 
    const [newMember, setNewMember] = useState({ name: "", dob: "", phone: "", email: "" });
    const [searchName, setSearchName] = useState(""); 
    const [foundMember, setFoundMember] = useState(null);

    // Fetch members from Database when page loads
    useEffect(() => {
        fetchMembers();
    }, []);

const fetchMembers = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            "http://127.0.0.1:8000/api/members",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembers(response.data);
    } catch (err) {
        console.error(err);
    }
};

const handleAdd = async () => {
    try {
        const token = localStorage.getItem("token"); // Récupération du jeton
        
        await axios.post("http://127.0.0.1:8000/api/members", newMember, {
            headers: { Authorization: `Bearer ${token}` } // <--- ENVOI DU JETON
        });

        alert("Membre ajouté !");
        setNewMember({ name: "", dob: "", phone: "", email: "" });
        fetchMembers(); // Actualise la liste
    } catch (err) {
        alert("Erreur : " + (err.response?.data?.message || "Vérifiez vos champs"));
    }
};

   
    const handleSearch = () => {
        const result = members.find(
            (m) => m.name.toLowerCase().includes(searchName.toLowerCase())
        );
        if (!result) {
            alert("No member found");
            setFoundMember(null);
            return;
        }
        setFoundMember(result);
    };

   
    const handleModify = async () => {
        if (!foundMember) return;
        try {
            await axios.put(`http://127.0.0.1:8000/api/members/${foundMember.id}`, foundMember);
            alert("Database updated!");
            fetchMembers();
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDelete = async () => {
        if (!foundMember) return;
        const confirmDelete = window.confirm(`Delete ${foundMember.name} from Database?`);
        if (confirmDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/members/${foundMember.id}`);
                alert("Deleted from MySQL!");
                setFoundMember(null);
                fetchMembers();
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    return (
        <div className="dashboard-container">
         
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Member Management</h2>
                <div></div>
            </div>

            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/owner/GestionMember">Gestion Members</Link>
                <Link to="/owner/GestionFinance">Gestion Finance</Link>
                <Link to="/owner/Coach">Gestion Coaches</Link>
                <Link to="/owner/OwnerProfile">Profil</Link>
                <Link to="/owner/GestionAnnonce">Annonce</Link>
            </div>
           
            <div className="dashboard-content">
                <h1 className="content-title">Member Management</h1>

                <div className="card add-form-container">
                    <h3>Add New Member </h3>
                    <div className="add-form"> 
                        <input className="form-input" placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                        <input className="form-input" type="date" max="9999-12-31" value={newMember.dob} onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })} />
                        <input className="form-input" type="tel" placeholder="Phone Number" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} />
                        <input className="form-input" type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                        <button className="action-btn primary-btn" onClick={handleAdd}>Add Member</button>
                    </div>
                </div>

                <div className="card search-modify-container">
                    <h3>Search / Modify</h3>
                    <div className="search-area">
                        <input className="form-input" placeholder="Enter member name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                        <button className="action-btn success-btn" onClick={handleSearch}>Search</button>
                    </div>

                    {foundMember && (
                        <div className="found-member-detail">
                            <h4 style={{ color: 'var(--primary-color)' }}>Editing ID: {foundMember.id}</h4>
                            <input className="form-input" value={foundMember.name} onChange={(e) => setFoundMember({ ...foundMember, name: e.target.value })} />
                            <input className="form-input" type="date" max="9999-12-31" value={foundMember.dob} onChange={(e) => setFoundMember({ ...foundMember, dob: e.target.value })} />
                            <input className="form-input" type="tel" value={foundMember.phone} onChange={(e) => setFoundMember({ ...foundMember, phone: e.target.value })} />
                            <input className="form-input" type="email" value={foundMember.email} onChange={(e) => setFoundMember({ ...foundMember, email: e.target.value })} />
                            
                            <div className="action-group">
                                <button className="action-btn warning-btn" onClick={handleModify}>Modify</button>
                                <button className="action-btn danger-btn" onClick={handleDelete}>Delete</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card member-list-container">
                    <h3>All Members from Database ({members.length})</h3>
                    <div className="member-list">
                        {members.map((m) => (
                            <div key={m.id} className="member-item">
                                <b>{m.name}</b> — Phone: {m.phone} — Email: {m.email}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}