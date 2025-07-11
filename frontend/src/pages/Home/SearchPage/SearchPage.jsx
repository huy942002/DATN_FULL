import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../../../layouts/Customer/ProductCard/index";
import { fetchSearchResults, clearSearchResults } from "../../../features/slices/searchSlice";
import { fetchFurnitureTypes, fetchLocations, fetchWoodTypes, fetchStyles } from "../../../features/slices/homeSlice";
import { fetchCraftingTechniques } from "../../../features/slices/craftingTechniqueSlice";
import { fetchPriceRanges } from "../../../features/slices/priceRangeSlice";
import { fetchFunctions } from "../../../features/slices/functionSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const { products, pagination, loading, error } = useSelector((state) => state.search);
  const furnitureTypes = useSelector((state) => state.home.furnitureTypes || []);
  const locations = useSelector((state) => state.home.locations || []);
  const woodTypes = useSelector((state) => state.home.woodTypes || []);
  const styles = useSelector((state) => state.home.styles || []);
  const techniques = useSelector((state) => state.craftingTechniques.craftingTechniques || []);
  const priceRanges = useSelector((state) => state.priceRanges.priceRanges || []);
  const functions = useSelector((state) => state.functions.functions || []);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;
  const [searchParams, setSearchParams] = useState({
    productName: "",
    description: "",
    price: "",
    weight: "",
    dimensions: "",
    styleId: "",
    woodTypeId: "",
    techniqueId: "",
    priceRangeId: "",
    productStatus: "",
    ratingCount: "",
    discountedPrice: "",
    furnitureTypeId: "",
    locationId: "",
    functionId: "",
    discountType: "",
    discountValue: "",
    discountStartDate: "",
    discountEndDate: "",
    discountIsActive: "",
  });

  useEffect(() => {
    dispatch(fetchFurnitureTypes());
    dispatch(fetchLocations());
    dispatch(fetchWoodTypes());
    dispatch(fetchStyles());
    dispatch(fetchCraftingTechniques());
    dispatch(fetchPriceRanges());
    dispatch(fetchFunctions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSearchResults({ page: currentPage, size: pageSize, ...searchParams }));
    return () => dispatch(clearSearchResults()); // Clear on unmount
  }, [dispatch, currentPage, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    dispatch(fetchSearchResults({ page: 0, size: pageSize, ...searchParams }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section className="container mx-auto py-12 px-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 animate-slide-up">Tìm kiếm sản phẩm</h2>
      <form onSubmit={handleSearch} className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="productName"
            value={searchParams.productName}
            onChange={handleInputChange}
            placeholder="Tên sản phẩm"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="description"
            value={searchParams.description}
            onChange={handleInputChange}
            placeholder="Mô tả"
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            value={searchParams.price}
            onChange={handleInputChange}
            placeholder="Giá (VND)"
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            step="0.01"
            name="weight"
            value={searchParams.weight}
            onChange={handleInputChange}
            placeholder="Cân nặng (kg)"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="dimensions"
            value={searchParams.dimensions}
            onChange={handleInputChange}
            placeholder="Kích thước"
            className="p-2 border rounded w-full"
          />
          <select
            name="styleId"
            value={searchParams.styleId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Phong cách</option>
            {styles.map((style) => (
              <option key={style.styleId} value={style.styleId}>
                {style.styleName}
              </option>
            ))}
          </select>
          <select
            name="woodTypeId"
            value={searchParams.woodTypeId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Loại gỗ</option>
            {woodTypes.map((woodType) => (
              <option key={woodType.woodTypeId} value={woodType.woodTypeId}>
                {woodType.woodTypeName}
              </option>
            ))}
          </select>
          <select
            name="techniqueId"
            value={searchParams.techniqueId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Kỹ thuật chế tác</option>
            {techniques.map((technique) => (
              <option key={technique.techniqueId} value={technique.techniqueId}>
                {technique.techniqueName}
              </option>
            ))}
          </select>
          <select
            name="priceRangeId"
            value={searchParams.priceRangeId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Phạm vi giá</option>
            {priceRanges.map((range) => (
              <option key={range.priceRangeId} value={range.priceRangeId}>
                {range.priceRangeName}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="productStatus"
            value={searchParams.productStatus}
            onChange={handleInputChange}
            placeholder="Trạng thái"
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            name="ratingCount"
            value={searchParams.ratingCount}
            onChange={handleInputChange}
            placeholder="Số lượng đánh giá"
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            step="0.01"
            name="discountedPrice"
            value={searchParams.discountedPrice}
            onChange={handleInputChange}
            placeholder="Giá giảm (VND)"
            className="p-2 border rounded w-full"
          />
          <select
            name="furnitureTypeId"
            value={searchParams.furnitureTypeId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Loại nội thất</option>
            {furnitureTypes.map((type) => (
              <option key={type.furnitureTypeId} value={type.furnitureTypeId}>
                {type.typeName}
              </option>
            ))}
          </select>
          <select
            name="locationId"
            value={searchParams.locationId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Vị trí sử dụng</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
          <select
            name="functionId"
            value={searchParams.functionId}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Chức năng</option>
            {functions.map((func) => (
              <option key={func.functionId} value={func.functionId}>
                {func.functionName}
              </option>
            ))}
          </select>
          <select
            name="discountType"
            value={searchParams.discountType}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Loại giảm giá</option>
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED_AMOUNT">Số tiền cố định</option>
          </select>
          <input
            type="number"
            step="0.01"
            name="discountValue"
            value={searchParams.discountValue}
            onChange={handleInputChange}
            placeholder="Giá trị giảm giá"
            className="p-2 border rounded w-full"
          />
          <input
            type="datetime-local"
            name="discountStartDate"
            value={searchParams.discountStartDate}
            onChange={handleInputChange}
            placeholder="Ngày bắt đầu giảm giá"
            className="p-2 border rounded w-full"
          />
          <input
            type="datetime-local"
            name="discountEndDate"
            value={searchParams.discountEndDate}
            onChange={handleInputChange}
            placeholder="Ngày kết thúc giảm giá"
            className="p-2 border rounded w-full"
          />
          <select
            name="discountIsActive"
            value={searchParams.discountIsActive}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          >
            <option value="">Trạng thái giảm giá</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
          <button
            type="submit"
            className="bg-blue-800 text-white p-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Tìm kiếm
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin-slow" />
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500 animate-fade-in">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product.productId}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full animate-fade-in">
                Không có sản phẩm để hiển thị.
              </p>
            )}
          </div>
          {products.length > 0 && (
            <div className="text-center mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                <span>
                  Trang {currentPage + 1} của {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage + 1 >= totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
              <Link to="/">
                <button
                  className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 ease-out hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  Quay lại Trang chủ
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default SearchPage;