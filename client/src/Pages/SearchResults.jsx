import { Table, TableHead, TableBody, TableCell, TableHeadCell, TableRow, Button, TextInput, Select } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Search filters state
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: '',
        inStock: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const location = useLocation();
    const navigate = useNavigate();

    // Parse URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const newFilters = {
            searchTerm: urlParams.get('searchTerm') || '',
            category: urlParams.get('category') || '',
            inStock: urlParams.get('inStock') || '',
            minPrice: urlParams.get('minPrice') || '',
            maxPrice: urlParams.get('maxPrice') || '',
            sortBy: urlParams.get('sortBy') || 'createdAt',
            sortOrder: urlParams.get('sortOrder') || 'desc'
        };
        setFilters(newFilters);

        // Perform search with URL parameters
        if (newFilters.searchTerm) {
            performSearch(newFilters, 1);
        }
    }, [location.search]);

    const performSearch = async (searchFilters = filters, page = 1) => {
        try {
            setIsLoading(true);

            // Build query parameters
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString()
            });

            // Add search filters to query
            if (searchFilters.searchTerm) queryParams.set('search', searchFilters.searchTerm);
            if (searchFilters.category) queryParams.set('category', searchFilters.category);
            if (searchFilters.inStock) queryParams.set('inStock', searchFilters.inStock);
            if (searchFilters.minPrice) queryParams.set('minPrice', searchFilters.minPrice);
            if (searchFilters.maxPrice) queryParams.set('maxPrice', searchFilters.maxPrice);
            if (searchFilters.sortBy) queryParams.set('sortBy', searchFilters.sortBy);
            if (searchFilters.sortOrder) queryParams.set('sortOrder', searchFilters.sortOrder);

            console.log('Search API call:', `/api/products?${queryParams.toString()}`);

            const response = await fetch(`/api/products?${queryParams.toString()}`, {
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setProducts(data.data.products || []);
                setPagination(data.data.pagination);

                if (data.data.products.length === 0) {
                    toast.info('No products found matching your search criteria');
                }
            } else {
                throw new Error(data.message || 'Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search products: ' + error.message);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (!filters.searchTerm.trim()) {
            toast.warning('Please enter a search term');
            return;
        }

        // Update URL with search parameters
        const urlParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) urlParams.set(key, value);
        });

        navigate(`/search?${urlParams.toString()}`);
        performSearch(filters, 1);
    };

    const clearSearch = () => {
        const clearedFilters = {
            searchTerm: '',
            category: '',
            inStock: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
        setFilters(clearedFilters);
        setProducts([]);
        navigate('/search');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            performSearch(filters, newPage);
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
                    className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors duration-200 ${pagination.currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="min-h-screen p-3 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-2">Search Products</h1>
                <p className="text-gray-500 text-center">Find products using advanced search and filters</p>
            </div>

            {/* Search Form */}
            <div className="bg-white  p-6 rounded-lg shadow-md mb-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    {/* Main Search Input */}
                    <div className="flex gap-4">
                        <TextInput
                            type="text"
                            placeholder="Search products by name or description..."
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            className="flex-1"
                            icon={FaSearch}
                        />
                        <Button type="submit" disabled={isLoading} className="px-6">
                            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                            {isLoading ? 'Searching...' : 'Search'}
                        </Button>
                    </div>

                    {/* Advanced Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <Select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Food">Food</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Stock Status</label>
                            <Select
                                value={filters.inStock}
                                onChange={(e) => handleFilterChange('inStock', e.target.value)}
                            >
                                <option value="">All Products</option>
                                <option value="true">In Stock</option>
                                <option value="false">Out of Stock</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Min Price ($)</label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Max Price ($)</label>
                            <TextInput
                                type="number"
                                placeholder="1000"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium mb-1">Sort By</label>
                            <Select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="createdAt">Date Created</option>
                                <option value="productName">Name</option>
                                <option value="price">Price</option>
                                <option value="category">Category</option>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Order</label>
                            <Select
                                value={filters.sortOrder}
                                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </Select>
                        </div>

                        <Button type="button" onClick={clearSearch} color="gray">
                            Clear Filters
                        </Button>
                    </div>
                </form>
            </div>

            {/* Results Header */}
            {products.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        Search Results ({pagination.totalCount} products found)
                    </h2>
                    {filters.searchTerm && (
                        <p className="text-gray-600">
                            Showing results for: <span className="font-medium">"{filters.searchTerm}"</span>
                        </p>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
                    <span className="text-gray-600 text-lg">Searching products...</span>
                </div>
            ) : products.length > 0 ? (
                <>
                    {/* Results Table */}
                    <Table className="shadow-md">
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
                                <TableRow key={product._id}>
                                    <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Link to={`/products/${product._id}`} className="text-blue-600 hover:underline">
                                            {product.productName}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>${product.price?.toFixed(2)}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>${product.totalValue?.toFixed(2)}</TableCell>
                                    <TableCell>
                                        {product.inStock ?
                                            <FaCheck className="text-green-500" /> :
                                            <FaTimes className="text-red-500" />
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8">
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
                    <div className="text-center mt-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                            {pagination.totalCount} results
                        </div>
                    </div>
                </>
            ) : (
                !isLoading && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            {filters.searchTerm ? 'No products found' : 'Start your search'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            {filters.searchTerm
                                ? 'Try different keywords or adjust your filters'
                                : 'Enter keywords in the search box above to find products'
                            }
                        </p>
                    </div>
                )
            )}
        </div>
    );
};

export default SearchResults;