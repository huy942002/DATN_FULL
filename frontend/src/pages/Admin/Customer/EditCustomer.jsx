import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomer, fetchCustomers } from '../../../features/slices/customersSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const EditCustomer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customersState = useSelector((state) => state.customer.customers);
  const customers = customersState?.customers || [];
  const loading = customersState?.loading || false;

  const customer = customers.find((cust) => cust.id === parseInt(id));

  useEffect(() => {
    if (!customer && !loading) {
      dispatch(fetchCustomers());
    }
  }, [dispatch, customer, loading]);

  const validationSchema = Yup.object({
    fullname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().min(6, 'At least 6 characters'),
    roles: Yup.array().min(1, 'Select at least one role').required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(updateCustomer({ id, customer: values }))
      .then(() => {
        toast.success('Customer updated successfully');
        navigate('/customers');
      })
      .catch(() => {
        toast.error('Failed to update customer');
        setSubmitting(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return <p>Customer not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Customer</h1>
      <Formik
        initialValues={{
          fullname: customer.fullname,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          email: customer.email,
          status: customer.status,
          username: customer.username,
          password: '',
          roles: customer.roles,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field name="fullname" placeholder="Full Name" className="border p-2 w-full" />
              <ErrorMessage name="fullname" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="email" type="email" placeholder="Email" className="border p-2 w-full" />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="phoneNumber" placeholder="Phone Number" className="border p-2 w-full" />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="address" placeholder="Address" className="border p-2 w-full" />
              <ErrorMessage name="address" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="username" placeholder="Username" className="border p-2 w-full" />
              <ErrorMessage name="username" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="password" type="password" placeholder="New Password (optional)" className="border p-2 w-full" />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <div>
              <Field as="select" name="roles" multiple className="border p-2 w-full">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="customer">Customer</option>
              </Field>
              <ErrorMessage name="roles" component="div" className="text-red-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">
              Update Customer
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditCustomer;