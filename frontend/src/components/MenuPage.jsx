import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { menuAPI, ordersAPI } from '../services/api';
import './MenuPage.css';

const MenuPage = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Available categories
  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  useEffect(() => {
    // Fetch menu items from backend API
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await menuAPI.getAllItems();
        
        // Convert prices to INR (assuming backend prices are in USD)
        const itemsInINR = data.map(item => ({
          ...item,
          priceINR: item.price * 83 // USD to INR conversion rate
        }));
        
        setMenuItems(itemsInINR);
        setFilteredItems(itemsInINR);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch menu items. Please try again later.');
        setLoading(false);
      }
    };

    fetchMenuItems();
    
    // Set up real-time polling every 30 seconds
    const interval = setInterval(fetchMenuItems, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter items based on search term and category
  useEffect(() => {
    let result = menuItems;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, menuItems]);

  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = () => {
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: ''
      });
    }
    setShowCheckout(true);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        userId: user?.id || null,
        items: cart.map(item => ({
          itemId: item._id,
          quantity: item.quantity
        })),
        totalAmount: cartTotal,
        customerInfo
      };
      
      await ordersAPI.create(orderData);
      setOrderPlaced(true);
      
      // Reset cart and form after a delay
      setTimeout(() => {
        setCart([]);
        setShowCheckout(false);
        setOrderPlaced(false);
        setCustomerInfo({
          name: '',
          email: '',
          phone: '',
          address: ''
        });
      }, 3000);
    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Order error:', error);
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.priceINR * item.quantity), 0);

  if (loading) {
    return <div className="menu-page"><div className="loading">Loading menu items...</div></div>;
  }

  if (error) {
    return <div className="menu-page"><div className="error-message">{error}</div></div>;
  }

  if (showCheckout) {
    return (
      <div className="menu-page">
        <h1>Checkout</h1>
        
        {orderPlaced ? (
          <div className="order-confirmation">
            <h2>✅ Order Placed Successfully!</h2>
            <p>Your order has been received and is being prepared.</p>
            <p>You'll be redirected back to the menu shortly...</p>
          </div>
        ) : (
          <div className="checkout-container">
            <div className="order-summary">
              <h2>Order Summary</h2>
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.priceINR * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
              </div>
            </div>
            
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <h3>Delivery Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Delivery Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  rows="3"
                  required
                />
              </div>
              
              <div className="checkout-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)}
                  className="back-button"
                >
                  Back to Cart
                </button>
                <button type="submit" className="place-order-button">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      
      {/* Search and Filter Section */}
      <div className="menu-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="menu-items">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item._id} className="menu-item">
              {item.imageURL && (
                <img 
                  src={item.imageURL} 
                  alt={item.name} 
                  className="menu-item-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="menu-item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu-item-footer">
                  <span className="price">₹{item.priceINR.toFixed(2)}</span>
                  <button 
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-items">No menu items found matching your criteria.</p>
        )}
      </div>
      
      {/* Shopping Cart */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h2>Shopping Cart</h2>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.priceINR.toFixed(2)} each</p>
                </div>
                <div className="cart-item-controls">
                  <button 
                    className="quantity-button"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-button"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
            </div>
            <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;