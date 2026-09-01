from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from products import products


class ProductSearchEngine:

    def __init__(self, product_catalog):
        self.products = product_catalog

        # Build searchable text for every product
        self.documents = [
            f"{product.get('name', '')} "
            f"{product.get('category', '')} "
            f"{product.get('description', '')} "
            f"{product.get('platform', '')}"
            for product in self.products
        ]

        self.vectorizer = TfidfVectorizer(
            stop_words="english"
        )

        self.product_vectors = self.vectorizer.fit_transform(
            self.documents
        )

    def search(
        self,
        query,
        max_price=None,
        platform=None,
        limit=5
    ):

        query_vector = self.vectorizer.transform([query])

        similarities = cosine_similarity(
            query_vector,
            self.product_vectors
        )[0]

        results = []

        for index, score in enumerate(similarities):

            product = self.products[index].copy()

            # Price filter
            if max_price is not None:
                if product["price"] > max_price:
                    continue

            # Platform filter
            if platform is not None:
                if product.get("platform", "").lower() != platform.lower():
                    continue

            # Ignore irrelevant products
            if score <= 0:
                continue

            product["match_score"] = round(
                float(score),
                3
            )

            results.append(product)

        # Highest relevance first
        results.sort(
            key=lambda item: item["match_score"],
            reverse=True
        )

        return results[:limit]


search_engine = ProductSearchEngine(products)