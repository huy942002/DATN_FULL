import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { saveCategory, updateCategory } from '../../../features/slices/categorySlice';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategorySchema = Yup.object().shape({
  categoryName: Yup.string().required('Category name is required'),
  description: Yup.string(),
});

const CategoryForm = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Kiểm tra xem có dữ liệu từ location.state không (dữ liệu chỉnh sửa)
  const editCategory = location.state?.category;

  const [initialValues, setInitialValues] = useState({
    categoryId: '',
    categoryName: '',
    description: '',
    createdAt: '',
    updatedAt: '',
  });


  useEffect(() => {
    if (editCategory) {
      setInitialValues({
        categoryId: editCategory.categoryId,
        categoryName: editCategory.categoryName,
        description: editCategory.description,
        createdAt: editCategory.createdAt,
        updatedAt: editCategory.updatedAt
      });
    }
  }, [editCategory]);
  const handleSubmit = async (values) => {
    if (editCategory) {
      try {
        await dispatch(updateCategory(values));
        toast.success('Color updated successfully');
      } catch (error) {
        toast.error('Error while updating product color');
      }
    } else {
      try {
        await dispatch(saveCategory(values));
        toast.success('Color created successfully');
      } catch (error) {
        toast.error('Error while creating product color');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {editCategory ? 'Edit Category' : 'Create Category'}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={CategorySchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700">Category Name</label>
              <Field
                name="categoryName"
                type="text"
                className="w-full px-3 py-2 border rounded"
              />
              <ErrorMessage
                name="categoryName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full px-3 py-2 border rounded"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              {editCategory ? 'Update Category' : 'Create Category'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
