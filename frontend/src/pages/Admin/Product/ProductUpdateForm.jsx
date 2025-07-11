import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    getProductById,
    updateProduct,
    uploadImage,
    uploadImagesbulk,
    resetCurrentProduct,
} from '../../../features/slices/productSlice';
import { uploadProductColorDetailImage } from '../../../features/slices/productDetailSlice';
import { fetchProductImages, deleteProductImage, resetProductImages } from '../../../features/slices/productImageSlice';
import { fetchStyles } from '../../../features/slices/styleSlice';
import { fetchWoodTypes } from '../../../features/slices/woodTypeSlice';
import { fetchLocations } from '../../../features/slices/locationSlice';
import { fetchCraftingTechniques } from '../../../features/slices/craftingTechniqueSlice';
import { fetchFurnitureTypes } from '../../../features/slices/furnitureTypeSlice';
import { fetchPriceRanges } from '../../../features/slices/priceRangeSlice';
import { fetchFunctions } from '../../../features/slices/functionSlice';
import { getProductColors } from '../../../features/slices/productColorSlice';
import { GetAllCategories } from '../../../features/slices/categorySlice';
import defaultImage from '../../../assets/images/default.jpg';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const validationSchema = Yup.object({
    productName: Yup.string().max(200, 'Tên sản phẩm không được vượt quá 200 ký tự').required('Tên sản phẩm là bắt buộc'),
    description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
    price: Yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
    weight: Yup.number().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0').required('Trọng lượng là bắt buộc'),
    dimensions: Yup.string().max(100, 'Kích thước không được vượt quá 100 ký tự'),
    imageUrl: Yup.string().max(255, 'URL hình ảnh không được vượt quá 255 ký tự'),
    styleId: Yup.string().nullable(),
    woodTypeId: Yup.string().nullable(),
    techniqueId: Yup.string().nullable(),
    priceRangeId: Yup.string().nullable(),
    productStatus: Yup.string().oneOf(['Available', 'Manufactured Goods'], 'Trạng thái không hợp lệ').required('Trạng thái sản phẩm là bắt buộc'),
    active: Yup.boolean(),
    categories: Yup.array().of(Yup.object({ categoryId: Yup.string().required('Danh mục là bắt buộc') })),
    functions: Yup.array().of(Yup.object({ functionId: Yup.string().required('Chức năng là bắt buộc') })),
    furnitureTypes: Yup.array().of(Yup.object({ furnitureTypeId: Yup.string().required('Loại nội thất là bắt buộc') })),
    productLocations: Yup.array().of(Yup.object({ locationId: Yup.string().required('Vị trí là bắt buộc') })),
    productDetails: Yup.array().of(
        Yup.object({
            colorId: Yup.string().required('Màu sắc là bắt buộc'),
            price: Yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
            stockQuantity: Yup.number().min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0').required('Số lượng là bắt buộc'),
            imageUrl: Yup.string().max(255, 'URL hình ảnh không được vượt quá 255 ký tự'),
            metaTagTitle: Yup.string().max(100, 'Tiêu đề meta không được vượt quá 100 ký tự').required('Tiêu đề meta là bắt buộc'),
            metaTagDescription: Yup.string().max(255, 'Mô tả meta không được vượt quá 255 ký tự'),
            metaKeywords: Yup.string().max(255, 'Từ khóa meta không được vượt quá 255 ký tự'),
        })
    ),
    discountType: Yup.string().required('Loại giảm giá là bắt buộc'),
    discountValue: Yup.number().when('discountType', {
        is: (value) => value !== 'none',
        then: (schema) => schema.min(0, 'Giá trị giảm giá phải lớn hơn hoặc bằng 0').required('Giá trị giảm giá là bắt buộc'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

function Sidebar({ values, styles, woodTypes, locations, techniques, furnitureTypes, priceRanges, functions, categories }) {
    return (
        <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
            {/* Ảnh đại diện */}
            <section className="bg-white rounded-lg p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#3E3F5E] mb-4">Ảnh đại diện</h2>
                <div className="relative w-32 h-24 bg-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    <img
                        src={values.imageUrl ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(values.imageUrl)}` : 'https://storage.googleapis.com/a1aa/image/dff37103-17b9-4a19-3ae4-a06a74e00ad0.jpg'}
                        alt="Product thumbnail"
                        className="object-contain max-w-full max-h-full"
                    />
                    <label
                        htmlFor="thumbnail-upload"
                        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faPen} />
                        <input
                            id="thumbnail-upload"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            className="hidden"
                        />
                    </label>
                </div>
                <p className="text-sm text-center text-gray-400 mt-3 leading-tight">
                    Đặt ảnh đại diện sản phẩm. Chỉ chấp nhận các tệp ảnh *.png, *.jpg và *.jpeg
                </p>
            </section>

            {/* Trạng thái */}
            <section className="bg-white rounded-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-[#3E3F5E] mb-3 flex items-center gap-1.5">
                    Trạng thái
                    <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block"></span>
                </h3>
                <Field
                    as="select"
                    name="productStatus"
                    className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="Available">Có sẵn</option>
                    <option value="Manufactured Goods">Hàng Gia Công</option>
                </Field>
                <ErrorMessage name="productStatus" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                <p className="text-sm text-gray-400 mt-2 leading-tight">Đặt trạng thái sản phẩm.</p>
            </section>

            {/* Product Details */}
            <section className="bg-white rounded-lg p-6 border border-gray-100 space-y-6">
                <h3 className="text-lg font-semibold text-[#3E3F5E] mb-2">Chi tiết sản phẩm</h3>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="category">Danh mục</label>
                    <FieldArray name="categories">
                        {({ push, remove }) => (
                            <div>
                                {values.categories.map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <Field
                                                as="select"
                                                name={`categories[${index}].categoryId`}
                                                className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((category) => (
                                                    <option key={category.categoryId} value={String(category.categoryId)}>
                                                        {category.categoryName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-sm text-[#F43F5E] hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name={`categories[${index}].categoryId`}
                                            component="p"
                                            className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => push({ categoryId: '' })}
                                    className="text-sm text-[#2563EB] hover:underline mt-2"
                                >
                                    + Thêm danh mục
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Thêm sản phẩm vào danh mục.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="wood-type">Loại gỗ</label>
                    <Field
                        as="select"
                        name="woodTypeId"
                        className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        <option value="">Chọn loại gỗ</option>
                        {woodTypes.map((woodType) => (
                            <option key={woodType.woodTypeId} value={String(woodType.woodTypeId)}>
                                {woodType.woodTypeName}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="woodTypeId" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn loại gỗ cho sản phẩm.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="function">Chức năng</label>
                    <FieldArray name="functions">
                        {({ push, remove }) => (
                            <div>
                                {values.functions.map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <Field
                                                as="select"
                                                name={`functions[${index}].functionId`}
                                                className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                            >
                                                <option value="">Chọn chức năng</option>
                                                {functions.map((func) => (
                                                    <option key={func.functionId} value={String(func.functionId)}>
                                                        {func.functionName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-sm text-[#F43F5E] hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name={`functions[${index}].functionId`}
                                            component="p"
                                            className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => push({ functionId: '' })}
                                    className="text-sm text-[#2563EB] hover:underline mt-2"
                                >
                                    + Thêm chức năng
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn chức năng của sản phẩm.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="style">Phong cách</label>
                    <Field
                        as="select"
                        name="styleId"
                        className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        <option value="">Chọn phong cách</option>
                        {styles.map((style) => (
                            <option key={style.styleId} value={String(style.styleId)}>
                                {style.styleName}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="styleId" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn phong cách của sản phẩm.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="location">Vị trí</label>
                    <FieldArray name="productLocations">
                        {({ push, remove }) => (
                            <div>
                                {values.productLocations.map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <Field
                                                as="select"
                                                name={`productLocations[${index}].locationId`}
                                                className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                            >
                                                <option value="">Chọn vị trí</option>
                                                {locations.map((location) => (
                                                    <option key={location.locationId} value={String(location.locationId)}>
                                                        {location.locationName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-sm text-[#F43F5E] hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name={`productLocations[${index}].locationId`}
                                            component="p"
                                            className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => push({ locationId: '' })}
                                    className="text-sm text-[#2563EB] hover:underline mt-2"
                                >
                                    + Thêm vị trí
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn vị trí của sản phẩm.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="crafting-technique">Kỹ thuật chế tác</label>
                    <Field
                        as="select"
                        name="techniqueId"
                        className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        <option value="">Chọn kỹ thuật</option>
                        {techniques.map((technique) => (
                            <option key={technique.techniqueId} value={String(technique.techniqueId)}>
                                {technique.techniqueName}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="techniqueId" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn kỹ thuật chế tác.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="price-range">Khoảng giá</label>
                    <Field
                        as="select"
                        name="priceRangeId"
                        className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    >
                        <option value="">Chọn khoảng giá</option>
                        {priceRanges.map((range) => (
                            <option key={range.priceRangeId} value={String(range.priceRangeId)}>
                                {range.priceRangeName}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="priceRangeId" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn khoảng giá.</p>
                </div>
                <div>
                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="furniture-type">Loại nội thất</label>
                    <FieldArray name="furnitureTypes">
                        {({ push, remove }) => (
                            <div>
                                {values.furnitureTypes.map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <Field
                                                as="select"
                                                name={`furnitureTypes[${index}].furnitureTypeId`}
                                                className="w-full text-base border border-gray-200 rounded-lg px-3 py-2 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                            >
                                                <option value="">Chọn loại nội thất</option>
                                                {furnitureTypes.map((type) => (
                                                    <option key={type.furnitureTypeId} value={String(type.furnitureTypeId)}>
                                                        {type.typeName}
                                                    </option>
                                                ))}
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-sm text-[#F43F5E] hover:underline"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name={`furnitureTypes[${index}].furnitureTypeId`}
                                            component="p"
                                            className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => push({ furnitureTypeId: '' })}
                                    className="text-sm text-[#2563EB] hover:underline mt-2"
                                >
                                    + Thêm loại nội thất
                                </button>
                            </div>
                        )}
                    </FieldArray>
                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn loại nội thất.</p>
                </div>
            </section>
        </aside>
    );
}

function ProductUpdateForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, loading: productLoading, error } = useSelector((state) => state.products);
    const { images } = useSelector((state) => state.productImages);
    const styles = useSelector((state) => state.styles.styles || []);
    const woodTypes = useSelector((state) => state.woodTypes.woodTypes || []);
    const locations = useSelector((state) => state.locations.locations || []);
    const techniques = useSelector((state) => state.craftingTechniques.craftingTechniques || []);
    const furnitureTypes = useSelector((state) => state.furnitureTypes.furnitureTypes || []);
    const priceRanges = useSelector((state) => state.priceRanges.priceRanges || []);
    const functions = useSelector((state) => state.functions.functions || []);
    const productColors = useSelector((state) => state.productColors || []);
    const categories = useSelector((state) => state.category.categories || []);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [productDetailImagesFiles, setProductDetailImageFiles] = useState({});
    const [productDetailPreviews, setProductDetailPreviews] = useState({});
    const [activeTab, setActiveTab] = useState('General');

    const getImageUrl = (imageUrl) => {
        return imageUrl
            ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(imageUrl)}`
            : defaultImage;
    };

    useEffect(() => {
        dispatch(fetchStyles());
        dispatch(fetchWoodTypes());
        dispatch(fetchLocations());
        dispatch(fetchCraftingTechniques());
        dispatch(fetchFurnitureTypes());
        dispatch(fetchPriceRanges());
        dispatch(fetchFunctions());
        dispatch(getProductColors());
        dispatch(GetAllCategories());

        if (id) {
            dispatch(getProductById(id));
            dispatch(fetchProductImages(id));
        }

        return () => {
            dispatch(resetCurrentProduct());
            dispatch(resetProductImages());
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
            Object.values(productDetailPreviews).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [dispatch, id, imagePreviews, productDetailPreviews]);

    const initialValues = {
        productName: currentProduct?.productName || '',
        description: currentProduct?.description || '',
        price: currentProduct?.price || 0,
        weight: currentProduct?.weight || 0,
        dimensions: currentProduct?.dimensions || '',
        imageUrl: currentProduct?.imageUrl || '',
        styleId: currentProduct?.styleId !== null && currentProduct?.styleId !== undefined ? String(currentProduct.styleId) : '',
        woodTypeId: currentProduct?.woodTypeId !== null && currentProduct?.woodTypeId !== undefined ? String(currentProduct.woodTypeId) : '',
        techniqueId: currentProduct?.techniqueId !== null && currentProduct?.techniqueId !== undefined ? String(currentProduct.techniqueId) : '',
        priceRangeId: currentProduct?.priceRangeId !== null && currentProduct?.priceRangeId !== undefined ? String(currentProduct.priceRangeId) : '',
        productStatus: currentProduct?.productStatus || '',
        active: currentProduct?.active ?? true,
        categories: (currentProduct?.categories || []).map((cat) => ({
            categoryId: cat.categoryId !== null && cat.categoryId !== undefined ? String(cat.categoryId) : '',
        })),
        functions: (currentProduct?.functions || []).map((func) => ({
            functionId: func.functionId !== null && func.functionId !== undefined ? String(func.functionId) : '',
        })),
        furnitureTypes: (currentProduct?.furnitureTypes || []).map((type) => ({
            furnitureTypeId: type.furnitureTypeId !== null && type.furnitureTypeId !== undefined ? String(type.furnitureTypeId) : '',
        })),
        productLocations: (currentProduct?.productLocations || []).map((loc) => ({
            locationId: loc.locationId !== null && loc.locationId !== undefined ? String(loc.locationId) : '',
        })),
        productDetails: (currentProduct?.productDetails || []).map((detail) => ({
            colorId: detail.colorId !== null && detail.colorId !== undefined ? String(detail.colorId) : '',
            price: detail.price || 0,
            stockQuantity: detail.stockQuantity || 0,
            imageUrl: detail.imageUrl || '',
            metaTagTitle: detail.metaTagTitle || '',
            metaTagDescription: detail.metaTagDescription || '',
            metaKeywords: detail.metaKeywords || '',
            productDetailsId: detail.productDetailsId || null,
        })),
        discountType: currentProduct?.discount ? currentProduct.discount.discountType === 'PERCENTAGE' ? 'percent' : 'fixed' : 'none',
        discountValue: currentProduct?.discount?.discountValue || 0,
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const productData = {
                ...values,
                styleId: values.styleId ? Number(values.styleId) : null,
                woodTypeId: values.woodTypeId ? Number(values.woodTypeId) : null,
                techniqueId: values.techniqueId ? Number(values.techniqueId) : null,
                priceRangeId: values.priceRangeId ? Number(values.priceRangeId) : null,
                categories: values.categories.map((cat) => ({
                    categoryId: Number(cat.categoryId),
                })),
                functions: values.functions.map((func) => ({
                    functionId: Number(func.functionId),
                })),
                furnitureTypes: values.furnitureTypes.map((type) => ({
                    furnitureTypeId: Number(type.furnitureTypeId),
                })),
                productLocations: values.productLocations.map((loc) => ({
                    locationId: Number(loc.locationId),
                })),
                productDetails: values.productDetails.map((detail) => ({
                    colorId: Number(detail.colorId),
                    price: Number(detail.price),
                    stockQuantity: Number(detail.stockQuantity),
                    imageUrl: detail.imageUrl || '',
                    metaTagTitle: detail.metaTagTitle,
                    metaTagDescription: detail.metaTagDescription || '',
                    metaKeywords: detail.metaKeywords || '',
                    productDetailsId: detail.productDetailsId || null,
                })),
                discount: values.discountType === 'none' ? null : {
                    discountType: values.discountType === 'percent' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
                    discountValue: Number(values.discountValue),
                    active: true,
                },
            };

            const response = await dispatch(updateProduct({ id, formData: productData })).unwrap();
            const productId = id;
            const productDetails = response.productDetails || values.productDetails;
            toast.success('Cập nhật sản phẩm thành công');

            if (imageFiles.length > 0) {
                if (imageFiles.length === 1) {
                    await dispatch(uploadImage({ productId, file: imageFiles[0] })).unwrap();
                } else {
                    await dispatch(uploadImagesbulk({ productId, files: imageFiles })).unwrap();
                }
                dispatch(fetchProductImages(productId));
            }

            for (let i = 0; i < productDetails.length; i++) {
                const productDetailId = productDetails[i]?.productDetailsId;
                const imageFile = productDetailImagesFiles[i];
                if (imageFile && productDetailId) {
                    await dispatch(uploadProductColorDetailImage({
                        productColorRelationId: productDetailId,
                        file: imageFile,
                    })).unwrap();
                } else if (imageFile && !productDetailId) {
                    console.warn(`Không tìm thấy productDetailsId cho chi tiết sản phẩm tại chỉ số ${i}`);
                    toast.warn(`Không thể tải lên hình ảnh cho chi tiết sản phẩm thứ ${i + 1}: Thiếu ID`);
                }
            }

            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi cập nhật sản phẩm');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageDelete = (imageId) => {
        dispatch(deleteProductImage(imageId))
            .unwrap()
            .then(() => toast.success('Xóa hình ảnh thành công'))
            .catch(() => toast.error('Lỗi khi xóa hình ảnh'));
    };

    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleProductDetailImageChange = (e, index, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue(`productDetails[${index}].imageFile`, file);
            setProductDetailImageFiles((prev) => ({
                ...prev,
                [index]: file,
            }));
            const previewUrl = URL.createObjectURL(file);
            setProductDetailPreviews((prev) => ({
                ...prev,
                [index]: previewUrl,
            }));
        }
    };

    if (productLoading) return <div className="text-center py-10 text-[#3E3F5E] text-base">Đang tải...</div>;
    if (error) return <div className="text-center py-10 text-[#F43F5E] text-base">Lỗi: {error}</div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#3E3F5E] text-base leading-relaxed">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <i className="fas fa-clock text-white text-base"></i>
                    </div>
                    <h1 className="text-3xl font-semibold text-[#3E3F5E]">Sửa sản phẩm</h1>
                </div>
                <nav className="flex items-center text-base text-gray-400 space-x-2 select-none">
                    <span>Trang chủ</span>
                    <span>-</span>
                    <span>Ứng dụng</span>
                    <span>-</span>
                    <span>Thương mại điện tử</span>
                    <span>-</span>
                    <span>Danh mục</span>
                </nav>
                <div className="ml-auto flex gap-3">
                    <Link to="/" className="text-base font-medium text-[#3E3F5E] bg-[#F9FAFB] border border-gray-300 rounded-lg px-5 py-2 hover:bg-gray-100">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        form="productForm"
                        className="text-base font-semibold text-white bg-[#0D1136] rounded-lg px-5 py-2 hover:bg-[#0a0e29]"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 px-4 sm:px-6 py-8">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                    {({ isSubmitting, setFieldValue, values }) => (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-8 max-w-7xl mx-auto">
                                {/* Left sidebar */}
                                <Sidebar
                                    values={values}
                                    styles={styles}
                                    woodTypes={woodTypes}
                                    locations={locations}
                                    techniques={techniques}
                                    furnitureTypes={furnitureTypes}
                                    priceRanges={priceRanges}
                                    functions={functions}
                                    categories={categories}
                                />

                                {/* Right content */}
                                <section className="w-full">
                                    {/* Tabs */}
                                    <nav className="flex border-b border-gray-200 mb-6">
                                        <button
                                            type="button"
                                            className={`px-5 py-3 text-base font-semibold -mb-px ${activeTab === 'General' ? 'border-b-2 border-[#2563EB] text-[#2563EB]' : 'text-gray-400 hover:text-[#3E3F5E]'}`}
                                            onClick={() => setActiveTab('General')}
                                            aria-current={activeTab === 'General' ? 'page' : undefined}
                                        >
                                            General
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-5 py-3 text-base font-semibold -mb-px ${activeTab === 'Advanced' ? 'border-b-2 border-[#2563EB] text-[#2563EB]' : 'text-gray-400 hover:text-[#3E3F5E]'}`}
                                            onClick={() => setActiveTab('Advanced')}
                                            aria-current={activeTab === 'Advanced' ? 'page' : undefined}
                                        >
                                            Advanced
                                        </button>
                                    </nav>

                                    {/* Form container */}
                                    <Form id="productForm" className="bg-white rounded-lg p-8 border border-gray-100">
                                        {activeTab === 'General' && (
                                            <fieldset className="space-y-8">
                                                <legend className="text-lg font-semibold text-[#3E3F5E] mb-4">General</legend>

                                                {/* Product Name */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="product-name">
                                                        Tên sản phẩm <span className="text-[#F43F5E]">*</span>
                                                    </label>
                                                    <Field
                                                        name="productName"
                                                        type="text"
                                                        className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                        placeholder="Nhập tên sản phẩm"
                                                    />
                                                    <ErrorMessage name="productName" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">
                                                        Tên sản phẩm là bắt buộc và nên là duy nhất.
                                                    </p>
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="description">
                                                        Mô tả
                                                    </label>
                                                    <div className="border border-gray-200 rounded-lg bg-white text-base text-gray-500 p-2 mb-2 select-none flex items-center gap-3">
                                                        <span className="text-base">Normal</span>
                                                        <button type="button" className="font-bold text-gray-600 hover:text-gray-900">B</button>
                                                        <button type="button" className="italic text-gray-600 hover:text-gray-900">I</button>
                                                        <button type="button" className="underline text-gray-600 hover:text-gray-900">U</button>
                                                        <button type="button" className="text-gray-600 hover:text-gray-900">
                                                            <i className="fas fa-image"></i>
                                                        </button>
                                                        <button type="button" className="text-gray-600 hover:text-gray-900">{'</>'}</button>
                                                    </div>
                                                    <Field
                                                        name="description"
                                                        as="textarea"
                                                        className="w-full text-base border border-gray-200 rounded-lg p-4 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                                                        placeholder="Nhập mô tả..."
                                                        rows="6"
                                                    />
                                                    <ErrorMessage name="description" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">
                                                        Đặt mô tả cho sản phẩm để tăng khả năng hiển thị.
                                                    </p>
                                                </div>

                                                {/* Pricing */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="base-price">
                                                        Giá cơ bản (VND) <span className="text-[#F43F5E]">*</span>
                                                    </label>
                                                    <Field
                                                        name="price"
                                                        type="number"
                                                        className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                        placeholder="Nhập giá"
                                                    />
                                                    <ErrorMessage name="price" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">Đặt giá sản phẩm.</p>
                                                </div>

                                                {/* Discount Type */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2">Loại giảm giá <span className="text-[#F43F5E]">*</span></label>
                                                    <div className="flex flex-col sm:flex-row gap-4 text-base text-[#3E3F5E]">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <Field
                                                                type="radio"
                                                                name="discountType"
                                                                value="none"
                                                                className="w-5 h-5 text-[#2563EB] border-gray-300 focus:ring-[#2563EB]"
                                                            />
                                                            Không giảm giá
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <Field
                                                                type="radio"
                                                                name="discountType"
                                                                value="percent"
                                                                className="w-5 h-5 text-[#2563EB] border-gray-300 focus:ring-[#2563EB]"
                                                            />
                                                            Phần trăm %
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <Field
                                                                type="radio"
                                                                name="discountType"
                                                                value="fixed"
                                                                className="w-5 h-5 text-[#2563EB] border-gray-300 focus:ring-[#2563EB]"
                                                            />
                                                            Số tiền cố định
                                                        </label>
                                                    </div>
                                                    <ErrorMessage name="discountType" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">Chọn loại giảm giá cho sản phẩm.</p>
                                                </div>

                                                {/* Discount Value */}
                                                {values.discountType !== 'none' && (
                                                    <div>
                                                        <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                            Giá trị giảm giá <span className="text-[#F43F5E]">*</span>
                                                        </label>
                                                        {values.discountType === 'percent' ? (
                                                            <div className="flex items-center gap-4">
                                                                <Field
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    name="discountValue"
                                                                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                                                                />
                                                                <span className="text-base font-semibold text-[#3E3F5E]">{values.discountValue}%</span>
                                                            </div>
                                                        ) : (
                                                            <Field
                                                                type="number"
                                                                name="discountValue"
                                                                className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                placeholder="Nhập số tiền giảm giá cố định"
                                                            />
                                                        )}
                                                        <ErrorMessage name="discountValue" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                        <p className="text-sm text-gray-400 mt-2 leading-tight">
                                                            Đặt giá trị giảm giá ({values.discountType === 'percent' ? 'phần trăm' : 'số tiền cố định'}).
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Weight */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="weight">
                                                        Trọng lượng (kg) <span className="text-[#F43F5E]">*</span>
                                                    </label>
                                                    <Field
                                                        name="weight"
                                                        type="number"
                                                        className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                        placeholder="Nhập trọng lượng"
                                                    />
                                                    <ErrorMessage name="weight" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">Đặt trọng lượng sản phẩm tính bằng kilogam.</p>
                                                </div>

                                                {/* Dimensions */}
                                                <div>
                                                    <label className="block text-base font-semibold text-[#3E3F5E] mb-2" htmlFor="dimensions">
                                                        Kích thước (DxRxC cm) <span className="text-[#F43F5E]">*</span>
                                                    </label>
                                                    <Field
                                                        name="dimensions"
                                                        type="text"
                                                        className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                        placeholder="VD: 120x60x80"
                                                    />
                                                    <ErrorMessage name="dimensions" component="p" className="text-sm text-[#F43F5E] mt-2 leading-tight" />
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">
                                                        Đặt kích thước sản phẩm theo định dạng dài x rộng x cao.
                                                    </p>
                                                </div>

                                                {/* Product Images */}
                                                <div>
                                                    <p className="text-base font-semibold text-[#3E3F5E] mb-2">Hình ảnh sản phẩm</p>
                                                    <p className="text-base font-semibold text-[#3E3F5E] mb-3">Tải lên hình ảnh mới</p>
                                                    <div className="bg-[#F3F4F6] rounded-lg p-6 text-base text-[#3E3F5E] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                        <label
                                                            htmlFor="upload-images"
                                                            className="bg-blue-600 text-white text-sm font-semibold rounded-lg px-4 py-2 cursor-pointer select-none hover:bg-blue-700"
                                                        >
                                                            Chọn tệp
                                                        </label>
                                                        <span className="text-base">{imageFiles.length > 0 ? `${imageFiles.length} tệp đã chọn` : 'Không có tệp nào được chọn'}</span>
                                                        <p className="w-full text-sm text-gray-400 mt-2 leading-tight">
                                                            Chọn nhiều hình ảnh cùng lúc hoặc thêm lần lượt
                                                        </p>
                                                        <input
                                                            id="upload-images"
                                                            type="file"
                                                            multiple
                                                            accept=".png,.jpg,.jpeg"
                                                            className="hidden"
                                                            onChange={handleProductImageChange}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-3 leading-tight">
                                                        Tải lên hình ảnh bổ sung cho sản phẩm. Chỉ chấp nhận các tệp *.png, *.jpg và *.jpeg.
                                                    </p>
                                                    {imagePreviews.length > 0 && (
                                                        <div className="mt-6">
                                                            <p className="text-base font-semibold text-[#3E3F5E] mb-3">Hình ảnh xem trước (chưa tải lên)</p>
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                                {imagePreviews.map((preview, idx) => (
                                                                    <img
                                                                        key={`preview-${idx}`}
                                                                        src={preview}
                                                                        alt="Product Preview"
                                                                        className="w-20 h-20 object-cover rounded-lg"
                                                                        loading="lazy"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {images.length > 0 && (
                                                        <div className="mt-6">
                                                            <p className="text-base font-semibold text-[#3E3F5E] mb-3">Hình ảnh hiện có</p>
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {images.map((image) => (
                                                                    <div key={image.imageId} className="relative">
                                                                        <img
                                                                            src={getImageUrl(image.imageUrl)}
                                                                            alt={image.imageAltText || 'Product Image'}
                                                                            className="w-20 h-20 object-cover rounded"
                                                                            loading="lazy"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleImageDelete(image.imageId)}
                                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {imagePreviews.length === 0 && images.length === 0 && (
                                                        <p className="text-sm text-gray-400 mt-3 leading-tight">Không có hình ảnh nào cho sản phẩm này.</p>
                                                    )}
                                                    <p className="text-sm text-gray-400 mt-2 leading-tight">
                                                        Chọn một hình ảnh để đặt làm hình thu nhỏ.
                                                    </p>
                                                </div>

                                                {/* Status */}
                                                <div>
                                                    <label className="flex items-center text-base font-semibold text-[#3E3F5E]">
                                                        <Field
                                                            type="checkbox"
                                                            name="active"
                                                            className="w-5 h-5 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB] mr-3"
                                                        />
                                                        Hoạt động
                                                    </label>
                                                </div>
                                            </fieldset>
                                        )}

                                        {activeTab === 'Advanced' && (
                                            <fieldset className="space-y-8">
                                                <legend className="text-lg font-semibold text-[#3E3F5E] mb-4">Advanced</legend>

                                                {/* Product Details Section */}
                                                <div>
                                                    <p className="text-lg font-semibold text-[#3E3F5E] mb-4">Chi tiết sản phẩm</p>
                                                    <FieldArray name="productDetails">
                                                        {({ push, remove }) => (
                                                            <div className="space-y-6">
                                                                {values.productDetails.map((detail, index) => (
                                                                    <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Màu sắc
                                                                                </label>
                                                                                <Field
                                                                                    as="select"
                                                                                    name={`productDetails[${index}].colorId`}
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                >
                                                                                    <option value="">Chọn màu sắc</option>
                                                                                    {productColors.map((color) => (
                                                                                        <option key={color.colorId} value={String(color.colorId)}>
                                                                                            {color.colorName}
                                                                                        </option>
                                                                                    ))}
                                                                                </Field>
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].colorId`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Giá
                                                                                </label>
                                                                                <Field
                                                                                    name={`productDetails[${index}].price`}
                                                                                    type="number"
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].price`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Số lượng tồn kho
                                                                                </label>
                                                                                <Field
                                                                                    name={`productDetails[${index}].stockQuantity`}
                                                                                    type="number"
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].stockQuantity`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Tiêu đề Meta
                                                                                </label>
                                                                                <Field
                                                                                    name={`productDetails[${index}].metaTagTitle`}
                                                                                    type="text"
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].metaTagTitle`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Mô tả Meta
                                                                                </label>
                                                                                <Field
                                                                                    name={`productDetails[${index}].metaTagDescription`}
                                                                                    type="text"
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].metaTagDescription`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-base font-semibold text-[#3E3F5E] mb-2">
                                                                                    Từ khóa Meta
                                                                                </label>
                                                                                <Field
                                                                                    name={`productDetails[${index}].metaKeywords`}
                                                                                    type="text"
                                                                                    className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                                                />
                                                                                <ErrorMessage
                                                                                    name={`productDetails[${index}].metaKeywords`}
                                                                                    component="p"
                                                                                    className="text-sm text-[#F43F5E] mt-2 leading-tight"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-6">
                                                                            <label className="block text-base font-semibold text-[#3E3F5E] mb-2">Hình ảnh</label>
                                                                            <input
                                                                                type="file"
                                                                                accept=".png,.jpg,.jpeg"
                                                                                onChange={(e) => handleProductDetailImageChange(e, index, setFieldValue)}
                                                                                className="w-full text-base border border-gray-200 rounded-lg px-4 py-2.5 text-[#3E3F5E] file:bg-blue-50 file:border-0 file:rounded file:px-4 file:py-2 file:text-base file:mr-4"
                                                                            />
                                                                            <div className="mt-4 flex flex-wrap gap-4">
                                                                                {productDetailPreviews[index] && (
                                                                                    <img
                                                                                        src={productDetailPreviews[index]}
                                                                                        alt="Product Detail Preview"
                                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                                        loading="lazy"
                                                                                    />
                                                                                )}
                                                                                {detail.imageUrl && !productDetailPreviews[index] && (
                                                                                    <img
                                                                                        src={getImageUrl(detail.imageUrl)}
                                                                                        alt="Product Detail"
                                                                                        className="w-24 h-24 object-cover rounded-lg"
                                                                                        loading="lazy"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                remove(index);
                                                                                setProductDetailPreviews((prev) => {
                                                                                    const newPreviews = { ...prev };
                                                                                    if (newPreviews[index]) {
                                                                                        URL.revokeObjectURL(newPreviews[index]);
                                                                                        delete newPreviews[index];
                                                                                    }
                                                                                    return newPreviews;
                                                                                });
                                                                                setProductDetailImageFiles((prev) => {
                                                                                    const newFiles = { ...prev };
                                                                                    delete newFiles[index];
                                                                                    return newFiles;
                                                                                });
                                                                            }}
                                                                            className="mt-6 text-sm text-[#F43F5E] hover:underline"
                                                                        >
                                                                            Xóa chi tiết sản phẩm
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        push({
                                                                            colorId: '',
                                                                            price: 0,
                                                                            stockQuantity: 0,
                                                                            imageUrl: '',
                                                                            metaTagTitle: '',
                                                                            metaTagDescription: '',
                                                                            metaKeywords: '',
                                                                        })
                                                                    }
                                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                                >
                                                                    + Thêm chi tiết màu
                                                                </button>
                                                            </div>
                                                        )}
                                                    </FieldArray>
                                                </div>
                                            </fieldset>
                                        )}
                                    </Form>

                                    {/* Bottom buttons */}
                                    <div className="flex justify-end mt-8 max-w-7xl mx-auto px-4 sm:px-6">
                                        <Link to="/" className="text-base font-medium text-[#3E3F5E] bg-transparent px-5 py-2 hover:underline rounded-lg">
                                            Hủy
                                        </Link>
                                        <button
                                            type="submit"
                                            form="productForm"
                                            disabled={isSubmitting}
                                            className="ml-4 text-base font-semibold text-white bg-indigo-600 rounded-lg px-5 py-2 hover:bg-indigo-700 disabled:bg-gray-400"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </Formik>
            </main>

            {/* Footer */}
            <footer className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t border-gray-200 text-sm text-gray-400">
                <div className="mb-2 sm:mb-0">
                    2025 © <span className="font-semibold text-gray-700">Product Management</span>
                </div>
                <div className="flex gap-4 sm:gap-3">
                    <a href="#" className="hover:text-gray-600">Về chúng tôi</a>
                    <a href="#" className="hover:text-gray-600">Hỗ trợ</a>
                    <a href="#" className="hover:text-gray-600">Mua hàng</a>
                </div>
            </footer>
        </div>
    );
}

export default ProductUpdateForm;