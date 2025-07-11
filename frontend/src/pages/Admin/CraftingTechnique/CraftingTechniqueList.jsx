import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCraftingTechniques, deleteCraftingTechnique, setSearch, setIsActive, setPage, setPageSize } from '../../../features/slices/craftingTechniqueSlice';

const CraftingTechniqueList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    filteredCraftingTechniques, 
    currentPage, 
    pageSize, 
    search, 
    isActive, 
    loading, 
    error 
  } = useSelector((state) => state.craftingTechniques);

  useEffect(() => {
    dispatch(fetchCraftingTechniques());
  }, [dispatch]);

  const handleEdit = (craftingTechnique) => {
    navigate('/admin/craftingTechniqueForm', { state: { craftingTechnique } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crafting technique?')) {
      try {
        await dispatch(deleteCraftingTechnique(id)).unwrap();
        toast.success('Crafting technique deleted successfully');
      } catch (error) {
        toast.error(`Failed to delete crafting technique: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleIsActiveFilter = (e) => {
    const value = e.target.value === '' ? undefined : e.target.value === 'true';
    dispatch(setIsActive(value));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (e) => {
    dispatch(setPageSize(Number(e.target.value)));
  };

  const totalPages = Math.ceil(filteredCraftingTechniques.length / pageSize);
  const paginatedTechniques = filteredCraftingTechniques.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Crafting Techniques</h2>
      <div className="flex justify-between mb-4">
        <div>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={isActive === undefined ? '' : isActive}
            onChange={handleIsActiveFilter}
            className="ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <button
          onClick={() => navigate('/admin/craftingTechniqueForm')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Crafting Technique
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Active</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTechniques.map((craftingTechnique) => (
            <tr key={craftingTechnique.techniqueId}>
              <td className="py-2 px-4 border">{craftingTechnique.techniqueId}</td>
              <td className="py-2 px-4 border">{craftingTechnique.techniqueName}</td>
              <td className="py-2 px-4 border">{craftingTechnique.description || '-'}</td>
              <td className="py-2 px-4 border">{craftingTechnique.active ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border">
                <button
                  onClick={() => handleEdit(craftingTechnique)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(craftingTechnique.techniqueId)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <div className="flex">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded mr-2 hover:bg-blue-500 hover:text-white disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded hover:bg-blue-500 hover:text-white disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CraftingTechniqueList;