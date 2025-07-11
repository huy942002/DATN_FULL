import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createWoodType, updateWoodType, fetchWoodTypes, uploadImage, fetchWoodTypesById } from '../../../features/slices/woodTypeSlice';
import { fetchMaterials } from '../../../features/slices/materialSlice';

// Schema xác thực với Yup
const WoodTypeSchema = Yup.object().shape({
  woodTypeName: Yup.string()
    .min(2, 'Wood type name must be at least 2 characters')
    .max(100, 'Wood type name must not exceed 100 characters')
    .required('Wood type name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
  materialId: Yup.number()
    .required('Material is required')
    .min(1, 'Please select a valid material'),
});

const WoodTypeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { woodTypes, uploadLoading, uploadError, loading, error } = useSelector((state) => state.woodTypes);
  const { materials } = useSelector((state) => state.material);

  const woodTypeToEdit = location.state?.woodType;

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);

  // Ảnh mặc định
  const defaultImage = '/images/default.jpg';

  useEffect(() => {
    dispatch(fetchMaterials());
    if (!woodTypeToEdit) {
      dispatch(fetchWoodTypes());
    }
    if (woodTypeToEdit?.naturalImageUrl) {
      // Kiểm tra tính hợp lệ của URL trước khi gán
      const imageUrl = `http://localhost:8080/public/load?imagePath=${encodeURIComponent(woodTypeToEdit.naturalImageUrl)}`;
      setImagePreview(imageUrl);
      setImageError(false); // Reset lỗi
    } else {
      setImagePreview(defaultImage);
      setImageError(false);
    }
  }, [woodTypeToEdit, dispatch]);

  const initialValues = {
    woodTypeName: woodTypeToEdit ? woodTypeToEdit.woodTypeName : '',
    description: woodTypeToEdit ? woodTypeToEdit.description : '',
    naturalImageUrl: woodTypeToEdit ? woodTypeToEdit.naturalImageUrl : '',
    materialId: woodTypeToEdit?.materials?.materialId || (materials.length > 0 ? materials[0].materialId : ''),
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImagePreview(defaultImage);
    setImageError(true);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let woodTypeId;
      let woodTypeData = {
        ...values,
        naturalImageUrl: woodTypeToEdit ? values.naturalImageUrl : '',
        active: true,
        materials: { materialId: values.materialId },
      };

      // Tạo hoặc cập nhật WoodType
      if (woodTypeToEdit) {
        woodTypeId = parseInt(woodTypeToEdit.woodTypeId);
        await dispatch(updateWoodType({ id: woodTypeId, woodTypeData })).unwrap();
        console.log("update");
      } else {
        const createdWoodType = await dispatch(createWoodType(woodTypeData)).unwrap();
        woodTypeId = createdWoodType.woodTypeId;
      }

      // Upload ảnh nếu có
      if (selectedImage) {
        await dispatch(uploadImage({ woodTypeId, file: selectedImage })).unwrap();
      }

      toast.success(`Wood type ${woodTypeToEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/woodTypeForm');
    } catch (error) {
      toast.error(`Failed to ${woodTypeToEdit ? 'update' : 'create'} wood type: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{woodTypeToEdit ? 'Edit Wood Type' : 'Add Wood Type'}</h2>
      {materials.length === 0 && (
        <p className="text-red-500 mb-4">No materials available. Please add materials first.</p>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={WoodTypeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="woodTypeName" className="block text-gray-700 font-medium mb-1">
                Wood Type Name
              </label>
              <Field
                type="text"
                name="woodTypeName"
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wood type name"
              />
              <ErrorMessage name="woodTypeName" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                rows="4"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="materialId" className="block text-gray-700 font-medium mb-1">
                Material
              </label>
              <Field
                as="select"
                name="materialId"
                className={`mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  materials.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={materials.length === 0}
              >
                <option value="" disabled>
                  {materials.length === 0 ? 'No materials available' : 'Select a material'}
                </option>
                {materials.map((material) => (
                  <option key={material.materialId} value={material.materialId}>
                    {material.materialName}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="materialId" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                    onError={handleImageError}
                  />
                </div>
              )}
              {imageError && <div className="text-red-500 text-sm mt-1">Failed to load image, using default.</div>}
              {uploadError && <div className="text-red-500 text-sm mt-1">{uploadError}</div>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || uploadLoading || materials.length === 0}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting || uploadLoading ? 'Submitting...' : woodTypeToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WoodTypeForm;