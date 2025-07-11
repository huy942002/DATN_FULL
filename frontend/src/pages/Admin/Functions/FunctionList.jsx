import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunctions, deleteFunction } from '../../../features/slices/functionSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'; // Cập nhật thêm Link và useNavigate

const FunctionList = () => {
  const dispatch = useDispatch();
  const { functions, loading, error } = useSelector((state) => state.functions);
  const navigate = useNavigate(); // Dùng để điều hướng khi cần
  useEffect(() => {
    dispatch(fetchFunctions());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this function?')) {
      dispatch(deleteFunction(id))
        .unwrap()
        .then(() => toast.success('Function deleted successfully'))
        .catch(() => toast.error('Failed to delete function'));
    }
  };

  const handleEdit = (functions) => {
   
    navigate('/admin/functionForm', { state: { functions } }); // Điều hướng đến trang chỉnh sửa
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách tính năng sử dụng</h2>
      <Link to="/add-function" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Function
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
          {functions.map((func) => (
            <tr key={func.functionId}>
              <td className="py-2 px-4 border">{func.functionId}</td>
              <td className="py-2 px-4 border">{func.functionName}</td>
              <td className="py-2 px-4 border">{func.description}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(func)}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(func.functionId)}
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

export default FunctionList;