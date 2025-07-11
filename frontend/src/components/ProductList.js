import React from "react";
import ProductCard from "../layouts/Customer/ProductCard/index";

const products = [
  {
    id: 1,
    name: "Ghế Sofa MOHO HALDEN 801",
    price: "8,290,000đ",
    oldPrice: "10,790,000đ",
    discount: "-23%",
    image: "https://source.unsplash.com/300x300/?sofa",
    rating: 5,
    sold: 7,
  },
  {
    id: 2,
    name: "Ghế Sofa MOHO LYNGBY 601",
    price: "7,999,000đ",
    oldPrice: "10,799,000đ",
    discount: "-26%",
    image: "https://source.unsplash.com/300x300/?sofa",
    rating: 4,
    sold: 8,
  },
  {
    id: 33,
    name: "Ghế Sofa MOHO LYNGBY 601",
    price: "7,999,000đ",
    oldPrice: "10,799,000đ",
    discount: "-26%",
    image: "https://source.unsplash.com/300x300/?sofa",
    rating: 4,
    sold: 8,
  },
  {
    id: 4,
    name: "Ghế Sofa MOHO LYNGBY 601",
    price: "7,999,000đ",
    oldPrice: "10,799,000đ",
    discount: "-26%",
    image: "https://source.unsplash.com/300x300/?sofa",
    rating: 4,
    sold: 8,
  },
];

const ProductList = ({ title }) => {
  return (
    <section className="container mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
