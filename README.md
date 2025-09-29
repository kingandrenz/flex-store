# 🛒 E-commerce Order API

A Node.js + Express backend service for managing **orders** in an e-commerce application.
It supports creating orders, calculating totals (items, tax, shipping), and storing them securely in MongoDB.

---

## 🚀 Features

* Create new customer orders
* Validate product availability from the database
* Auto-calculate prices (items, tax, shipping, and total)
* MongoDB integration with Mongoose
* Centralized error handling with async middleware
* JWT-based user authentication (assumed from `req.user._id`)

---

## 📂 Project Structure

```
├── controllers/
│   └── orderController.js    # Order logic
├── middlewares/
│   └── asyncHandler.js       # Async error wrapper
├── models/
│   ├── orderModel.js         # Order schema
│   └── productModel.js       # Product schema
├── utils/
│   └── calcPrices.js         # Helper for order totals
└── server.js                 # App entry point
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-api.git
cd ecommerce-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Run Server

```bash
npm run dev   # for development (with nodemon)
npm start     # for production
```

---

## 🛠️ API Endpoints

### Create Order

**POST** `/api/orders`

#### Request Body:

```json
{
  "orderItems": [
    {
      "_id": "64b22c1f12a3f6f1c9d12345",
      "name": "Sample Product",
      "qty": 2
    }
  ],
  "shippingAddress": {
    "address": "123 Main St",
    "city": "Lagos",
    "postalCode": "100001",
    "country": "Nigeria"
  },
  "paymentMethod": "PayPal"
}
```

#### Response:

```json
{
  "_id": "64b22c1f12a3f6f1c9d67890",
  "orderItems": [
    {
      "name": "Sample Product",
      "qty": 2,
      "price": 100,
      "product": "64b22c1f12a3f6f1c9d12345"
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "PayPal",
  "itemsPrice": 200,
  "taxPrice": 20,
  "shippingPrice": 10,
  "totalPrice": 230,
  "user": "64b11c9f12a3f6f1c9d45678",
  "createdAt": "2025-09-29T12:00:00Z"
}
```

---

## 🧮 Price Calculation

Prices are calculated using `utils/calcPrices.js`:

* **Items Price** = sum of `price * qty`
* **Tax Price** = configurable (e.g., 10%)
* **Shipping Price** = configurable (e.g., flat rate)
* **Total Price** = items + tax + shipping

---

## 🤝 Contribution

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request 🎉

---

## 📜 License

This project is licensed under the MIT License.
Feel free to use and modify it for your own projects.

