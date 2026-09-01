class ContextManager:

    def __init__(self):
        self.context = {
            "category": None,
            "product_type": None,
            "budget": None,
            "platform": None,
            "last_products": [],
            "selected_product": None,
            "last_action": None
        }

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if value is not None:
                self.context[key] = value

    def get(self):
        return self.context

    def clear(self):
        self.context = {
            "category": None,
            "product_type": None,
            "budget": None,
            "platform": None,
            "last_products": [],
            "selected_product": None,
            "last_action": None
        }


context_manager = ContextManager()