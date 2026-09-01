import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("QUICKCOMMERCE_API_KEY")

API_URL = "https://api.quickcommerceapi.com/v1/groupsearch"

# Bengaluru coordinates for initial testing
LATITUDE = 12.9716
LONGITUDE = 77.5946

PLATFORMS = [
    "Amazon",
    "Flipkart",
    "Myntra"
]


def search_real_products(query, max_price=None):
    """
    Search real products across multiple shopping platforms.
    """

    if not API_KEY:
        raise ValueError(
            "QUICKCOMMERCE_API_KEY is missing from .env"
        )

    params = {
        "q": query,
        "lat": LATITUDE,
        "lon": LONGITUDE,
        "platforms": ",".join(PLATFORMS)
    }

    try:
        response = requests.get(
            API_URL,
            headers={
                "X-API-Key": API_KEY
            },
            params=params,
            timeout=30
        )

        response.raise_for_status()

        data = response.json()

        results = []

        platform_results = (
            data.get("data", {})
                .get("results", {})
        )

        for platform, products in platform_results.items():

            for product in products:

                price = product.get("offer_price")

                if price is None:
                    price = product.get("price")

                # Apply budget
                if max_price is not None:
                    if price is None or float(price) > float(max_price):
                        continue

                images = product.get("images", [])

                image_url = None

                if images:
                    image_url = images[0]

                platform_data = product.get(
                    "platform",
                    {}
                )

                if isinstance(platform_data, dict):
                    platform_name = platform_data.get(
                        "name",
                        platform
                    )
                else:
                    platform_name = platform

                results.append({
                    "id": product.get("id"),
                    "name": product.get("name"),
                    "brand": product.get("brand"),
                    "platform": platform_name,
                    "price": price,
                    "mrp": product.get("mrp"),
                    "rating": product.get("rating"),
                    "rating_count": product.get("rating_count"),
                    "image": image_url,
                    "stock": product.get("inventory"),
                    "available": product.get("available"),
                    "product_url": product.get("deeplink"),
                    "quantity": product.get("quantity")
                })

        # Cheapest products first
        results.sort(
            key=lambda product: (
                float(product["price"])
                if product["price"] is not None
                else float("inf")
            )
        )

        return results

    except requests.exceptions.RequestException as error:

        print(
            "Real product API error:",
            error
        )

        return []