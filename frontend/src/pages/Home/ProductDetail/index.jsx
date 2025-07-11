import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StarIcon, TagIcon, ScaleIcon, ViewfinderCircleIcon, CheckCircleIcon, XCircleIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    getProductById
} from "../../../features/slices/productSlice";
import {
    fetchProductImages
} from "../../../features/slices/productImageSlice";
import { getProductColors } from "../../../features/slices/productColorSlice";
import { fetchWoodTypes } from "../../../features/slices/woodTypeSlice";
import { fetchStyles } from "../../../features/slices/styleSlice";
import { GetAllCategories } from "../../../features/slices/categorySlice";
import { fetchFurnitureTypes } from "../../../features/slices/furnitureTypeSlice";
import { fetchLocations } from "../../../features/slices/locationSlice";
import { fetchFunctions } from "../../../features/slices/functionSlice";
import { fetchCraftingTechniques } from "../../../features/slices/craftingTechniqueSlice";
import { fetchPriceRanges } from "../../../features/slices/priceRangeSlice";
import { addToCart } from "../../../features/slices/cartSlice";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const sliderRef = useRef(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const {
        currentProduct,
        loading: productLoading,
        error: productError,
    } = useSelector((state) => state.products);
    const productImage = useSelector((state) => state.productImages.images || []);
    const productColors = useSelector((state) => state.productColors || []);
    const woodTypes = useSelector((state) => state.woodTypes.woodTypes || []);
    const styles = useSelector((state) => state.styles.styles || []);
    const categories = useSelector((state) => state.category.categories || []);
    const furnitureTypes = useSelector((state) => state.furnitureTypes.furnitureTypes || []);
    const locations = useSelector((state) => state.locations.locations || []);
    const functions = useSelector((state) => state.functions.functions || []);
    const techniques = useSelector((state) => state.craftingTechniques.craftingTechniques || []);
    const priceRanges = useSelector((state) => state.priceRanges.priceRanges || []);

    const productImages = productImage.length > 0
        ? productImage
            .filter(img => img && img.imageUrl)
            .map((img) => ({
                src: `http://localhost:8080/public/load?imagePath=${encodeURIComponent(img.imageUrl || "")}`,
                alt: img.imageAltText || (currentProduct ? currentProduct.productName : "Hình ảnh mặc định"),
            }))
        : (currentProduct && currentProduct.productDetails ? currentProduct.productDetails : [])
            .filter(detail => detail && detail.imageUrl)
            .map((detail) => ({
                src: `http://localhost:8080/public/load?imagePath=${encodeURIComponent(detail.imageUrl || "")}`,
                alt: detail.metaTagTitle || (currentProduct ? currentProduct.productName : "Hình ảnh mặc định"),
            }));

    if (productImages.length === 0) {
        productImages.push({
            src: "https://cdn.pixabay.com/photo/2015/10/20/18/57/furniture-998265_960_720.jpg",
            alt: "Hình ảnh mặc định",
        });
    }

    useEffect(() => {
        if (id) {
            dispatch(getProductById(id));
            dispatch(fetchProductImages(id));
            dispatch(getProductColors());
            dispatch(fetchWoodTypes());
            dispatch(fetchStyles());
            dispatch(GetAllCategories());
            dispatch(fetchFurnitureTypes());
            dispatch(fetchLocations());
            dispatch(fetchFunctions());
            dispatch(fetchCraftingTechniques());
            dispatch(fetchPriceRanges());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProduct && currentProduct.productDetails && currentProduct.productDetails.length > 0) {
            setSelectedDetail(currentProduct.productDetails[0]);
        }
    }, [currentProduct]);

    useEffect(() => {
        if (selectedDetail && selectedDetail.imageUrl && sliderRef.current) {
            const imageIndex = productImages.findIndex(
                (img) => img.src.includes(encodeURIComponent(selectedDetail.imageUrl))
            );
            if (imageIndex !== -1) {
                sliderRef.current.slickGoTo(imageIndex);
            }
        }
    }, [selectedDetail, productImages]);

    const handleAddToCart = () => {
        if (!selectedDetail || !currentProduct) return;

        const cartItem = {
            productId: currentProduct.productId,
            productDetailsId: selectedDetail.productDetailsId,
            productName: currentProduct.productName,
            price: discountedPrice,
            quantity,
            image: productImages[0]?.src,
            color: productColors.find((c) => c.colorId === selectedDetail.colorId)?.colorName,
        };

        dispatch(addToCart(cartItem));
        alert("Đã thêm vào giỏ hàng thành công!");
    };

    if (productLoading) return <div className="text-center py-10 text-gray-700 text-base">Đang tải...</div>;
    if (productError) return <div className="text-center py-10 text-red-500 text-base">Lỗi: {productError}</div>;
    if (!currentProduct) return <div className="text-center py-10 text-gray-700 text-base">Sản phẩm không tìm thấy</div>;

    const basePrice = selectedDetail ? selectedDetail.price : currentProduct.price;
    let discountedPrice = basePrice;
    let discountAmount = 0;

    if (currentProduct.discount && currentProduct.discount.discountType !== "none") {
        if (currentProduct.discount.discountType === "PERCENTAGE") {
            discountAmount = (basePrice * (currentProduct.discount.discountValue || 0)) / 100;
        } else {
            discountAmount = currentProduct.discount.discountValue || 0;
        }
        discountedPrice = basePrice - discountAmount;
    }

    const discountPercentage = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: false,
    };

    const metaTagTitle = selectedDetail?.metaTagTitle || (currentProduct?.productName || "Chi tiết sản phẩm");
    const metaTagDescription = selectedDetail?.metaTagDescription || (currentProduct?.description || "Không có mô tả");
    const metaTagKeywords = selectedDetail?.metaKeywords || "";

    return (
        <>
            <Helmet>
                <title>{metaTagTitle}</title>
                <meta name="description" content={metaTagDescription} />
                <meta name="keywords" content={metaTagKeywords} />
            </Helmet>
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-700 text-base leading-relaxed">
                <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 border-b border-gray-200">
                    <nav className="flex items-center text-base text-gray-400 space-x-2 select-none">
                        <span>Trang chủ</span>
                        <span>-</span>
                        <span>Chi tiết sản phẩm</span>
                    </nav>
                </header>

                <main className="flex-1 px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 max-w-7xl mx-auto">
                        <aside className="w-full md:w-[400px] flex-shrink-0 space-y-6">
                            <section className="bg-white rounded-lg p-6 border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Hình ảnh sản phẩm</h2>
                                <Slider ref={sliderRef} {...sliderSettings}>
                                    {productImages.map((image, index) => (
                                        <div key={index}>
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-[300px] object-cover rounded-lg"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </section>
                        </aside>

                        <section className="w-full">
                            <div className="bg-white rounded-lg p-8 border border-gray-200 space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-700">{currentProduct.productName}</h2>
                                    <div className="flex items-center space-x-2">
                                        {discountPercentage > 0 && (
                                            <span className="text-lg text-gray-500 line-through">{basePrice.toLocaleString("vi-VN")}đ</span>
                                        )}
                                        <span className={discountPercentage > 0 ? "text-2xl font-semibold text-red-600" : "text-2xl font-semibold text-gray-900"}>
                                            {discountedPrice.toLocaleString("vi-VN")}đ
                                        </span>
                                        {discountPercentage > 0 && (
                                            <span className="text-red-500 text-sm">(-{discountPercentage}%)</span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <StarIcon
                                                    key={star}
                                                    className={classNames(
                                                        star <= (currentProduct.rating || 0) ? "text-yellow-400" : "text-gray-300",
                                                        "h-5 w-5"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <p className="ml-2 text-sm text-gray-600">({currentProduct.ratingCount || 0} đánh giá)</p>
                                    </div>
                                </div>

                                {/* Moved Thông tin sản phẩm above Chọn màu sắc */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-700">Thông tin sản phẩm</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start bg-gray-100 p-4 rounded-lg">
                                            <ScaleIcon className="h-6 w-6 text-blue-600 mr-3" />
                                            <div>
                                                <h3 className="text-base font-medium text-gray-700">Cân nặng</h3>
                                                <p className="text-sm text-gray-600">{currentProduct.weight || "Chưa xác định"} kg</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start bg-gray-100 p-4 rounded-lg">
                                            <ViewfinderCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                                            <div>
                                                <h3 className="text-base font-medium text-gray-700">Kích thước</h3>
                                                <p className="text-sm text-gray-600">{currentProduct.dimensions || "Chưa xác định"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start bg-gray-100 p-4 rounded-lg">
                                            <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                                            <div>
                                                <h3 className="text-base font-medium text-gray-700">Trạng thái</h3>
                                                <p className="text-sm text-gray-600">
                                                    {currentProduct.productStatus === "Available" ? "Có hàng" : currentProduct.productStatus === "Manufactured Goods" ? "Đặt hàng" : "Chưa xác định"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start bg-gray-100 p-4 rounded-lg">
                                            <TagIcon className="h-6 w-6 text-blue-600 mr-3" />
                                            <div>
                                                <h3 className="text-base font-medium text-gray-700">Loại gỗ</h3>
                                                <p className="text-sm text-gray-600">
                                                    {woodTypes.find((wt) => wt.woodTypeId === currentProduct.woodTypeId)?.woodTypeName || "Chưa chọn"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Chọn màu sắc</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {currentProduct.productDetails && currentProduct.productDetails.length > 0 ? (
                                            currentProduct.productDetails.map((detail) => {
                                                const color = productColors.find((c) => c.colorId === detail.colorId);
                                                if (!color) return null;
                                                return (
                                                    <button
                                                        key={detail.productDetailsId || detail.colorId}
                                                        className={classNames(
                                                            "w-8 h-8 rounded-full ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-600",
                                                            selectedDetail &&
                                                                (selectedDetail.productDetailsId || selectedDetail.colorId) ===
                                                                (detail.productDetailsId || detail.colorId)
                                                                ? "ring-2 ring-blue-600"
                                                                : ""
                                                        )}
                                                        style={{ backgroundColor: color.colorHexCode }}
                                                        onClick={() => setSelectedDetail(detail)}
                                                        aria-label={`Chọn ${color.colorName}`}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-400">Không có màu sắc khả dụng.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 text-center border-none focus:ring-0"
                                        />
                                        <button
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                        disabled={!selectedDetail}
                                    >
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-bold text-gray-700">Chi tiết bổ sung</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700">Danh mục</h3>
                                            <p className="text-base text-gray-600">
                                                {currentProduct.categories
                                                    ?.map((cat) => categories.find((c) => c.categoryId === cat.categoryId)?.categoryName)
                                                    .join(", ") || "Không có"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700">Phong cách</h3>
                                            <p className="text-base text-gray-600">
                                                {styles.find((s) => s.styleId === currentProduct.styleId)?.styleName || "Chưa chọn"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700">Kỹ thuật chế tác</h3>
                                            <p className="text-base text-gray-600">
                                                {techniques.find((t) => t.techniqueId === currentProduct.techniqueId)?.techniqueName || "Chưa chọn"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-700">Mô tả</h3>
                                            <p className="text-sm text-gray-600">{currentProduct.description || "Không có mô tả"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200 text-sm text-gray-400">
                    <div className="mb-2 sm:mb-0">
                        2025 © <span className="font-semibold text-gray-700">NHH CITY</span>
                    </div>
                    <div className="flex gap-4 sm:gap-3">
                        <a href="#" className="hover:text-gray-600">Về chúng tôi</a>
                        <a href="#" className="hover:text-gray-600">Hỗ trợ</a>
                        <a href="#" className="hover:text-gray-600">Cửa hàng</a>
                    </div>
                </footer>
            </div>
        </>
    );
}