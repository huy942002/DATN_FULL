import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faEye,
  faEdit,
  faTrash,
  faTimes,
  faSave,
  faPlus,
  faSearch,
  faUserPlus,
  faCartPlus,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchOrders,
  updateOrder,
  deleteOrder,
  fetchOrderDetails,
  setStatusFilter,
  addOrder,
} from '../../../features/slices/orderSlice';
import { fetchInvoices } from '../../../features/slices/invoiceSlice';
import { fetchCustomers, fetchCustomerById, addCustomer } from '../../../features/slices/customersSlice';
import {
  fetchProductsPos,
  setSearch,
  setCategoryId,
  setFurnitureTypeId,
  setColorId,
  setSortBy,
  setSortDirection,
  setPage,
} from '../../../features/slices/productSlice';
import { getProductColors } from '../../../features/slices/productColorSlice';
import { GetAllCategories } from '../../../features/slices/categorySlice';
import { fetchFurnitureTypes } from '../../../features/slices/furnitureTypeSlice';
import { createSelector } from 'reselect';
import config from '../../../api/apiSevices';
import { useReactToPrint } from 'react-to-print';

// Memoized Redux selectors
const selectOrdersState = (state) => state.order || {};
const selectInvoicesState = (state) => state.invoice || {};
const selectCustomersState = (state) => state.customers || {};
const selectProductsState = (state) => state.products || {};
const selectProductColorsState = (state) => state.productColors || [];
const selectCategoriesState = (state) => state.category || {};
const selectFurnitureTypesState = (state) => state.furnitureTypes || {};

const selectOrders = createSelector(
  [selectOrdersState, selectInvoicesState, selectCustomersState, selectProductsState, selectProductColorsState, selectCategoriesState, selectFurnitureTypesState],
  (orders, invoices, customers, products, productColors, categories, furnitureTypes) => ({
    orders: orders.orders || [],
    filteredOrders: orders.filteredOrders || [],
    loading: orders.loading || invoices.loading || customers.loading || products.loading || false,
    error: orders.error || invoices.error || customers.error || products.error || null,
    statusFilter: orders.statusFilter || 'PENDING',
    invoices: invoices.invoices || [],
    customers: customers.customers || [],
    products: products.products || [],
    totalPages: products.totalPages || 1,
    currentPage: products.currentPage || 0,
    pageSize: products.pageSize || 10,
    search: products.search || '',
    categoryId: products.categoryId || null,
    furnitureTypeId: products.furnitureTypeId || null,
    colorId: products.colorId || null,
    sortBy: products.sortBy || 'productName',
    sortDirection: products.sortDirection || 'ASC',
    productColors: productColors || [],
    categories: categories.categories || [],
    furnitureTypes: furnitureTypes.furnitureTypes || [],
  })
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in OrderDetailModal:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Đã xảy ra lỗi khi hiển thị chi tiết đơn hàng. Vui lòng thử lại.</div>;
    }
    return this.props.children;
  }
}

