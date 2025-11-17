import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reservationsAPI } from '../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: 2,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [availability, setAvailability] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'partySize' ? parseInt(value) : value
    }));
  };

  const checkAvailability = (e) => {
    e.preventDefault();
    // In a real application, this would check with the backend
    // For now, we'll simulate availability
    const availableSlots = 10 - Math.floor(Math.random() * 8);
    setAvailability({
      available: availableSlots > 0,
      slots: availableSlots
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create reservation in database
      const reservationData = {
        userId: user?.id || null,
        date: formData.date,
        time: formData.time,
        partySize: formData.partySize,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests
      };
      
      console.log('Sending reservation data:', reservationData);
      const savedReservation = await reservationsAPI.create(reservationData);
      console.log('Reservation created successfully:', savedReservation);
      
      // Generate a reference number using the reservation ID
      const refNumber = 'RES-' + savedReservation._id.substring(savedReservation._id.length - 6).toUpperCase();
      setReferenceNumber(refNumber);
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Reservation error details:', error);
      alert(`Failed to create reservation. Please try again. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="booking-page">
        <div className="confirmation-card">
          <h2>Booking Confirmed!</h2>
          <p className="success-message">Your table has been successfully reserved.</p>
          <div className="confirmation-details">
            <p><strong>Reference Number:</strong> {referenceNumber}</p>
            <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {formData.time}</p>
            <p><strong>Party Size:</strong> {formData.partySize} people</p>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
          </div>
          <button onClick={() => {
            setBookingConfirmed(false);
            setFormData({
              date: '',
              time: '',
              partySize: 2,
              name: '',
              email: '',
              phone: '',
              specialRequests: ''
            });
            setAvailability(null);
          }} className="button">
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <h2>Reserve a Table</h2>
      
      <form onSubmit={availability ? handleSubmit : checkAvailability} className="booking-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time:</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Select a time</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="13:30">1:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="partySize">Party Size:</label>
          <input
            type="number"
            id="partySize"
            name="partySize"
            value={formData.partySize}
            onChange={handleChange}
            min="1"
            max="20"
            required
          />
        </div>

        {availability && (
          <div className={`availability-status ${availability.available ? 'available' : 'unavailable'}`}>
            {availability.available ? (
              <p>✓ Great news! We have {availability.slots} tables available for your selected date and time.</p>
            ) : (
              <p>✗ Sorry, no tables available for this time. Please try a different time slot.</p>
            )}
          </div>
        )}

        {availability?.available && (
          <>
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests (optional):</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </>
        )}

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Processing...' : availability ? 'Confirm Reservation' : 'Check Availability'}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;