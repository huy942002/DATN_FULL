import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductColors, deleteProductColor } from '../../../features/slices/productColorSlice';
import { toast } from 'react-toastify';
import { Link,useNavigate } from 'react-router-dom'; // Để sử dụng với React Router

const ProductColorList = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate(); // Dùng để điều hướng khi cần
  const productColors = useSelector((state) => state.productColors);

  useEffect(() => {
    dispatch(getProductColors());
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProductColor(id));
      toast.success('Product color deleted');
    } catch (error) {
      toast.error('Error while deleting product color');
    }
  };

  const handleEdit = (color) => {
    // setEditCategory(category); // Lưu danh mục cần chỉnh sửa vào trạng thái
    navigate('/admin/productColorForm', { state: { color } }); // Điều hướng đến trang chỉnh sửa
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Colors</h2>

      {/* Nút Thêm */}
      <Link to="/admin/ProductColorForm">
        <button className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Thêm Màu Mới
        </button>
      </Link>

      {/* Bảng Hiển thị Dữ Liệu */}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">#</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Color Name</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Hex Code</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Image</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productColors.map((color) => (
            <tr key={color.id}>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{color.colorID}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{color.colorName}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{color.colorHexCode}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                {color.imageURL ? (
                  <img src={`http://localhost:8080/public/images/colors/${color.imageURL}`} alt={color.colorName} className="w-16 h-16 rounded-full" />
                ) : (
                  'No image'
                )}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
              <button
                  onClick={() => handleEdit(color)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(color.colorID)}
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

export default ProductColorList;
