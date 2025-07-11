import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard/index";
import { fetchProducts } from "../../../features/slices/homeSlice";

const ProductList = ({ title, sectionType }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.home.products);
  const loading = useSelector((state) => state.home.loading);
  const error = useSelector((state) => state.home.error);
  const sectionProducts = products[sectionType] || [];

  useEffect(() => {
    dispatch(fetchProducts({ sectionType, page: 0, size: 4 })); // Fetch only 4 products
  }, [dispatch, sectionType]);

  return (
    <section className="container mx-auto py-12 px-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 animate-slide-up">{title}</h2>
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
              sectionProducts.slice(0, 4).map((product, index) => ( // Limit to 4 products
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
              <Link to={`/products/${sectionType}`}>
                <button
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform duration-200 ease-out hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  Xem thêm
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductList;