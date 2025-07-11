import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  const notify = () => toast.success('Operation successful!');

  return (
    <div>
      <button onClick={notify} className="p-2 bg-green-500 text-white rounded">
        Show Success Toast
      </button>
      <ToastContainer />
    </div>
  );
};

export default ToastNotification;
