import React, { useState, useEffect } from 'react';
import { Package, DollarSign, CheckCircle, XCircle, Calendar, User, Mail, Hash, Layers, Archive } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const ProductDetailsPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { productId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const Navigate = useNavigate();

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the product.');
            }

            toast.success('Product deleted successfully!'); // Show toast
            setShowModal(false);

            // Wait 1 second before navigating
            setTimeout(() => {
                Navigate('/');
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error('Error deleting product');
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${productId}`);

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error(`API endpoint returned ${contentType}. Check if /api/products/${productId} exists.`);
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
                }

                setProduct(data.product);

            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const getCategoryColor = (category) => {
        const colors = {
            'Electronics': 'bg-blue-50 text-blue-700 border-blue-200',
            'Clothing': 'bg-purple-50 text-purple-700 border-purple-200',
            'Food': 'bg-green-50 text-green-700 border-green-200'
        };
        return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
                    <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-6">
                        <XCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h2>
                    <p className="text-slate-600 leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="bg-slate-50 p-4 rounded-full w-fit mx-auto mb-6">
                        <Package className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">Product Not Found</h2>
                    <p className="text-slate-600">The requested product could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Main Product Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/50">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(product.category)} bg-white`}>
                                        <Layers className="w-4 h-4 inline mr-2" />
                                        {product.category}
                                    </span>
                                    <div className="flex items-center">
                                        {product.inStock ? (
                                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-400 mr-2" />
                                        )}
                                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${product.inStock ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold mb-6 leading-tight">
                                    {product.productName}
                                </h1>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center">
                                        <DollarSign className="h-8 w-8 text-green-300 mr-3" />
                                        <div>
                                            <p className="text-sm text-slate-300 font-medium">Price</p>
                                            <p className="text-3xl font-bold text-white">
                                                {product.price ? product.price.toFixed(2) : '0.00'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center">
                                        <Archive className="h-8 w-8 text-blue-300 mr-3" />
                                        <div>
                                            <p className="text-sm text-slate-300 font-medium">Available</p>
                                            <p className="text-3xl font-bold text-white">{product.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Description Section */}
                        {product.description && (
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                                    <Package className="h-6 w-6 text-indigo-600 mr-3" />
                                    Product Overview
                                </h2>
                                <p className="text-slate-700 leading-relaxed text-lg">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Product Details Grid */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                <Hash className="h-6 w-6 text-indigo-600 mr-3" />
                                Product Information
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Product ID</span>
                                            <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded-lg text-slate-800">
                                                {product._id}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Category</span>
                                            <span className="font-semibold text-slate-900">{product.category}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Unit Price</span>
                                            <span className="font-bold text-green-600 text-lg">
                                                ${product.price ? product.price.toFixed(2) : '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Stock Quantity</span>
                                            <span className="font-bold text-blue-600 text-lg">{product.quantity} units</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Availability</span>
                                            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.inStock ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600 font-medium">Total Value</span>
                                            <span className="font-bold text-indigo-600 text-lg">
                                                ${product.totalValue
                                                    ? product.totalValue.toFixed(2)
                                                    : (product.price * product.quantity).toFixed(2)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Creator Information */}
                        {product.createdBy && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                                    <User className="h-6 w-6 text-emerald-600 mr-3" />
                                    Creator Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 text-slate-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-slate-600 font-medium">Creator</p>
                                                <p className="font-semibold text-slate-900">{product.createdBy.username}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 text-slate-500 mr-3" />
                                            <div>
                                                <p className="text-sm text-slate-600 font-medium">Email</p>
                                                <p className="font-semibold text-slate-900">{product.createdBy.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {product.createdAt && (
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-slate-500 mr-3" />
                                                <div>
                                                    <p className="text-sm text-slate-600 font-medium">Created</p>
                                                    <p className="font-semibold text-slate-900">{formatDate(product.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {product.updatedAt && (
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-slate-500 mr-3" />
                                                <div>
                                                    <p className="text-sm text-slate-600 font-medium">Updated</p>
                                                    <p className="font-semibold text-slate-900">{formatDate(product.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className='flex justify-center items-center'>
                            {product?.createdBy._id === currentUser?._id && (
                                <div className="flex gap-3 mt-6">
                                    <button
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300"
                                    >
                                        <Link to={`/update-product/${product._id}`}>✏️ Edit</Link>

                                    </button>
                                    <Button
                                        color="failure"
                                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-md hover:from-red-600 hover:to-pink-700 transition duration-300"
                                        onClick={() => setShowModal(true)}

                                    >
                                        Delete Product
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)}
                popup
                size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are You Sure You want to delete this user?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                            onClick={handleDeleteProduct}>
                            Yes, I'm sure
                        </Button>
                        <Button
                            onClick={() => setShowModal(false)}
                        >No, cancel</Button>

                    </div>
                </ModalBody>

            </Modal>

        </div>
    );
};

export default ProductDetailsPage;