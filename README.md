# 🛍️ SellMate AI

### AI-Powered Agentic Commerce Assistant

SellMate AI is an AI-powered shopping assistant designed to make online product discovery easier, faster, and more personalized.

Instead of manually searching through multiple products, users can interact with SellMate AI using natural language. The system understands shopping requirements such as product type, budget, and preferences, searches for relevant products, and presents useful recommendations with price, rating, discount, availability, and purchase options.

---

## 🚀 Problem Statement

Online shopping platforms provide thousands of products, making it difficult for users to quickly identify the right product within their budget.

Users often need to:

- Search through many products
- Compare prices and ratings
- Check discounts
- Find products within a specific budget
- Decide which product provides better value
- Manage selected products separately

This process can be time-consuming and overwhelming.

---

## 💡 Our Solution

SellMate AI acts as an intelligent shopping assistant that understands a user's shopping intent and helps them discover suitable products.

Users can simply ask questions such as:

> Find running shoes under ₹3000

or

> Show me backpacks under ₹1000

SellMate AI processes the request and provides relevant product recommendations.

---

# ✨ Key Features

## 🤖 1. AI Shopping Assistant

Users can interact with SellMate AI using natural language.

Example queries:

```text
Find running shoes under ₹3000
Show me backpacks under ₹1000
I need sports shoes under ₹2000
Find the best rated shoes
Show me products below ₹500
2. Product Recommendations
```

##🛒 2. Product Recommendations

Each product card provides:

🏷️ Product name
🏢 Brand
🏪 Shopping platform
💰 Current price
💵 MRP
🔖 Discount percentage
⭐ Product rating
👥 Number of reviews
✅ Availability
🖼️ Product image
🔗 Purchase link
##💰 3. Budget-Based Shopping

Users can specify their maximum budget while searching for products.

Example:

Find wireless headphones under ₹2000

The system identifies products that match the requested category and budget.

##⭐ 4. Product Comparison

SellMate AI helps users compare products using important factors such as:

Price
Rating
Discount
Availability
Shopping platform

The assistant also highlights useful information such as the best price and best-rated product.

##🛍️ 5. Buy Now

For products available from external shopping platforms, users can click:

🛒 Buy Now

The system opens the product's shopping link so the user can continue the purchase on the respective platform.

##🛒 6. Shopping Cart

SellMate AI includes a cart system for managing selected products.

Users can:

Add products to the cart
View cart items
Check total number of items
Check subtotal
Remove products
Clear the entire cart

Example commands:

Show my cart
Remove running shoes
Clear cart
##🤖 7. Agentic Commerce

The system follows an agent-based approach to understand shopping requests and perform appropriate actions.

The agent can:

Understand the user's shopping request
Identify product requirements
Extract budget constraints
Search for relevant products
Rank suitable products
Generate a useful response
Allow the user to purchase or add products to the cart

---

# 🏗️ System Architecture

The following architecture shows how the user request flows through the SellMate AI system.

```text
User
  │
  │ Natural Language Shopping Request
  ▼
React Frontend
  │
  │ REST API
  ▼
FastAPI Backend
  │
  ▼
Commerce Agent
  │
  ├── Understand Shopping Intent
  ├── Extract Product Requirements
  ├── Extract Budget Constraints
  │
  ▼
Product Search Engine
  │
  ├── Product Providers
  ├── Product Search
  └── Product Ranking
  │
  ▼
Product Recommendations
  │
  ├── Price
  ├── Rating
  ├── Discount
  ├── Availability
  └── Purchase Link
  │
  ├───────────────┐
  ▼               ▼
Buy Now       Add to Cart
                  │
                  ▼
             Shopping Cart
```

---

#🧰 Technology Stack
Frontend
React.js
JavaScript
HTML5
CSS3
Axios
Vite
Backend
Python
FastAPI
Pydantic
REST APIs
AI / Intelligent Processing
Agent-based request understanding
Natural language processing
Product search and ranking
Context-aware recommendations
Commerce Features
Product comparison
Budget filtering
Shopping cart
Product purchase links
Product availability
---

#📁 Project Structure
```text
SellMate-AI/
│
├── backend/
│   ├── agent.py
│   ├── cart.py
│   ├── comparison.py
│   ├── context_manager.py
│   ├── conversation_state.py
│   ├── cross_sell.py
│   ├── main.py
│   ├── product_providers.py
│   ├── product_search.py
│   ├── products.py
│   └── real_product_search.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
