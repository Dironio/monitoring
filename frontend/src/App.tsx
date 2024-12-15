import React, { useState } from 'react';
import { User } from './models/user.model';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css'
import PromoPage from './components/Pages/PromoPage/PromoPage';
import Sidebar from './components/Navbar/Navbar';


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

    const toggleNavbar = () => {
        setIsNavbarExpanded(!isNavbarExpanded);
    };


    return (
        <div className="App">
            <div className={`app-container ${isNavbarExpanded ? "with-sidebar" : "without-sidebar"}`}>
                <Sidebar
                    isExpanded={isNavbarExpanded}
                    toggleNavbar={toggleNavbar}
                // user={user}
                />

                <div className="main-content">

                    <Header
                    // user={user}
                    />

                    <Routes>
                        <Route
                            path="/promo"
                            element={
                                <PromoPage
                                // user={user}
                                />}
                        />

                        {/* <Route
                    path="/"
                    element={
                        user ? <Navigate to="/auth" /> :
                            <HomePage
                                user={user} />
                    }
                /> */}


                    </Routes>

                </div>
            </div>
        </div >
    );
};

export default App;