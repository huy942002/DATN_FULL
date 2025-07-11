import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchPriceRanges, deletePriceRange, setSearch, setIsActive, setPage, setPageSize } from '../../../features/slices/priceRangeSlice';

const PriceRangeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    filteredPriceRanges, 
    currentPage, 
    pageSize, 
    search, 
    isActive, 
    loading, 
    error 
  } = useSelector((state) => state.priceRanges);

  useEffect(() => {
    dispatch(fetchPriceRanges());
  }, [dispatch]);

  const handleEdit = (priceRange) => {
    navigate('/admin/priceRangeForm', { state: { priceRange } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price range?')) {
      try {
        await dispatch(deletePriceRange(id)).unwrap();
        toast.success('Price range deleted successfully');
      } catch (error) {
        toast.error(`Failed to delete price range: ${error.message || 'Unknown error'}`);
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

  const totalPages = Math.ceil(filteredPriceRanges.length / pageSize);
  const paginatedRanges = filteredPriceRanges.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Price Ranges</h2>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
          <select
            value={isActive === undefined ? '' : isActive.toString()}
            onChange={handleIsActiveFilter}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-24"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
        <button
          onClick={() => navigate('/admin/priceRangeForm')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
        >
          Add New Price Range
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6 border-b text-left text-gray-700 font-semibold">ID</th>
              <th className="py-4 px-6 border-b text-left text-gray-700 font-semibold">Name</th>
              <th className="py-4 px-6 border-b text-left text-gray-700 font-semibold">Description</th>
              <th className="py-4 px-6 border-b text-left text-gray-700 font-semibold">Active</th>
              <th className="py-4 px-6 border-b text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRanges.map((priceRange) => (
              <tr key={priceRange.priceRangeId} className="hover:bg-gray-50 transition duration-150">
                <td className="py-4 px-6 border-b text-gray-600">{priceRange.priceRangeId}</td>
                <td className="py-4 px-6 border-b text-gray-600">{priceRange.priceRangeName}</td>
                <td className="py-4 px-6 border-b text-gray-600">{priceRange.description || '-'}</td>
                <td className="py-4 px-6 border-b text-gray-600">{priceRange.active ? 'Yes' : 'No'}</td>
                <td className="py-4 px-6 border-b">
                  <button
                    onClick={() => handleEdit(priceRange)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(priceRange.priceRangeId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeList;