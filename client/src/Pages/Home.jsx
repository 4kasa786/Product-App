import { Table, TableHead, TableBody, TableCell, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import React, { useEffect, useState, useCallback } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaSync } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const DashProducts = () => {
    const [products, setProducts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 5,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchProducts = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/products?page=${page}&limit=5`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                if (data.data && data.data.products && Array.isArray(data.data.products)) {
                    setProducts(data.data.products);
                    setPagination(data.data.pagination);
                    setShowMore(data.data.pagination.hasNextPage);
                } else {
                    setProducts([]);
                    setPagination({
                        currentPage: 1,
                        totalPages: 1,
                        totalCount: 0,
                        limit: 5,
                        hasNextPage: false,
                        hasPrevPage: false
                    });
                    setShowMore(false);
                }
            } else {
                throw new Error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
            setProducts([]);
            setShowMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleProductGenerated = (e) => {
            if (e.detail) {
                setProducts(prev => [e.detail, ...prev]);
            }
        };
        window.addEventListener('product-generated', handleProductGenerated);
        return () => window.removeEventListener('product-generated', handleProductGenerated);
    }, []);

    const handleGenerateProduct = async () => {
        try {
            setIsGenerating(true);

            // Step 1: Generate product via AI
            const genRes = await fetch('/api/products/generate', {
                method: 'POST',
                credentials: 'include',
            });

            if (!genRes.ok) {
                const errorData = await genRes.json();
                throw new Error(errorData.message || `HTTP error! status: ${genRes.status}`);
            }

            const genData = await genRes.json();

            if (!genData.success || !genData.generatedProduct) {
                throw new Error('Failed to generate product - invalid response');
            }

            // Step 2: Save product to DB
            const createRes = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(genData.generatedProduct),
            });

            if (!createRes.ok) {
                const errorData = await createRes.json();
                throw new Error(errorData.message || `HTTP error! status: ${createRes.status}`);
            }

            const createdProductData = await createRes.json();

            // Debug: Log the response to see its structure
            console.log('Created product response:', createdProductData);
            console.log('Generated product data:', genData.generatedProduct);

            // Check if the product was created successfully
            if (createRes.ok && (createdProductData.success || createdProductData.message?.includes('successfully'))) {
                toast.success('Product generated successfully!');

                // Handle different possible response structures
                const newProduct = createdProductData.product ||
                    createdProductData.data?.product ||
                    createdProductData.data ||
                    createdProductData; // sometimes the product data is at root level

                // If we have product data, add it to state
                if (newProduct && newProduct._id) {
                    setProducts(prev => [newProduct, ...prev]);

                    // Update pagination info to reflect the new product
                    setPagination(prev => ({
                        ...prev,
                        totalCount: prev.totalCount + 1,
                        totalPages: Math.ceil((prev.totalCount + 1) / prev.limit)
                    }));

                    // If we're on the first page, maintain page size
                    if (pagination.currentPage === 1) {
                        setProducts(prev => prev.slice(0, pagination.limit));
                    }
                } else {
                    // If no product data with _id, create a temporary object for display
                    // and refresh to get accurate data
                    console.warn('Product created but no complete product data returned, refreshing list...');

                    // Add generated product temporarily (it might not have _id)
                    const tempProduct = {
                        ...genData.generatedProduct,
                        _id: 'temp-' + Date.now(),
                        createdAt: new Date().toISOString(),
                        totalValue: genData.generatedProduct.price * genData.generatedProduct.quantity
                    };

                    setProducts(prev => [tempProduct, ...prev]);

                    // Refresh after a short delay to get the real data
                    setTimeout(() => {
                        fetchProducts(pagination.currentPage);
                    }, 1000);
                }

            } else {
                throw new Error(createdProductData.message || 'Failed to create product in database');
            }
        } catch (err) {
            console.error('Error generating product:', err);
            toast.error(err.message || 'Something went wrong while generating product');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProducts(newPage);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const { currentPage, totalPages } = pagination;

        if (totalPages > 1) {
            pages.push(1);
        }

        if (currentPage > 3) {
            pages.push('...');
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages.map((page, index) => {
            if (page === '...') {
                return (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                        ...
                    </span>
                );
            }

            return (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                >
                    {page}
                </button>
            );
        });
    };

    // Auto-refresh when component becomes visible
    useEffect(() => {
        fetchProducts(1);
    }, []);

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto w-full p-3 min-h-screen scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            <div className='flex flex-col lg:p-10 p-3 max-w-6xl mx-auto'>
                <h1 className='text-3xl font-bold lg:text-6xl text-center'>Welcome to my Products</h1>
                <p className='text-gray-500 text-xs sm:text-sm text-center mt-2'>A smart product management app with AI-powered descriptions, secure auth, and powerful search & filter tools.</p>
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleGenerateProduct}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:bg-gradient-to-br"
                    >
                        {isGenerating ? <FaSpinner className="animate-spin mr-2" /> : null}
                        {isGenerating ? 'Generating...' : 'Generate Product'}
                    </Button>
                </div>
            </div>

            {(isLoading || isGenerating) ? (
                <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
                    <span className="text-gray-600 text-lg">{isGenerating ? 'Generating product...' : 'Loading products...'}</span>
                </div>
            ) : products.length > 0 ? (
                <>
                    <Table className="shadow-md mt-4">
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Date Created</TableHeadCell>
                                <TableHeadCell>Product Name</TableHeadCell>
                                <TableHeadCell>Category</TableHeadCell>
                                <TableHeadCell>Price</TableHeadCell>
                                <TableHeadCell>Quantity</TableHeadCell>
                                <TableHeadCell>Total Value</TableHeadCell>
                                <TableHeadCell>In Stock</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map(product => (
                                <TableRow key={product?._id}>
                                    <TableCell>{new Date(product?.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Link to={`/products/${product?._id}`} className="text-blue-600 hover:underline">
                                            {product?.productName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{product?.category}</TableCell>
                                    <TableCell>${product?.price?.toFixed(2)}</TableCell>
                                    <TableCell>{product?.quantity}</TableCell>
                                    <TableCell>${product?.totalValue?.toFixed(2)}</TableCell>
                                    <TableCell>{product?.inStock ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-12">
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pagination.hasPrevPage
                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
                                        }`}
                                >
                                    Previous
                                </button>

                                <div className="flex items-center mx-2">
                                    {renderPageNumbers()}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pagination.hasNextPage
                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Page Info */}
                    {products.length > 0 && (
                        <div className="text-center mt-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                                {pagination.totalCount} results
                            </div>
                        </div>
                    )}

                    {/* Show More Button (alternative for single page) */}
                    {showMore && pagination.totalPages <= 1 && (
                        <div className="w-full flex justify-center mt-4">
                            <button
                                onClick={() => fetchProducts(pagination.currentPage + 1)}
                                className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm dark:text-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                            >
                                Show More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">No products found!</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Create products using your separate form and they'll appear here instantly.
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default DashProducts;