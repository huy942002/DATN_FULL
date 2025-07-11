import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { createCraftingTechnique, updateCraftingTechnique, fetchCraftingTechniques } from '../../../features/slices/craftingTechniqueSlice';

// Schema xác thực với Yup
const CraftingTechniqueSchema = Yup.object().shape({
  techniqueName: Yup.string()
    .min(2, 'Crafting technique name must be at least 2 characters')
    .max(100, 'Crafting technique name must not exceed 100 characters')
    .required('Crafting technique name is required'),
  description: Yup.string().max(500, 'Description must not exceed 500 characters'),
});

const CraftingTechniqueForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.craftingTechniques);

  const craftingTechniqueToEdit = location.state?.craftingTechnique;

  useEffect(() => {
    if (!craftingTechniqueToEdit) {
      dispatch(fetchCraftingTechniques());
    }
  }, [craftingTechniqueToEdit, dispatch]);

  const initialValues = {
    techniqueName: craftingTechniqueToEdit ? craftingTechniqueToEdit.techniqueName : '',
    description: craftingTechniqueToEdit ? craftingTechniqueToEdit.description : '',
    isActive: craftingTechniqueToEdit ? craftingTechniqueToEdit.isActive : true,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let techniqueId;
      const craftingTechniqueData = {
        ...values,
        isActive: true, // Luôn đặt isActive=true khi tạo mới hoặc cập nhật
      };

      // Tạo hoặc cập nhật CraftingTechnique
      if (craftingTechniqueToEdit) {
        techniqueId = parseInt(craftingTechniqueToEdit.techniqueId);
        await dispatch(updateCraftingTechnique({ id: techniqueId, craftingTechniqueData })).unwrap();
        console.log("update");
      } else {
        const createdCraftingTechnique = await dispatch(createCraftingTechnique(craftingTechniqueData)).unwrap();
        techniqueId = createdCraftingTechnique.techniqueId;
      }

      toast.success(`Crafting technique ${craftingTechniqueToEdit ? 'updated' : 'created'} successfully`);
      navigate('/admin/craftingTechniques');
    } catch (error) {
      toast.error(`Failed to ${craftingTechniqueToEdit ? 'update' : 'create'} crafting technique: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{craftingTechniqueToEdit ? 'Edit Crafting Technique' : 'Add Crafting Technique'}</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={CraftingTechniqueSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded shadow-md">
            <div className="mb-4">
              <label htmlFor="techniqueName" className="block text-gray-700 font-medium mb-1">
                Crafting Technique Name
              </label>
              <Field
                type="text"
                name="techniqueName"
                className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter crafting technique name"
              />
              <ErrorMessage name="techniqueName" component="div" className="text-red-500 text-sm mt-1" />
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : craftingTechniqueToEdit ? 'Update' : 'Create'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CraftingTechniqueForm;