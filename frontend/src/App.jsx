import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MenuPage from './components/MenuPage';
import BookingPage from './components/BookingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="protected-route">
        <h2>Access Restricted</h2>
        <p>Please log in to access this page.</p>
        <Link to="/login" className="login-link">Go to Login</Link>
      </div>
    );
  }
  
  return children;
};

// Main App Component
function AppContent() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Restaurant Booking & Ordering</h1>
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/booking" className="nav-link">Book Table</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <span className="user-info">Hi, {user?.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </header>
      
      <Routes>
        <Route path="/" element={
          <main className="App-main">
            <h2>Welcome to Our Restaurant</h2>
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600" 
              alt="Restaurant Interior" 
              className="hero-image"
            />
            <p>Experience the best dining experience with our delicious menu and comfortable seating.</p>
            <div className="button-container">
              <Link to="/booking" className="button">
                Book a Table
              </Link>
              <Link to="/menu" className="button button-secondary">
                View Menu
              </Link>
            </div>
          </main>
        } />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

// Wrap the app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;