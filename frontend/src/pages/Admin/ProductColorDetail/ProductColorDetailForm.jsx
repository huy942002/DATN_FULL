// import React, { useEffect, useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { create, update, fetchById } from '../../../features/slices/productColorDetailSlice';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const validationSchema = Yup.object({
//   productId: Yup.number().required('Sản phẩm là bắt buộc'),
//   colorId: Yup.number().required('Màu sắc là bắt buộc'),
//   price: Yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
//   stockQuantity: Yup.number().min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0').required('Số lượng tồn kho là bắt buộc'),
//   active: Yup.boolean(),
//   imageUrl: Yup.string().url('URL không hợp lệ'),
//   sku: Yup.string().required('SKU là bắt buộc'),
//   barcode: Yup.string(),
//   metaTagTitle: Yup.string().required('Tiêu đề meta tag là bắt buộc'),
//   metaTagDescription: Yup.string(),
//   metaKeywords: Yup.string(),
// });

// const ProductColorDetailForm = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const current = useSelector((state) => state.productColorDetails.current);
//   const [products, setProducts] = useState([]);
//   const [colors, setColors] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/products');
//         setProducts(response.data);
//       } catch (error) {
//         toast.error('Không thể tải danh sách sản phẩm');
//       }
//     };
//     const fetchColors = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/colors');
//         setColors(response.data);
//       } catch (error) {
//         toast.error('Không thể tải danh sách màu sắc');
//       }
//     };
//     fetchProducts();
//     fetchColors();
//     if (id) {
//       dispatch(fetchById(id));
//     }
//   }, [id, dispatch]);

//   const initialValues = id && current ? current : {
//     productId: '',
//     colorId: '',
//     price: '',
//     stockQuantity: '',
//     active: true,
//     imageUrl: '',
//     sku: '',
//     barcode: '',
//     metaTagTitle: '',
//     metaTagDescription: '',
//     metaKeywords: '',
//   };

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       if (id) {
//         await dispatch(update({ id, data: values })).unwrap();
//         toast.success('Cập nhật thành công');
//       } else {
//         await dispatch(create(values)).unwrap();
//         toast.success('Tạo mới thành công');
//       }
//       navigate('/product-color-details');
//     } catch (error) {
//       toast.error(error.message || 'Thao tác thất bại');
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">{id ? 'Chỉnh sửa' : 'Tạo mới'} Chi tiết màu sản phẩm</h2>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize
//       >
//         {({ issubmitting }) => (
//           <Form className="space-y-4">
//             <div>
//               <label className="block">Sản phẩm</label>
//               <Field as="select" name="productId" className="w-full border p-2 rounded">
//                 <option value="">Chọn sản phẩm</option>
//                 {products.map((product) => (
//                   <option key={product.id} value={product.id}>
//                     {product.name}
//                   </option>
//                 ))}
//               </Field>
//               <ErrorMessage name="productId" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Màu sắc</label>
//               <Field as="select" name="colorId" className="w-full border p-2 rounded">
//                 <option value="">Chọn màu sắc</option>
//                 {colors.map((color) => (
//                   <option key={color.id} value={color.id}>
//                     {color.name}
//                   </option>
//                 ))}
//               </Field>
//               <ErrorMessage name="colorId" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Giá</label>
//               <Field type="number" name="price" className="w-full border p-2 rounded" />
//               <ErrorMessage name="price" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Số lượng tồn kho</label>
//               <Field type="number" name="stockQuantity" className="w-full border p-2 rounded" />
//               <ErrorMessage name="stockQuantity" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="flex items-center">
//                 <Field type="checkbox" name="active" className="mr-2" />
//                 Kích hoạt
//               </label>
//             </div>
//             <div>
//               <label className="block">URL hình ảnh</label>
//               <Field type="text" name="imageUrl" className="w-full border p-2 rounded" />
//               <ErrorMessage name="imageUrl" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">SKU</label>
//               <Field type="text" name="sku" className="w-full border p-2 rounded" />
//               <ErrorMessage name="sku" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Barcode</label>
//               <Field type="text" name="barcode" className="w-full border p-2 rounded" />
//               <ErrorMessage name="barcode" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Tiêu đề Meta Tag</label>
//               <Field type="text" name="metaTagTitle" className="w-full border p-2 rounded" />
//               <ErrorMessage name="metaTagTitle" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Mô tả Meta Tag</label>
//               <Field type="text" name="metaTagDescription" className="w-full border p-2 rounded" />
//               <ErrorMessage name="metaTagDescription" component="div" className="text-red-500" />
//             </div>
//             <div>
//               <label className="block">Từ khóa Meta</label>
//               <Field type="text" name="metaKeywords" className="w-full border p-2 rounded" />
//               <ErrorMessage name="metaKeywords" component="div" className="text-red-500" />
//             </div>
//             <button
//               type="submit"
//               disabled={issubmitting}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               {id ? 'Cập nhật' : 'Tạo mới'}
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default ProductColorDetailForm;