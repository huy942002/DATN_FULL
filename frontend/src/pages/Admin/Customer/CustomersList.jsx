import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, deleteCustomer } from '../../../features/slices/customersSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomersList = () => {
  const dispatch = useDispatch();
  const customersState = useSelector((state) => state.customer);
  const customers = customersState?.customers || [];
  const loading = customersState?.loading || false;
  const error = customersState?.error || null;

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCustomer(id))
      .then(() => toast.success('Customer deleted successfully'))
      .catch(() => toast.error('Failed to delete customer'));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <Link to="/admin/addCustomer" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add Customer
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
          {customers.length > 0 ? (
            customers.map((cust) => (
              <tr key={cust.id}>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{cust.id}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{cust.fullname}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{cust.username}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{cust.roles.join(', ')}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  <Link to={`/admin/editEmployee/${cust.id}`} className="text-blue-500 mr-2">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(cust.id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-2 text-center">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersList;