import { useDispatch } from 'react-redux';
import { addEmployee } from '../../../features/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    fullname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phoneNumber: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    position: Yup.string().required('Required'),
    salary: Yup.number().min(0, 'Must be positive').required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().min(6, 'At least 6 characters').required('Required'),
    roles: Yup.array().min(1, 'Select at least one role').required('Required'),
  });

  const initialValues = {
    fullname: '',
    phoneNumber: '',
    address: '',
    position: '',
    salary: '',
    email: '',
    status: 1,
    username: '',
    password: '',
    roles: [],
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(addEmployee(values))
      .then(() => {
        toast.success('Employee added successfully');
      })
      .catch(() => {
        toast.error('Failed to add employee');
        setSubmitting(false);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Employee</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
              <Field name="position" placeholder="Position" className="border p-2 w-full" />
              <ErrorMessage name="position" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="salary" type="number" placeholder="Salary" className="border p-2 w-full" />
              <ErrorMessage name="salary" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="username" placeholder="Username" className="border p-2 w-full" />
              <ErrorMessage name="username" component="div" className="text-red-500" />
            </div>
            <div>
              <Field name="password" type="password" placeholder="Password" className="border p-2 w-full" />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <div>
              <Field as="select" name="roles" multiple className="border p-2 w-full">
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Field>
              <ErrorMessage name="roles" component="div" className="text-red-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Employee
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;