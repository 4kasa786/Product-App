# Product-App

[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Product-App** is a full-stack web application for managing products. Users can create, view, update, delete, and generate products using AI prompts. It features authentication, CRUD operations with calculated fields, pagination, filtering, and a responsive frontend built with React.

Live Demo: [https://product-app-nayx.onrender.com](https://product-app-nayx.onrender.com)

---

**Author:** Sarvesh Kishor Bhoyar

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Installation & Quick Start](#installation--quick-start)
* [Environment Variables](#environment-variables)
* [Backend API](#backend-api)
* [Frontend Routes](#frontend-routes)
* [Database Models](#database-models)
* [Development Notes](#development-notes)
* [Deployment](#deployment)
* [License](#license)

---

## Features

### 🔐 Authentication System

* User signup, login, and logout
* Password-based authentication
* JWT-protected routes

### 📊 CRUD Operations

* Domain: **Products**
* Required fields:

  * Text field: `productName`
  * Enum field: `category` (Electronics, Clothing, Food)
  * Boolean field: `inStock`
  * Calculated field: `totalValue = price * quantity`
* Full Create, Read, Update, Delete endpoints
* Simple React frontend

### 📑 Listing & Data Management

* Pagination: 5–10 items per page
* Filter products by category or stock status
* Bonus: search products, sort by price or quantity

### 🤖 AI Integration

* Product generation using **Gemini CLI**
* Documented methodology for AI usage

---

## Tech Stack

* **Frontend:** React, React Router, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Authentication:** JWT
* **Validation:** Zod and custom backend validation
* **Notifications:** react-toastify
* **Deployment:** Render

---

## Folder Structure

```
Product-App
├── api
│   ├── controllers       # Auth & product controllers
│   ├── index.js          # Backend entry point
│   ├── models            # MongoDB models (User, Product)
│   ├── routes            # API routes
│   ├── utils             # Helper functions (validate, verifyToken)
│   └── validators        # Request validation schemas
├── client
│   ├── src               # React components & pages
│   ├── public            # Static assets
│   └── vite.config.js    # Vite config
├── docs                  # Documentation files
├── node_modules          # Dependencies
├── .env                  # Environment variables
├── package.json
├── package-lock.json
└── testGemini.js         # Gemini CLI testing
```

---

## Installation & Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Product-App.git
cd Product-App
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Run the application

**Backend**

```bash
npm run dev   # Starts Express server
```

**Frontend**

```bash
npm run dev   # Starts React app
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGO=mongodb+srv://alkabhoyar01:ITtVVQ0nlXRkTel6@cluster0.xluzdhx.mongodb.net/product-app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET='God and Parents and Teachers and Everyone should Always be Respected'
GEMINI_API_KEY=AIzaSyB_o-jfYpSGXcFCNRmdEMbn9J51ausg5xI
PORT=5000
```

---

## Backend API

### Auth Routes

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | /api/auth/signup  | Register a new user |
| POST   | /api/auth/signin  | Login user          |
| POST   | /api/auth/signout | Logout user         |

### Product Routes

| Method | Endpoint               | Description                 | Protected |
| ------ | ---------------------- | --------------------------- | --------- |
| POST   | /api/products          | Create a product            | Yes       |
| POST   | /api/products/generate | Generate product via prompt | Yes       |
| GET    | /api/products          | Get all products            | No        |
| GET    | /api/products/\:id     | Get single product by ID    | No        |
| PUT    | /api/products/\:id     | Update product by ID        | Yes       |
| DELETE | /api/products/\:id     | Delete product by ID        | Yes       |

---

## Frontend Routes

| Path                         | Component         | Description                   |
| ---------------------------- | ----------------- | ----------------------------- |
| `/`                          | Home              | Product listings              |
| `/sign-up`                   | SignUp            | User registration             |
| `/sign-in`                   | SignIn            | User login                    |
| `/search`                    | SearchResults     | Search products               |
| `/products/:productId`       | ProductDetailPage | View single product           |
| `/create-product`            | ProductForm       | Create product (PrivateRoute) |
| `/update-product/:productId` | ProductUpdateForm | Update product (PrivateRoute) |

---

## Database Models

### Product Model

```javascript
const productSchema = new mongoose.Schema({
    productName: String,
    category: { type: String, enum: ['Electronics', 'Clothing', 'Food'] },
    inStock: { type: Boolean, default: true },
    price: Number,
    quantity: Number,
    totalValue: Number, // calculated as price * quantity
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

productSchema.pre('save', function (next) {
    this.totalValue = this.price * this.quantity;
    next();
});
```

### User Model

```javascript
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }
}, { timestamps: true });
```

---

## Development Notes

* Built from scratch using Express and React
* Pagination implemented with query parameters (`page` & `limit`)
* Filters on `category` and `inStock`
* Optional sorting by `price` or `quantity`
* AI product generation integrated using **Gemini CLI**

---

## Deployment

* Deployed on **Render**


---

## License

This project is licensed under the MIT License.
