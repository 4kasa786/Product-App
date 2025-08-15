import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductUpdateForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const id = productId || ''; // Handle case where productId is not provided
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        inStock: true,
        price: '',
        quantity: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const categories = [
        { value: '', label: 'Select Category' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Clothing', label: 'Clothing' },
        { value: 'Food', label: 'Food' }
    ];

    // Fetch existing product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'GET',
                    credentials: 'include', // This includes cookies in the request
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (response.ok) {
                    const result = await response.json();
                    console.log('API Response:', result); // Debug log

                    // Handle different response structures: result.product, result.data, or direct result
                    const product = result.product || result.data || result;
                    console.log('Product data:', product); // Debug log

                    setFormData({
                        productName: product.productName || '',
                        category: product.category || '',
                        inStock: product.inStock !== undefined ? product.inStock : true,
                        price: product.price ? product.price.toString() : '',
                        quantity: product.quantity ? product.quantity.toString() : '',
                        description: product.description || ''
                    });
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Failed to load product data' }));
                    console.error('Error response:', errorData);
                    showToast('error', errorData.message || 'Failed to load product data');
                    navigate('/');
                }
            } catch (error) {
                console.error('Network error:', error);
                showToast('error', 'Network error. Please try again.');
                navigate('/');
            } finally {
                setInitialLoading(false);
            }
        };

        if (id) {
            console.log('Fetching product with ID:', id);
            fetchProduct();
        } else {
            console.warn('No product ID provided');
            setInitialLoading(false);
        }
    }, [id, navigate]);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
    };

    const validateForm = () => {
        const newErrors = {};

        // Product name validation
        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        } else if (formData.productName.trim().length < 3) {
            newErrors.productName = 'Product name must be at least 3 characters';
        } else if (formData.productName.trim().length > 100) {
            newErrors.productName = 'Product name cannot exceed 100 characters';
        }

        // Category validation
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else {
            const price = parseFloat(formData.price);
            if (isNaN(price) || price < 0) {
                newErrors.price = 'Price cannot be negative';
            } else if (price > 100000) {
                newErrors.price = 'Price cannot exceed 100,000';
            }
        }

        // Quantity validation
        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else {
            const quantity = parseInt(formData.quantity);
            if (isNaN(quantity) || quantity < 1) {
                newErrors.quantity = 'Quantity must be at least 1';
            } else if (!Number.isInteger(quantity)) {
                newErrors.quantity = 'Quantity must be an integer';
            }
        }

        // Description validation
        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('error', 'Please fix the validation errors');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                credentials: 'include', // This includes cookies in the request
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity)
                })
            });

            console.log('Update response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                showToast('success', result.message || 'Product updated successfully!');

                // Navigate to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                const error = await response.json().catch(() => ({ message: 'Failed to update product' }));
                console.error('Update error:', error);
                showToast('error', error.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update network error:', error);
            showToast('error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const closeToast = () => {
        setToast({ show: false, type: '', message: '' });
    };

    const totalValue = formData.price && formData.quantity
        ? (parseFloat(formData.price) * parseInt(formData.quantity)).toFixed(2)
        : '0.00';

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                    <span>{toast.message}</span>
                    <button
                        onClick={closeToast}
                        className="ml-2 text-white hover:bg-black hover:bg-opacity-20 rounded px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Product</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.productName
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.productName && (
                                <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
                            )}
                        </div>

                        {/* Category and In Stock Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white ${errors.category
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            {/* In Stock */}
                            <div className="flex items-center pt-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Currently in stock
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Price and Quantity Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    max="100000"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.price
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="1"
                                    min="1"
                                    step="1"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.quantity
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                                )}
                            </div>
                        </div>

                        {/* Total Value Display */}
                        {(formData.price && formData.quantity) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Total Value:</span>
                                    <span className="text-2xl font-bold text-blue-600">${totalValue}</span>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter product description (optional)"
                                rows="4"
                                maxLength="1000"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${errors.description
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300'
                                    }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                                <p className="text-sm text-gray-500 ml-auto">
                                    {formData.description.length}/1000
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            {/* Cancel Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                            >
                                ❌ Cancel
                            </button>

                            {/* Update Product Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-all duration-300 transform ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 focus:ring-4 focus:ring-blue-200'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating Product...
                                    </div>
                                ) : (
                                    '🚀 Update Product'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductUpdateForm;