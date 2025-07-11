import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createStyle, updateStyle, fetchStyles } from '../../../features/slices/styleSlice';

// Schema xác thực với Yup
const StyleSchema = Yup.object().shape({
  styleName: Yup.string()
    .min(2, 'Style name must be at least 2 characters')
    .max(100, 'Style name must not exceed 100 characters')
    .required('Style name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const StyleForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { styles } = useSelector((state) => state.styles);
  const location = useLocation();

  const styleToEdit = location.state?.style;

  useEffect(() => {
    if (!styleToEdit) {
      dispatch(fetchStyles());
    }
  }, [, styleToEdit, dispatch]);

  const initialValues = {
    styleName: styleToEdit ? styleToEdit.styleName : '',
    description: styleToEdit ? styleToEdit.description : '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const styleData = {
      ...values,
      isActive: true,
    };

    if (styleToEdit) {
      dispatch(updateStyle({ id: parseInt(styleToEdit.styleId), styleData }))
        .unwrap()
        .then(() => {
          toast.success('Style updated successfully');
          navigate('/styles');
        })
        .catch(() => {
          toast.error('Failed to update style');
        })
        .finally(() => setSubmitting(false));
    } else {
      dispatch(createStyle(styleData))
        .unwrap()
        .then(() => {
          toast.success('Style created successfully');
          navigate('/styles');
        })
        .catch(() => {
          toast.error('Failed to create style');
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{styleToEdit ? 'Edit Style' : 'Add Style'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={StyleSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="styleName" className="block text-gray-700">
                Style Name
              </label>
              <Field
                type="text"
                name="styleName"
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter style name"
              />
              <ErrorMessage name="styleName" component="div" className="text-red-500 text-sm" />
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
              {isSubmitting ? 'Submitting...' : styleToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StyleForm;