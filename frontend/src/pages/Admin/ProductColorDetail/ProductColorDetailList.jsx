// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAll, setSearch, setIsActive, setPage, setPageSize, remove } from '../../../features/slices/productColorDetailSlice';
// import { Link } from 'react-router-dom';
// import ReactPaginate from 'react-paginate';
// import { toast } from 'react-toastify';
// import { debounce } from 'lodash';

// const ProductColorDetailList = () => {
//   const dispatch = useDispatch();
//   const state = useSelector((state) => {
//     console.log('Redux state:', state); // Debug state
//     return state.productColorDetails || {};
//   });

//   const {
//     page = { content: [], totalPages: 0, number: 0, size: 10, totalElements: 0 },
//     search = '',
//     isActive = 'all',
//     loading = false,
//     error = null,
//   } = state;

//   useEffect(() => {
//     dispatch(fetchAll({ search, isActive, page: page.number, size: page.size }));
//   }, [search, isActive, page.number, page.size, dispatch]);

//   const handleDelete = (id) => {
//     dispatch(remove(id))
//       .then(() => {
//         dispatch(fetchAll({ search, isActive, page: page.number, size: page.size }));
//         toast.success('Xóa thành công');
//       })
//       .catch(() => {
//         toast.error('Xóa thất bại');
//       });
//   };

//   const debouncedSetSearch = debounce((value) => {
//     dispatch(setSearch(value));
//   }, 300);

//   if (loading) {
//     return <div className="text-center">Đang tải...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">Lỗi: {error}</div>;
//   }

//   const defaultImage = '/images/default.jpg';

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Danh sách chi tiết màu sản phẩm</h2>
//       <div className="mb-4 flex space-x-4">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => debouncedSetSearch(e.target.value)}
//           placeholder="Tìm kiếm theo SKU"
//           className="border p-2 rounded"
//         />
//         <select
//           value={isActive}
//           onChange={(e) => dispatch(setIsActive(e.target.value))}
//           className="border p-2 rounded"
//         >
//           <option value="all">Tất cả</option>
//           <option value="active">Kích hoạt</option>
//           <option value="inactive">Không kích hoạt</option>
//         </select>
//         <select
//           value={page.size}
//           onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
//           className="border p-2 rounded"
//         >
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//         </select>
//       </div>
//       <Link
//         to="/admin/productColorDetailForm"
//         className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
//       >
//         Thêm mới
//       </Link>
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Sản phẩm</th>
//             <th className="border p-2">Màu</th>
//             <th className="border p-2">Mã màu</th>
//             <th className="border p-2">Ảnh sản phẩm</th>
//             <th className="border p-2">Ảnh màu</th>
//             <th className="border p-2">SKU</th>
//             <th className="border p-2">Giá</th>
//             <th className="border p-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {page.content.map((item) => (
//             <tr key={item.productColorRelationId} className="hover:bg-gray-100">
//               <td className="border p-2">{item.productColorRelationId}</td>
//               <td className="border p-2">{item.productName || item.productId}</td>
//               <td className="border p-2">{item.colorName}</td>
//               <td className="border p-2 flex items-center">
//                 <span className="mr-2">{item.colorHexCode}</span>
//                 <div
//                   className="w-6 h-6 rounded"
//                   style={{ backgroundColor: item.colorHexCode }}
//                 ></div>
//               </td>
//               <td className="border p-2">
//                 {item.imageUrl ? (
//                   <img
//                   src={item.imageUrl ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(item.imageUrl)}` : defaultImage}
//                   alt={item.productName || 'Product'}
//                   className="w-16 h-16 object-cover rounded"
//                   loading="lazy"
//                 />
//                 ) : (
//                   'Không có ảnh'
//                 )}
//               </td>
//               <td className="border p-2">
//                 {item.colorImageUrl ? (
//                   <img
//                     src={item.colorImageUrl ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(item.colorImageUrl)}`: defaultImage}
//                     alt="Color"
//                     className="w-12 h-12 object-cover rounded"
//                   />
//                 ) : (
//                   'Không có ảnh'
//                 )}
//               </td>
//               <td className="border p-2">{item.sku}</td>
//               <td className="border p-2">{item.price}</td>
//               <td className="border p-2">
//                 <Link
//                   to={`/admin/productColorDetailForm/${item.productColorRelationId}`}
//                   className="text-blue-500 mr-2"
//                 >
//                   Sửa
//                 </Link>
//                 <button
//                   onClick={() => handleDelete(item.productColorRelationId)}
//                   className="text-red-500"
//                 >
//                   Xóa
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="mt-4">
//         <ReactPaginate
//           previousLabel={'Trước'}
//           nextLabel={'Sau'}
//           breakLabel={'...'}
//           pageCount={page.totalPages}
//           marginPagesDisplayed={2}
//           pageRangeDisplayed={5}
//           onPageChange={(data) => dispatch(setPage(data.selected))}
//           containerClassName={'flex space-x-2 justify-center'}
//           pageClassName={'border p-2 rounded'}
//           activeClassName={'bg-blue-500 text-white'}
//           previousClassName={'border p-2 rounded'}
//           nextClassName={'border p-2 rounded'}
//           breakClassName={'border p-2 rounded'}
//           forcePage={page.number}
//         />
//       </div>
//       <p className="mt-2 text-center">
//         Tổng cộng: {page.totalElements} mục
//       </p>
//     </div>
//   );
// };

// export default ProductColorDetailList;