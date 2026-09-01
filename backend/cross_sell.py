from products import products


# Products that naturally complement each other
CROSS_SELL_RULES = {
    "Running Shoes Pro": [
        "Running Socks Pack",
        "Smart Fitness Band"
    ],

    "Urban Laptop Backpack": [
        "Laptop Sleeve 15.6 inch",
        "Wireless Mouse"
    ],

    "Classic Canvas Backpack": [
        "Laptop Sleeve 15.6 inch",
        "Stainless Steel Water Bottle"
    ],

    "Wireless Bluetooth Headphones": [
        "Fast Charging Power Bank"
    ],

    "AirBeat Wireless Earbuds": [
        "Fast Charging Power Bank"
    ],

    "Smart Fitness Band": [
        "Running Socks Pack",
        "Running Shoes Pro"
    ],

    "Fast Charging Power Bank": [
        "Wireless Bluetooth Headphones",
        "AirBeat Wireless Earbuds"
    ]
}


def get_cross_sell_products(product_name, max_results=2):

    recommended_names = CROSS_SELL_RULES.get(
        product_name,
        []
    )

    recommendations = []

    for name in recommended_names:

        for product in products:

            if product["name"] == name:
                recommendations.append(product)
                break

    return recommendations[:max_results]