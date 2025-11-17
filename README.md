# Restaurant Booking and Ordering System

A full-stack web application for a small restaurant that provides both table booking and food ordering capabilities.

## Technology Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── User.js
│   │   ├── Reservation.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── menuItems.js
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Features Implemented

### Backend
1. Express server setup with MongoDB connection
2. Mongoose schemas for:
   - MenuItem (name, description, price, category, imageURL)
   - User (name, email, password, role)
   - Reservation (userId, date, time, partySize, status)
   - Order (userId, items, totalAmount, status)
3. Basic CRUD API endpoints for MenuItems
4. Authentication routes (register, login) with JWT

### Frontend
1. React app with Vite
2. Tailwind CSS configuration
3. Proxy setup for API calls
4. Basic homepage with "Book a Table" and "View Menu" buttons

## Getting Started

1. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

4. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

## API Endpoints

### Menu Items
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items/category/:category` - Get menu items by category
- `GET /api/menu-items/:id` - Get a specific menu item
- `POST /api/menu-items` - Create a new menu item
- `PUT /api/menu-items/:id` - Update a menu item
- `DELETE /api/menu-items/:id` - Delete a menu item

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user