import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  fetchProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadImage,
  uploadImagesbulk,
  resetCurrentProduct,
} from '../../../features/slices/productSlice';
import { uploadProductColorDetailImage } from '../../../features/slices/productDetailSlice'
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

const validationSchema = Yup.object({
  productName: Yup.string().max(200, 'Tên sản phẩm không được vượt quá 200 ký tự').required('Tên sản phẩm là bắt buộc'),
  description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
  price: Yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
  weight: Yup.number().min(0, 'Trọng lượng phải lớn hơn hoặc bằng 0'),
  dimensions: Yup.string().max(100, 'Kích thước không được vượt quá 100 ký tự'),
  imageUrl: Yup.string().max(255, 'URL hình ảnh không được vượt quá 255 ký tự'),
  styleId: Yup.string().nullable(),
  woodTypeId: Yup.string().nullable(),
  techniqueId: Yup.string().nullable(),
  priceRangeId: Yup.string().nullable(),
  productStatus: Yup.string().max(50, 'Trạng thái không được vượt quá 50 ký tự'),
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

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading: productLoading, error: productError } = useSelector((state) => state.products);
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
  const [productDetailPreviews, setProductDetailPreviews] = useState({});

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
    } else {
      dispatch(resetCurrentProduct());
      dispatch(resetProductImages());
    }

    return () => {
      dispatch(resetCurrentProduct());
      dispatch(resetProductImages());
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      Object.values(productDetailPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [dispatch, id, imagePreviews, productDetailPreviews]);

  // const initialValues = {
  //   productName: "Bàn Trà Gỗ Sồi Hiện Đại",
  //   description: "Bàn trà làm từ gỗ sồi tự nhiên, thiết kế hiện đại, phù hợp với phòng khách.",
  //   price: 3500000,
  //   weight: 10.5,
  //   dimensions: "80x80x45 cm",
  //   imageUrl: "/images/coffee-table.jpg",
  //   styleId: "1",
  //   woodTypeId: "2",
  //   techniqueId: "2",
  //   priceRangeId: "4",
  //   productStatus: "Còn hàng",
  //   active: true,
  //   categories: [
  //     { categoryId: "1" },
  //     { categoryId: "5" }
  //   ],
  //   functions: [
  //     { functionId: "1" }
  //   ],
  //   furnitureTypes: [
  //     { furnitureTypeId: "2" }
  //   ],
  //   productLocations: [
  //     { locationId: "1" },
  //     { locationId: "3" }
  //   ],
  //   productDetails: [
  //     {
  //       productDetailsId: "",
  //       colorId: "1",
  //       price: 3500000,
  //       stockQuantity: 10,
  //       imageUrl: "/images/coffee-table-natural.jpg",
  //       metaTagTitle: "Bàn Trà Gỗ Sồi Tự Nhiên",
  //       metaTagDescription: "Bàn trà gỗ sồi hiện đại cho phòng khách.",
  //       metaKeywords: "bàn trà, gỗ sồi, nội thất hiện đại"
  //     },
  //     {
  //       productDetailsId: "",
  //       colorId: "4",
  //       price: 3600000,
  //       stockQuantity: 5,
  //       imageUrl: "/images/coffee-table-white.jpg",
  //       metaTagTitle: "Bàn Trà Gỗ Sồi Sơn Trắng",
  //       metaTagDescription: "Bàn trà gỗ sồi sơn trắng, phong cách hiện đại.",
  //       metaKeywords: "bàn trà, gỗ sồi, nội thất trắng"
  //     }
  //   ],
  //   discountType: "percent",
  //   discountValue: 10
  // };

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
      id: loc.id !== null && loc.id !== undefined ? String(loc.id) : '',
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
    console.log("1")
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
      console.log(productData)
      let productId;
      let productDetailsResponse = [];
      if (id) {
        const response = await dispatch(updateProduct({ id, formData: productData })).unwrap();
        toast.success('Cập nhật sản phẩm thành công');
        productId = id;
        // Giả sử API trả về productDetails trong response khi cập nhật
        productDetailsResponse = response.productDetails || values.productDetails;
      } else {
        const response = await dispatch(createProduct(productData)).unwrap();
        toast.success('Tạo sản phẩm thành công');
        productId = response.productId;
        console.log(response.productId);
        console.log(response.data);
        console.log(response.productDetails);
        values.productDetails = response.productDetails;
        console.log(values.productDetails);
        for(let i =  0; i< values.productDetails.length; i++){
          console.log(values.productDetails[i].productDetailsId)
        }
      }

      // Tải lên hình ảnh sản phẩm
      if (imageFiles.length > 0) {
        if (imageFiles.length === 1) {
          await dispatch(uploadImage({ productId, file: imageFiles[0] })).unwrap();
        } else {
          await dispatch(uploadImagesbulk({ productId, files: imageFiles })).unwrap();
        }
        dispatch(fetchProductImages(productId));
      }

      // Tải lên hình ảnh chi tiết sản phẩm
      for (let i = 0; i < values.productDetails.length; i++) {
        const detail = values.productDetails[i];
        if (detail.imageFile) {
          // Đảm bảo productDetailsId tồn tại
          const productDetailId = detail.productDetailsId;
          console.log(productDetailId);
          if (productDetailId) {
            await dispatch(uploadProductColorDetailImage({
              productColorRelationId: productDetailId,
              file: detail.imageFile
            })).unwrap();
          } else {
            console.warn(`Không tìm thấy productDetailsId cho chi tiết sản phẩm tại chỉ số ${i}`);
            toast.warn(`Không thể tải lên hình ảnh cho chi tiết sản phẩm thứ ${i + 1}: Thiếu ID`);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(id ? 'Lỗi khi cập nhật sản phẩm' : 'Lỗi khi tạo sản phẩm');
    }
    finally {
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
      const previewUrl = URL.createObjectURL(file);
      setProductDetailPreviews((prev) => ({
        ...prev,
        [index]: previewUrl,
      }));
    }
  };

  // if (productLoading) return <div className="text-center py-10">Đang tải...</div>;
  // if (productError) return <div className="text-center py-10 text-red-500">Lỗi: {productError}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
      <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Quay lại danh sách
      </Link>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="bg-white p-8 rounded-lg shadow-lg">
            {/* Basic Info Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <Field
                    name="productName"
                    type="text"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="productName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá (VND)</label>
                  <Field
                    name="price"
                    type="number"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trọng lượng</label>
                  <Field
                    name="weight"
                    type="number"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kích thước</label>
                  <Field
                    name="dimensions"
                    type="text"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="dimensions" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <Field
                  name="description"
                  as="textarea"
                  className="mt-1 p-2 border rounded w-full h-32 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Attributes Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Thuộc tính sản phẩm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phong cách</label>
                  <Field
                    as="select"
                    name="styleId"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn phong cách</option>
                    {styles.map((style) => (
                      <option key={style.styleId} value={String(style.styleId)}>
                        {style.styleName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="styleId" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loại gỗ</label>
                  <Field
                    as="select"
                    name="woodTypeId"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn loại gỗ</option>
                    {woodTypes.map((woodType) => (
                      <option key={woodType.woodTypeId} value={String(woodType.woodTypeId)}>
                        {woodType.woodTypeName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="woodTypeId" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kỹ thuật chế tác</label>
                  <Field
                    as="select"
                    name="techniqueId"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn kỹ thuật</option>
                    {techniques.map((technique) => (
                      <option key={technique.techniqueId} value={String(technique.techniqueId)}>
                        {technique.techniqueName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="techniqueId" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khoảng giá</label>
                  <Field
                    as="select"
                    name="priceRangeId"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn khoảng giá</option>
                    {priceRanges.map((range) => (
                      <option key={range.priceRangeId} value={String(range.priceRangeId)}>
                        {range.priceRangeName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="priceRangeId" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái sản phẩm</label>
                  <Field
                    name="productStatus"
                    type="text"
                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage name="productStatus" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </div>
            </div>

            {/* Locations Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Vị trí</h2>
              <FieldArray name="productLocations">
                {({ push, remove }) => (
                  <div>
                    {values.productLocations.map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Field
                          as="select"
                          name={`productLocations[${index}].locationId`}
                          className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn vị trí</option>
                          {locations.map((location) => (
                            <option key={location.locationId} value={String(location.locationId)}>
                              {location.locationName}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`productLocations[${index}].locationId`}
                          component="div"
                          className="text-red-500 text-sm ml-2"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ locationId: '' })}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      + Thêm vị trí
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Categories Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
              <FieldArray name="categories">
                {({ push, remove }) => (
                  <div>
                    {values.categories.map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Field
                          as="select"
                          name={`categories[${index}].categoryId`}
                          className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map((category) => (
                            <option key={category.categoryId} value={String(category.categoryId)}>
                              {category.categoryName}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`categories[${index}].categoryId`}
                          component="div"
                          className="text-red-500 text-sm ml-2"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ categoryId: '' })}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      + Thêm danh mục
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Functions Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Chức năng</h2>
              <FieldArray name="functions">
                {({ push, remove }) => (
                  <div>
                    {values.functions.map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Field
                          as="select"
                          name={`functions[${index}].functionId`}
                          className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn chức năng</option>
                          {functions.map((func) => (
                            <option key={func.functionId} value={String(func.functionId)}>
                              {func.functionName}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`functions[${index}].functionId`}
                          component="div"
                          className="text-red-500 text-sm ml-2"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ functionId: '' })}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      + Thêm chức năng
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Furniture Types Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Loại nội thất</h2>
              <FieldArray name="furnitureTypes">
                {({ push, remove }) => (
                  <div>
                    {values.furnitureTypes.map((_, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Field
                          as="select"
                          name={`furnitureTypes[${index}].furnitureTypeId`}
                          className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn loại nội thất</option>
                          {furnitureTypes.map((type) => (
                            <option key={type.furnitureTypeId} value={String(type.furnitureTypeId)}>
                              {type.typeName}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name={`furnitureTypes[${index}].furnitureTypeId`}
                          component="div"
                          className="text-red-500 text-sm ml-2"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ furnitureTypeId: '' })}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      + Thêm loại nội thất
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Product Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>
              <FieldArray name="productDetails">
                {({ push, remove }) => (
                  <div>
                    {values.productDetails.map((detail, index) => (
                      <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                            <Field
                              as="select"
                              name={`productDetails[${index}].colorId`}
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
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
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Giá</label>
                            <Field
                              name={`productDetails[${index}].price`}
                              type="number"
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage
                              name={`productDetails[${index}].price`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                            <Field
                              name={`productDetails[${index}].stockQuantity`}
                              type="number"
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage
                              name={`productDetails[${index}].stockQuantity`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Tiêu đề Meta</label>
                            <Field
                              name={`productDetails[${index}].metaTagTitle`}
                              type="text"
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage
                              name={`productDetails[${index}].metaTagTitle`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả Meta</label>
                            <Field
                              name={`productDetails[${index}].metaTagDescription`}
                              type="text"
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage
                              name={`productDetails[${index}].metaTagDescription`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Từ khóa Meta</label>
                            <Field
                              name={`productDetails[${index}].metaKeywords`}
                              type="text"
                              className="p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                            />
                            <ErrorMessage
                              name={`productDetails[${index}].metaKeywords`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                          <input
                            type="file"
                            onChange={(e) => handleProductDetailImageChange(e, index, setFieldValue)}
                            className="p-2 border rounded w-full"
                          />
                          <div className="mt-2 flex gap-2">
                            {productDetailPreviews[index] && (
                              <img
                                src={productDetailPreviews[index]}
                                alt="Product Detail Preview"
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            {detail.imageUrl && !productDetailPreviews[index] && (
                              <img src={detail.imageUrl} alt="Product Detail" className="w-16 h-16 object-cover rounded" />
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
                          }}
                          className="mt-4 text-red-500 hover:underline"
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
                      className="text-blue-500 hover:underline mt-2"
                    >
                      + Thêm chi tiết màu
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Product Images Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Hình ảnh sản phẩm</h2>
              <label className="block text-sm font-medium text-gray-700">Chọn hình ảnh</label>
              <input
                type="file"
                multiple
                onChange={handleProductImageChange}
                className="p-2 border rounded w-full"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((preview, idx) => (
                  <img key={idx} src={preview} alt="Product Preview" className="w-16 h-16 object-cover rounded" />
                ))}
                {images.map((image) => (
                  <div key={image.imageId} className="relative">
                    <img src={image.imageUrl} alt={image.imageAltText} className="w-16 h-16 object-cover rounded" />
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

            {/* Discount Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Giảm giá</h2>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2 select-none">
                  Loại giảm giá <span className="text-red-600">*</span>
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'none', label: 'Không giảm giá' },
                    { value: 'percent', label: 'Phần trăm %' },
                    { value: 'fixed', label: 'Số tiền cố định' },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center flex-1 border border-gray-300 rounded-md px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
                    >
                      <Field
                        type="radio"
                        name="discountType"
                        value={value}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage name="discountType" component="p" className="text-red-500 text-sm mt-2" />
                <p className="text-sm text-gray-500 mt-2 select-none leading-tight">
                  Chọn loại giảm giá cho sản phẩm.
                </p>
              </div>
              {values.discountType !== 'none' && (
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-2 select-none">
                    Giá trị giảm giá <span className="text-red-600">*</span>
                  </label>
                  {values.discountType === 'percent' ? (
                    <div className="flex items-center space-x-4">
                      <Field
                        type="range"
                        min="0"
                        max="100"
                        name="discountValue"
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-base font-semibold text-gray-700">{values.discountValue}%</span>
                    </div>
                  ) : (
                    <Field
                      type="number"
                      name="discountValue"
                      className="w-full border border-gray-200 rounded-md text-base text-gray-700 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập số tiền giảm giá cố định"
                    />
                  )}
                  <ErrorMessage name="discountValue" component="p" className="text-red-500 text-sm mt-2" />
                  <p className="text-sm text-gray-500 mt-2 select-none leading-tight">
                    Đặt giá trị giảm giá ({values.discountType === 'percent' ? 'phần trăm' : 'số tiền cố định'}).
                  </p>
                </div>
              )}
            </div>

            {/* Status Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Trạng thái</h2>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Field type="checkbox" name="active" className="mr-2" />
                Hoạt động
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {id ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ProductForm;