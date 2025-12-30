import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    function Sidebar ()  {
    const { user, token, login, logout } = useAuth();
    const navigate = useNavigate();
    //get from usecontext , if null -> citizen
    

    if (user && user.role === null) {
    user.role = 'citizen';
}
    
    const handleLogout = () => {
    navigate('/login');
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
                    {user.role === 'Citizen' && (
                        <>
                            <Link to="/newRequest"><FilePlus2 size={18} /> Submit a New Request</Link>
                            <Link to="#"><Wallet size={18} /> Placeholder for Citizen</Link>
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
                            <Link to="/newRequest"><FilePlus2 size={18} /> Submit a New Request</Link>
                        </>
                    )}

                    {/* Mayor */}
                    {user.role === 'Mayor' && (
                        <>
                            <Link to="#"><UsersRound size={18} /> Placeholder for Mayor</Link>
                        </>
                    )}

                    {/* Municipal Director */}
                    {user.role === 'Municipal Director' && (
                        <>
                            <Link to="#"><FileText size={18} /> Placeholder for Municipal Director</Link>
                        </>
                    )}

                    {/* Finance Officer */}
                    {user.role === 'Finance Officer' && (
                        <>
                            <Link to="#"><Wallet size={18} /> Placeholder for Finance Officer</Link>
                        </>
                    )}

                    {/* Urban Planner */}
                    {user.role === 'Urban Planner' && (
                        <>
                            <Link to="#"><Map size={18} /> Placeholder for Urban Planner</Link>
                        </>
                    )}

                    {/* Project Manager */}
                    {user.role === 'Project Manager' && (
                        <>
                            <Link to="#"><FilePlus2 size={18} /> Placeholder for Project Manager</Link>
                        </>
                    )}

                    {/* Clerk */}
                    {user.role === 'Clerk' && (
                        <>
                            <Link to="#"><FileText size={18} /> Placeholder for Clerk</Link>
                        </>
                    )}

                    {/* Staff */}
                    {user.role === 'Staff' && (
                        <>
                            <Link to="#"><CalendarDays size={18} /> Placeholder for Staff</Link>
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