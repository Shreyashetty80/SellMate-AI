from real_product_search import search_real_products
from product_search import search_engine


def search_all_platforms(query, max_price=None):
    """
    Search real shopping platforms first.
    Fall back to the local SellMate catalog if the real API
    is unavailable.
    """

    # --------------------------------------------------
    # REAL PRODUCT SEARCH
    # --------------------------------------------------

    real_products = search_real_products(
        query=query,
        max_price=max_price
    )

    if real_products:
        return real_products

    # --------------------------------------------------
    # FALLBACK TO LOCAL CATALOG
    # --------------------------------------------------

    local_products = search_engine.search(
        query=query,
        max_price=max_price,
        limit=10
    )

    for product in local_products:
        product["platform"] = "SellMate Catalog"
        product["product_url"] = None
        product["image"] = None

    return local_products