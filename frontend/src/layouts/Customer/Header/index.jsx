import React, { useEffect } from "react";
import { Carousel } from "flowbite-react";
import Slide from "../../../components/Slide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchStyles } from "../../../features/slices/styleSlice";
import { fetchWoodTypes } from "../../../features/slices/woodTypeSlice";
import { fetchLocations } from "../../../features/slices/locationSlice";
import { fetchFurnitureTypes } from "../../../features/slices/furnitureTypeSlice";

const HeroSection = () => {
  const dispatch = useDispatch();
  const styles = useSelector((state) => state.styles.styles || []);
  const woodTypes = useSelector((state) => state.woodTypes.woodTypes || []);
  const locations = useSelector((state) => state.locations.locations || []);
  const furnitureTypes = useSelector((state) => state.furnitureTypes.furnitureTypes || []);
  const cartItems = useSelector((state) => state.cart.items || []); // Get cart items from Redux
  const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") || "{}") : null;
  useEffect(() => {
    dispatch(fetchStyles());
    dispatch(fetchWoodTypes());
    dispatch(fetchLocations());
    dispatch(fetchFurnitureTypes());
  }, [dispatch]);

  const slides = [
    {
      image: "https://cdn.pixabay.com/photo/2016/11/19/13/06/bedroom-1839183_960_720.jpg",
      title: "Bàn Ghế Tối Giản",
      description: "Thiết kế tinh tế, giảm giá 37% hôm nay!",
      discountPercentage: 37,
    },
    {
      image: "https://cdn.pixabay.com/photo/2015/10/20/18/57/furniture-998265_960_720.jpg",
      title: "Sofa Hiện Đại",
      description: "Nội thất cao cấp với ưu đãi đặc biệt",
      discountPercentage: 37,
    },
    {
      image: "https://cdn.pixabay.com/photo/2014/08/11/21/40/bedroom-416062_960_720.jpg",
      title: "Giường Ngủ Đẳng Cấp",
      description: "Giấc ngủ hoàn hảo với giảm giá 37%",
      discountPercentage: 37,
    },
    {
      image: "https://cdn.pixabay.com/photo/2016/06/10/01/05/hotel-room-1447201_960_720.jpg",
      title: "Tủ Quần Áo Sang Trọng",
      description: "Khuyến mãi đặc biệt cho nội thất cao cấp",
      discountPercentage: 37,
    },
  ];

  return (
    <header className="bg-white">
      {/* Header với menu điều hướng */}
      <div className="container mx-auto px-6 py-2 flex justify-between items-center border-b">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-2xl font-bold text-blue-800">NHH CITY</a>
          <nav className="flex space-x-5">
            <a href="/products" className="text-blue-800 hover:text-blue-600">Sản Phẩm</a>
            <a href="/" className="text-blue-800 hover:text-blue-600">Về Chúng Tôi</a>
            <a href="/" className="text-blue-800 hover:text-blue-600">Liên Hệ</a>
            <a href="/search" className="text-blue-800 hover:text-blue-600">Tìm Kiếm</a>
            <a href="/cart" className="text-lg relative">
              <FontAwesomeIcon icon={faHeart} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4"> 
          <a href="/login" className="text-blue-800 hover:text-blue-600">Đăng Nhập</a>
          <FontAwesomeIcon icon={faUser} className="text-blue-800 hover:text-blue-600" />
        </div>
      </div>

      {/* Carousel */}
      <div className="h-[400px] md:h-[500px]">
        <Carousel>
          {slides.map((slide, index) => (
            <Slide
              key={index}
              image={slide.image}
              title={slide.title}
              description={slide.description}
              discountPercentage={slide.discountPercentage}
            />
          ))}
        </Carousel>
      </div>

      {/* Phần tìm kiếm sản phẩm */}
      {/* <div className="container mx-auto px-6 py-6 bg-white text-center">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Tìm Nội Thất Của Bạn</h2>
        <div className="flex justify-center space-x-4 flex-wrap">
          <input
            type="text"
            placeholder="Tên nội thất,SKU (Sofa, Giường...)"
            className="p-2 border rounded w-full sm:w-auto"
            name="productName"
          />
          <select
            className="p-2 border rounded w-full sm:w-auto"
            name="furnitureTypeId"
          >
            <option value="">Loại nội thất</option>
            {furnitureTypes.map((type) => (
              <option key={type.furnitureTypeId} value={type.furnitureTypeId}>
                {type.typeName}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded w-full sm:w-auto"
            name="locationId"
          >
            <option value="">Nơi sử dụng</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded w-full sm:w-auto"
            name="woodTypeId"
          >
            <option value="">Loại gỗ</option>
            {woodTypes.map((woodType) => (
              <option key={woodType.woodTypeId} value={woodType.woodTypeId}>
                {woodType.woodTypeName}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded w-full sm:w-auto"
            name="styleId"
          >
            <option value="">Phong cách</option>
            {styles.map((style) => (
              <option key={style.styleId} value={style.styleId}>
                {style.styleName}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Giá (VND)"
            className="p-2 border rounded w-full sm:w-auto"
            name="price"
          />
          <button className="bg-blue-800 text-white p-2 rounded hover:bg-blue-600 w-full sm:w-auto">
            <FontAwesomeIcon icon={faSearch} /> Tìm Kiếm
          </button>
        </div>
      </div> */}
    </header>
  );
};

export default HeroSection;