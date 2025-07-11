import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createFunction, updateFunction, fetchFunctions } from '../../../features/slices/functionSlice';

// Schema xác thực với Yup
const FunctionSchema = Yup.object().shape({
  functionName: Yup.string()
    .min(2, 'Function name must be at least 2 characters')
    .max(100, 'Function name must not exceed 100 characters')
    .required('Function name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const FunctionForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  // Kiểm tra xem có dữ liệu từ location.state không (dữ liệu chỉnh sửa)
  const functionToEdit = location.state?.functions;
  useEffect(() => {
    if (!functionToEdit) {
      dispatch(fetchFunctions());
    }
  }, [functionToEdit, dispatch]);

  const initialValues = {
    functionName: functionToEdit ? functionToEdit.functionName : '',
    description: functionToEdit ? functionToEdit.description : '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const functionData = {
      ...values,
      isActive: true,
    };

    if (functionToEdit) {
      dispatch(updateFunction({ id: parseInt(functionToEdit.functionId), functionData }))
        .unwrap()
        .then(() => {
          toast.success('Function updated successfully');
          navigate('/functions');
        })
        .catch(() => {
          toast.error('Failed to update function');
        })
        .finally(() => setSubmitting(false));
    } else {
      dispatch(createFunction(functionData))
        .unwrap()
        .then(() => {
          toast.success('Function created successfully');
          navigate('/functions');
        })
        .catch(() => {
          toast.error('Failed to create function');
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{functionToEdit ? 'Edit Function' : 'Add Function'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={FunctionSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="functionName" className="block text-gray-700">
                Function Name
              </label>
              <Field
                type="text"
                name="functionName"
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter function name"
              />
              <ErrorMessage name="functionName" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter description"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : functionToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FunctionForm;