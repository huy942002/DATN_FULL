import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCategories, deleteCategory } from './../../../features/slices/categorySlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'; // Cập nhật thêm Link và useNavigate

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const loading = useSelector((state) => state.category.loading);
  const navigate = useNavigate(); // Dùng để điều hướng khi cần

  useEffect(() => {
    dispatch(GetAllCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCategory(id))
      .then(() => {
        toast.success('Category deleted successfully');
      })
      .catch(() => {
        toast.error('Error deleting category');
      });
  };

  const handleEdit = (category) => {
    // setEditCategory(category); // Lưu danh mục cần chỉnh sửa vào trạng thái
    navigate('/admin/categoryForm', { state: { category } }); // Điều hướng đến trang chỉnh sửa
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Category List</h2>

      {/* Nút Thêm */}
      <Link to="/admin/categoryForm">
        <button className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Thêm Danh Mục
        </button>
      </Link>

      {/* Bảng Hiển thị Dữ Liệu */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">#</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Category Name</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.categoryID}>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{category.categoryId}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{category.categoryName}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                {/* Nút Chỉnh sửa */}
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Chỉnh sửa
                </button>

                {/* Nút Xóa */}
                <button
                  onClick={() => handleDelete(category.categoryId)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
