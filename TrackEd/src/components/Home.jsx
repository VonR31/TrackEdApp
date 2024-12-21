import React from "react";
import { Menu } from "lucide-react";
import "./styles.css";
import logo from "../assets/logo.png";

function Home() {
    return (
        <div className="home-content">
        <header className="header">
        <nav className="navbar">
            <div className="navbar-left">
                <Menu size={35} /> 
                < a href="/home" className="logo">
                    <img src={logo} alt="Logo" />
                </a>
            </div>
        </nav>
        </header>
        <main className="home">
        
        
        </main>
        </div>

        
    );
}


export default Home;