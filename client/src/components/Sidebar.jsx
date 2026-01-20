import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


import {
Home,
CalendarDays,
FilePlus2,
Wallet,
UsersRound,
Settings,
FileText,
Map,
LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import './Sidebar.css'
const API_URL = "http://localhost:8000/api";

function Sidebar ()  {
    const { user, token, login, logout } = useAuth();
    const navigate = useNavigate();
    //get from usecontext , if null -> citizen
    

    if (user && user.role === null) {
    user.role = 'Citizen';
}
    
    const handleLogout = async () => {
     const res = await axios.post(`${API_URL}/logout`,{},{
       headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: "application/json",
    },
    });
    localStorage.removeItem("token");
    navigate("/login");
    };

    return (
        <>
         {/* Sidebar */} 
        <div className="sidebar" >
            <div className="sidebar-header">
                <h4>Municipal Management System</h4>
            </div>
            <div className="sidebar-menu">
            <Link to="/"><Home size={18} /> Home</Link>
            <Link to="/events"><CalendarDays size={18} /> Events</Link>

            {user && (
                <>
                    {/* Citizen */}
                    { (user.role === 'Citizen' ) && (
                        <>
                            <Link to="/request"><FilePlus2 size={18} /> Certificate Requests</Link>
                            <Link to="/permitrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/editprofile"><UsersRound size={18} /> Edit Profile</Link>
                            

                        </>
                    )}

                    {/* Resident */}
                    {user.role === 'Resident' && (
                        <>
                            <Link to="#"><FilePlus2 size={18} /> Placeholder for Resident</Link>
                        </>
                    )}

                    {/* HR Manager */}
                    {user.role === 'HR Manager' && (
                        <>
                            <Link to="/employees"><FilePlus2 size={18} /> Employees Management</Link>
                            <Link to="/attendances"><CalendarDays size={18} /> attendances</Link>
                            <Link to="/payroll"><CalendarDays size={18} /> payroll</Link>
                            <Link to="/performance"><CalendarDays size={18} /> performance</Link>
                        </>
                    )}

                    {/* Admin */}
                    {user.role === 'Admin' && (
                        <>
                            <Link to="/employees"><FilePlus2 size={18} /> Employees Management</Link>
                            <Link to="/attendances"><CalendarDays size={18} /> attendances</Link>
                            <Link to="/payroll"><CalendarDays size={18} /> payroll</Link>
                            <Link to="/performance"><CalendarDays size={18} /> performance</Link>
                            <Link to="/request"><FilePlus2 size={18} /> Certificate Requests</Link>
                            <Link to="/permitrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/permitreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentreview"><UsersRound size={18} />manage users</Link>
                            <Link to="/projectmanagement"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/managetasks"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/createtask"><FilePlus2 size={18} />  Project creation</Link>
                            <Link to="/createproject"><FilePlus2 size={18} />  Project creation</Link>
                             <Link to="/requestmanagement"><CalendarDays size={18} /> manage citizens requests</Link>
                            <Link to="/permitmanagement"><CalendarDays size={18} /> manage citizens permits</Link>
                            <Link to="/userslist"><CalendarDays size={18} /> manage users</Link>
                            
                        </>
                    )}

                    {/* Mayor */}
                    {user.role === 'Mayor' && (
                        <>
                              <Link to="/employees"><FilePlus2 size={18} /> Employees Management</Link>
                            <Link to="/attendances"><CalendarDays size={18} /> attendances</Link>
                            <Link to="/payroll"><CalendarDays size={18} /> payroll</Link>
                            <Link to="/performance"><CalendarDays size={18} /> performance</Link>
                            <Link to="/request"><FilePlus2 size={18} /> Certificate Requests</Link>
                            <Link to="/permitrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/permitreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/projectmanagement"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/managetasks"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/createtask"><FilePlus2 size={18} />  Project creation</Link>
                            <Link to="/createproject"><FilePlus2 size={18} />  Project creation</Link>
                             <Link to="/requestmanagement"><CalendarDays size={18} /> manage citizens requests</Link>
                            <Link to="/permitmanagement"><CalendarDays size={18} /> manage citizens permits</Link>
                        </>
                    )}

                    {/* Municipal Director */}
                    {user.role === 'Municipal Director' && (
                        <>
                              <Link to="/employees"><FilePlus2 size={18} /> Employees Management</Link>
                            <Link to="/attendances"><CalendarDays size={18} /> attendances</Link>
                            <Link to="/payroll"><CalendarDays size={18} /> payroll</Link>
                            <Link to="/performance"><CalendarDays size={18} /> performance</Link>
                            <Link to="/request"><FilePlus2 size={18} /> Certificate Requests</Link>
                            <Link to="/permitrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/permitreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentrequest"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/paymentreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                            <Link to="/projectmanagement"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/managetasks"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/createtask"><FilePlus2 size={18} />  Project creation</Link>
                            <Link to="/createproject"><FilePlus2 size={18} />  Project creation</Link>
                             <Link to="/requestmanagement"><CalendarDays size={18} /> manage citizens requests</Link>
                            <Link to="/permitmanagement"><CalendarDays size={18} /> manage citizens permits</Link>
                            
                        </>
                    )}

                    {/* Finance Officer */}
                    {user.role === 'Finance Officer' && (
                        <>
                             <Link to="/paymentreview"><FilePlus2 size={18} /> Submit a New permit Request</Link>
                              <Link to="/payroll"><CalendarDays size={18} /> payroll</Link>
                        </>
                    )}

                    {/* Urban Planner */}
                    {user.role === 'Urban Planner' && (
                        <>
                            <Link to="/projectmanagement"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/managetasks"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/createtask"><FilePlus2 size={18} />  Project creation</Link>
                            <Link to="/createproject"><FilePlus2 size={18} />  Project creation</Link>
                        </>
                    )}

                    {/* Project Manager */}
                    {user.role === 'Project Manager' && (
                        <>
                            <Link to="/projectmanagement"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/managetasks"><FilePlus2 size={18} />  Project Management</Link>
                            <Link to="/createtask"><FilePlus2 size={18} />  Project creation</Link>
                            <Link to="/createproject"><FilePlus2 size={18} />  Project creation</Link>
                        </>
                    )}

                    {/* Clerk */}
                    {user.role === 'Clerk' && (
                        <>
                              <Link to="/requestmanagement"><CalendarDays size={18} /> manage citizens requests</Link>
                            <Link to="/permitmanagement"><CalendarDays size={18} /> manage citizens permits</Link>
                        </>
                    )}

                    {/* Staff */}
                    {user.role === 'Staff' && (
                        <>
                            
                            <Link to="/requestmanagement"><CalendarDays size={18} /> manage citizens requests</Link>
                            <Link to="/permitmanagement"><CalendarDays size={18} /> manage citizens permits</Link>
                        </>
                    )}
                </>
            )}

            <hr />
        </div>

        <div className="sidebar-footer">
            {user ? (
                <>
                    <div className="user-box">{user.name} ({user.role})</div>
                    <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Log Out</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">New Account</Link>
                </>
            )}
        </div>

        </div>
        </>
    );
}
export default Sidebar;