import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { 
  ArrowLeftIcon, 
  PhotoIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { AuthContext } from "../Provider/AuthProvider";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = use(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buyingPrice: '',
    sellingPrice: '',
    stock: '',
    category: '',
    image: ''
  });

  const categories = [
    'SmartPhone',
    'Laptop',
    'Tablet',
    'Headphones',
    'Camera',
    'Gaming',
    'Accessories',
    'Other'
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!user?.email) {
        setError("Please log in to edit products");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/products/${user.email}/${productId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const product = data[0];
            setFormData({
              name: product.name || '',
              description: product.description || '',
              buyingPrice: product.buyingPrice || '',
              sellingPrice: product.sellingPrice || '',
              stock: product.stock || '',
              category: product.category || '',
              image: product.image || ''
            });
          } else {
            setError("Product not found");
          }
        } else {
          setError("Failed to fetch product data");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email && productId) {
      fetchProduct();
    }
  }, [user?.email, productId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success message when user starts editing
    if (success) setSuccess(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.email) {
      setError("Please log in to update products");
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.sellingPrice || !formData.stock) {
      setError("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.sellingPrice) <= 0 || parseInt(formData.stock) < 0) {
      setError("Please enter valid price and stock values");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        buyingPrice: parseFloat(formData.buyingPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image.trim(),
        userEmail: user.email
      };

      const response = await fetch(
        `http://localhost:5000/products/${user.email}/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to connect to server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="loading loading-spinner loading-lg text-blue-600"></div>
          </div>
          <p className="text-center text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error && loading === false && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
            {error}
          </h3>
          <div className="flex gap-4 mt-6">
            <Link 
              to="/products" 
              className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Products
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/products"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update your product information</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-700 font-medium">Product updated successfully! Redirecting...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing and Inventory */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buying Price */}
                  <div>
                    <label htmlFor="buyingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Buying Price (৳)
                    </label>
                    <input
                      type="number"
                      id="buyingPrice"
                      name="buyingPrice"
                      value={formData.buyingPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Selling Price (৳) *
                    </label>
                    <input
                      type="number"
                      id="sellingPrice"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Stock */}
                  <div className="md:col-span-2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Profit Calculation */}
                {formData.buyingPrice && formData.sellingPrice && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Profit per unit:</span>
                      <span className={`text-sm font-semibold ${
                        (formData.sellingPrice - formData.buyingPrice) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        ৳{(formData.sellingPrice - formData.buyingPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Image</h2>
                
                {/* Image Preview */}
                <div className="mb-4">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/300/300";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image URL Input */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                to="/products"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center font-medium text-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white flex items-center justify-center gap-2`}
              >
                {saving ? (
                  <>
                    <div className="loading loading-spinner loading-sm"></div>
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;