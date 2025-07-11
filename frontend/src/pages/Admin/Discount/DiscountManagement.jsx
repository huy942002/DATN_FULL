import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount, applyDiscount } from '../../../features/slices/discountSlice';

function DiscountManagement() {
  const [formData, setFormData] = useState({
    discountId: null,
    discountType: 'PERCENTAGE',
    discountValue: 0,
    startDate: '',
    endDate: '',
    productId: 1,
    isActive: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const dispatch = useDispatch();
  const { discounts, appliedDiscounts, status, error, totalPages, currentPage: reduxPage } = useSelector((state) => state.discounts);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDiscounts({ page: currentPage, size: pageSize }));
    }
  }, [status, dispatch, currentPage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const discount = {
      discountId: formData.discountId,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      product: { productId: parseInt(formData.productId) },
      isActive: formData.isActive,
    };
    if (formData.discountId) {
      dispatch(updateDiscount(discount));
    } else {
      dispatch(createDiscount(discount));
    }
    setShowForm(false);
    setFormData({
      discountId: null,
      discountType: 'PERCENTAGE',
      discountValue: 0,
      startDate: '',
      endDate: '',
      productId: 1,
      isActive: true,
    });
    dispatch(fetchDiscounts({ page: currentPage, size: pageSize }));
  };

  const handleEdit = (discount) => {
    setFormData({
      discountId: discount.discountId,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      startDate: discount.startDate ? discount.startDate.split('T')[0] : '',
      endDate: discount.endDate ? discount.endDate.split('T')[0] : '',
      productId: discount.productId || 1,
      isActive: discount.active,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      dispatch(deleteDiscount(id)).then(() => {
        dispatch(fetchDiscounts({ page: currentPage, size: pageSize }));
      });
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode) {
      alert('Vui lòng nhập mã giảm giá');
      return;
    }
    dispatch(applyDiscount(discountCode));
    setDiscountCode('');
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      dispatch(fetchDiscounts({ page, size: pageSize }));
    }
  };

  return (
    <div className="min-h-screen bg-[#121417] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-semibold">Quản lý giảm giá</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#10b981] text-white text-sm rounded px-4 py-2 hover:bg-[#0f766e] transition"
            >
              Thêm giảm giá
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#374151] text-[#d1d5db] text-sm rounded px-4 py-2 hover:bg-[#4b5563] transition"
            >
              Áp dụng mã giảm giá
            </button>
          </div>
        </div>

        {/* Discount Table */}
        <div className="bg-[#1e2128] rounded-lg p-6">
          {status === 'loading' && <p className="text-white">Đang tải...</p>}
          {error && <p className="text-[#ef4444]">Lỗi: {error}</p>}
          <table className="w-full text-[#9ca3af] text-xs">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="py-3 text-left">ID</th>
                <th className="py-3 text-left">Sản phẩm</th>
                <th className="py-3 text-left">Loại giảm giá</th>
                <th className="py-3 text-left">Giá trị</th>
                <th className="py-3 text-left">Ngày bắt đầu</th>
                <th className="py-3 text-left">Ngày kết thúc</th>
                <th className="py-3 text-left">Trạng thái</th>
                <th className="py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.discountId} className="border-b border-[#374151]">
                  <td className="py-3">{discount.discountId}</td>
                  <td className="py-3">{discount.productId || 'N/A'}</td>
                  <td className="py-3">
                    {discount.discountType === 'PERCENTAGE'
                      ? 'Phần trăm'
                      : discount.discountType === 'FIXED_AMOUNT'
                      ? 'Số tiền cố định'
                      : 'Không giảm giá'}
                  </td>
                  <td className="py-3">
                    {discount.discountType === 'PERCENTAGE'
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>
                  <td className="py-3">{discount.startDate?.split('T')[0] || 'N/A'}</td>
                  <td className="py-3">{discount.endDate?.split('T')[0] || 'N/A'}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        discount.active ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'
                      }`}
                    >
                      {discount.active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-[#3b82f6] hover:text-[#2563eb]"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      onClick={() => handleDelete(discount.discountId)}
                      className="text-[#ef4444] hover:text-[#dc2626]"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded text-sm ${
                currentPage === 0
                  ? 'bg-[#374151] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#10b981] text-white hover:bg-[#0f766e]'
              } transition`}
            >
              Trước
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === i
                      ? 'bg-[#10b981] text-white'
                      : 'bg-[#374151] text-[#d1d5db] hover:bg-[#4b5563]'
                  } transition`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`px-4 py-2 rounded text-sm ${
                currentPage >= totalPages - 1
                  ? 'bg-[#374151] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#10b981] text-white hover:bg-[#0f766e]'
              } transition`}
            >
              Tiếp
            </button>
          </div>
        </div>

        {/* Applied Discounts */}
        {appliedDiscounts.length > 0 && (
          <div className="mt-6 bg-[#1e2128] rounded-lg p-6">
            <h2 className="text-white text-lg font-semibold mb-4">Mã giảm giá đã áp dụng</h2>
            <ul className="text-[#9ca3af] text-xs">
              {appliedDiscounts.map((discount) => (
                <li key={discount.discountId}>
                  Mã: {discount.discountId} - Loại: {discount.discountType} - Giá trị:{' '}
                  {discount.discountType === 'PERCENTAGE'
                    ? `${discount.discountValue}%`
                    : `$${discount.discountValue}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Discount Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1e2128] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-white text-lg font-semibold mb-4">
                {formData.discountId ? 'Chỉnh sửa giảm giá' : 'Thêm giảm giá mới'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 text-[#9ca3af] text-xs">
                <div>
                  <label className="block mb-1">Loại giảm giá</label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  >
                    <option value="NO_DISCOUNT">Không giảm giá</option>
                    <option value="PERCENTAGE">Phần trăm</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Giá trị giảm giá</label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Sản phẩm (ID)</label>
                  <input
                    type="number"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    min="1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label>Hoạt động</label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-[#374151] text-[#9ca3af] rounded px-4 py-2 hover:bg-[#4b5563] transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#10b981] text-white rounded px-4 py-2 hover:bg-[#0f766e] transition"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Apply Discount Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1e2128] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-white text-lg font-semibold mb-4">Áp dụng mã giảm giá</h2>
              <div className="space-y-4 text-[#9ca3af] text-xs">
                <div>
                  <label className="block mb-1">Mã giảm giá</label>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full bg-[#121417] border border-[#374151] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    placeholder="Nhập mã giảm giá"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-[#374151] text-[#9ca3af] rounded px-4 py-2 hover:bg-[#4b5563] transition"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleApplyDiscount}
                    className="bg-[#10b981] text-white rounded px-4 py-2 hover:bg-[#0f766e] transition"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscountManagement;