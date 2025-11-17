import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ordersAPI, reservationsAPI } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user's orders and reservations by email
        const [ordersData, reservationsData] = await Promise.all([
          ordersAPI.getOrdersByEmail(user.email),
          reservationsAPI.getReservationsByEmail(user.email)
        ]);
        
        setOrders(ordersData);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Set up real-time polling every 30 seconds
    const interval = setInterval(fetchUserData, 30000);
    
    return () => clearInterval(interval);
  }, [user?.email]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <button className="edit-profile-button">Edit Profile</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Your Orders</h2>
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-item">
                  <div className="order-header">
                    <span>Order #{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                    <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div className="order-details">
                    <p>Date: {formatDate(order.createdAt)}</p>
                    <p>Items: {order.items.length}</p>
                    <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
          <Link to="/menu" className="view-menu-link">View Menu</Link>
        </div>

        <div className="dashboard-section">
          <h2>Your Reservations</h2>
          {reservations.length > 0 ? (
            <div className="reservations-list">
              {reservations.map(reservation => (
                <div key={reservation._id} className="reservation-item">
                  <div className="reservation-header">
                    <span>Reservation #{reservation._id.substring(reservation._id.length - 6).toUpperCase()}</span>
                    <span className={`status ${reservation.status.toLowerCase()}`}>{reservation.status}</span>
                  </div>
                  <div className="reservation-details">
                    <p>Date: {formatDate(reservation.date)}</p>
                    <p>Time: {reservation.time}</p>
                    <p>Party Size: {reservation.partySize}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't made any reservations yet.</p>
          )}
          <Link to="/booking" className="book-table-link">Book a Table</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;