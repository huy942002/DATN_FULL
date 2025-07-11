import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStyles, deleteStyle } from '../../../features/slices/styleSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const StyleList = () => {
  const dispatch = useDispatch();
  const { styles, loading, error } = useSelector((state) => state.styles);
  const navigate = useNavigate(); // Dùng để điều hướng khi cần
  useEffect(() => {
    dispatch(fetchStyles());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this style?')) {
      dispatch(deleteStyle(id))
        .unwrap()
        .then(() => toast.success('Style deleted successfully'))
        .catch(() => toast.error('Failed to delete style'));
    }
  };

  const handleEdit = (style) => {
    // setEditCategory(category); // Lưu danh mục cần chỉnh sửa vào trạng thái
    navigate('/admin/styleForm', { state: { style } }); // Điều hướng đến trang chỉnh sửa
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Style List</h2>
      <Link to="/add-style" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Style
      </Link>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {styles.map((style) => (
            <tr key={style.styleId}>
              <td className="py-2 px-4 border">{style.styleId}</td>
              <td className="py-2 px-4 border">{style.styleName}</td>
              <td className="py-2 px-4 border">{style.description}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(style)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(style.styleId)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StyleList;