\# 🛍️ SellMate AI



\### AI-Powered Agentic Commerce Assistant



SellMate AI is an AI-powered shopping assistant designed to make online product discovery easier, faster, and more personalized.



Instead of manually searching through multiple products, users can interact with SellMate AI using natural language. The system understands shopping requirements such as product type, budget, and preferences, searches for relevant products, and presents useful recommendations with price, rating, discount, availability, and purchase options.



\---



\## 🚀 Problem Statement



Online shopping platforms provide thousands of products, making it difficult for users to quickly identify the right product within their budget.



Users often need to:



\- Search through many products

\- Compare prices and ratings

\- Check discounts

\- Find products within a specific budget

\- Decide which product provides better value

\- Manage selected products separately



This process can be time-consuming and overwhelming.



\---



\## 💡 Our Solution



SellMate AI acts as an intelligent shopping assistant that understands a user's shopping intent and helps them discover suitable products.



Users can simply ask questions such as:



> Find running shoes under ₹3000



or



> Show me backpacks under ₹1000



SellMate AI processes the request and provides relevant product recommendations with important information such as:



\- Product name

\- Brand

\- Price

\- MRP

\- Discount

\- Rating

\- Number of reviews

\- Availability

\- Shopping platform

\- Purchase link



\---



\# ✨ Key Features



\## 🤖 1. AI Shopping Assistant



Users can interact with SellMate AI using natural language.



Example queries:



```text

Find running shoes under ₹3000

Show me backpacks under ₹1000

I need sports shoes under ₹2000

Find the best rated shoes

Show me products below ₹500

```

\---



\## 🛍️ 2. Product Recommendations



Each product card provides:



\- 🏷️ Product name

\- 🏢 Brand

\- 🏪 Shopping platform

\- 💰 Current price

\- 💵 MRP

\- 🔖 Discount percentage

\- ⭐ Product rating

\- 👥 Number of reviews

\- ✅ Availability

\- 🖼️ Product image

\- 🔗 Purchase link



\---



\## 💰 3. Budget-Based Shopping



Users can specify their maximum budget while searching for products.



Example:



```text

Find wireless headphones under ₹2000

```

\## ⭐ 4. Product Comparison



SellMate AI helps users compare products using important factors such as:



\- 💰 Price

\- ⭐ Rating

\- 🔖 Discount

\- ✅ Availability

\- 🏪 Shopping platform



The assistant can highlight useful information such as the \*\*best price\*\* and \*\*best-rated product\*\*.



Example:



```text

Compare running shoes under ₹3000

```

\## 🛒 5. Buy Now



For products available from external shopping platforms, SellMate AI provides a \*\*Buy Now\*\* option.



Users can click the:



\*\*🛒 Buy Now\*\*



button on a product card to open the corresponding product page on the shopping platform.



This allows users to:



\- View the product on the original shopping platform

\- Check additional product details

\- Continue with the purchase

\- Access the product using the provided shopping link



Example:



```text

User searches for running shoes

&#x20;       ↓

SellMate AI displays products

&#x20;       ↓

User selects a product

&#x20;       ↓

Click "🛒 Buy Now"

&#x20;       ↓

Original shopping platform opens

```

\## 🛒 6. Shopping Cart



SellMate AI includes a shopping cart system that allows users to manage products they are interested in purchasing.



Users can:



\- ➕ Add products to the cart

\- 🛍️ View cart items

\- 🔢 Check the total number of items

\- 💰 Check the cart subtotal

\- ❌ Remove individual products

\- 🗑️ Clear the entire cart



\### Example Cart Commands



```text

Show my cart

Remove running shoes

Clear my cart

```

\## 🤖 7. Agentic Commerce



SellMate AI uses an agent-based approach to understand user shopping requests and perform appropriate commerce actions.



The commerce agent can:



\- 🧠 Understand the user's shopping request

\- 🔍 Identify the required product category

\- 💰 Extract budget constraints

\- 🔎 Search for relevant products

\- 📊 Compare and rank products

\- ⭐ Identify useful products based on ratings and price

\- 💬 Generate a natural-language response

\- 🛒 Add selected products to the shopping cart

\- 🔗 Provide purchase links through the Buy Now option



This allows users to interact with the shopping system naturally instead of manually searching and filtering products.



\---

\# 🏗️ 8. System Architecture



The following architecture shows how a user's shopping request flows through the SellMate AI system.



```text

User

&#x20; │

&#x20; │ Natural Language Shopping Request

&#x20; ▼

React Frontend

&#x20; │

&#x20; │ REST API

&#x20; ▼

FastAPI Backend

&#x20; │

&#x20; ▼

Commerce Agent

&#x20; │

&#x20; ├── Understand Shopping Intent

&#x20; ├── Extract Product Requirements

&#x20; └── Extract Budget Constraints

&#x20; │

&#x20; ▼

Product Search Engine

&#x20; │

&#x20; ├── Product Providers

&#x20; ├── Product Search

&#x20; └── Product Ranking

&#x20; │

&#x20; ▼

Product Recommendations

&#x20; │

&#x20; ├── Price

&#x20; ├── Rating

&#x20; ├── Discount

&#x20; ├── Availability

&#x20; └── Purchase Link

&#x20; │

&#x20; ├──────────────────┐

&#x20; ▼                  ▼

Buy Now          Add to Cart

&#x20;                      │

&#x20;                      ▼

&#x20;                 Shopping Cart

```

\# 🧰 9. Technology Stack



\## 🎨 Frontend



\- React.js

\- JavaScript

\- HTML5

\- CSS3

\- Axios

\- Vite



\## ⚙️ Backend



\- Python

\- FastAPI

\- Pydantic

\- REST APIs



\## 🤖 AI / Intelligent Processing



\- Agent-based request understanding

\- Natural Language Processing

\- Product search and ranking

\- Context-aware recommendations



\## 🛍️ Commerce Features



\- Product search

\- Budget filtering

\- Product comparison

\- Product ranking

\- Shopping cart

\- Buy Now functionality

\- Product purchase links

\- Product availability



\---

\# 📁 10. Project Structure



```text

SellMate-AI/

│

├── backend/

│   ├── agent.py

│   ├── cart.py

│   ├── comparison.py

│   ├── context\_manager.py

│   ├── conversation\_state.py

│   ├── cross\_sell.py

│   ├── main.py

│   ├── product\_providers.py

│   ├── product\_search.py

│   ├── products.py

│   └── real\_product\_search.py

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

\# ⚙️ 11. How to Run



\## 🔧 Backend Setup



Open a terminal in the project folder:



```bash

cd backend

```

Create a Python virtual environment:



```bash

python -m venv venv

```

Activate the virtual environment on Windows:



```bash

venv\\Scripts\\activate

```

Install the required dependencies:

```bash

pip install -r requirements.txt

```

Start the FastAPI backend:

```bash

uvicorn main:app --reload

```

The backend will run at:

```text

http://127.0.0.1:8000

```

You can also check the API documentation at:

```text

http://127.0.0.1:8000/docs

```

\## 🎨 Frontend Setup

Open another terminal:

```bash

cd frontend

```

Install the required Node.js dependencies:

```bash

npm install

```

Start the React development server:

```bash

npm run dev

```

The frontend will run at:

```text

http://localhost:5173

```

\## ▶️ Running the Application



1\. Start the FastAPI backend.

2\. Start the React frontend.

3\. Open the frontend URL in a browser.

4\. Enter a natural-language shopping request.

5\. View the recommended products.

6\. Use \*\*Buy Now\*\* to open the shopping platform.

7\. Use \*\*Add to Cart\*\* to add products to the cart.

8\. Manage products through the shopping cart.

\## 💬 12. Example User Queries



Users can interact with SellMate AI using natural language.



\### 🔎 Product Search



```text

Find running shoes under ₹3000

Show me backpacks under ₹1000

I need sports shoes under ₹2000

```

\### ⭐ Product Ranking



```text

Find the best rated shoes

Show me the cheapest running shoes

Which product has the best discount?

```

\###  💰 Budget-Based Search

```text

Show me products below ₹500

Find wireless headphones under ₹2000

```

\### 🛒 Shopping Cart

```text

Show my cart

Add this product to my cart

Remove running shoes from my cart

Clear my cart

```

\## 🔄 13. Application Workflow



The SellMate AI application follows this workflow:



```text

User

&#x20; ↓

Natural Language Shopping Request

&#x20; ↓

React Frontend

&#x20; ↓

FastAPI Backend

&#x20; ↓

Commerce Agent

&#x20; ↓

Understand Shopping Intent

&#x20; ↓

Extract Product \& Budget Requirements

&#x20; ↓

Product Search Engine

&#x20; ↓

Compare \& Rank Products

&#x20; ↓

Generate Product Recommendations

&#x20; ↓

Display Product Cards

&#x20; ↓

┌───────────────────┐

│                   │

▼                   ▼

Buy Now         Add to Cart

&#x20;                   ↓

&#x20;             Shopping Cart

```

\## 🎯 14. Benefits



SellMate AI provides the following benefits:



\- Simplifies online product discovery

\- Reduces manual product searching

\- Provides budget-aware recommendations

\- Displays important product information in one place

\- Helps users compare products

\- Highlights best price and best-rated products

\- Provides direct purchase links

\- Supports shopping cart management

\- Enables natural-language interaction

\- Provides a simple and user-friendly shopping experience



\---

\## 🚀 15. Future Enhancements



The following features can be added in future versions of SellMate AI:



\- 🎙️ Voice-based shopping

\- 🌐 Multilingual shopping assistance

\- 🛍️ Integration with additional shopping platforms

\- 🎯 Personalized product recommendations

\- 📊 Advanced product ranking

\- 💳 Payment integration

\- 👤 User accounts and persistent shopping carts

\- 📦 Order tracking

\- 🧠 Recommendation learning based on user behavior



\---

\# 🏆 16. Razorpay Buildathon



SellMate AI was developed as a project for the Razorpay Buildathon.



The project focuses on using \*\*AI and agentic workflows\*\* to improve the online shopping experience by helping users:



\- 🔍 Discover products

\- 💰 Find products within their budget

\- ⭐ Compare products

\- 📊 Identify suitable recommendations

\- 🛒 Add products to a shopping cart

\- 🔗 Access products through purchase links



SellMate AI demonstrates how an AI-powered commerce assistant can simplify product discovery and help users make faster and more informed shopping decisions.



\---



\## 👩‍💻 Project



\*\*SellMate AI – AI-Powered Agentic Commerce Assistant\*\*



Built with \*\*React.js, FastAPI, Python, and AI-powered commerce workflows\*\*.



