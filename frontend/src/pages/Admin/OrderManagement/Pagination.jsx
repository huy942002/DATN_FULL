import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center my-4 space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-2 py-1 border rounded bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>
      {[...Array(totalPages).keys()].map(num => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 border rounded ${num === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          {num + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-2 py-1 border rounded bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
