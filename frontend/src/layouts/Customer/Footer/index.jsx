// src/layouts/Customer/Footer/index.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-lg font-bold mb-4">Sản phẩm</h3>
          <ul>
            <li className="text-gray-300 hover:text-white cursor-pointer">Sofa</li>
            <li className="text-gray-300 hover:text-white cursor-pointer mt-2">Giường</li>
            <li className="text-gray-300 hover:text-white cursor-pointer mt-2">Nội thất</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Trợ giúp</h3>
          <ul>
            <li className="text-gray-300 hover:text-white cursor-pointer">Câu hỏi thường gặp</li>
            <li className="text-gray-300 hover:text-white cursor-pointer mt-2">Chính sách bảo mật</li>
            <li className="text-gray-300 hover:text-white cursor-pointer mt-2">Hướng dẫn mua hàng</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Cửa hàng</h3>
          <p className="text-gray-300">Số 10, đường 4A, Hát Môn, Hà Nội</p>
          <p className="text-gray-300 mt-2">Hotline: 1900-123-456</p>
          <p className="text-gray-300 mt-2">Email: support@nhhcity.com</p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Theo dõi chúng tôi</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
            <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-400">
        © 2025 NHH CITY. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;