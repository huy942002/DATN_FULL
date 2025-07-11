import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from '../../../features/slices/supplierSlice';

const validationSchema = Yup.object({
    supplierName: Yup.string()
        .max(200, 'Tên nhà cung cấp không được vượt quá 200 ký tự')
        .required('Tên nhà cung cấp là bắt buộc'),
    description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
    contactInfo: Yup.string().max(100, 'Thông tin liên hệ không được vượt quá 100 ký tự'),
    address: Yup.string().max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
    isActive: Yup.boolean(),
});

function SupplierManagement() {
    const dispatch = useDispatch();
    const suppliers = useSelector((state) => state.suppliers.suppliers || []);
    const status = useSelector((state) => state.suppliers.status);
    const error = useSelector((state) => state.suppliers.error);
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSuppliers());
        }
    }, [dispatch, status]);

    const initialValues = {
        supplierName: '',
        description: '',
        contactInfo: '',
        address: '',
        isActive: true,
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            if (editingSupplier) {
                await dispatch(updateSupplier({ id: editingSupplier.supplierId, supplierData: values })).unwrap();
                toast.success('Cập nhật nhà cung cấp thành công');
                setEditingSupplier(null);
            } else {
                await dispatch(createSupplier(values)).unwrap();
                toast.success('Tạo nhà cung cấp thành công');
            }
            resetForm();
        } catch (error) {
            toast.error('Lỗi: ' + (error.message || 'Không thể lưu nhà cung cấp'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
            try {
                await dispatch(deleteSupplier(id)).unwrap();
                toast.success('Xóa nhà cung cấp thành công');
            } catch (error) {
                toast.error('Lỗi: ' + (error.message || 'Không thể xóa nhà cung cấp'));
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Quản lý nhà cung cấp</h1>
            <Link to="/" className="text-blue-500 hover:underline mb-6 inline-block">
                ← Quay lại danh sách sản phẩm
            </Link>

            {/* Form for Creating/Editing Supplier */}
            <Formik
                initialValues={editingSupplier || initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form className="bg-white p-8 rounded-lg shadow-lg mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingSupplier ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên nhà cung cấp
                                </label>
                                <Field
                                    name="supplierName"
                                    type="text"
                                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                                />
                                <ErrorMessage
                                    name="supplierName"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Thông tin liên hệ
                                </label>
                                <Field
                                    name="contactInfo"
                                    type="text"
                                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                                />
                                <ErrorMessage
                                    name="contactInfo"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Địa chỉ
                                </label>
                                <Field
                                    name="address"
                                    type="text"
                                    className="mt-1 p-2 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <Field
                                    name="description"
                                    as="textarea"
                                    className="mt-1 p-2 border rounded w-full h-32 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Field type="checkbox" name="isActive" className="mr-2" />
                                Hoạt động
                            </label>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {editingSupplier ? 'Cập nhật' : 'Thêm nhà cung cấp'}
                            </button>
                            {editingSupplier && (
                                <button
                                    type="button"
                                    onClick={() => setEditingSupplier(null)}
                                    className="ml-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>

            {/* Supplier List */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Danh sách nhà cung cấp</h2>
                {status === 'loading' && <p>Đang tải...</p>}
                {status === 'failed' && <p className="text-red-500">Lỗi: {error}</p>}
                {status === 'succeeded' && suppliers.length === 0 && (
                    <p>Không có nhà cung cấp nào.</p>
                )}
                {status === 'succeeded' && suppliers.length > 0 && (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Tên</th>
                                <th className="p-2 text-left">Liên hệ</th>
                                <th className="p-2 text-left">Địa chỉ</th>
                                <th className="p-2 text-left">Mô tả</th>
                                <th className="p-2 text-left">Trạng thái</th>
                                <th className="p-2 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.supplierId} className="border-t">
                                    <td className="p-2">{supplier.supplierName}</td>
                                    <td className="p-2">{supplier.contactInfo}</td>
                                    <td className="p-2">{supplier.address}</td>
                                    <td className="p-2">{supplier.description}</td>
                                    <td className="p-2">
                                        {supplier.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                    </td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => handleEdit(supplier)}
                                            className="text-blue-500 hover:underline mr-2"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(supplier.supplierId)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default SupplierManagement;