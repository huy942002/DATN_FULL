import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createProductColor, updateProductColor } from '../../../features/slices/productColorSlice';
import { toast } from 'react-toastify';
import config from '../../../api/apiSevices'


const ProductColorForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const editProductColor = location.state?.color;
  const token = window.localStorage.getItem('token');

  const axiosConfig ={
    headers: {
      'Authorization': 'Bearer ' + token, // Sử dụng Bearer authentication token ở đây
      "content-type": "multipart/form-data"
  }// Sử dụng Bearer authentication token ở đây
  }

  const { id } = useParams(); // Lấy id từ URL nếu là chỉnh sửa

  const [initialValues, setInitialValues] = useState({
    colorID: '',
    colorName: '',
    colorHexCode: '',
    image: null, // Chúng ta sẽ lưu trữ file hình ảnh ở đây
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    if (editProductColor) {
      setInitialValues({
        colorID: editProductColor.colorID,
        colorName: editProductColor.colorName,
        colorHexCode: editProductColor.colorHexCode,
        image: editProductColor.imageURL, // Nếu chỉnh sửa, chúng ta lấy URL hình ảnh hiện tại
        createdAt: editProductColor.createdAt,
        updatedAt: '',
      });
    }
  }, [editProductColor]);

  const validationSchema = Yup.object({
    colorName: Yup.string().required('Color name is required'),
    colorHexCode: Yup.string().required('Color hex code is required'),
    image: Yup.mixed().required('Image is required'), // Kiểm tra xem hình ảnh có được chọn không
  });

  

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('file', values.image); // Đưa tệp ảnh vào formData
  
    try {
      let imageUrl = '';
      if (values.image) {
        // Gửi tệp ảnh lên backend và lấy URL của ảnh
        const response = await config.post('/product-colors/upload', formData, axiosConfig);
  
        // Kiểm tra nếu phản hồi có chứa URL hình ảnh
        if (response.data) {
          imageUrl = response.data; // Lấy URL hình ảnh trả về từ backend
        }
      }
  
      // Nếu chỉnh sửa màu sắc, cập nhật sản phẩm màu
      if (editProductColor) {
        await dispatch(updateProductColor({ ...values, imageURL: imageUrl, id: parseInt(id) }));
        toast.success('Color updated successfully');
      } else {
        // Nếu tạo mới, gửi dữ liệu kèm ảnh
        await dispatch(createProductColor({ ...values, imageURL: imageUrl }));
        toast.success('Color created successfully');
      }
    } catch (error) {
      toast.error('Error while processing product color');
      console.error(error); // Log lỗi nếu cần
    }
  };
  


  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {editProductColor ? 'Edit Product Color' : 'Create Product Color'}
      </h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="colorName" className="block text-sm font-medium text-gray-700">Color Name</label>
              <Field
                type="text"
                id="colorName"
                name="colorName"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="colorHexCode" className="block text-sm font-medium text-gray-700">Hex Code</label>
              <Field
                type="text"
                id="colorHexCode"
                name="colorHexCode"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Choose Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              />
              {errors.image && touched.image && (
                <div className="text-red-500 text-sm">{errors.image}</div>
              )}
            </div>
            <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
              {editProductColor ? 'Update Color' : 'Add Color'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductColorForm;
