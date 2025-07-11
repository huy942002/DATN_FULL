import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createLocation, updateLocation, fetchLocations } from '../../../features/slices/locationSlice';

// Schema xác thực với Yup
const LocationSchema = Yup.object().shape({
  locationName: Yup.string()
    .min(2, 'Location name must be at least 2 characters')
    .max(100, 'Location name must not exceed 100 characters')
    .required('Location name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const LocationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

   const location = useLocation();

  const { locations } = useSelector((state) => state.locations);

  const locationToEdit = location.state?.locationss;

  useEffect(() => {
    if (!locationToEdit) {
      dispatch(fetchLocations());
    }
  }, [locationToEdit, dispatch]);

  const initialValues = {
    locationName: locationToEdit ? locationToEdit.locationName : '',
    description: locationToEdit ? locationToEdit.description : '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const locationData = {
      ...values,
      isActive: true,
    };

    if (locationToEdit) {
      dispatch(updateLocation({ id: parseInt(locationToEdit.locationId), locationData }))
        .unwrap()
        .then(() => {
          toast.success('Location updated successfully');
          navigate('/locations');
        })
        .catch(() => {
          toast.error('Failed to update location');
        })
        .finally(() => setSubmitting(false));
    } else {
      dispatch(createLocation(locationData))
        .unwrap()
        .then(() => {
          toast.success('Location created successfully');
          navigate('/locations');
        })
        .catch(() => {
          toast.error('Failed to create location');
        })
        .finally(() => setSubmitting(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{locationToEdit ? 'Edit Location' : 'Add Location'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LocationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="locationName" className="block text-gray-700">
                Location Name
              </label>
              <Field
                type="text"
                name="locationName"
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter location name"
              />
              <ErrorMessage name="locationName" component="div" className="text-red-500 text-sm" />
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
              {isSubmitting ? 'Submitting...' : locationToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LocationForm;