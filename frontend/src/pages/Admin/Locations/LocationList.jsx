import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations, deleteLocation, setSearch, setIsActive, setPage, setPageSize } from '../../../features/slices/locationSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const LocationList = () => {
    const dispatch = useDispatch();
    const { locations, filteredLocations, loading, error, currentPage, pageSize, search, isActive } = useSelector((state) => state.locations);

    const [searchInput, setSearchInput] = useState(search);

    const navigate = useNavigate(); // Dùng để điều hướng khi cần

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            dispatch(deleteLocation(id))
                .unwrap()
                .then(() => {
                    toast.success('Location deleted successfully');
                })
                .catch(() => toast.error('Failed to delete location'));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearch(searchInput));
    };

    const handleIsActiveChange = (e) => {
        const value = e.target.value === '' ? undefined : e.target.value === 'true';
        dispatch(setIsActive(value));
    };

    const handlePageSizeChange = (e) => {
        dispatch(setPageSize(Number(e.target.value)));
    };

    const handlePageChange = ({ selected }) => {
        dispatch(setPage(selected));
    };

    const handleEdit = (locationss) => {

        navigate('/admin/locationForm', { state: { locationss } }); // Điều hướng đến trang chỉnh sửa
    };

    // Tính toán dữ liệu phân trang tại frontend
    const totalItems = Array.isArray(filteredLocations) ? filteredLocations.length : 0;
    const totalPages = Math.ceil(totalItems / pageSize) || 1; // Đảm bảo ít nhất 1 trang
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const currentLocations = Array.isArray(filteredLocations) ? filteredLocations.slice(startIndex, endIndex) : [];

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Location List</h2>
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <label htmlFor="search" className="mr-2 text-gray-700">Search:</label>
                        <input
                            id="search"
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="p-2 border rounded"
                            placeholder="Search by name"
                        />
                        <button
                            onClick={handleSearch}
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Search
                        </button>
                    </div>
                    <div>
                        <label htmlFor="isActive" className="mr-2 text-gray-700">Filter by Status:</label>
                        <select
                            id="isActive"
                            value={isActive === undefined ? '' : isActive}
                            onChange={handleIsActiveChange}
                            className="p-2 border rounded"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pageSize" className="mr-2 text-gray-700">Items per page:</label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="p-2 border rounded"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
                <Link to="/add-location" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Location
                </Link>
            </div>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Description</th>
                        <th className="py-2 px-4 border">Status</th>
                        <th className="py-2 px-4 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLocations.length > 0 ? (
                        currentLocations.map((location) => (
                            <tr key={location.locationId}>
                                <td className="py-2 px-4 border">{location.locationId}</td>
                                <td className="py-2 px-4 border">{location.locationName}</td>
                                <td className="py-2 px-4 border">{location.description}</td>
                                <td className="py-2 px-4 border">{location.active ? 'Active' : 'Inactive'}</td>
                                <td className="py-2 px-4 border">
                                    <button
                                        onClick={() => handleEdit(location)}
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(location.locationId)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="py-2 px-4 border text-center">
                                No locations found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'flex justify-center space-x-2'}
                    pageClassName={'px-3 py-1 border rounded'}
                    pageLinkClassName={'text-gray-700'}
                    previousClassName={'px-3 py-1 border rounded'}
                    previousLinkClassName={'text-gray-700'}
                    nextClassName={'px-3 py-1 border rounded'}
                    nextLinkClassName={'text-gray-700'}
                    breakClassName={'px-3 py-1'}
                    activeClassName={'bg-blue-500 text-white'}
                    disabledClassName={'opacity-50 cursor-not-allowed'}
                    forcePage={currentPage}
                />
                <div className="text-center mt-2">
                    <span>Page {currentPage + 1} of {totalPages} | Total items: {totalItems}</span>
                </div>
            </div>
        </div>
    );
};

export default LocationList;