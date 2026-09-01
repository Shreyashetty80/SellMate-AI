from product_providers import search_all_platforms


class CommerceAgent:

    def understand_request(self, message):
        """
        Understand a user's shopping request.
        """

        text = message.lower().strip()

        return {
            "message": message,
            "intent": "shopping_search",
            "query": text
        }

    def extract_budget(self, message):
        """
        Try to detect a maximum budget from natural language.
        """

        import re

        patterns = [
            r"under\s*[₹rs.]?\s*(\d+(?:,\d+)?)",
            r"below\s*[₹rs.]?\s*(\d+(?:,\d+)?)",
            r"less than\s*[₹rs.]?\s*(\d+(?:,\d+)?)",
            r"within\s*[₹rs.]?\s*(\d+(?:,\d+)?)",
            r"budget\s*(?:of|is)?\s*[₹rs.]?\s*(\d+(?:,\d+)?)"
        ]

        for pattern in patterns:

            match = re.search(pattern, message.lower())

            if match:

                value = match.group(1).replace(",", "")

                return float(value)

        return None

    def clean_query(self, message):
        """
        Remove common shopping/budget words so the
        product search receives a cleaner query.
        """

        import re

        query = message.lower()

        # Remove budget expressions
        query = re.sub(
            r"under\s*[₹rs.]?\s*\d+(?:,\d+)?",
            "",
            query
        )

        query = re.sub(
            r"below\s*[₹rs.]?\s*\d+(?:,\d+)?",
            "",
            query
        )

        query = re.sub(
            r"less than\s*[₹rs.]?\s*\d+(?:,\d+)?",
            "",
            query
        )

        query = re.sub(
            r"within\s*[₹rs.]?\s*\d+(?:,\d+)?",
            "",
            query
        )

        query = re.sub(
            r"budget\s*(?:of|is)?\s*[₹rs.]?\s*\d+(?:,\d+)?",
            "",
            query
        )

        # Remove common conversational words
        remove_words = [
            "i want",
            "i need",
            "i am looking for",
            "looking for",
            "find me",
            "show me",
            "search for",
            "search",
            "please",
            "can you find",
            "can you show",
            "give me",
            "get me",
            "buy me"
        ]

        for word in remove_words:
            query = query.replace(word, "")

        return query.strip()

    def generate_response(self, message):
        """
        Main shopping intelligence.
        """

        budget = self.extract_budget(message)

        query = self.clean_query(message)

        # If cleaning removed too much, use original message
        if not query:
            query = message

        # Search real shopping platforms
        products = search_all_platforms(
            query=query,
            max_price=budget
        )

        # ------------------------------------------------
        # RESPONSE
        # ------------------------------------------------

        if not products:

            if budget:

                response = (
                    f"I couldn't find products matching "
                    f"'{query}' within ₹{int(budget)}."
                )

            else:

                response = (
                    f"I couldn't find products matching "
                    f"'{query}'. Try another product or "
                    f"add a budget."
                )

            return {
                "response": response,
                "products": [],
                "query": query,
                "budget": budget
            }

        # Sort cheapest first
        products = sorted(
            products,
            key=lambda product: product.get("price", 999999)
        )

        # Limit results
        products = products[:10]

        # ------------------------------------------------
        # BUILD SMART RESPONSE
        # ------------------------------------------------

        if budget:

            response = (
                f"I found {len(products)} products for "
                f"'{query}' under ₹{int(budget)}."
            )

        else:

            response = (
                f"I found {len(products)} products for "
                f"'{query}' across shopping platforms."
            )

        # Best price
        cheapest = products[0]

        response += (
            f"\n\n💰 Best price: ₹{cheapest.get('price')} "
            f"on {cheapest.get('platform', 'shopping platform')}."
        )

        # Best rated
        rated_products = [
            p for p in products
            if p.get("rating") is not None
        ]

        if rated_products:

            best_rated = max(
                rated_products,
                key=lambda p: p.get("rating", 0)
            )

            response += (
                f"\n⭐ Best rated: "
                f"{best_rated.get('name')} "
                f"({best_rated.get('rating')}/5)."
            )

        return {
            "response": response,
            "products": products,
            "query": query,
            "budget": budget
        }


# ----------------------------------------------------
# GLOBAL AGENT
# ----------------------------------------------------

commerce_agent = CommerceAgent()