// Pagination Component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const maxPagesToShow = 5;
  const halfRange = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(0, currentPage - halfRange);
  let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(0, endPage - maxPagesToShow + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Previous Page"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === 0 ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
            aria-label="Page 1"
          >
            1
          </button>
          {startPage > 1 && <span className="px-3 py-1 text-gray-600">...</span>}
        </>
      )}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === page ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
          aria-label={`Page ${page + 1}`}
        >
          {page + 1}
        </button>
      ))}
      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-3 py-1 text-gray-600">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === totalPages - 1 ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
            aria-label={`Page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Next Page"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

// Product Selection Modal Component
const ProductSelectionModal = ({ isOpen, onClose, onSelect, dispatch }) => {
  const { products, totalPages, currentPage, search, categoryId, furnitureTypeId, colorId, sortBy, sortDirection, productColors, categories, furnitureTypes } = useSelector(selectOrders);
  const [searchTerm, setSearchTerm] = useState(search);
  const [categoryFilter, setCategoryFilter] = useState(categoryId || '');
  const [furnitureTypeFilter, setFurnitureTypeFilter] = useState(furnitureTypeId || '');
  const [colorFilter, setColorFilter] = useState(colorId || '');
  const [sortByFilter, setSortByFilter] = useState(sortBy);
  const [sortDirectionFilter, setSortDirectionFilter] = useState(sortDirection);

  useEffect(() => {
    if (isOpen) {
      dispatch(getProductColors());
      dispatch(GetAllCategories());
      dispatch(fetchFurnitureTypes());
      dispatch(fetchProductsPos({
        search: searchTerm,
        categoryId: categoryFilter || undefined,
        furnitureTypeId: furnitureTypeFilter || undefined,
        colorId: colorFilter || undefined,
        sortBy: sortByFilter,
        sortDirection: sortDirectionFilter,
        page: currentPage,
        size: 10,
      }));
    }
  }, [isOpen, searchTerm, categoryFilter, furnitureTypeFilter, colorFilter, sortByFilter, sortDirectionFilter, currentPage, dispatch]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setFurnitureTypeFilter('');
    setColorFilter('');
    setSortByFilter('productName');
    setSortDirectionFilter('ASC');
    dispatch(setSearch(''));
    dispatch(setCategoryId(null));
    dispatch(setFurnitureTypeId(null));
    dispatch(setColorId(null));
    dispatch(setSortBy('productName'));
    dispatch(setSortDirection('ASC'));
    dispatch(setPage(0));
  };

  const getMainImage = (imageUrl) => {
    return imageUrl ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(imageUrl)}` : '/path/to/default.jpg';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[95vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chọn sản phẩm</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  dispatch(setSearch(e.target.value));
                  dispatch(setPage(0));
                }}
                placeholder="Tìm theo tên, SKU, mô tả..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                dispatch(setCategoryId(e.target.value));
                dispatch(setPage(0));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại nội thất</label>
            <select
              value={furnitureTypeFilter}
              onChange={(e) => {
                setFurnitureTypeFilter(e.target.value);
                dispatch(setFurnitureTypeId(e.target.value));
                dispatch(setPage(0));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            >
              <option value="">Tất cả loại nội thất</option>
              {furnitureTypes.map((type) => (
                <option key={type.furnitureTypeId} value={type.furnitureTypeId}>{type.typeName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
            <select
              value={colorFilter}
              onChange={(e) => {
                setColorFilter(e.target.value);
                dispatch(setColorId(e.target.value));
                dispatch(setPage(0));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            >
              <option value="">Tất cả màu sắc</option>
              {productColors.map((color) => (
                <option key={color.colorId} value={color.colorId}>{color.colorName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
            <select
              value={sortByFilter}
              onChange={(e) => {
                setSortByFilter(e.target.value);
                dispatch(setSortBy(e.target.value));
                dispatch(setPage(0));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            >
              <option value="productName">Tên sản phẩm</option>
              <option value="price">Giá</option>
              <option value="discountedPrice">Giá giảm</option>
              <option value="stockQuantity">Số lượng tồn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hướng sắp xếp</label>
            <select
              value={sortDirectionFilter}
              onChange={(e) => {
                setSortDirectionFilter(e.target.value);
                dispatch(setSortDirection(e.target.value));
                dispatch(setPage(0));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            >
              <option value="ASC">Tăng dần</option>
              <option value="DESC">Giảm dần</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3">Hình ảnh</th>
                <th className="px-4 py-3">Tên sản phẩm</th>
                <th className="px-4 py-3">Màu sắc</th>
                <th className="px-4 py-3">Kích thước</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Tồn kho</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.flatMap((product) =>
                (Array.isArray(product.productDetails) ? product.productDetails : []).map((detail) => ({
                  ...detail,
                  product,
                }))
              ).map((productDetail) => {
                let discountDisplay = '0';
                let discountedPrice = productDetail.price;
                const hasDiscount = productDetail.product?.discount && productDetail.product.discount.discountType !== 'none';
                if (hasDiscount) {
                  if (productDetail.product.discount.discountType === 'PERCENTAGE') {
                    discountDisplay = `${productDetail.product.discount.discountValue}%`;
                    discountedPrice = productDetail.price * (1 - productDetail.product.discount.discountValue / 100);
                  } else {
                    discountDisplay = `${productDetail.product.discount.discountValue.toLocaleString('vi-VN')} ₫`;
                    discountedPrice = productDetail.price - productDetail.product.discount.discountValue;
                  }
                }
                const stockStatus = productDetail.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng';
                const stockColor = productDetail.stockQuantity > 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <tr key={productDetail.productDetailsId} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={getMainImage(productDetail.imageUrl)}
                        alt={productDetail.metaTagTitle}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">{productDetail.metaTagTitle}</td>
                    <td className="px-4 py-3">{productColors.find((c) => c.colorId === productDetail.colorId)?.colorName || 'N/A'}</td>
                    <td className="px-4 py-3">{productDetail.product.dimensions || 'N/A'} cm</td>
                    <td className="px-4 py-3">
                      {hasDiscount ? (
                        <div>
                          <span className="line-through">{productDetail.price.toLocaleString('vi-VN')} ₫</span>
                          <br />
                          <span className="text-red-600">{discountedPrice.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      ) : (
                        <span>{productDetail.price.toLocaleString('vi-VN')} ₫</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 ${stockColor}`}>{stockStatus} ({productDetail.stockQuantity})</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => productDetail.active && productDetail.stockQuantity > 0 && onSelect(productDetail, productDetail.product)}
                        className={`bg-[#22c55e] text-white px-4 py-2 rounded-md ${!productDetail.active || productDetail.stockQuantity <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                        disabled={!productDetail.active || productDetail.stockQuantity <= 0}
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => dispatch(setPage(page))}
          />
        </div>
      </div>
    </div>
  );
};

// Customer Selection Modal Component
const CustomerSelectionModal = ({ isOpen, onClose, onSelect, dispatch }) => {
  const { customers, loading: customersLoading, error: customersError } = useSelector(selectOrders);
  const [newCustomer, setNewCustomer] = useState({
    fullname: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCustomers())
        .unwrap()
        .catch((error) => toast.error(`Lỗi khi tải danh sách khách hàng: ${error}`));
    }
  }, [isOpen, dispatch]);

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewCustomer = async () => {
    if (!newCustomer.fullname) {
      toast.error('Vui lòng nhập họ tên khách hàng');
      return;
    }
    if (newCustomer.phoneNumber && !/^\d{10}$/.test(newCustomer.phoneNumber)) {
      toast.error('Số điện thoại phải có đúng 10 chữ số');
      return;
    }
    if (newCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    try {
      const customerData = {
        fullname: newCustomer.fullname,
        phoneNumber: newCustomer.phoneNumber || null,
        email: newCustomer.email || null,
        address: newCustomer.address || null,
        status: 1,
        username: '',
        password: '',
        roles: [],
      };
      const customerResult = await dispatch(addCustomer(customerData)).unwrap();
      onSelect({
        customerId: customerResult.id,
        fullname: customerResult.fullname,
        phoneNumber: customerResult.phoneNumber || null,
        email: customerResult.email || null,
        address: customerResult.address || null,
        shipping_address: customerResult.address || null,
      });
      toast.success('Đã thêm khách hàng mới!');
      setNewCustomer({
        fullname: '',
        phoneNumber: '',
        email: '',
        address: '',
      });
      setSearchQuery('');
      onClose();
    } catch (error) {
      toast.error(`Lỗi khi thêm khách hàng: ${error}`);
    }
  };

  const filteredCustomers = customers.filter(
    (cust) =>
      cust &&
      cust.id &&
      (cust.id.toString().includes(searchQuery) ||
        cust.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.phoneNumber?.includes(searchQuery))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-8 rounded-lg w-full max-w-[95vw] max-h-[95vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm khách hàng
          </label>
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo ID, tên hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điện thoại
            </label>
            <input
              name="phoneNumber"
              value={newCustomer.phoneNumber}
              onChange={handleNewCustomerChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
              placeholder="Nhập số điện thoại"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khách
            </label>
            <input
              name="fullname"
              value={newCustomer.fullname}
              onChange={handleNewCustomerChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
              placeholder="Nhập tên khách"
              type="text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              value={newCustomer.email}
              onChange={handleNewCustomerChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
              placeholder="Nhập email"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ
            </label>
            <input
              name="address"
              value={newCustomer.address}
              onChange={handleNewCustomerChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
              placeholder="Nhập địa chỉ"
              type="text"
            />
          </div>
        </div>
        <button
          onClick={handleSaveNewCustomer}
          className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          <span>Thêm khách hàng</span>
        </button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Danh sách khách hàng
          </h3>
          <ul className="max-h-96 overflow-y-auto border rounded-md">
            {customersLoading && <li className="p-2 text-center">Đang tải...</li>}
            {customersError && (
              <li className="p-2 text-red-500 text-center">Lỗi: {customersError}</li>
            )}
            {!customersLoading && !customersError && filteredCustomers.length === 0 && (
              <li className="p-2 text-center text-gray-500">Không tìm thấy khách hàng</li>
            )}
            {!customersLoading &&
              !customersError &&
              filteredCustomers.map((cust) => (
                <li
                  key={cust.id}
                  className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    onSelect({
                      customerId: cust.id,
                      fullname: cust.fullname,
                      phoneNumber: cust.phoneNumber || null,
                      email: cust.email || null,
                      address: cust.address || null,
                      shipping_address: cust.address || null,
                    })
                  }
                >
                  {cust.id} - {cust.fullname} - {cust.phoneNumber || 'Không có'}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Invoice Print Component
const InvoicePrint = ({ invoice }) => {
  if (!invoice || !invoice.invoiceId) return <div>Không có hóa đơn để in</div>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Hóa đơn #{invoice.invoiceId}</h2>
      <p><strong>Khách hàng:</strong> {invoice.customerName || 'Khách lẻ'}</p>
      <p><strong>Ngày:</strong> {new Date(invoice.invoiceDate).toLocaleString('vi-VN')}</p>
      <table className="w-full mt-2 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Sản phẩm</th>
            <th className="px-4 py-2 border">Số lượng</th>
            <th className="px-4 py-2 border">Đơn giá</th>
            <th className="px-4 py-2 border">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {invoice.orderDetails.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.productName}</td>
              <td className="px-4 py-2 text-right">{item.quantity}</td>
              <td className="px-4 py-2 text-right">{item.price.toLocaleString('vi-VN')} ₫</td>
              <td className="px-4 py-2 text-right">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p><strong>Tổng tiền:</strong> {invoice.totalAmount.toLocaleString('vi-VN')} ₫</p>
        <p><strong>Thuế (8%):</strong> {invoice.taxAmount.toLocaleString('vi-VN')} ₫</p>
        <p><strong>Phương thức:</strong> {invoice.paymentMethod}</p>
      </div>
    </div>
  );
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, invoice, isOpen, onClose, onUpdate, dispatch }) => {
  const { customers, productColors } = useSelector(selectOrders);
  const [orderData, setOrderData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [printInvoice, setPrintInvoice] = useState(null);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setPrintInvoice(null),
  });

  useEffect(() => {
    if (!isOpen || !order || !order.orderId) {
      setOrderData({});
      setOrderDetails([]);
      return;
    }

    if (order.customerId && !customers.find((c) => c.id === order.customerId)) {
      dispatch(fetchCustomerById(order.customerId))
        .unwrap()
        .catch((error) => toast.error(`Không tìm thấy khách hàng #${order.customerId}: ${error}`));
    }

    const customer = customers.find((c) => c.id === order.customerId);
    setOrderData({
      orderId: order.orderId || '',
      customerId: order.customerId || '',
      fullname: customer?.fullname || 'Khách lẻ',
      phoneNumber: customer?.phoneNumber || '',
      email: customer?.email || '',
      address: customer?.address || '',
      shipping_address: order.shippingAddress || customer?.address || '',
      billing_address: order.billingAddress || "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
      status: order.status || 'PENDING',
      paymentMethod: order.paymentMethod || '',
      totalAmount: order.totalAmount || 0,
    });

    dispatch(fetchOrderDetails(order.orderId))
      .unwrap()
      .then((details) => {
        const enhancedDetails = details.map((detail) => ({
          ...detail,
          productName: detail.productName || detail.productDetailsId || 'N/A',
          color: productColors.find((c) => c.colorId === detail.colorId)?.colorName || 'N/A',
          dimensions: detail.dimensions || 'N/A',
        }));
        setOrderDetails(enhancedDetails || []);
      })
      .catch((error) => toast.error(`Lỗi khi tải chi tiết đơn hàng: ${error}`));
  }, [order, customers, productColors, dispatch, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'address' && prev.shipping_address === prev.address ? { shipping_address: value } : {}),
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...orderDetails];
    updatedDetails[index][field] = field === 'quantity' || field === 'price' || field === 'discount' ? Number(value) : value;
    updatedDetails[index].total =
      updatedDetails[index].quantity * updatedDetails[index].price -
      (updatedDetails[index].discount || 0);
    setOrderDetails(updatedDetails);
  };

  const handleAddDetail = (productDetail, product) => {
    if (productDetail.stockQuantity <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    const basePrice = productDetail.price;
    let discountedPrice = basePrice;
    let itemDiscount = 0;
    if (product.discount && product.discount.discountType !== 'none') {
      if (product.discount.discountType === 'PERCENTAGE') {
        itemDiscount = (basePrice * product.discount.discountValue) / 100;
      } else {
        itemDiscount = product.discount.discountValue;
      }
      discountedPrice = basePrice - itemDiscount;
    }
    const color = productColors.find((c) => c.colorId === productDetail.colorId)?.colorName || 'N/A';
    setOrderDetails((prev) => [
      ...prev,
      {
        productDetailsId: productDetail.productDetailsId,
        productName: productDetail.metaTagTitle,
        quantity: 1,
        price: basePrice,
        discount: itemDiscount,
        total: discountedPrice,
        color,
        dimensions: product.dimensions || 'N/A',
      },
    ]);
    setIsProductModalOpen(false);
  };

  const handleSelectCustomer = (selectedCustomer) => {
    setOrderData((prev) => ({
      ...prev,
      customerId: selectedCustomer.customerId,
      fullname: selectedCustomer.fullname,
      phoneNumber: selectedCustomer.phoneNumber || '',
      email: selectedCustomer.email || '',
      address: selectedCustomer.address || '',
      shipping_address: selectedCustomer.shipping_address || selectedCustomer.address || '',
    }));
    setIsCustomerModalOpen(false);
  };

  const initiateVnpayPayment = async () => {
    if (!order || !order.orderId) return;
    try {
      const subtotal = orderDetails.reduce((sum, detail) => sum + (detail.total || 0), 0);
      const taxAmount = subtotal * 0.08;
      const totalAmount = subtotal + taxAmount;
      const paymentData = {
        orderId: order.orderId,
        amount: totalAmount.toFixed(2),
        billMobile: orderData.phoneNumber || '',
        billEmail: orderData.email || '',
        billFirstName: orderData.fullname ? orderData.fullname.split(' ').slice(0, -1).join(' ') || 'Nguyen' : 'Nguyen',
        billLastName: orderData.fullname ? orderData.fullname.split(' ').slice(-1)[0] || 'Van A' : 'Van A',
        billAddress: orderData.billing_address,
        billCity: 'Ha Noi',
        billCountry: 'VN',
        paymentStatus: 'PENDING',
        customerId: orderData.customerId,
        orderDetails: orderDetails,
        printReceipt: true,
      };
      localStorage.setItem('tempPaymentData', JSON.stringify(paymentData));
      const response = await config.post('/payments/create-vnpay-url', paymentData, {
        headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` },
      });
      window.location.href = response.data.vnp_PayUrl;
    } catch (err) {
      toast.error(`Lỗi khi tạo URL thanh toán: ${err}`);
    }
  };

  const handleSave = async () => {
    if (!order || !order.orderId) return;
    try {
      const subtotal = orderDetails.reduce((sum, detail) => sum + (detail.total || 0), 0);
      const taxAmount = subtotal * 0.08;
      const totalAmount = subtotal + taxAmount;
      const updatedOrder = {
        ...orderData,
        totalAmount: totalAmount.toFixed(2),
        orderDetails: orderDetails.map((detail) => ({
          orderDetailId: detail.orderDetailId,
          productDetailsId: detail.productDetailsId,
          quantity: detail.quantity,
          price: detail.price.toFixed(2),
          discount: detail.discount.toFixed(2),
          total: detail.total.toFixed(2),
        })),
      };
      await onUpdate(updatedOrder);
      if (invoice?.invoiceStatus === 'PENDING') {
        await config.post('/invoices', {
          orderId: order.orderId,
          customerId: orderData.customerId,
          totalAmount: totalAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          finalAmount: totalAmount.toFixed(2),
          invoiceStatus: 'PENDING',
          paymentMethod: orderData.paymentMethod,
        }, { headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` } });
      }
      setIsEditing(false);
      toast.success('Cập nhật đơn hàng thành công!');
    } catch (err) {
      toast.error(`Lỗi khi cập nhật đơn hàng: ${err}`);
    }
  };

  if (!isOpen || !order || !order.orderId) return null;

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[95vh] overflow-auto shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Chi tiết đơn hàng #{orderData.orderId || 'N/A'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Thông tin đơn hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khách hàng
                  </label>
                  {isEditing ? (
                    <button
                      onClick={() => setIsCustomerModalOpen(true)}
                      className="w-full p-2 border border-gray-300 rounded-md text-left bg-gray-100 hover:bg-gray-200"
                    >
                      {orderData.fullname || 'Chọn khách hàng'}
                    </button>
                  ) : (
                    <input
                      type="text"
                      name="fullname"
                      value={orderData.fullname || 'Khách lẻ'}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={orderData.phoneNumber || ''}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderData.email || ''}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ khách hàng
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={orderData.address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={orderData.shipping_address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={orderData.status || 'PENDING'}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                  >
                    <option value="PENDING">Đang chờ xác nhận</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="SHIPPED">Đã giao hàng</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phương thức thanh toán
                  </label>
                  <input
                    type="text"
                    name="paymentMethod"
                    value={orderData.paymentMethod || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Chi tiết sản phẩm
              </h3>
              {isEditing && (
                <button
                  onClick={() => setIsProductModalOpen(true)}
                  className="mb-4 bg-[#22c55e] text-white p-2 rounded"
                >
                  <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm
                </button>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="px-4 py-3">Màu sắc</th>
                      <th className="px-4 py-3">Kích thước</th>
                      <th className="px-4 py-3">Số lượng</th>
                      <th className="px-4 py-3">Đơn giá</th>
                      <th className="px-4 py-3">Giảm giá</th>
                      <th className="px-4 py-3">Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.length > 0 ? (
                      orderDetails.map((detail, index) => (
                        <tr
                          key={detail.orderDetailId || `temp-${index}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">{detail.productName || detail.productDetailsId || 'N/A'}</td>
                          <td className="px-4 py-3">{detail.color || 'N/A'}</td>
                          <td className="px-4 py-3">{detail.dimensions || 'N/A'}</td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={detail.quantity || 0}
                                onChange={(e) =>
                                  handleDetailChange(index, 'quantity', Number(e.target.value))
                                }
                                className="w-16 p-1 border rounded"
                              />
                            ) : (
                              detail.quantity || 0
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={detail.price || 0}
                                onChange={(e) =>
                                  handleDetailChange(index, 'price', Number(e.target.value))
                                }
                                className="w-24 p-1 border rounded"
                              />
                            ) : (
                              (detail.price || 0).toLocaleString('vi-VN') + ' ₫'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                type="number"
                                value={detail.discount || 0}
                                onChange={(e) =>
                                  handleDetailChange(index, 'discount', Number(e.target.value))
                                }
                                className="w-24 p-1 border rounded"
                              />
                            ) : (
                              (detail.discount || 0).toLocaleString('vi-VN') + ' ₫'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {(detail.total || 0).toLocaleString('vi-VN')} ₫
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-4 text-gray-500"
                        >
                          Không có sản phẩm nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {invoice && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Thông tin hóa đơn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã hóa đơn
                    </label>
                    <input
                      type="text"
                      value={invoice.invoiceId || 'N/A'}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tổng tiền
                    </label>
                    <input
                      type="text"
                      value={(invoice.totalAmount || 0).toLocaleString('vi-VN') + ' ₫'}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thuế
                    </label>
                    <input
                      type="text"
                      value={(invoice.taxAmount || 0).toLocaleString('vi-VN') + ' ₫'}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái hóa đơn
                    </label>
                    <input
                      type="text"
                      value={invoice.invoiceStatus || 'N/A'}
                      disabled
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                  >
                    <span>Hủy</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Chỉnh sửa</span>
                  </button>
                  {invoice?.invoiceStatus === 'PENDING' && (
                    <button
                      onClick={initiateVnpayPayment}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                    >
                      <span>Thanh toán VNPay</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <CustomerSelectionModal
            isOpen={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            onSelect={handleSelectCustomer}
            dispatch={dispatch}
          />
          <ProductSelectionModal
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            onSelect={handleAddDetail}
            dispatch={dispatch}
          />
          {printInvoice && (
            <div ref={componentRef} style={{ display: 'none' }}>
              <InvoicePrint invoice={printInvoice} />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Create Order Modal Component
const CreateOrderModal = ({ isOpen, onClose, onCreate, dispatch }) => {
  const { productColors } = useSelector(selectOrders);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    fullname: '',
    phoneNumber: '',
    email: '',
    address: '',
    shipping_address: '',
    billing_address: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
    totalAmount: 0,
    taxAmount: 0,
    paymentMethod: 'Tiền mặt',
    shippingMethod: 'Tại quầy',
    status: 'PENDING',
    orderDetails: [],
  });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [customers, setIsCreateModalOpen] = useState(false);
  const [customerPaid, setCustomerPaid] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [printInvoice, setPrintInvoice] = useState(null);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setPrintInvoice(null),
  });

  useEffect(() => {
    const subtotal = newOrder.orderDetails.reduce((sum, detail) => sum + (detail.total || 0), 0);
    const taxAmount = subtotal * 0.08;
    const totalAmount = subtotal + taxAmount - discount;
    setNewOrder((prev) => ({ ...prev, totalAmount, taxAmount }));
  }, [newOrder.orderDetails, discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'address' && prev.shipping_address === prev.address ? { shipping_address: value } : {}),
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...newOrder.orderDetails];
    updatedDetails[index][field] = field === 'quantity' || field === 'price' || field === 'discount' ? Number(value) : value;
    updatedDetails[index].total =
      updatedDetails[index].quantity * updatedDetails[index].price -
      (updatedDetails[index].discount || 0);
    setNewOrder((prev) => ({ ...prev, orderDetails: updatedDetails }));
  };

  const handleAddDetail = (productDetail, product) => {
    if (productDetail.stockQuantity <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    const basePrice = productDetail.price;
    let discountedPrice = basePrice;
    let itemDiscount = 0;
    if (product.discount && product.discount.discountType !== 'none') {
      if (product.discount.discountType === 'PERCENTAGE') {
        itemDiscount = (basePrice * product.discount.discountValue) / 100;
      } else {
        itemDiscount = product.discount.discountValue;
      }
      discountedPrice = basePrice - itemDiscount;
    }
    const color = productColors.find((c) => c.colorId === productDetail.colorId)?.colorName || 'N/A';
    setNewOrder((prev) => ({
      ...prev,
      orderDetails: [
        ...prev.orderDetails,
        {
          productDetailsId: productDetail.productDetailsId,
          productName: productDetail.metaTagTitle,
          quantity: 1,
          price: basePrice,
          discount: itemDiscount,
          total: discountedPrice,
          color,
          dimensions: product.dimensions || 'N/A',
        },
      ],
    }));
    setIsProductModalOpen(false);
  };

  const handleSelectCustomer = (selectedCustomer) => {
    setNewOrder((prev) => ({
      ...prev,
      customerId: selectedCustomer.customerId,
      fullname: selectedCustomer.fullname,
      phoneNumber: selectedCustomer.phoneNumber || '',
      email: selectedCustomer.email || '',
      address: selectedCustomer.address || '',
      shipping_address: selectedCustomer.shipping_address || selectedCustomer.address || '',
    }));
    setIsCustomerModalOpen(false);
  };

  const handlePayment = async () => {
    if (newOrder.orderDetails.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm');
      return;
    }
    if (!newOrder.customerId) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }
    if (customerPaid < newOrder.totalAmount && ['Tiền mặt', 'Thẻ', 'Chuyển khoản'].includes(newOrder.paymentMethod)) {
      toast.error('Số tiền khách đưa không đủ');
      return;
    }

    const subtotal = newOrder.orderDetails.reduce((sum, detail) => sum + (detail.total || 0), 0);
    const taxAmount = subtotal * 0.08;
    const totalAmount = subtotal + taxAmount - discount;

    const paymentData = {
      amount: totalAmount.toFixed(2),
      paymentMethod: newOrder.paymentMethod,
      billMobile: newOrder.phoneNumber || '',
      billEmail: newOrder.email || '',
      billFirstName: newOrder.fullname ? newOrder.fullname.split(' ').slice(0, -1).join(' ') || 'Nguyen' : 'Nguyen',
      billLastName: newOrder.fullname ? newOrder.fullname.split(' ').slice(-1)[0] || 'Van A' : 'Van A',
      billAddress: newOrder.billing_address,
      billCity: 'Ha Noi',
      billCountry: 'VN',
      paymentStatus: 'PENDING',
      customerId: newOrder.customerId,
      orderDetails: newOrder.orderDetails,
      shippingMethod: newOrder.shippingMethod,
      printReceipt,
    };

    if (['Tiền mặt', 'Thẻ', 'Chuyển khoản'].includes(newOrder.paymentMethod)) {
      const orderData = {
        customerId: newOrder.customerId,
        totalAmount: totalAmount.toFixed(2),
        paymentMethod: newOrder.paymentMethod,
        shippingMethod: newOrder.shippingMethod,
        status: 'PROCESSING',
        billingAddress: newOrder.billing_address,
        shippingAddress: newOrder.shipping_address || newOrder.address,
        orderDetails: newOrder.orderDetails.map((item) => ({
          productDetailsId: item.productDetailsId,
          quantity: item.quantity,
          price: item.price.toFixed(2),
          discount: item.discount.toFixed(2),
          total: item.total.toFixed(2),
        })),
      };
      try {
        const orderResult = await dispatch(addOrder(orderData)).unwrap();
        const invoiceResult = await config.post('/invoices', {
          orderId: orderResult.id,
          customerId: newOrder.customerId,
          totalAmount: totalAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          finalAmount: totalAmount.toFixed(2),
          invoiceStatus: 'PAID',
          paymentMethod: newOrder.paymentMethod,
        }, { headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` } });
        await config.post('/payments', {
          orderId: orderResult.id,
          customerId: newOrder.customerId,
          amount: totalAmount.toFixed(2),
          paymentStatus: 'COMPLETED',
          paymentMethod: newOrder.paymentMethod,
          isActive: true,
        }, { headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` } });
        if (printReceipt) {
          setPrintInvoice({
            invoiceId: invoiceResult.data.invoiceId,
            customerName: newOrder.fullname,
            orderDetails: newOrder.orderDetails,
            totalAmount: totalAmount,
            taxAmount: taxAmount,
            invoiceDate: new Date(),
            paymentMethod: newOrder.paymentMethod,
          });
          handlePrint();
        }
        toast.success(`Thanh toán thành công! Mã hóa đơn: ${invoiceResult.data.invoiceId}`);
        setIsCreateModalOpen(false);
        setNewOrder({
          customerId: '',
          fullname: '',
          phoneNumber: '',
          email: '',
          address: '',
          shipping_address: '',
          billing_address: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
          totalAmount: 0,
          taxAmount: 0,
          paymentMethod: 'Tiền mặt',
          shippingMethod: 'Tại quầy',
          status: 'PENDING',
          orderDetails: [],
        });
        setCustomerPaid(0);
        setDiscount(0);
      } catch (err) {
        toast.error(`Lỗi khi xử lý thanh toán: ${err}`);
      }
    } else if (newOrder.paymentMethod === 'VNPAY') {
      localStorage.setItem('tempPaymentData', JSON.stringify(paymentData));
      try {
        const response = await config.post('/payments/create-vnpay-url', paymentData, {
          headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` },
        });
        window.location.href = response.data.vnp_PayUrl;
      } catch (err) {
        toast.error(`Lỗi khi tạo URL VNPAY: ${err}`);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newOrder.customerId || newOrder.orderDetails.length === 0) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng và sản phẩm');
      return;
    }
    const subtotal = newOrder.orderDetails.reduce((sum, detail) => sum + (detail.total || 0), 0);
    const taxAmount = subtotal * 0.08;
    const totalAmount = subtotal + taxAmount - discount;
    try {
      const orderData = {
        customerId: newOrder.customerId,
        totalAmount: totalAmount.toFixed(2),
        paymentMethod: newOrder.paymentMethod,
        shippingMethod: newOrder.shippingMethod,
        status: newOrder.status,
        billingAddress: newOrder.billing_address,
        shippingAddress: newOrder.shipping_address || newOrder.address,
        orderDetails: newOrder.orderDetails.map((detail) => ({
          productDetailsId: detail.productDetailsId,
          quantity: detail.quantity,
          price: detail.price.toFixed(2),
          discount: detail.discount.toFixed(2),
          total: detail.total.toFixed(2),
        })),
      };
      await onCreate(orderData);
      await config.post('/invoices', {
        orderId: orderData.id,
        customerId: newOrder.customerId,
        totalAmount: totalAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        finalAmount: totalAmount.toFixed(2),
        invoiceStatus: 'PENDING',
        paymentMethod: newOrder.paymentMethod,
      }, { headers: { 'Authorization': `Bearer ${window.localStorage.getItem('token')}` } });
    } catch (err) {
      toast.error(`Lỗi khi tạo đơn hàng: ${err}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[95vh] overflow-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tạo đơn hàng mới</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Thông tin đơn hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khách hàng
                </label>
                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="w-full p-2 border border-gray-300 rounded-md text-left bg-gray-100 hover:bg-gray-200"
                >
                  {newOrder.fullname || 'Chọn khách hàng'}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tổng tiền
                </label>
                <input
                  type="text"
                  value={`${newOrder.totalAmount.toLocaleString('vi-VN')} ₫ (Thuế: ${newOrder.taxAmount.toLocaleString('vi-VN')} ₫)`}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương thức thanh toán
                </label>
                <select
                  name="paymentMethod"
                  value={newOrder.paymentMethod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Thẻ">Thẻ</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="VNPAY">VNPAY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phương thức vận chuyển
                </label>
                <input
                  type="text"
                  name="shippingMethod"
                  value={newOrder.shippingMethod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ khách hàng
                </label>
                <input
                  type="text"
                  name="address"
                  value={newOrder.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng
                </label>
                <input
                  type="text"
                  name="shipping_address"
                  value={newOrder.shipping_address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiết khấu
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value === '' ? 0 : Number(e.target.value) || 0)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                />
              </div>
              {['Tiền mặt', 'Thẻ', 'Chuyển khoản'].includes(newOrder.paymentMethod) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiền khách đưa
                  </label>
                  <input
                    type="number"
                    value={customerPaid}
                    onChange={(e) => setCustomerPaid(e.target.value === '' ? 0 : Number(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                  />
                </div>
              )}
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={printReceipt}
                    onChange={(e) => setPrintReceipt(e.target.checked)}
                    className="mr-2"
                  />
                  In hóa đơn
                </label>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Chi tiết sản phẩm
            </h3>
            <button
              onClick={() => setIsProductModalOpen(true)}
              className="mb-4 bg-[#22c55e] text-white p-2 rounded"
            >
              <FontAwesomeIcon icon={faPlus} /> Thêm sản phẩm
            </button>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">Màu sắc</th>
                    <th className="px-4 py-3">Kích thước</th>
                    <th className="px-4 py-3">Số lượng</th>
                    <th className="px-4 py-3">Đơn giá</th>
                    <th className="px-4 py-3">Giảm giá</th>
                    <th className="px-4 py-3">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {newOrder.orderDetails.map((detail, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{detail.productName || detail.productDetailsId}</td>
                      <td className="px-4 py-3">{detail.color || 'N/A'}</td>
                      <td className="px-4 py-3">{detail.dimensions || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={detail.quantity}
                          onChange={(e) =>
                            handleDetailChange(index, 'quantity', Number(e.target.value))
                          }
                          className="w-16 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={detail.price}
                          onChange={(e) =>
                            handleDetailChange(index, 'price', Number(e.target.value))
                          }
                          className="w-24 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={detail.discount}
                          onChange={(e) =>
                            handleDetailChange(index, 'discount', Number(e.target.value))
                          }
                          className="w-24 p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {(detail.total || 0).toLocaleString('vi-VN')} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSubmit}
              className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>Tạo</span>
            </button>
            <button
              onClick={handlePayment}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPrint} />
              <span>Thanh toán</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
            >
              <span>Hủy</span>
            </button>
          </div>
          <CustomerSelectionModal
            isOpen={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            onSelect={handleSelectCustomer}
            dispatch={dispatch}
          />
          <ProductSelectionModal
            isOpen={isProductModalOpen}
            onClose={() => setIsProductModalOpen(false)}
            onSelect={handleAddDetail}
            dispatch={dispatch}
          />
          {printInvoice && (
            <div ref={componentRef} style={{ display: 'none' }}>
              <InvoicePrint invoice={printInvoice} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Management Component
const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, filteredOrders, loading, error, statusFilter, invoices, customers } = useSelector(selectOrders);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const paginatedOrders = useMemo(() => {
    return filteredOrders
      .filter(
        (order) =>
          order &&
          order.orderId &&
          (order.orderId.toString().includes(searchQuery) ||
            customers.find((c) => c.id === order.customerId)?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customers.find((c) => c.id === order.customerId)?.phoneNumber?.includes(searchQuery))
      )
      .slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  }, [filteredOrders, customers, searchQuery, currentPage, pageSize]);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchInvoices());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error && (error.includes('Access denied') || error.includes('Unauthorized'))) {
      toast.error(error);
      navigate('/login');
    }
  }, [error, navigate]);

  const handleTabChange = (status) => {
    dispatch(setStatusFilter(status));
    setCurrentPage(0);
    setSearchQuery('');
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      await dispatch(
        updateOrder({ id: order.orderId, order: { ...order, status: newStatus } })
      ).unwrap();
      toast.success(`Đã cập nhật trạng thái đơn hàng #${order.orderId}`);
    } catch (err) {
      toast.error(`Lỗi khi cập nhật trạng thái: ${err}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng #${orderId}?`)) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        toast.success(`Đã xóa đơn hàng #${orderId}`);
      } catch (err) {
        toast.error(`Lỗi khi xóa đơn hàng: ${err}`);
      }
    }
  };

  const handleViewOrder = async (order) => {
    if (!order || !order.orderId) return;
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      await dispatch(
        updateOrder({
          id: updatedOrder.orderId,
          order: {
            customerId: updatedOrder.customerId,
            totalAmount: updatedOrder.totalAmount,
            paymentMethod: updatedOrder.paymentMethod,
            shippingMethod: updatedOrder.shippingMethod,
            status: updatedOrder.status,
            billingAddress: updatedOrder.billingAddress,
            shippingAddress: updatedOrder.shippingAddress || updatedOrder.address || null,
            orderDetails: updatedOrder.orderDetails,
          },
        })
      ).unwrap();
      setIsDetailModalOpen(false);
      setSelectedOrder(null);
      toast.success('Cập nhật đơn hàng thành công!');
    } catch (err) {
      toast.error(`Lỗi khi cập nhật đơn hàng: ${err}`);
      throw err;
    }
  };

  const handleCreateOrder = async (newOrder) => {
    try {
      await dispatch(addOrder(newOrder)).unwrap();
      setIsCreateModalOpen(false);
      toast.success('Tạo đơn hàng thành công!');
    } catch (err) {
      toast.error(`Lỗi khi tạo đơn hàng: ${err}`);
    }
  };

  const tabs = [
    { id: 'PENDING', label: 'Đang chờ xác nhận' },
    { id: 'PROCESSING', label: 'Đang xử lý' },
    { id: 'SHIPPED', label: 'Đã giao hàng' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-[#f8f9fa]">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý đơn hàng
            </h2>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Tạo đơn hàng</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md px-4 py-2 flex items-center space-x-2"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Quay lại</span>
              </button>
            </div>
          </div>
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 text-sm font-medium ${statusFilter === tab.id
                  ? 'border-b-2 border-[#22c55e] text-[#22c55e]'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label} (
                {orders.filter((o) => o && o.status && o.status.toUpperCase() === tab.id).length})
              </button>
            ))}
          </div>
          <div>
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22c55e]"></div>
              </div>
            )}
            {error && (
              <p className="text-center py-8 text-red-500 text-lg">
                Lỗi khi tải đơn hàng: {error}. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.
              </p>
            )}
            {!loading && !error && paginatedOrders.length === 0 && (
              <p className="text-center py-8 text-gray-500 text-lg">
                Không có đơn hàng nào trong trạng thái này. Kiểm tra dữ liệu hoặc thử trạng thái khác.
              </p>
            )}
            {!loading && !error && paginatedOrders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-3">Mã đơn hàng</th>
                      <th className="px-4 py-3">Khách hàng</th>
                      <th className="px-4 py-3">Ngày đặt</th>
                      <th className="px-4 py-3">Tổng tiền</th>
                      <th className="px-4 py-3">Phương thức thanh toán</th>
                      <th className="px-4 py-3">Trạng thái đơn hàng</th>
                      <th className="px-4 py-3">Trạng thái hóa đơn</th>
                      <th className="px-4 py-3">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => {
                      const customer = customers.find((c) => c.id === order.customerId);
                      const invoice = invoices.find((inv) => inv?.orderId === order.orderId);
                      const invoiceStatusDisplay = invoice
                        ? invoice.invoiceStatus === 'PAID'
                          ? 'Đã thanh toán'
                          : invoice.invoiceStatus === 'PENDING'
                            ? 'Chưa thanh toán'
                            : invoice.invoiceStatus || 'Không xác định'
                        : 'Chưa có hóa đơn';
                      return (
                        <tr
                          key={order.orderId || `temp-${Math.random()}`}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">#{order.orderId || 'N/A'}</td>
                          <td className="px-4 py-3">
                            {customer ? customer.fullname : 'Khách lẻ'}
                          </td>
                          <td className="px-4 py-3">
                            {order.orderDate
                              ? new Date(order.orderDate).toLocaleDateString('vi-VN')
                              : order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                                : 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            {(order.totalAmount || 0).toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="px-4 py-3">
                            {order.paymentMethod || 'Không xác định'}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status || 'PENDING'}
                              onChange={(e) => handleStatusChange(order, e.target.value)}
                              className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                            >
                              <option value="PENDING">Đang chờ xác nhận</option>
                              <option value="PROCESSING">Đang xử lý</option>
                              <option value="SHIPPED">Đã giao hàng</option>
                              <option value="CANCELLED">Đã hủy</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                invoiceStatusDisplay === 'Đã thanh toán'
                                  ? 'text-green-600'
                                  : invoiceStatusDisplay === 'Chưa thanh toán'
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                              }
                            >
                              {invoiceStatusDisplay}
                            </span>
                          </td>
                          <td className="px-4 py-3 flex space-x-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Xem chi tiết"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-yellow-600 hover:text-yellow-800"
                              title="Chỉnh sửa"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.orderId)}
                              className="text-red-600 hover:text-red-800"
                              title="Xóa"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {paginatedOrders.length > 0 && (
              <div className="mt-6">
                <Pagination
                  totalPages={Math.ceil(filteredOrders.length / pageSize)}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <OrderDetailModal
        order={selectedOrder}
        invoice={invoices.find((inv) => inv?.orderId === selectedOrder?.orderId)}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdate={handleUpdateOrder}
        dispatch={dispatch}
      />
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOrder}
        dispatch={dispatch}
      />
      <ToastContainer />
    </div>
  );
};

export default OrderManagement;