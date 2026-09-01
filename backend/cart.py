# =========================================================
# CART MANAGEMENT FOR SELLMATE AI
# =========================================================

from typing import Dict, Any


# =========================================================
# IN-MEMORY CART STORAGE
# =========================================================

carts: Dict[str, Dict[str, Any]] = {}


# =========================================================
# CREATE EMPTY CART
# =========================================================

def create_empty_cart(user_id: str):
    return {
        "user_id": user_id,
        "items": [],
        "total_items": 0,
        "subtotal": 0
    }


# =========================================================
# GET CART
# =========================================================

def get_cart(user_id: str):

    if user_id not in carts:
        carts[user_id] = create_empty_cart(user_id)

    return carts[user_id]


# =========================================================
# CALCULATE CART
# =========================================================

def calculate_cart(user_id: str):

    cart = get_cart(user_id)

    total_items = 0
    subtotal = 0

    for item in cart["items"]:

        quantity = int(item.get("quantity", 1))
        price = float(item.get("price", 0))

        total_items += quantity
        subtotal += price * quantity

    cart["total_items"] = total_items

    # Keep integer prices looking clean
    if subtotal.is_integer():
        cart["subtotal"] = int(subtotal)
    else:
        cart["subtotal"] = round(subtotal, 2)

    return cart


# =========================================================
# ADD PRODUCT TO CART
# =========================================================

def add_to_cart(
    user_id: str,
    product: Dict[str, Any],
    quantity: int = 1
):

    cart = get_cart(user_id)

    product_id = str(
        product.get("id")
        or product.get("product_id")
    )

    # -----------------------------------------------------
    # CHECK IF PRODUCT ALREADY EXISTS
    # -----------------------------------------------------

    existing_item = None

    for item in cart["items"]:

        if str(item["product_id"]) == product_id:
            existing_item = item
            break

    # -----------------------------------------------------
    # UPDATE EXISTING PRODUCT
    # -----------------------------------------------------

    if existing_item:

        existing_item["quantity"] += quantity

    # -----------------------------------------------------
    # ADD NEW PRODUCT
    # -----------------------------------------------------

    else:

        cart["items"].append({

            "product_id": product_id,

            "name": product.get(
                "name",
                "Unknown Product"
            ),

            "brand": product.get(
                "brand",
                ""
            ),

            "platform": product.get(
                "platform",
                "SellMate"
            ),

            "price": float(
                product.get("price", 0)
            ),

            "mrp": (
                float(product["mrp"])
                if product.get("mrp") is not None
                else None
            ),

            "rating": (
                float(product["rating"])
                if product.get("rating") is not None
                else None
            ),

            "rating_count": int(
                product.get(
                    "rating_count",
                    0
                )
            ),

            "image": product.get(
                "image",
                ""
            ),

            "product_url": product.get(
                "product_url",
                ""
            ),

            "available": bool(
                product.get(
                    "available",
                    True
                )
            ),

            "quantity": quantity
        })

    return calculate_cart(user_id)


# =========================================================
# REMOVE PRODUCT
# =========================================================

def remove_from_cart(
    user_id: str,
    product_id: str
):

    cart = get_cart(user_id)

    product_id = str(product_id)

    cart["items"] = [
        item
        for item in cart["items"]
        if str(item["product_id"]) != product_id
    ]

    return calculate_cart(user_id)


# =========================================================
# CLEAR CART
# =========================================================

def clear_cart(user_id: str):

    carts[user_id] = create_empty_cart(user_id)

    return carts[user_id]