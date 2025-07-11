import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { createMaterial, updateMaterial } from '../../../features/slices/materialSlice';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const MaterialSchema = Yup.object().shape({
    materialName: Yup.string().required('Material name is required'),
    description: Yup.string(),
});

const MaterialForm = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    
    const editMaterial = location.state?.material;

    const [initialValues, setInitialValues] = useState({
        materialID: '',
        materialName: '',
        description: '',
        createdAt: '',
        updatedAt: '',
    })

    useEffect(() => {
        if (editMaterial) {
            setInitialValues({
                materialID: editMaterial.materialID,
                materialName: editMaterial.materialName,
                description: editMaterial.description,
                createdAt: editMaterial.createdAt,
                updatedAt: editMaterial.updatedAt,
            });
        }
    }, [editMaterial]);

    const handleSubmit = async (values) => {
        if (editMaterial) {
            try {
                await dispatch(updateMaterial(values));
                toast.success('Material updated successfully');
            } catch (error) {
                console.log(error)
                toast.error('Error while updating Material');
            }
        } else {
            try {
                await dispatch(createMaterial(values));
                toast.success('Material created successfully');
            } catch (error) {
                toast.error('Error while creating product color');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">
                {editMaterial ? 'Edit Material' : 'Create Material'}
            </h2>
            <Formik
                initialValues={initialValues}
                validationSchema={MaterialSchema}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Material Name</label>
                            <Field
                                name="materialName"
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                            />
                            <ErrorMessage
                                name="materialName"
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
                            {editMaterial ? 'Update Material' : 'Create Material'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MaterialForm;
