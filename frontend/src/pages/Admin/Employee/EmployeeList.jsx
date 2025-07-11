import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../../../features/slices/employeeSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeesList = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees);
  const loading = useSelector((state) => state.employee.loading);
  const error = useSelector((state) => state.employee.error);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteEmployee(id))
      .then(() => toast.success('Employee deleted successfully'))
      .catch(() => toast.error('Failed to delete employee'));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <Link to="/admin/addEmployee" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Employee
      </Link>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Full Name</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Username</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Roles</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{emp.id}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{emp.fullname}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{emp.username}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{emp.roles.join(', ')}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                <Link to={`/admin/editEmployee/${emp.id}`} className="text-blue-500 mr-2">Edit</Link>
                <button onClick={() => handleDelete(emp.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;