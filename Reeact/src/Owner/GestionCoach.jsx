import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Style/Dashboard.css";
import "../Style/Gestion.css"; 
import "../Style/CoachGestion.css"; 

function GestionCoach() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [coaches, setCoaches] = useState([]);
    const [form, setForm] = useState({ id: "", name: "", email: "", phone: "" });
    const [editing, setEditing] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);

    
    const fetchCoaches = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/users-coaches");
            setCoaches(res.data);
        } catch (err) {
            console.error("Error fetching coaches", err);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`http://127.0.0.1:8000/api/users/${form.id}`, form);
                alert("Coach updated successfully");
            } else {
                await axios.post("http://127.0.0.1:8000/api/users-coaches", form);
                alert("Coach added successfully");
            }
            setForm({ id: "", name: "", email: "", phone: "" });
            setEditing(false);
            fetchCoaches(); 
        } catch (err) {
            alert(err.response?.data?.message || "Operation failed");
        }
    };

    
    const deleteCoach = async (id, name) => {
        if (!window.confirm(`Delete Coach ${name}?`)) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
            alert("Coach deleted");
            fetchCoaches(); 
        } catch (err) {
            alert("Error deleting coach");
        }
    };

    const editCoach = (coach) => {
        setEditing(true);
        setForm(coach);
    };

    return (
        <div className="dashboard-container">
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Coach Management</h2>
                <div></div>
            </div>

            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/owner/GestionMember">Gestion Members</Link>
                <Link to="/owner/GestionFinance">Gestion Finance</Link>
                <Link to="/owner/Coach">Gestion Coaches</Link>
                <Link to="/owner/GestionAnnonce">Annonce</Link>
            </div>

            <div className="dashboard-content">
                <h1 className="content-title">Gestion des Coachs ({coaches.length})</h1>

                <div className="coach-grid-container">
                    <div className="card form-card">
                        <h3>{editing ? "Modifier un Coach" : "Ajouter un Coach"}</h3>
                        <form onSubmit={handleSubmit} className="coach-form-layout">
                            <input className="form-input" type="text" name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
                            <input className="form-input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                            <input className="form-input" type="text" name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} required />
                            <div className="form-actions">
                                <button className="action-btn primary-btn" type="submit">{editing ? "Enregistrer" : "Ajouter"}</button>
                                {editing && <button className="action-btn warning-btn" onClick={() => {setEditing(false); setForm({id:"",name:"",email:"",phone:""})}}>Annuler</button>}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="card list-card">
                    <h3>Liste des Coachs</h3>
                    <table className="data-table full-width">
                        <thead>
                            <tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {coaches.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>
                                        <button className="action-btn edit-btn warning-btn" onClick={() => editCoach(c)}>Modifier</button>
                                        <button className="action-btn delete-btn danger-btn" onClick={() => deleteCoach(c.id, c.name)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GestionCoach;