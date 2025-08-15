import React, { useState, useEffect, use, useCallback } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { user } = use(AuthContext); // Get current user

  // Fetch products from API for current user
  const fetchProducts = useCallback(async () => {
    if (!user?.email) {
      setError("Please log in to view your products");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://shop-mate-server.vercel.app/products/${user.email}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">
                Manage your product inventory
              </p>
            </div>

            {/* Add Product Button */}
            <Link to={"/add-product"}>
              <button className="btn btn-primary flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                <PlusIcon className="h-5 w-5" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              Filter
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            /* Loading State */
            <div className="flex justify-center items-center py-12">
              <div className="loading loading-spinner loading-lg text-blue-600"></div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {error}
              </h3>
              <p className="text-gray-500 mb-6">
                Please check your internet connection and try again.
              </p>
              <button
                onClick={fetchProducts}
                className="btn btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first product to the inventory.
              </p>
              <Link to="/add-product">
                <button className="btn btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                  Add Your First Product
                </button>
              </Link>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products
                .filter(
                  (product) =>
                    product.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    product.description
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    product.category
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className="group border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image || "/api/placeholder/300/300"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/300";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3
                        className="font-semibold text-gray-900 truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-sm text-gray-600 line-clamp-2"
                        title={product.description}
                      >
                        {product.description}
                      </p>

                      {/* Category */}
                      {product.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {product.category}
                        </span>
                      )}

                      {/* Price and Stock */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          ৳{product.sellingPrice}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Link className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200" to={`/edit-product/${product._id}`}>
                        <button className="">
                          Edit
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Pagination (for when you have many products) */}
        {products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {Math.min(products.length, 12)}
                </span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                products
                {searchTerm && (
                  <span className="ml-2 text-blue-600">
                    (filtered by "{searchTerm}")
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchProducts}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  Refresh
                </button>
                {products.length > 12 && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
