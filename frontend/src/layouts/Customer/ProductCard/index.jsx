// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const discountPercentage = product.discount
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.productId}`} className="block border p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300">
      <div className="relative">
        {product.discount && discountPercentage > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{discountPercentage}%
          </span>
        )}
        <img
          src={`http://localhost:8080/public/load?imagePath=${encodeURIComponent(product.imageUrl)}`}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-800">
        {product.productName}
      </h3>
      <div className="flex items-center mt-2">
        <span className="text-red-600 text-xl font-bold">
          {product.discountedPrice
            ? `${product.discountedPrice.toLocaleString("vi-VN")}đ`
            : `${product.price.toLocaleString("vi-VN")}đ`}
        </span>
        {product.discount && discountPercentage > 0 && (
          <span className="text-gray-500 line-through ml-2">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
        )}
      </div>
      <div className="flex items-center mt-2 text-yellow-500">
        {"★".repeat(product.rating || 0)}{" "}
        <span className="text-gray-600 ml-2">
          ({product.ratingCount || 0} đánh giá)
        </span>
      </div>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300">
        Xem chi tiết
      </button>
    </Link>
  );
};

export default ProductCard;