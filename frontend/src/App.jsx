import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState({
    user_id: "demo_user",
    items: [],
    total_items: 0,
    subtotal: 0,
  });

  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // =========================================================
  // COMPARISON STATE
  // =========================================================

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparison, setComparison] = useState(null);

  const userId = "demo_user";

  // =========================================================
  // LOAD PRODUCTS + CART
  // =========================================================

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);

      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Unable to load products:", error);
    }
  };

  // =========================================================
  // LOAD CART
  // =========================================================

  const loadCart = async () => {
    try {
      const response = await axios.get(`${API}/cart/${userId}`);

      if (response.data.cart) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    }
  };

  // =========================================================
  // GET PRODUCT ID
  // =========================================================

  const getProductId = (product) => {
    return (
      product.id ||
      product.product_id ||
      `${product.name}-${product.platform || ""}`
    );
  };

  // =========================================================
  // TOGGLE PRODUCT FOR COMPARISON
  // =========================================================

  const toggleCompareProduct = (product) => {
    const productId = getProductId(product);

    setSelectedProducts((previous) => {
      const alreadySelected = previous.some(
        (item) => getProductId(item) === productId
      );

      if (alreadySelected) {
        return previous.filter(
          (item) => getProductId(item) !== productId
        );
      }

      // Maximum 4 products
      if (previous.length >= 4) {
        alert("You can compare up to 4 products.");
        return previous;
      }

      return [...previous, product];
    });
  };

  // =========================================================
  // CHECK IF PRODUCT IS SELECTED
  // =========================================================

  const isSelectedForComparison = (product) => {
    const productId = getProductId(product);

    return selectedProducts.some(
      (item) => getProductId(item) === productId
    );
  };

  // =========================================================
  // CALCULATE DISCOUNT
  // =========================================================

  const getDiscount = (product) => {
    const mrp = Number(product.mrp || 0);
    const price = Number(product.price || 0);

    if (mrp > price && mrp > 0) {
      return Math.round(((mrp - price) / mrp) * 100);
    }

    return 0;
  };

  // =========================================================
  // COMPARE PRODUCTS
  // =========================================================

  const compareSelectedProducts = () => {
    if (selectedProducts.length < 2) {
      alert("Please select at least 2 products to compare.");
      return;
    }

    const prices = selectedProducts
      .map((product) => Number(product.price || 0))
      .filter((price) => price > 0);

    const ratings = selectedProducts.map((product) =>
      Number(product.rating || 0)
    );

    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1;

    const maxRating =
      ratings.length > 0 ? Math.max(...ratings) : 5;

    const comparedProducts = selectedProducts.map((product) => {
      const price = Number(product.price || 0);
      const rating = Number(product.rating || 0);

      const priceScore =
        maxPrice > 0 ? 1 - price / maxPrice : 0;

      const ratingScore =
        maxRating > 0 ? rating / maxRating : 0;

      const valueScore =
        priceScore * 0.4 + ratingScore * 0.6;

      return {
        ...product,
        value_score: Number(valueScore.toFixed(3)),
      };
    });

    const cheapest = [...comparedProducts].sort(
      (a, b) =>
        Number(a.price || Infinity) -
        Number(b.price || Infinity)
    )[0];

    const highestRated = [...comparedProducts].sort(
      (a, b) =>
        Number(b.rating || 0) -
        Number(a.rating || 0)
    )[0];

    const bestOverall = [...comparedProducts].sort(
      (a, b) =>
        Number(b.value_score || 0) -
        Number(a.value_score || 0)
    )[0];

    setComparison({
      products: comparedProducts,
      cheapest,
      highestRated,
      bestOverall,
    });

    // Scroll to comparison section
    setTimeout(() => {
      const comparisonElement =
        document.getElementById("comparison-section");

      if (comparisonElement) {
        comparisonElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // =========================================================
  // CLEAR COMPARISON
  // =========================================================

  const clearComparison = () => {
    setSelectedProducts([]);
    setComparison(null);
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();
    const lowerMessage = userMessage.toLowerCase();

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      // =====================================================
      // SHOW CART
      // =====================================================

      if (
        lowerMessage.includes("show my cart") ||
        lowerMessage.includes("show cart") ||
        lowerMessage.includes("view cart") ||
        lowerMessage === "my cart" ||
        lowerMessage.includes("check cart") ||
        lowerMessage.includes("what is in my cart")
      ) {
        const response = await axios.get(
          `${API}/cart/${userId}`
        );

        const cartData = response.data.cart;

        let cartMessage = "";

        if (
          !cartData.items ||
          cartData.items.length === 0
        ) {
          cartMessage =
            "🛒 Your cart is currently empty.";
        } else {
          cartMessage =
            `🛒 You have ${cartData.total_items} item${
              cartData.total_items !== 1 ? "s" : ""
            } in your cart.\n\n`;

          cartData.items.forEach((item, index) => {
            cartMessage +=
              `${index + 1}. ${item.name} — ₹${item.price} × ${item.quantity}\n`;
          });

          cartMessage +=
            `\n💰 Subtotal: ₹${cartData.subtotal}`;
        }

        setCart(cartData);

        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text: cartMessage,
            products: [],
          },
        ]);

        return;
      }

      // =====================================================
      // CLEAR CART
      // =====================================================

      if (
        lowerMessage.includes("clear cart") ||
        lowerMessage.includes("clear my cart") ||
        lowerMessage.includes("empty cart") ||
        lowerMessage.includes("empty my cart")
      ) {
        const response = await axios.delete(
          `${API}/cart/${userId}`
        );

        if (response.data.cart) {
          setCart(response.data.cart);
        }

        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text:
              "🛒 Your cart has been cleared successfully.",
            products: [],
          },
        ]);

        return;
      }

      // =====================================================
      // REMOVE PRODUCT FROM CART
      // =====================================================

      if (
        lowerMessage.includes("remove") ||
        lowerMessage.includes("delete")
      ) {
        const cartResponse = await axios.get(
          `${API}/cart/${userId}`
        );

        const currentCart = cartResponse.data.cart;

        let productToRemove = null;

        for (const item of currentCart.items || []) {
          const itemName = item.name.toLowerCase();

          if (lowerMessage.includes(itemName)) {
            productToRemove = item;
            break;
          }

          const words = itemName.split(" ");

          if (
            words.some(
              (word) =>
                word.length > 3 &&
                lowerMessage.includes(word)
            )
          ) {
            productToRemove = item;
            break;
          }
        }

        if (!productToRemove) {
          setMessages((previous) => [
            ...previous,
            {
              type: "ai",
              text:
                "I couldn't identify which product you want to remove. Please mention the product name.",
              products: [],
            },
          ]);

          return;
        }

        const response = await axios.delete(
          `${API}/cart/${userId}/item/${productToRemove.product_id}`
        );

        if (response.data.cart) {
          setCart(response.data.cart);
        }

        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text:
              `🗑️ ${productToRemove.name} has been removed from your cart.`,
            products: [],
          },
        ]);

        return;
      }

      // =====================================================
      // ADD PRODUCT USING CHAT
      // =====================================================

      if (
        lowerMessage.startsWith("add ") ||
        lowerMessage.startsWith("buy ") ||
        lowerMessage.startsWith("purchase ")
      ) {
        let productToAdd = null;

        for (const product of products) {
          if (
            lowerMessage.includes(
              product.name.toLowerCase()
            )
          ) {
            productToAdd = product;
            break;
          }
        }

        if (productToAdd) {
          await addProduct(productToAdd);
          return;
        }
      }

      // =====================================================
      // NORMAL AI SHOPPING REQUEST
      // =====================================================

      const response = await axios.post(
        `${API}/agent/recommend`,
        {
          message: userMessage,
          user_id: userId,
        }
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            response.data.response ||
            "I couldn't find a suitable recommendation.",
          products:
            response.data.products || [],
        },
      ]);
    } catch (error) {
      console.error("Request error:", error);

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            "Sorry, I couldn't connect to the SellMate AI backend. Please make sure FastAPI is running.",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ADD PRODUCT TO CART
  // =========================================================

  const addProduct = async (product) => {
    setCartLoading(true);

    try {
      const response = await axios.post(
        `${API}/cart/add`,
        {
          user_id: userId,

          product_id:
            product.id ||
            product.product_id ||
            `product_${Date.now()}`,

          name: product.name || "Unknown Product",

          brand: product.brand || "",

          platform:
            product.platform || "SellMate",

          price: Number(product.price || 0),

          mrp:
            product.mrp !== undefined &&
            product.mrp !== null
              ? Number(product.mrp)
              : null,

          rating:
            product.rating !== undefined &&
            product.rating !== null
              ? Number(product.rating)
              : null,

          rating_count:
            product.rating_count !== undefined &&
            product.rating_count !== null
              ? Number(product.rating_count)
              : 0,

          image: product.image || "",

          product_url:
            product.product_url || "",

          available:
            product.available !== undefined
              ? Boolean(product.available)
              : true,

          quantity: 1,
        }
      );

      if (response.data.cart) {
        setCart(response.data.cart);
      }

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            `🛒 ${product.name} has been added to your SellMate cart.`,
          products: [],
        },
      ]);
    } catch (error) {
      console.error(
        "Unable to add product:",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text:
            "Unable to add the product to the cart.",
          products: [],
        },
      ]);
    } finally {
      setCartLoading(false);
    }
  };

  // =========================================================
  // OPEN PRODUCT
  // =========================================================

  const openProduct = (product) => {
    if (!product.product_url) {
      return;
    }

    window.open(
      product.product_url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // CLEAR CHAT
  // =========================================================

  const clearChat = () => {
    setMessages([]);
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = async () => {
    try {
      const response = await axios.delete(
        `${API}/cart/${userId}`
      );

      if (response.data.cart) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error(
        "Unable to clear cart:",
        error
      );

      alert("Unable to clear cart.");
    }
  };

  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // =========================================================
  // PRODUCT ICON
  // =========================================================

  const getProductIcon = (category) => {
    if (category === "Fitness") {
      return "👟";
    }

    if (category === "Bags") {
      return "🎒";
    }

    if (category === "Electronics") {
      return "🎧";
    }

    if (category === "Fashion") {
      return "👕";
    }

    if (category === "Accessories") {
      return "🛍️";
    }

    return "🛍️";
  };

  // =========================================================
  // PLATFORM LABEL
  // =========================================================

  const getPlatformLabel = (platform) => {
    if (!platform) {
      return "SellMate";
    }

    return platform;
  };

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price unavailable";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            🛍️
          </div>

          <div>
            <h1>SellMate AI</h1>

            <p>
              AI-Powered Shopping Comparison Assistant
            </p>
          </div>

        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI Online
        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="main">

        {/* ===================================================
            LEFT CHAT
        =================================================== */}

        <section className="chat-section">

          <div className="section-header">

            <div>
              <h2>
                Shopping Assistant
              </h2>

              <p>
                Search products across shopping platforms.
              </p>
            </div>

            <button
              className="clear-chat"
              onClick={clearChat}
            >
              Clear Chat
            </button>

          </div>


          {/* =================================================
              WELCOME
          ================================================= */}

          {messages.length === 0 && (

            <div className="welcome">

              <div className="robot">
                🤖
              </div>

              <h2>
                Hi! I'm SellMate AI 👋
              </h2>

              <p>
                Tell me what you want to buy and I'll
                help you find real products, compare
                prices and choose the best option.
              </p>

              <div className="examples">

                <button
                  onClick={() =>
                    setMessage(
                      "I need running shoes under 3000"
                    )
                  }
                >
                  👟 Running shoes under ₹3000
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "I need a college bag under 1500"
                    )
                  }
                >
                  🎒 College bag under ₹1500
                </button>

                <button
                  onClick={() =>
                    setMessage(
                      "Show me wireless headphones"
                    )
                  }
                >
                  🎧 Wireless headphones
                </button>

                <button
                  onClick={() =>
                    setMessage("Show my cart")
                  }
                >
                  🛒 Show my cart
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              CHAT MESSAGES
          ================================================= */}

          <div className="messages">

            {messages.map((item, index) => (

              <div
                key={index}
                className={`message-row ${item.type}`}
              >

                <div className="avatar">
                  {item.type === "user"
                    ? "👤"
                    : "🤖"}
                </div>

                <div className="message-content">

                  <div className="message-bubble">
                    {item.text}
                  </div>


                  {/* =================================================
                      PRODUCTS
                  ================================================= */}

                  {item.products &&
                    item.products.length > 0 && (

                      <div className="recommendations">

                        {item.products.map(
                          (product, productIndex) => {

                            const discount =
                              getDiscount(product);

                            const selected =
                              isSelectedForComparison(
                                product
                              );

                            return (

                              <div
                                className={`product-card ${
                                  selected
                                    ? "compare-selected"
                                    : ""
                                }`}
                                key={
                                  getProductId(product) ||
                                  `${product.name}-${productIndex}`
                                }
                              >

                                {/* PRODUCT IMAGE */}

                                <div className="product-image-container">

                                  {product.image ? (

                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="product-image"
                                      onError={(event) => {

                                        event.currentTarget.style.display =
                                          "none";

                                        if (
                                          event.currentTarget
                                            .nextSibling
                                        ) {
                                          event.currentTarget
                                            .nextSibling
                                            .style.display =
                                            "flex";
                                        }

                                      }}
                                    />

                                  ) : null}

                                  <div
                                    className="product-image-fallback"
                                    style={{
                                      display:
                                        product.image
                                          ? "none"
                                          : "flex",
                                    }}
                                  >
                                    {getProductIcon(
                                      product.category
                                    )}
                                  </div>

                                </div>


                                {/* PRODUCT INFO */}

                                <div className="product-info">

                                  {/* PLATFORM + BRAND */}

                                  <div className="platform-row">

                                    <span className="platform">
                                      🏪{" "}
                                      {getPlatformLabel(
                                        product.platform
                                      )}
                                    </span>

                                    {product.brand && (
                                      <span className="brand-name">
                                        {product.brand}
                                      </span>
                                    )}

                                  </div>


                                  {/* PRODUCT NAME */}

                                  <h3>
                                    {product.name}
                                  </h3>


                                  {/* DESCRIPTION */}

                                  {product.description && (
                                    <p>
                                      {product.description}
                                    </p>
                                  )}


                                  {/* RATING */}

                                  <div className="rating-row">

                                    ⭐{" "}

                                    {product.rating !==
                                      undefined &&
                                    product.rating !==
                                      null &&
                                    Number(product.rating) >
                                      0
                                      ? Number(
                                          product.rating
                                        ).toFixed(1)
                                      : "N/A"}

                                    {product.rating_count !==
                                      undefined &&
                                    product.rating_count !==
                                      null && (

                                      <span className="review-count">

                                        (
                                        {Number(
                                          product.rating_count
                                        ).toLocaleString(
                                          "en-IN"
                                        )}{" "}
                                        reviews)

                                      </span>

                                    )}

                                  </div>


                                  {/* PRICE */}

                                  <div className="price-row">

                                    <strong>
                                      {formatPrice(
                                        product.price
                                      )}
                                    </strong>

                                    {product.mrp &&
                                      Number(product.mrp) >
                                        Number(
                                          product.price
                                        ) && (

                                        <>
                                          <span className="mrp">
                                            MRP{" "}
                                            {formatPrice(
                                              product.mrp
                                            )}
                                          </span>

                                          <span className="discount">
                                            {discount}% OFF
                                          </span>
                                        </>

                                      )}

                                  </div>


                                  {/* AVAILABILITY */}

                                  <div className="availability">

                                    {product.available !==
                                      false ? (
                                      "✓ In Stock"
                                    ) : (
                                      "✕ Out of Stock"
                                    )}

                                  </div>


                                  {/* =================================================
                                      ACTIONS
                                  ================================================= */}

                                  <div className="product-actions">

                                    {/* BUY NOW */}

                                    {product.product_url && (
                                      <button
                                        className="buy-button"
                                        onClick={() =>
                                          openProduct(product)
                                        }
                                      >
                                        🛒 Buy Now
                                      </button>
                                    )}


                                    {/* ADD TO CART */}

                                    <button
                                      className="add-button"
                                      disabled={
                                        cartLoading ||
                                        product.available ===
                                          false
                                      }
                                      onClick={() =>
                                        addProduct(product)
                                      }
                                    >
                                      + Add to Cart
                                    </button>

                                  </div>


                                  {/* =================================================
                                      COMPARE CHECKBOX
                                  ================================================= */}

                                  <label className="compare-checkbox">

                                    <input
                                      type="checkbox"
                                      checked={selected}
                                      onChange={() =>
                                        toggleCompareProduct(
                                          product
                                        )
                                      }
                                    />

                                    <span>
                                      ⚖️ Compare
                                    </span>

                                  </label>

                                </div>

                              </div>

                            );
                          }
                        )}

                      </div>

                    )}

                </div>

              </div>

            ))}


            {/* LOADING */}

            {loading && (

              <div className="message-row ai">

                <div className="avatar">
                  🤖
                </div>

                <div className="typing">
                  SellMate AI is searching shopping
                  platforms...
                </div>

              </div>

            )}

          </div>


          {/* =================================================
              COMPARISON CONTROLS
          ================================================= */}

          {selectedProducts.length > 0 && (

            <div className="comparison-controls">

              <div>
                <strong>
                  ⚖️ {selectedProducts.length}
                  {" "}
                  product
                  {selectedProducts.length !== 1
                    ? "s"
                    : ""} selected
                </strong>

                <span>
                  Select 2–4 products to compare.
                </span>
              </div>

              <div className="comparison-buttons">

                <button
                  className="compare-button"
                  onClick={compareSelectedProducts}
                  disabled={
                    selectedProducts.length < 2
                  }
                >
                  ⚖️ Compare Selected
                </button>

                <button
                  className="cancel-compare-button"
                  onClick={clearComparison}
                >
                  Clear Selection
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              INPUT
          ================================================= */}

          <div className="input-area">

            <input
              type="text"
              placeholder="Ask me anything... e.g. laptop under ₹50000"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              disabled={
                loading ||
                !message.trim()
              }
            >
              Send
            </button>

          </div>

        </section>


        {/* ===================================================
            RIGHT CART
        =================================================== */}

        <aside className="cart-section">

          <div className="cart-header">

            <div>

              <h2>
                🛒 Your Cart
              </h2>

              <p>
                {cart.total_items || 0} item
                {(cart.total_items || 0) !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>


          {/* CART ITEMS */}

          {cart.items &&
          cart.items.length > 0 ? (

            <>

              <div className="cart-items">

                {cart.items.map((item) => (

                  <div
                    className="cart-item"
                    key={item.product_id}
                  >

                    <div className="cart-product-icon">
                      🛍️
                    </div>

                    <div className="cart-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹{item.price} ×{" "}
                        {item.quantity}
                      </p>

                    </div>

                    <strong>
                      ₹
                      {Number(item.price) *
                        Number(item.quantity)}
                    </strong>

                  </div>

                ))}

              </div>


              {/* CART SUMMARY */}

              <div className="cart-summary">

                <div>

                  <span>
                    Items
                  </span>

                  <strong>
                    {cart.total_items}
                  </strong>

                </div>


                <div className="subtotal">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹{cart.subtotal}
                  </strong>

                </div>


                <button
                  className="clear-cart"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>

              </div>

            </>

          ) : (

            <div className="empty-cart">

              <div>
                🛒
              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Search for products and add
                them to your SellMate cart.
              </p>

            </div>

          )}

        </aside>

      </main>


      {/* =====================================================
          COMPARISON RESULT
      ===================================================== */}

      {comparison && (

        <section
          id="comparison-section"
          className="comparison-section"
        >

          <div className="comparison-header">

            <div>
              <h2>
                ⚖️ Product Comparison
              </h2>

              <p>
                Compare selected products and choose
                the best option.
              </p>
            </div>

            <button
              className="clear-comparison"
              onClick={clearComparison}
            >
              Clear Comparison
            </button>

          </div>


          {/* =================================================
              HIGHLIGHTS
          ================================================= */}

          <div className="comparison-highlights">

            {/* BEST OVERALL */}

            {comparison.bestOverall && (

              <div className="highlight-card">

                <div className="highlight-icon">
                  🏆
                </div>

                <div>

                  <span>
                    Best Overall
                  </span>

                  <strong>
                    {comparison.bestOverall.name}
                  </strong>

                  <small>
                    Value Score:{" "}
                    {comparison.bestOverall.value_score}
                  </small>

                </div>

              </div>

            )}


            {/* CHEAPEST */}

            {comparison.cheapest && (

              <div className="highlight-card">

                <div className="highlight-icon">
                  💰
                </div>

                <div>

                  <span>
                    Cheapest
                  </span>

                  <strong>
                    {comparison.cheapest.name}
                  </strong>

                  <small>
                    {formatPrice(
                      comparison.cheapest.price
                    )}
                  </small>

                </div>

              </div>

            )}


            {/* HIGHEST RATED */}

            {comparison.highestRated && (

              <div className="highlight-card">

                <div className="highlight-icon">
                  ⭐
                </div>

                <div>

                  <span>
                    Highest Rated
                  </span>

                  <strong>
                    {comparison.highestRated.name}
                  </strong>

                  <small>
                    {Number(
                      comparison.highestRated.rating || 0
                    ).toFixed(1)}{" "}
                    / 5
                  </small>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              COMPARISON TABLE
          ================================================= */}

          <div className="comparison-table-container">

            <table className="comparison-table">

              <thead>

                <tr>

                  <th>
                    Feature
                  </th>

                  {comparison.products.map(
                    (product) => (

                      <th
                        key={getProductId(product)}
                      >

                        <div className="comparison-product-name">

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="comparison-product-icon">
                              {getProductIcon(
                                product.category
                              )}
                            </div>
                          )}

                          <span>
                            {product.name}
                          </span>

                        </div>

                      </th>

                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {/* BRAND */}

                <tr>

                  <td>
                    🏢 Brand
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >
                        {product.brand || "N/A"}
                      </td>

                    )
                  )}

                </tr>


                {/* PLATFORM */}

                <tr>

                  <td>
                    🏪 Platform
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >
                        {getPlatformLabel(
                          product.platform
                        )}
                      </td>

                    )
                  )}

                </tr>


                {/* PRICE */}

                <tr>

                  <td>
                    💰 Price
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >
                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>
                      </td>

                    )
                  )}

                </tr>


                {/* MRP */}

                <tr>

                  <td>
                    💵 MRP
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >
                        {formatPrice(
                          product.mrp
                        )}
                      </td>

                    )
                  )}

                </tr>


                {/* DISCOUNT */}

                <tr>

                  <td>
                    🔖 Discount
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        {getDiscount(product) > 0
                          ? `${getDiscount(product)}% OFF`
                          : "No discount"}

                      </td>

                    )
                  )}

                </tr>


                {/* RATING */}

                <tr>

                  <td>
                    ⭐ Rating
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        {Number(
                          product.rating || 0
                        ) > 0
                          ? `${Number(
                              product.rating
                            ).toFixed(1)} / 5`
                          : "N/A"}

                      </td>

                    )
                  )}

                </tr>


                {/* REVIEWS */}

                <tr>

                  <td>
                    👥 Reviews
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        {Number(
                          product.rating_count || 0
                        ).toLocaleString("en-IN")}

                      </td>

                    )
                  )}

                </tr>


                {/* AVAILABILITY */}

                <tr>

                  <td>
                    ✅ Availability
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        {product.available !== false
                          ? "✓ In Stock"
                          : "✕ Out of Stock"}

                      </td>

                    )
                  )}

                </tr>


                {/* VALUE SCORE */}

                <tr>

                  <td>
                    🏆 Value Score
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        <strong>
                          {product.value_score}
                        </strong>

                      </td>

                    )
                  )}

                </tr>


                {/* BUY */}

                <tr>

                  <td>
                    🛒 Action
                  </td>

                  {comparison.products.map(
                    (product) => (

                      <td
                        key={getProductId(product)}
                      >

                        <div className="comparison-actions">

                          {product.product_url && (
                            <button
                              className="buy-button"
                              onClick={() =>
                                openProduct(product)
                              }
                            >
                              Buy Now
                            </button>
                          )}

                          <button
                            className="add-button"
                            onClick={() =>
                              addProduct(product)
                            }
                            disabled={
                              cartLoading ||
                              product.available === false
                            }
                          >
                            Add to Cart
                          </button>

                        </div>

                      </td>

                    )
                  )}

                </tr>

              </tbody>

            </table>

          </div>

        </section>

      )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <span>
          SellMate AI
        </span>

        <span>
          Compare products. Choose smarter.
        </span>

      </footer>

    </div>
  );
}

export default App;