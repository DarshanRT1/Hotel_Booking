const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Seed route - populate database with sample menu items
router.post('/seed', async (req, res) => {
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});
    
    // Sample menu items with prices in USD (will be converted to INR in frontend)
    const sampleItems = [
      {
        name: 'Paneer Tikka',
        description: 'Cottage cheese marinated in spices and grilled to perfection',
        price: 3.50,
        category: 'Appetizer',
        imageURL: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400'
      },
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken and spices',
        price: 5.99,
        category: 'Main Course',
        imageURL: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in a rich, creamy tomato-based sauce',
        price: 6.50,
        category: 'Main Course',
        imageURL: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400'
      },
      {
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in a creamy butter sauce',
        price: 4.25,
        category: 'Main Course',
        imageURL: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'
      },
      {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        price: 1.50,
        category: 'Appetizer',
        imageURL: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'
      },
      {
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in sweet syrup',
        price: 2.50,
        category: 'Dessert',
        imageURL: 'https://images.unsplash.com/photo-1589301760014-1b5e50e5c14e?w=400'
      },
      {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt-based drink with mango',
        price: 2.00,
        category: 'Beverage',
        imageURL: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 1.25,
        category: 'Beverage',
        imageURL: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400'
      },
      {
        name: 'Tandoori Roti',
        description: 'Whole wheat bread baked in a clay oven',
        price: 1.00,
        category: 'Appetizer',
        imageURL: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
      },
      {
        name: 'Kulfi',
        description: 'Traditional Indian ice cream with pistachios',
        price: 2.75,
        category: 'Dessert',
        imageURL: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400'
      }
    ];
    
    await MenuItem.insertMany(sampleItems);
    
    res.status(201).json({ 
      message: 'Database seeded successfully', 
      count: sampleItems.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;