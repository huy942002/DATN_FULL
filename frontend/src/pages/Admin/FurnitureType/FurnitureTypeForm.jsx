import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createFurnitureType, updateFurnitureType, fetchFurnitureTypes } from '../../../features/slices/furnitureTypeSlice';

// Schema xác thực với Yup
const FurnitureTypeSchema = Yup.object().shape({
  typeName: Yup.string()
    .min(2, 'Furniture type name must be at least 2 characters')
    .max(100, 'Furniture type name must not exceed 100 characters')
    .required('Furniture type name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const FurnitureTypeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.furnitureTypes);

  const furnitureTypeToEdit = location.state?.furnitureType;

  useEffect(() => {
    if (!furnitureTypeToEdit) {
      dispatch(fetchFurnitureTypes());
    }
  }, [furnitureTypeToEdit, dispatch]);

  const initialValues = {
    typeName: furnitureTypeToEdit ? furnitureTypeToEdit.typeName : '',
    description: furnitureTypeToEdit ? furnitureTypeToEdit.description : '',
    active: furnitureTypeToEdit ? furnitureTypeToEdit.active : true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let furnitureTypeId;
      const furnitureTypeData = {
        ...values,
        active: true, // Luôn đặt isActive=true khi tạo mới hoặc cập nhật
      };

      // Tạo hoặc cập nhật FurnitureType
      if (furnitureTypeToEdit) {
        furnitureTypeId = parseInt(furnitureTypeToEdit.furnitureTypeId);
        await dispatch(updateFurnitureType({ id: furnitureTypeId, furnitureTypeData })).unwrap();
      } else {
        const createdFurnitureType = await dispatch(createFurnitureType(furnitureTypeData)).unwrap();
        furnitureTypeId = createdFurnitureType.furnitureTypeId;
      }

      toast.success(`Furniture type ${furnitureTypeToEdit ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${furnitureTypeToEdit ? 'update' : 'create'} furniture type: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">{furnitureTypeToEdit ? 'Edit Furniture Type' : 'Add Furniture Type'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={FurnitureTypeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <label htmlFor="typeName" className="block text-gray-700 font-medium mb-2">
                Furniture Type Name
              </label>
              <Field
                type="text"
                name="typeName"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter furniture type name"
              />
              <ErrorMessage name="typeName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                rows="4"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : furnitureTypeToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FurnitureTypeForm;