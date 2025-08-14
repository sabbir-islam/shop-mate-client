import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const AddSale = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    if (!user?.email) {
      toast.error("Please log in to view products");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/products/${user.email}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchProducts();
    }
  }, [user?.email, fetchProducts]);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Add product to cart with custom quantity
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find((item) => item._id === product._id);
    const requestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (requestedQuantity > product.stock) {
      toast.warning(`Only ${product.stock} items available in stock`);
      return;
    }

    if (product.stock === 0) {
      toast.warning("Product is out of stock");
      return;
    }

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: requestedQuantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    
    toast.success(`${product.name} added to cart`);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const item = cart.find(item => item._id === productId);
    setCart(cart.filter((item) => item._id !== productId));
    if (item) {
      toast.info(`${item.name} removed from cart`);
    }
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (newQuantity > product.stock) {
      toast.warning(`Only ${product.stock} items available in stock`);
      return;
    }

    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Quick add function for different quantities
  const quickAdd = (product, quantity) => {
    addToCart(product, quantity);
  };

  // Calculate totals (using sellingPrice)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  // Submit sale
const handleSubmitSale = async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    toast.error("Please add products to cart");
    return;
  }

  if (!customerName.trim()) {
    toast.error("Please enter customer name");
    return;
  }

  // Validate stock availability before submitting
  for (const cartItem of cart) {
    const product = products.find(p => p._id === cartItem._id);
    if (cartItem.quantity > product.stock) {
      toast.error(`${product.name} has insufficient stock`);
      return;
    }
  }

  setSubmitting(true);
  try {
    // Calculate total profit
    const totalProfit = cart.reduce((sum, item) => {
      const profit = (item.sellingPrice - item.buyingPrice) * item.quantity;
      return sum + profit;
    }, 0);

    const saleData = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      products: cart.map((item) => {
        const itemProfit = (item.sellingPrice - item.buyingPrice) * item.quantity;
        return {
          productId: item._id,
          name: item.name,
          buyingPrice: item.buyingPrice,
          sellingPrice: item.sellingPrice,
          quantity: item.quantity,
          total: item.sellingPrice * item.quantity,
          profit: itemProfit
        };
      }),
      subtotal,
      discount,
      discountAmount,
      total,
      totalProfit,
      saleDate: new Date().toISOString(),
      soldBy: user.email,
    };

    const response = await fetch("http://localhost:5000/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saleData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      toast.success("Sale recorded successfully! Stock updated.");
      // Reset form
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setDiscount(0);
      // Refresh products to show updated stock
      fetchProducts();
    } else {
      toast.error(result.message || "Failed to record sale");
    }
  } catch (error) {
    console.error("Error submitting sale:", error);
    toast.error("Failed to submit sale");
  } finally {
    setSubmitting(false);
  }
};

  // Get available stock for a product considering cart items
  const getAvailableStock = (product) => {
    const cartItem = cart.find(item => item._id === product._id);
    return product.stock - (cartItem ? cartItem.quantity : 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-600">
            You need to be logged in to access the sales page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
            Add Sale
          </h1>
          <p className="text-gray-600 mt-2">
            Select products and create a new sale
          </p>
        </div>

        {/* Cart Summary Bar */}
        {cart.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  {cart.length} item(s) in cart
                </span>
              </div>
              <div className="text-blue-800 font-bold">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Products ({filteredProducts.length})
                </h2>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {searchTerm ? "No products found matching your search" : "No products found"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => {
                    const cartItem = cart.find(item => item._id === product._id);
                    const availableStock = getAvailableStock(product);
                    
                    return (
                      <div
                        key={product._id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          availableStock === 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        {/* Product Image */}
                        {product.image && (
                          <div className="mb-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {product.name}
                          </h3>
                          <span className="text-lg font-bold text-green-600">
                            ${product.sellingPrice}
                          </span>
                        </div>
                        
                        {product.description && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600 mb-1">
                          Category: {product.category}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          Total Stock: {product.stock}
                        </p>
                        {cartItem && (
                          <p className="text-sm text-blue-600 mb-1">
                            In Cart: {cartItem.quantity}
                          </p>
                        )}
                        <p className={`text-sm mb-3 ${availableStock === 0 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          Available: {availableStock}
                        </p>
                        
                        {/* Quick Add Buttons */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => quickAdd(product, 1)}
                              disabled={availableStock < 1}
                              className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => quickAdd(product, 5)}
                              disabled={availableStock < 5}
                              className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => quickAdd(product, 10)}
                              disabled={availableStock < 10}
                              className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              +10
                            </button>
                          </div>
                          
                          <button
                            onClick={() => addToCart(product, 1)}
                            disabled={availableStock === 0}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <PlusIcon className="h-4 w-4" />
                            {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart and Sale Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Cart & Sale Details
              </h2>

              {/* Customer Information */}
              <form onSubmit={handleSubmitSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Cart Items */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Cart Items ({cart.length})
                  </h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No items in cart
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-600">
                              ${item.sellingPrice} × {item.quantity} = ${(item.sellingPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="text-gray-500 hover:text-gray-700 p-1"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="text-gray-500 hover:text-gray-700 p-1"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 hover:text-red-700 ml-2 p-1"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Math.max(
                          0,
                          Math.min(100, parseFloat(e.target.value) || 0)
                        )
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({discount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || submitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Sale...
                    </>
                  ) : (
                    <>
                      <CurrencyDollarIcon className="h-5 w-5" />
                      Complete Sale (${total.toFixed(2)})
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSale;