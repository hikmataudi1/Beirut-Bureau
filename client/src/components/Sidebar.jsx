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
import './Sidebar.css'
    function Sidebar ()  {

    const navigate = useNavigate();
    //get from usecontext , if null -> citizen
    const [user, setUser] = useState({
    name: "mohamd ",
    role: null // جرب 'citizen', 'finance', 'hr', 'planner'
    });

    if (user && user.role === null) {
    user.role = 'citizen';
}
    
    const handleLogout = () => {
    setUser(null);
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
                <Link to="/" > <Home size={18} /> homme</Link>
                <Link to="/events" ><CalendarDays size={18} />events</Link>
                {user&&(<>
                {/* for user  */}
                {user.role==='citizen'&&
                (<>
                <Link to="/newRequest"><FilePlus2 size={18} />Submitting a request/complaint</Link>
                <Link to="/billing"> <Wallet size={18} />Paying the bills</Link>
                </>)}

                {/* for admin and mayor */}
                {['admin','mayor'].includes(user.role)&&(
                    <>
                    <Link to="/users"><UsersRound size={18} />User Management</Link>
                    <Link to="/reports"><FileText size={18} />Comprehensive reports</Link>
                    <Link to="/settings"><Settings size={18} />System settings</Link>
                    </>
                )}

                {/* for admin and finance */}
                {['admin','finance'].includes(user.role)&&
                    (<>
                        <Link to="/taxes"><Wallet size={18} />tax collection</Link>
                        <Link to="/bills"><FileText size={18} />Bills and fees</Link>
                        <Link to="/budgets"><Map size={18} />Budget</Link>
                    </>)
                }

                {/* for admin and hr  */}
                {['admin','hr'].includes(user.role)&&(<>
                    <Link to="/employees"><UsersRound size={18} />Employee Records</Link>
                    <Link to="/attendance"><CalendarDays size={18} />Attendance and working hours</Link>
                    <Link to="/payroll"><Wallet size={18} />salaries</Link>
                </>)}
                </>)}
                <hr/>
                </div><div className="sidebar-footer">
                {user?(<>
                    <div className='user-box'>{user.name}  ({user.role})</div>
                    <button  onClick={handleLogout}  className='logout-btn'><LogOut size={18} />Log out</button>
                </>):(<>
                    <Link to="/login">login</Link>
                    <Link to="/register">New account</Link>
                </>)}
            </div>
        </div>
        </>
    );
}
export default Sidebar;