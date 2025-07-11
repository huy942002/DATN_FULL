import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createPriceRange, updatePriceRange, fetchPriceRanges } from '../../../features/slices/priceRangeSlice';

// Schema xác thực với Yup
const PriceRangeSchema = Yup.object().shape({
  priceRangeName: Yup.string()
    .min(2, 'Price range name must be at least 2 characters')
    .max(100, 'Price range name must not exceed 100 characters')
    .required('Price range name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const PriceRangeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.priceRanges);

  const priceRangeToEdit = location.state?.priceRange;

  useEffect(() => {
    if (!priceRangeToEdit) {
      dispatch(fetchPriceRanges());
    }
  }, [priceRangeToEdit, dispatch]);

  const initialValues = {
    priceRangeName: priceRangeToEdit ? priceRangeToEdit.priceRangeName : '',
    description: priceRangeToEdit ? priceRangeToEdit.description : '',
    active: priceRangeToEdit ? priceRangeToEdit.active : true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let priceRangeId;
      const priceRangeData = {
        ...values,
        active: true, // Luôn đặt isActive=true khi tạo mới hoặc cập nhật
      };

      // Tạo hoặc cập nhật PriceRange
      if (priceRangeToEdit) {
        priceRangeId = parseInt(priceRangeToEdit.priceRangeId);
        await dispatch(updatePriceRange({ id: priceRangeId, priceRangeData })).unwrap();
      } else {
        const createdPriceRange = await dispatch(createPriceRange(priceRangeData)).unwrap();
        priceRangeId = createdPriceRange.priceRangeId;
      }

      toast.success(`Price range ${priceRangeToEdit ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${priceRangeToEdit ? 'update' : 'create'} price range: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-lg">Error: {error}</p>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">{priceRangeToEdit ? 'Edit Price Range' : 'Add Price Range'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={PriceRangeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <label htmlFor="priceRangeName" className="block text-gray-700 font-medium mb-2">
                Price Range Name
              </label>
              <Field
                type="text"
                name="priceRangeName"
                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price range name"
              />
              <ErrorMessage name="priceRangeName" component="div" className="text-red-500 text-sm mt-1" />
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
              {isSubmitting ? 'Submitting...' : priceRangeToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PriceRangeForm;