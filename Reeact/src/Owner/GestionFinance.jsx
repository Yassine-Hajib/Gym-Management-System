import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Style/Finance.css"; 

const API_BASE_URL = "http://127.0.0.1:8000";

const GestionFinance = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [finance, setFinance] = useState({ revenue: 0, expenses: 0, profit: 0 });
    const [members, setMembers] = useState([]); 
    const [coaches, setCoaches] = useState([]);
    
    const [expDesc, setExpDesc] = useState("");
    const [expAmount, setExpAmount] = useState("");
    const [expDate, setExpDate] = useState("");

    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [memberPay, setMemberPay] = useState("");
    const [payDate, setPayDate] = useState("");

    const [selectedCoachId, setSelectedCoachId] = useState("");
    const [coachSalary, setCoachSalary] = useState("");
    const [salaryDate, setSalaryDate] = useState("");

    useEffect(() => {
        fetchFinanceSummary();
        fetchMembers();
        fetchCoaches();
    }, []);

    const fetchFinanceSummary = async () => { 
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/api/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFinance({
                revenue: res.data.totalRevenue || 0, 
                expenses: res.data.totalExpenses || 0,
                profit: res.data.profit || 0
            });
        } catch (err) {
            console.error("Error fetching finance data", err);
        }
    };

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("token");
            // Utilise l'endpoint qui filtre les membres appartenant à cet owner
            const res = await axios.get(`${API_BASE_URL}/api/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(res.data);
        } catch (err) {
            console.error("Error fetching members", err);
        }
    };
    

const fetchCoaches = async () => {
    try {
        const token = localStorage.getItem("token");
        // Appel de la route spécifique aux coachs
        const res = await axios.get(`${API_BASE_URL}/api/coaches`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCoaches(res.data);
    } catch (err) {
        console.error("Error fetching coaches", err);
    }
};

    const handleAddExpense = async () => {
        if (!expDesc || !expAmount || !expDate) return alert("Fill all fields");
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/expenses`, {
                description: expDesc,
                amount: Number(expAmount),
                expense_date: expDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Expense recorded!");
            setExpDesc(""); setExpAmount(""); setExpDate("");
            fetchFinanceSummary();
        } catch (err) { alert("Error recording expense"); }
    };

    const handleMemberPayment = async () => {
        if (!selectedMemberId || !memberPay || !payDate) return alert("Select member/fill fields");
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/payments`, {
                user_id: selectedMemberId,
                amount: Number(memberPay),
                payment_date: payDate,
                status: "Paid",
                description: "Monthly Membership"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Payment recorded!");
            setSelectedMemberId(""); setMemberPay(""); setPayDate("");
            fetchFinanceSummary();
        } catch (err) { alert("Payment Error"); }
    };

    const handlePayCoach = async () => {
        if (!selectedCoachId || !coachSalary || !salaryDate) return alert("Select coach and fill all fields");
        
        // Trouver le nom du coach pour la description de la dépense
        const coach = coaches.find(c => c.id === parseInt(selectedCoachId));

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/api/expenses`, {
                description: `Salary: ${coach ? coach.name : "Coach"}`,
                amount: Number(coachSalary),
                expense_date: salaryDate,
                // Si votre table expense a un champ user_id pour traquer à qui va l'argent :
                // target_user_id: selectedCoachId 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Salary paid!");
            setSelectedCoachId(""); setCoachSalary(""); setSalaryDate("");
            fetchFinanceSummary();
        } catch (err) { alert("Server error"); }
    };

    const currencyFormat = (num) => `${(num || 0).toLocaleString()} DH`;

    return (
        <div className="dashboard-container">
            <div className="topbar">
                <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                <h2>Finance Management</h2>
                <div></div>
            </div>

            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <Link to="/owner/dashboard">Dashboard</Link>
                <Link to="/owner/GestionMember">Gestion Members</Link>
                <Link to="/owner/GestionFinance">Gestion Finance</Link>
                <Link to="/owner/Coach">Gestion Coaches</Link>
            </div>

            <div className="dashboard-content finance-grid">
                <h1 className="content-title">Financial Transactions</h1>
                
                <div className="finance-summary-cards cards-container">
                    <div className="card revenue-card"><h3>Total Revenue</h3><p>{currencyFormat(finance.revenue)}</p></div>
                    <div className="card expenses-card"><h3>Total Expenses</h3><p>{currencyFormat(finance.expenses)}</p></div>
                    <div className="card profit-card"><h3>Net Profit</h3><p>{currencyFormat(finance.profit)}</p></div>
                </div>
                
                <div className="transaction-forms-container">
                    <div className="card transaction-form expense-form">
                        <h3>Add General Expense</h3>
                        <div className="add-form">
                            <input className="form-input" type="text" placeholder="Description" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
                            <input className="form-input" type="date" value={expDate} onChange={(e) => setExpDate(e.target.value)} />
                            <input className="form-input" type="number" placeholder="Amount (DH)" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} />
                            <button className="action-btn danger-btn" onClick={handleAddExpense}>Record Expense</button>
                        </div>
                    </div>

                    <div className="card transaction-form revenue-form">
                        <h3>Record Member Payment</h3>
                        <div className="add-form">
                            <select 
                                className="form-input" 
                                value={selectedMemberId} 
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                            >
                                <option value="">-- Select Member --</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <input className="form-input" type="number" placeholder="Amount Paid (DH)" value={memberPay} onChange={(e) => setMemberPay(e.target.value)} />
                            <input className="form-input" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
                            <button className="action-btn success-btn" onClick={handleMemberPayment}>Confirm Payment</button>
                        </div>
                    </div>
                  <div className="card transaction-form salary-form">
                        <h3>Pay Coach Salary</h3>
                        <div className="add-form">
                            {/* Menu déroulant pour les coachs */}
                            <select 
                                className="form-input" 
                                value={selectedCoachId} 
                                onChange={(e) => setSelectedCoachId(e.target.value)}
                            >
                                <option value="">-- Select Coach --</option>
                                {coaches.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            
                            <input 
                                className="form-input" 
                                type="number" 
                                placeholder="Salary Amount (DH)" 
                                value={coachSalary} 
                                onChange={(e) => setCoachSalary(e.target.value)} 
                            />
                            <input 
                                className="form-input" 
                                type="date" 
                                value={salaryDate} 
                                onChange={(e) => setSalaryDate(e.target.value)} 
                            />
                            <button className="action-btn danger-btn" onClick={handlePayCoach}>Pay Salary</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionFinance;