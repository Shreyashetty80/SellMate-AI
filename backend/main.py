# =========================================================
# SELLMATE AI - FASTAPI BACKEND
# =========================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional


from products import products
from product_search import search_engine
from agent import commerce_agent

from cart import (
    add_to_cart,
    remove_from_cart,
    clear_cart,
    calculate_cart
)

from conversation_state import (
    save_recommendations
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="SellMate AI",
    description="AI-powered agentic commerce assistant",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "SellMate AI backend is running!",
        "status": "success"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# PRODUCTS
# =========================================================

@app.get("/products")
def get_products():

    return {
        "products": products,
        "count": len(products)
    }


# =========================================================
# PRODUCT SEARCH
# =========================================================

@app.get("/search")
def search_products(
    query: str,
    max_price: Optional[float] = None
):

    results = search_engine.search(
        query=query,
        max_price=max_price
    )

    return {
        "query": query,
        "results": results,
        "count": len(results)
    }


# =========================================================
# REQUEST MODELS
# =========================================================

class ChatRequest(BaseModel):

    message: str

    user_id: str = "demo_user"


class CartRequest(BaseModel):

    user_id: str

    # IMPORTANT:
    # Product IDs can be numbers OR strings
    product_id: str

    quantity: int = 1

    # Product information sent by React
    name: str = "Unknown Product"

    brand: str = ""

    platform: str = "SellMate"

    price: float = 0

    mrp: Optional[float] = None

    rating: Optional[float] = None

    rating_count: int = 0

    image: str = ""

    product_url: str = ""

    available: bool = True


class AgentCartRequest(BaseModel):

    message: str

    user_id: str = "demo_user"


# =========================================================
# AGENT CHAT
# =========================================================

@app.post("/agent/chat")
def agent_chat(request: ChatRequest):

    result = commerce_agent.understand_request(
        request.message
    )

    return result


# =========================================================
# AI RECOMMENDATION
# =========================================================

@app.post("/agent/recommend")
def agent_recommend(request: ChatRequest):

    result = commerce_agent.generate_response(
        request.message
    )

    save_recommendations(
        request.user_id,
        result.get("products", [])
    )

    return result


# =========================================================
# ADD PRODUCT TO CART
# =========================================================

@app.post("/cart/add")
def cart_add(request: CartRequest):

    # -----------------------------------------------------
    # VALIDATE QUANTITY
    # -----------------------------------------------------

    if request.quantity <= 0:

        return {
            "success": False,
            "message": "Quantity must be greater than zero"
        }

    # -----------------------------------------------------
    # CREATE PRODUCT OBJECT
    # -----------------------------------------------------

    product = {

        "id": request.product_id,

        "name": request.name,

        "brand": request.brand,

        "platform": request.platform,

        "price": request.price,

        "mrp": request.mrp,

        "rating": request.rating,

        "rating_count": request.rating_count,

        "image": request.image,

        "product_url": request.product_url,

        "available": request.available
    }

    # -----------------------------------------------------
    # CHECK AVAILABILITY
    # -----------------------------------------------------

    if not request.available:

        return {
            "success": False,
            "message": "This product is currently out of stock."
        }

    # -----------------------------------------------------
    # ADD TO CART
    # -----------------------------------------------------

    cart = add_to_cart(
        user_id=request.user_id,
        product=product,
        quantity=request.quantity
    )

    return {

        "success": True,

        "message": (
            f"{request.name} has been added "
            "to your cart."
        ),

        "cart": cart
    }


# =========================================================
# GET USER CART
# =========================================================

@app.get("/cart/{user_id}")
def get_user_cart(user_id: str):

    cart = calculate_cart(user_id)

    return {

        "success": True,

        "cart": cart
    }


# =========================================================
# REMOVE PRODUCT FROM CART
# =========================================================

@app.delete(
    "/cart/{user_id}/item/{product_id}"
)
def delete_cart_item(
    user_id: str,
    product_id: str
):

    cart = remove_from_cart(
        user_id,
        product_id
    )

    return {

        "success": True,

        "message": "Product removed from cart",

        "cart": cart
    }


# =========================================================
# CLEAR CART
# =========================================================

@app.delete("/cart/{user_id}")
def delete_cart(user_id: str):

    cart = clear_cart(user_id)

    return {

        "success": True,

        "message": "Cart cleared",

        "cart": cart
    }


# =========================================================
# AI CART AGENT
# =========================================================

@app.post("/agent/cart")
def agent_cart(request: AgentCartRequest):

    message = request.message.lower().strip()

    # =====================================================
    # CLEAR CART
    # =====================================================

    clear_keywords = [

        "clear cart",
        "clear my cart",
        "empty cart",
        "empty my cart",
        "remove everything",
        "remove all",
        "delete everything",
        "delete all",
        "clear everything"
    ]

    if any(
        keyword in message
        for keyword in clear_keywords
    ):

        cart = clear_cart(
            request.user_id
        )

        return {

            "success": True,

            "action": "clear",

            "message":
                "Your cart has been cleared successfully.",

            "cart": cart
        }

    # =====================================================
    # VIEW CART
    # =====================================================

    view_keywords = [

        "show my cart",
        "show cart",
        "view cart",
        "my cart",
        "check cart",
        "what is in my cart"
    ]

    if any(
        keyword in message
        for keyword in view_keywords
    ):

        cart = calculate_cart(
            request.user_id
        )

        return {

            "success": True,

            "action": "view",

            "message":
                "Here is your current cart.",

            "cart": cart
        }

    # =====================================================
    # REMOVE PRODUCT
    # =====================================================

    remove_keywords = [
        "remove",
        "delete"
    ]

    if any(
        keyword in message
        for keyword in remove_keywords
    ):

        cart = calculate_cart(
            request.user_id
        )

        product_id = None

        for item in cart["items"]:

            product_name = (
                item["name"]
                .lower()
            )

            # Match full product name
            if product_name in message:

                product_id = item[
                    "product_id"
                ]

                break

            # Match important words
            product_words = [
                word
                for word in product_name.split()
                if len(word) > 3
            ]

            if any(
                word in message
                for word in product_words
            ):

                product_id = item[
                    "product_id"
                ]

                break

        if product_id is None:

            return {

                "success": False,

                "action": "remove",

                "message":
                    "I couldn't identify which product "
                    "you want to remove. Please mention "
                    "the product name."
            }

        updated_cart = remove_from_cart(
            request.user_id,
            product_id
        )

        return {

            "success": True,

            "action": "remove",

            "message":
                "Product removed from your cart.",

            "cart": updated_cart
        }

    # =====================================================
    # UNKNOWN COMMAND
    # =====================================================

    return {

        "success": False,

        "action": "unknown",

        "message":
            "I can help you add products, remove "
            "products, view your cart, or clear "
            "your cart."
    }