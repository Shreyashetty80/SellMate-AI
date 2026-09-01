from collections import defaultdict


class ProductComparator:

    def compare(self, products):
        """
        Compare products from different shopping platforms.
        """

        if not products:
            return {
                "products": [],
                "best_overall": None,
                "cheapest": None,
                "highest_rated": None
            }

        # -------------------------------------------------
        # Sort by price
        # -------------------------------------------------

        cheapest = min(
            products,
            key=lambda product: product.get("price", float("inf"))
        )

        # -------------------------------------------------
        # Sort by rating
        # -------------------------------------------------

        highest_rated = max(
            products,
            key=lambda product: product.get("rating", 0)
        )

        # -------------------------------------------------
        # Calculate value score
        # -------------------------------------------------

        prices = [
            product.get("price", 0)
            for product in products
            if product.get("price", 0) > 0
        ]

        ratings = [
            product.get("rating", 0)
            for product in products
        ]

        max_price = max(prices) if prices else 1
        max_rating = max(ratings) if ratings else 5

        compared_products = []

        for product in products:

            price = product.get("price", 0)
            rating = product.get("rating", 0)

            # Lower price = better score
            price_score = 1 - (price / max_price)

            # Higher rating = better score
            rating_score = rating / max_rating

            # Overall value
            value_score = (
                price_score * 0.4 +
                rating_score * 0.6
            )

            updated_product = product.copy()

            updated_product["value_score"] = round(
                value_score,
                3
            )

            compared_products.append(updated_product)

        # -------------------------------------------------
        # Best overall
        # -------------------------------------------------

        best_overall = max(
            compared_products,
            key=lambda product: product.get(
                "value_score",
                0
            )
        )

        return {
            "products": compared_products,
            "best_overall": best_overall,
            "cheapest": cheapest,
            "highest_rated": highest_rated
        }


product_comparator = ProductComparator()