import React from "react";
import { Provider } from "react-redux";
import store from "../../features/store";
import HeroSection from "../../layouts/Customer/Header/index";
import ProductList from "../../layouts/Customer/ProductList/ProductList";
import Footer from "../../layouts/Customer/Footer/index";
import TrustSection from "../../layouts/Customer/TrustSection/TrustSection";

const Home = () => {
  return (
    <Provider store={store}>
      <div className="font-roboto">
        <ProductList title="SẢN PHẨM NỔI BẬT" sectionType="featured" />
        <ProductList title="GỢI Ý CHO BẠN" sectionType="suggestions" />
        <ProductList title="SẢN PHẨM MỚI NHẤT" sectionType="newest" />
        <ProductList title="COMBO GIÁ TỐT" sectionType="deals" />
        <ProductList title="KHUYẾN MÃI ĐẶC BIỆT" sectionType="promotions" />
      </div>
    </Provider>
  );
};

export default Home;