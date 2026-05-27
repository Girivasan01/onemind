import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const loc = useLocation();
    return (
        <nav className="nav">
            <div className="nav-inner container">
                <div className="brand"><Link to="/">One Mind Search Engine</Link></div>
                <div className="links">
                    <Link className={loc.pathname === "/" ? "active" : ""} to="/">Home</Link>
                    <Link className={loc.pathname === "/about" ? "active" : ""} to="/about">About</Link>
                    <Link to="/admin">Admin</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
