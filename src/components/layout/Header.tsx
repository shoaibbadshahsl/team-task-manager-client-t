import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>Team Task Manager</h1>
            <nav>
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;