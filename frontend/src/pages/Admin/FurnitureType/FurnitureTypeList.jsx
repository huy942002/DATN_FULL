import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchFurnitureTypes, deleteFurnitureType, setSearch, setIsActive, setPage, setPageSize } from '../../../features/slices/furnitureTypeSlice';

const FurnitureTypeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        filteredFurnitureTypes,
        currentPage,
        pageSize,
        search,
        isActive,
        loading,
        error
    } = useSelector((state) => state.furnitureTypes);

    useEffect(() => {
        dispatch(fetchFurnitureTypes());
    }, [dispatch]);

    const handleEdit = (furnitureType) => {
        navigate('/admin/furnitureTypeForm', { state: { furnitureType } });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this furniture type?')) {
            try {
                await dispatch(deleteFurnitureType(id)).unwrap();
                toast.success('Furniture type deleted successfully');
            } catch (error) {
                toast.error(`Failed to delete furniture type: ${error.message || 'Unknown error'}`);
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

    const totalPages = Math.ceil(filteredFurnitureTypes.length / pageSize);
    const paginatedTypes = filteredFurnitureTypes.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-600 text-lg">Error: {error}</p>;

    return (
        <div className="container mx-auto px-6 py-8 max-w-7xl bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Furniture Types</h2>
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
                    onClick={() => navigate('/admin/furnitureTypeForm')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 w-full sm:w-auto"
                >
                    Add New Furniture Type
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
                        {paginatedTypes.map((furnitureType) => (
                            <tr key={furnitureType.furnitureTypeId} className="hover:bg-gray-50 transition duration-150">
                                <td className="py-4 px-6 border-b text-gray-600">{furnitureType.furnitureTypeId}</td>
                                <td className="py-4 px-6 border-b text-gray-600">{furnitureType.typeName}</td>
                                <td className="py-4 px-6 border-b text-gray-600">{furnitureType.description || '-'}</td>
                                <td className="py-4 px-6 border-b text-gray-600">{furnitureType.active ? 'Yes' : 'No'}</td>
                                <td className="py-4 px-6 border-b">
                                    <button
                                        onClick={() => handleEdit(furnitureType)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600 transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(furnitureType.furnitureTypeId)}
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

export default FurnitureTypeList;