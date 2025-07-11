// src/components/Slide.jsx
import React from "react";

const Slide = ({ image, title, description, discountPercentage }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 text-black p-4 rounded-lg text-center shadow-lg max-w-md">
        <h2 className="text-3xl font-bold text-green-700">{title}</h2>
        {discountPercentage && (
          <div className="mt-2 text-xl font-semibold text-red-500">
            Giảm Giá <span className="text-4xl">{discountPercentage}%</span>
          </div>
        )}
        <p className="mt-2 text-md">{description}</p>
      </div>
    </div>
  );
};

export default Slide;