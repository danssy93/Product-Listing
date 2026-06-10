# 🛒 ProductApp — Full Stack Product Listing Web App

A full-stack e-commerce web application built with **React**, **TypeScript**, **Node.js/Express**, and **MongoDB**. Features include product listing, authentication, shopping cart, order management, and more.

---

## 📸 Features

- 🔐 **Authentication** — Register and login with JWT-based persistent sessions
- 🛍️ **Product Listing** — Browse all products with search, filter, and sort
- 🛒 **Shopping Cart** — Global cart state with quantity management and badge count
- 📦 **Product Management** — Create, edit, and delete products (authenticated users)
- ✅ **Order System** — Place orders, reduce stock automatically, view order history
- 🔔 **Toast Notifications** — Real-time feedback for all user actions
- 💀 **Loading Skeletons** — Smooth loading states while data fetches
- 📭 **Empty States** — Friendly UI when no results are found
- 🗑️ **Confirm Modals** — Confirmation dialogs before destructive actions
- 📊 **Stock Tracking** — Live stock display with low-stock and out-of-stock indicators
- 🔽 **Category Dropdown** — Consistent category selection across the app
- 📋 **Form Validation** — Inline error messages on all forms

---

## 🧰 Tech Stack

### Frontend

| Tool            | Purpose                    |
| --------------- | -------------------------- |
| React 18        | UI framework               |
| TypeScript      | Type safety                |
| React Router v6 | Client-side routing        |
| Context API     | Global state (cart + auth) |
| Axios           | HTTP requests              |
| react-hot-toast | Toast notifications        |

### Backend

| Tool               | Purpose               |
| ------------------ | --------------------- |
| Node.js + Express  | REST API server       |
| TypeScript         | Type safety           |
| MongoDB + Mongoose | Database and ODM      |
| bcryptjs           | Password hashing      |
| jsonwebtoken       | JWT authentication    |
| dotenv             | Environment variables |
| cors               | Cross-origin requests |

---

## 📁 Project Structure

```
product-app/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   └── Order.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   └── orders.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.ts
        ├── components/
        │   ├── Navbar.tsx
        │   ├── ProductSkeleton.tsx
        │   ├── EmptyState.tsx
        │   └── ConfirmModal.tsx
        ├── constants/
        │   └── categories.ts
        ├── context/
        │   ├── AuthContext.tsx
        │   └── CartContext.tsx
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── ProductsPage.tsx
        │   ├── ProductDetailPage.tsx
        │   ├── CheckoutPage.tsx
        │   └── OrdersPage.tsx
        ├── App.tsx
        └── index.css
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier is fine)

---

### 1. Clone the repository

```bash
git clone https://github.com/danssy93/product-app.git
cd product-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
```

> 💡 To get your `MONGO_URI`:
>
> 1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
> 2. Create a free cluster
> 3. Click **Connect → Drivers**
> 4. Copy the connection string and replace `<password>` with your DB user password

Start the backend:

```bash
npm run dev
```

You should see:

```
MongoDB connected
Server running on port 5000
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

App opens at **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user       | No            |
| POST   | `/api/auth/login`    | Login and get JWT token | No            |

### Products

| Method | Endpoint                         | Description                                      | Auth Required |
| ------ | -------------------------------- | ------------------------------------------------ | ------------- |
| GET    | `/api/products`                  | Get all products (supports search, filter, sort) | No            |
| GET    | `/api/products/:id`              | Get single product                               | No            |
| POST   | `/api/products`                  | Create a product                                 | Yes           |
| PUT    | `/api/products/:id`              | Update a product                                 | Yes           |
| DELETE | `/api/products/:id`              | Delete a product                                 | Yes           |
| POST   | `/api/products/:id/reduce-stock` | Reduce product stock                             | Yes           |

### Orders

| Method | Endpoint      | Description                 | Auth Required |
| ------ | ------------- | --------------------------- | ------------- |
| POST   | `/api/orders` | Place a new order           | Yes           |
| GET    | `/api/orders` | Get logged-in user's orders | Yes           |

### Query Parameters for `GET /api/products`

| Param      | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| `search`   | string | Search by product name                 |
| `category` | string | Filter by category                     |
| `minPrice` | number | Minimum price filter                   |
| `maxPrice` | number | Maximum price filter                   |
| `sort`     | string | `price_asc`, `price_desc`, or `newest` |

---

## 🚀 Deployment (Render)

### Backend Deployment

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Set the following:

| Setting        | Value                          |
| -------------- | ------------------------------ |
| Root Directory | `backend`                      |
| Build Command  | `npm install && npm run build` |
| Start Command  | `npm start`                    |

5. Add environment variables:

| Key          | Value                                |
| ------------ | ------------------------------------ |
| `PORT`       | `5000`                               |
| `MONGO_URI`  | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key                      |

6. Click **Deploy**. Copy the deployed URL e.g. `https://product-app-api.onrender.com`

---

### Frontend Deployment

1. Go to [render.com](https://render.com) and create a new **Static Site**
2. Connect the same GitHub repository
3. Set the following:

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| Root Directory    | `frontend`                     |
| Build Command     | `npm install && npm run build` |
| Publish Directory | `build`                        |

4. Add environment variable:

| Key                 | Value                                       |
| ------------------- | ------------------------------------------- |
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` |

5. Click **Deploy**

---

### MongoDB Atlas Configuration for Production

Make sure your MongoDB Atlas cluster allows connections from anywhere:

1. Go to **Network Access** in Atlas
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Save

---

## 🔐 Authentication Flow

1. User registers or logs in via `/api/auth/login`
2. Server returns a JWT token (valid for 7 days)
3. Token is stored in `localStorage`
4. Every subsequent request attaches the token via `Authorization: Bearer <token>` header
5. Protected routes on the backend verify the token via the `protect` middleware
6. Protected pages on the frontend redirect to `/login` if no token is found

---

## 📦 Available Scripts

### Backend

```bash
npm run dev      # Start with nodemon (development)
npm run build    # Compile TypeScript to JS
npm start        # Run compiled JS (production)
```

### Frontend

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

---

## 🌱 Product Categories

The following categories are available in the app:

- Electronics
- Clothing
- Food & Drinks
- Home & Living
- Health & Beauty
- Sports & Fitness
- Books & Stationery
- Toys & Games
- Automotive
- Other

---

## 👤 Author

**Daudu Tobi Emmanuel**
Backend Developer
[GitHub: danssy93](https://github.com/danssy93)

---

## 📄 License

This project is built as a take-home assessment. All rights reserved.
