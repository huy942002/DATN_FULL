import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../../layouts/Customer/ProductCard/index";
import { fetchProducts } from "../../../features/slices/homeSlice";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { sectionType } = useParams();
  const products = useSelector((state) => state.home.products);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);
  const pagination = useSelector((state) => state.home.pagination[sectionType] || {});
  const sectionProducts = products[sectionType] || [];
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20; // Set to 20 items per page

  useEffect(() => {
    dispatch(fetchProducts({ sectionType, page: currentPage, size: pageSize }));
  }, [dispatch, sectionType, currentPage, pageSize]);

  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Manual translation mapping for sectionType
  const translateSectionType = (type) => {
    const translations = {
      featured: "Nổi bật",
      suggestions: "Gợi ý",
      newest: "Mới nhất",
      deals: "Combo giá tốt",
      promotions: "Khuyến mãi",
    };
    return translations[type] || type.charAt(0).toUpperCase() + type.slice(1); // Fallback to capitalized English
  };

  const title = `Tất cả ${translateSectionType(sectionType)} Sản phẩm`;

  return (
    <section className="container mx-auto py-12 px-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 animate-slide-up">
        {title}
      </h2>
      {loading.products ? (
        <div className="text-center py-6">
          <div className="inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin-slow" />
        </div>
      ) : error.products ? (
        <div className="text-center py-6 text-red-500 animate-fade-in">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sectionProducts.length > 0 ? (
              sectionProducts.map((product, index) => (
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
          {sectionProducts.length > 0 && (
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
                  Page {currentPage + 1} of {totalPages}
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
                  Back to Home
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AllProducts;