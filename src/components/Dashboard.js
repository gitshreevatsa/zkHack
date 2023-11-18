// Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import CSS for styling
import Loader from './Loader';
import { useUser } from './UserContext';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const { user, updateUser } = useUser();
  const baseURL = window.location.origin;

  const handleCopy= async () => {
    const paymentURL = `${baseURL}/payment/${user?.apiKey}/`;

    try {
      await navigator.clipboard.writeText(paymentURL);
      console.log('Payment URL copied to clipboard:', paymentURL);
      // You can also show a success message to the user
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <div className='dashboard'>
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        {console.log(user)}
        <div className="dashboard-stats">
          <div className="stat">
            <div className="stat-api">{user?.apiKey}</div>
            <div className="stat-label">API key</div>
          </div>
        </div>
        <div className='dashboard-stats'>
          <div className="stat">
            <div className="stat-value">{user?.totalAmount?.toFixed(2)}</div>
            <div className="stat-label">Total Amount Collected</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user?.totalTransactions}</div>
            <div className="stat-label">Total Number of Transactions</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user?.totalUsers}</div>
            <div className="stat-label">Total Number of Users</div>
          </div>
        </div>
        <div>
          <div className="stat">
            <button onClick={handleCopy}>Copy Payment Url</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
