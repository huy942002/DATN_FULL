import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials, deleteMaterial } from '../../../features/slices/materialSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const MaterialList = () => {
  const dispatch = useDispatch();
  const materials = useSelector((state) => state.material.materials);
  const loading = useSelector((state) => state.material.loading);
  const navigate = useNavigate(); // Dùng để điều hướng khi cần

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteMaterial(id))
      .then(() => {
        toast.success('Category deleted successfully');
      })
      .catch(() => {
        toast.error('Error deleting category');
      });
  };

  const handleEdit = (material) => {
    // setEditCategory(category); // Lưu danh mục cần chỉnh sửa vào trạng thái
    navigate('/admin/materialForm', { state: { material } }); // Điều hướng đến trang chỉnh sửa
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Material List</h2>
      <Link to="/admin/materialForm">
        <button className="mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Thêm Mới
        </button>
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Material Name</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.materialId} className="bg-white border-b hover:bg-gray-100">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{material.materialName}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{material.description}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  <button
                    onClick={() => handleEdit(material)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material.materialId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialList;
