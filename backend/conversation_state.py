# ===================================================
# CONVERSATION STATE
# ===================================================

# Stores the last recommended products for each user.
# This allows the user to say things like:
# "add it"
# "add that"
# "add the first one"

last_recommendations = {}


def save_recommendations(user_id, products):
    """
    Save the products recently recommended to a user.
    """

    last_recommendations[user_id] = products


def get_recommendations(user_id):
    """
    Get the user's most recent recommendations.
    """

    return last_recommendations.get(user_id, [])


def clear_recommendations(user_id):
    """
    Clear stored recommendations.
    """

    last_recommendations.pop(user_id, None)