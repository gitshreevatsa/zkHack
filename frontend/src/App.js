// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { UserProvider } from './components/UserContext';

import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Payment from "./components/Payment";
import Navbar from "./components/Navbar";

function App() {
  return (
      <UserProvider>
        <Router>
        <Navbar/>
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage />
              }
            />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/payment/:apiKey/:walletAddress" element={<Payment />} />
          </Routes>
        </Router>
      </UserProvider>

  );
}

export default App;
