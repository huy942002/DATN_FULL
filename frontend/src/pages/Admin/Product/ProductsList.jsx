import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchProducts, deleteProduct, setSearch, setPage } from '../../../features/slices/productSlice';
import { GetAllCategories } from '../../../features/slices/categorySlice';
import defaultImage from '../../../assets/images/default.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight, faStar as faStarSolid, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error, totalPages, currentPage, search, pageSize } = useSelector((state) => state.products);
  const categories = useSelector((state) => state.category.categories || []);
  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState('All');
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    dispatch(fetchProducts({ search, page: currentPage, size: pageSize }));
    dispatch(GetAllCategories());
  }, [dispatch, search, currentPage, pageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setSearch(value));
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
        .unwrap()
        .then(() => {
          toast.success('Product deleted successfully');
          dispatch(fetchProducts({ search, page: currentPage, size: pageSize }));
        })
        .catch(() => toast.error('Error deleting product'));
    }
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const toggleDropdown = (productId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const formatPrice = (price) => {
    return (price || 0).toFixed(2);
  };

  const getMainImage = (images) => {
    if (!images || images.length === 0) return defaultImage;
    const mainImage = images.find((img) => img.mainImage) || images[0];
    return mainImage.imageUrl
      ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(mainImage.imageUrl)}`
      : defaultImage;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : 'Unknown';
  };

  const getStock = (productDetails) => {
    if (!productDetails || productDetails.length === 0) return 0;
    return productDetails
      .filter((detail) => detail.active)
      .reduce((sum, detail) => sum + (detail.stockQuantity || 0), 0);
  };

  const getDiscount = (discountObj) => {
    return discountObj && discountObj.active ? discountObj.discountValue || 0 : 0;
  };

  const getLastUpdated = (updatedAt) => {
    if (!updatedAt) return new Date().toLocaleDateString('en-US');
    return new Date(updatedAt).toLocaleDateString('en-US');
  };

  const getStatus = (active) => {
    return active ? 'IsActive' : 'InActive';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStarSolid : faStarRegular}
          className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  if (loading) return <div className="text-center py-12 text-gray-600 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500 text-lg">Error: {error}</div>;

  return (
    <div className="w-full mx-auto p-2 text-gray-700 bg-gray-50 font-sans min-h-screen">
      <style>
        {`
          .dropdown-menu {
            display: none;
          }
          .dropdown-menu.show {
            display: block;
          }
        `}
      </style>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center bg-white rounded-lg px-4 py-3 w-full sm:w-80 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-green-300 transition">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-base" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Product"
              className="bg-transparent placeholder-gray-400 text-gray-700 text-base focus:outline-none ml-3 w-full"
            />
          </div>
          <div className="flex items-center space-x-6 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="bg-white text-gray-600 text-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-48 border border-gray-200 shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="InActive">InActive</option>
              <option value="IsActive">IsActive</option>
            </select>
            <Link
              to="/admin/product/productCreateForm"
              className="bg-green-600 text-white text-base font-medium rounded-lg px-6 py-3 hover:bg-green-700 focus:ring-2 focus:ring-green-300 transition shadow-sm"
            >
              Add Product
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-sm text-gray-500 font-semibold bg-gray-100">
                <th className="px-3 py-4 w-64">Product Name</th>
                <th className="px-3 py-4 w-48">Category</th>
                <th className="px-3 py-4 w-24">Stock</th>
                <th className="px-3 py-4 w-32">Sale Price</th>
                <th className="px-3 py-4 w-32">Discount</th>
                <th className="px-3 py-4 w-36">Last Updated</th>
                <th className="px-3 py-4 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {products
                .filter((product) => statusFilter === 'All' || getStatus(product.active) === statusFilter)
                .map((product, index) => {
                  const stock = getStock(product.productDetails);
                  const discount = getDiscount(product.discount);
                  const lastUpdated = getLastUpdated(product.updatedAt);
                  return (
                    <tr
                      key={product.productId}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors rounded-lg`}
                    >
                      <td className="flex items-center space-x-3 px-3 py-4">
                        <img
                          src={getMainImage(product.images)}
                          alt={product.productName || 'Product'}
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <span className="truncate max-w-48 font-medium">{product.productName}</span>
                      </td>
                      <td className="px-3 py-4">
                        {product.categories
                          .map((cat) => getCategoryName(cat.categoryId))
                          .join(', ')}
                      </td>
                      <td className="px-3 py-4">
                        {stock < 5 && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full px-2 py-1 mr-2">
                            Low
                          </span>
                        )}
                        <span className={stock < 5 ? 'text-yellow-700 font-medium' : 'text-gray-700'}>
                          {stock}
                        </span>
                      </td>
                      <td className="px-3 py-4 font-medium">${formatPrice(product.price)}</td>
                      <td className="px-3 py-4">{discount}%</td>
                      <td className="px-3 py-4">{lastUpdated}</td>
                      <td className="px-3 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(product.productId)}
                            className="bg-gray-100 text-gray-600 text-base font-medium rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-200 focus:ring-2 focus:ring-green-300 transition"
                          >
                            <span>Actions</span>
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={`h-3.5 w-3.5 transition-transform ${
                                openDropdowns[product.productId] ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <div
                            className={`absolute right-0 top-full mt-2 w-36 bg-gray-500 rounded-lg shadow-lg border border-gray-200 dropdown-menu ${
                              openDropdowns[product.productId] ? 'show' : ''
                            } z-10`}
                            style={{ backgroundColor: 'white' }}
                          >
                            <Link
                              to={`/admin/product/productUpdateForm/${product.productId}`}
                              className="block w-full text-left px-4 py-3 text-gray-700 text-base hover:bg-gray-100 transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product.productId)}
                              className="block w-full text-left px-4 py-3 text-gray-700 text-base hover:bg-gray-100 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between text-gray-600 text-base">
          <div>
            <select
              value={pageSize}
              onChange={(e) => dispatch(fetchProducts({ search, page: currentPage, size: parseInt(e.target.value) }))}
              className="bg-white rounded-lg px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-green-300 border border-gray-200 shadow-sm"
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button
              className="text-gray-600 hover:text-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-base" />
            </button>
            {[...Array(totalPages || 1)].map((_, index) => (
              <button
                key={index}
                className={`rounded-lg px-4 py-2 ${
                  currentPage === index ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100 transition'
                }`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="text-gray-600 hover:text-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2"
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;