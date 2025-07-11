import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, fetchCustomers } from "../../../features/slices/customersSlice";
import { addOrder } from "../../../features/slices/orderSlice";
import { addInvoice } from "../../../features/slices/invoiceSlice";
import { fetchProducts, setSearch, setPage } from "../../../features/slices/productSlice";
import { getProductColors } from "../../../features/slices/productColorSlice";
import { GetAllCategories } from "../../../features/slices/categorySlice";
import { fetchFurnitureTypes } from "../../../features/slices/furnitureTypeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faCartPlus, faTrash, faSearch, faFilter, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import config from "../../../api/apiSevices";
import defaultImage from "../../../assets/images/default.jpg";
import ReactPaginate from 'react-paginate';

const InvoicePrint = ({ invoice }) => {
  if (!invoice || !invoice.invoiceId) {
    return <div>Không có hóa đơn để in</div>;
  }
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Hóa đơn #{invoice.invoiceId}</h2>
      <p><strong>Khách hàng:</strong> {invoice.customerName || "Chưa chọn khách hàng"}</p>
      <p><strong>Ngày:</strong> {new Date(invoice.invoiceDate).toLocaleString("vi-VN")}</p>
      <h3 className="mt-4 font-semibold">Chi tiết đơn hàng</h3>
      <table className="w-full mt-2">
        <thead>
          <tr>
            <th className="text-left">Sản phẩm</th>
            <th className="text-right">Số lượng</th>
            <th className="text-right">Đơn giá</th>
            <th className="text-right">Tổng</th>
          </tr>
        </thead>
        <tbody>
          {invoice.orderDetails?.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td className="text-right">{item.quantity}</td>
              <td className="text-right">{item.price.toLocaleString("vi-VN")} ₫</td>
              <td className="text-right">{(item.price * item.quantity).toLocaleString("vi-VN")} ₫</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p><strong>Tổng tiền:</strong> {invoice.totalAmount?.toLocaleString("vi-VN")} ₫</p>
        <p><strong>Thuế (8%):</strong> {(invoice.taxAmount || 0).toLocaleString("vi-VN")} ₫</p>
        <p><strong>Phí vận chuyển:</strong> {(invoice.shippingFee || 0).toLocaleString("vi-VN")} ₫</p>
        <p><strong>Khách trả:</strong> {invoice.customerPaid?.toLocaleString("vi-VN")} ₫</p>
        <p><strong>Phương thức:</strong> {invoice.paymentMethod || "Không xác định"}</p>
      </div>
    </div>
  );
};

export default function POS() {
  const dispatch = useDispatch();
  const { customers: reduxCustomers, loading: customersLoading, error: customersError } = useSelector((state) => state.customers || { customers: [], loading: false, error: null });
  const { products, loading: productsLoading, error: productsError, totalPages, currentPage, search: productSearch, pageSize } = useSelector((state) => state.products || {});
  const productColors = useSelector((state) => state.productColors || []);
  const categories = useSelector((state) => state.category.categories || []);
  const furnitureTypes = useSelector((state) => state.furnitureTypes.furnitureTypes || []);
  const token = window.localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = sessionStorage.getItem('pos_invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [customers, setCustomers] = useState(reduxCustomers);
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(productSearch || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [furnitureTypeFilter, setFurnitureTypeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [printInvoice, setPrintInvoice] = useState(null);
  const componentRef = useRef();

  const activeInvoice = invoices.find((inv) => inv.id === activeInvoiceId) || null;
  const { cart = [], customerId, note = "", discount = 0, customerPaid = 0, paymentMethod = "Tiền mặt", printReceipt = true } = activeInvoice || {};
  const customer = customers.find((c) => c.id === customerId) || { fullname: "Chưa chọn khách hàng", phoneNumber: "", email: "", address: "" };

  const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  const taxAmount = total * 0.08;
  const shippingFee = 0;
  const totalAmount = total + taxAmount + shippingFee - discount;

  useEffect(() => {
    sessionStorage.setItem('pos_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    setCustomers(reduxCustomers);
  }, [reduxCustomers]);

  useEffect(() => {
    if (isProductModalOpen) {
      dispatch(getProductColors());
      dispatch(GetAllCategories());
      dispatch(fetchFurnitureTypes());
      dispatch(setPage(0));
      dispatch(fetchProducts({
        search: searchTerm,
        categoryId: categoryFilter,
        furnitureTypeId: furnitureTypeFilter,
        colorId: colorFilter,
        page: 0,
        size: pageSize
      }));
    }
  }, [dispatch, isProductModalOpen, searchTerm, categoryFilter, furnitureTypeFilter, colorFilter, pageSize]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    dispatch(setPage(0));
    dispatch(fetchProducts({
      search: searchTerm,
      categoryId: categoryFilter,
      furnitureTypeId: furnitureTypeFilter,
      colorId: colorFilter,
      page: 0,
      size: pageSize
    }));
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => setPrintInvoice(null),
  });

  const handleAddInvoice = () => {
    const newId = invoices.length ? Math.max(...invoices.map((inv) => inv.id)) + 1 : 1;
    setInvoices([...invoices, { id: newId, cart: [], customerId: null, note: "", discount: 0, customerPaid: 0, paymentMethod: "Tiền mặt", printReceipt: true }]);
    setActiveInvoiceId(newId);
    toast.success(`Tạo hóa đơn ${newId} thành công`);
  };

  const handleDeleteInvoice = (id) => {
    if (invoices.length === 1) {
      toast.error("Không thể xóa hóa đơn cuối cùng!");
      return;
    }
    const newInvoices = invoices.filter((inv) => inv.id !== id);
    setInvoices(newInvoices);
    if (activeInvoiceId === id) {
      setActiveInvoiceId(newInvoices[0].id);
    }
    toast.success(`Đã xóa hóa đơn ${id}`);
  };

  const handleSwitchInvoice = (id) => {
    setActiveInvoiceId(id);
    toast.info(`Chuyển sang hóa đơn ${id}`);
  };

  const updateActiveInvoice = (updates) => {
    setInvoices(invoices.map((inv) => (inv.id === activeInvoiceId ? { ...inv, ...updates } : inv)));
  };

  const handleSaveCustomer = async () => {
    if (!phone || !fullname) {
      toast.error("Vui lòng nhập số điện thoại và tên khách hàng");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Số điện thoại phải có đúng 10 chữ số");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }
    try {
      const customerData = {
        fullname,
        email: email || null,
        phoneNumber: phone,
        address: address || null,
        status: 1,
        username: "",
        password: "",
        roles: []
      };
      const customerResult = await dispatch(addCustomer(customerData)).unwrap();
      setCustomers([...customers, customerResult]);
      if (activeInvoice) {
        updateActiveInvoice({ customerId: customerResult.id });
      }
      setPhone("");
      setFullname("");
      setEmail("");
      setAddress("");
      setIsCustomerModalOpen(false);
      toast.success("Thông tin khách hàng đã được lưu!");
    } catch (error) {
      toast.error("Lỗi khi lưu khách hàng!");
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Giỏ hàng trống, vui lòng thêm sản phẩm");
      return;
    }
    let newCustomerId = customerId || null;
    try {
      if (!customerId && phone && fullname) {
        const customerData = {
          fullname,
          email: email || null,
          phoneNumber: phone,
          address: address || null,
          status: 1,
          username: "",
          password: "",
          roles: []
        };
        const customerResult = await dispatch(addCustomer(customerData)).unwrap();
        newCustomerId = customerResult.id;
        setCustomers([...customers, customerResult]);
        updateActiveInvoice({ customerId: newCustomerId });
      }

      const orderData = {
        fullName: customer.fullname,
        email: customer.email || null,
        phoneNumber: customer.phoneNumber || null,
        address: customer.address || null,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        shippingFee: shippingFee,
        paymentMethod: paymentMethod,
        shippingMethod: "Tại quầy",
        status: "PENDING",
        orderNotes: note,
        billingAddress: customer.address || null,
        shippingAddress: customer.address || null,
        orderDetails: cart.map((item) => ({
          productDetailsId: item.productDetailsId,
          quantity: item.quantity,
          price: item.discountedPrice,
          discount: item.itemDiscount || 0,
          total: item.discountedPrice * item.quantity,
        })),
      };

      console.log('Sending order data to backend:', orderData);
      const orderResult = await dispatch(addOrder(orderData)).unwrap();
      const invoiceData = {
        orderId: orderResult.orderId,
        customerId: newCustomerId,
        employeeId: null,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        finalAmount: totalAmount,
        invoiceStatus: "PENDING",
        paymentMethod: paymentMethod,
      };

      console.log('Sending invoice data to backend:', invoiceData);
      const invoiceResult = await dispatch(addInvoice(invoiceData)).unwrap();

      // Tạo bản ghi Payment
      const paymentData = {
        order: { orderId: orderResult.orderId },
        amount: totalAmount,
        paymentStatus: "COMPLETED",
        paymentMethod: paymentMethod,
        isActive: true,
      };
      await config.post("/payments", paymentData, axiosConfig);

      toast.success(`Thanh toán thành công! Mã hóa đơn: ${invoiceResult.invoiceId}`);
      setInvoices(invoices.filter((inv) => inv.id !== activeInvoiceId));
      if (invoices.length > 1) {
        setActiveInvoiceId(invoices[0].id);
      } else {
        setActiveInvoiceId(1);
        setInvoices([{ id: 1, cart: [], customerId: null, note: "", discount: 0, customerPaid: 0, paymentMethod: "Tiền mặt", printReceipt: true }]);
      }
      setPhone("");
      setFullname("");
      setEmail("");
      setAddress("");
      if (printReceipt) {
        setPrintInvoice({
          ...invoiceResult,
          customerName: customer.fullname,
          orderDetails: cart.map((item) => ({
            productName: item.name,
            quantity: item.quantity,
            price: item.discountedPrice,
          })),
        });
        handlePrint();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(`Lỗi: ${error.message || "Thanh toán thất bại"}`);
    }
  };

  const handleAddToCart = (productDetail, product) => {
    if (!productDetail.active) {
      toast.error("Sản phẩm không khả dụng");
      return;
    }

    const existingItem = cart.find((item) => item.productDetailsId === productDetail.productDetailsId);
    const basePrice = productDetail.price;
    let discountedPrice = basePrice;
    let itemDiscount = 0;
    let discountDisplay = "0";

    if (product.discount && product.discount.discountType !== "none") {
      if (product.discount.discountType === "PERCENTAGE") {
        itemDiscount = (basePrice * (product.discount.discountValue || 0)) / 100;
        discountDisplay = `${product.discount.discountValue}%`;
      } else {
        itemDiscount = product.discount.discountValue || 0;
        discountDisplay = `${itemDiscount.toLocaleString("vi-VN")} ₫`;
      }
      discountedPrice = basePrice - itemDiscount;
    }

    const color = productColors.find(c => c.colorId === productDetail.colorId)?.colorName || getColorName(productDetail.colorId);

    if (existingItem) {
      updateActiveInvoice({
        cart: cart.map((item) =>
          item.productDetailsId === productDetail.productDetailsId ? { ...item, quantity: item.quantity + 1 } : item
        ),
      });
    } else {
      updateActiveInvoice({
        cart: [...cart, {
          productDetailsId: productDetail.productDetailsId,
          price: basePrice,
          discountedPrice,
          itemDiscount,
          discountDisplay,
          quantity: 1,
          name: productDetail.metaTagTitle,
          stockQuantity: productDetail.stockQuantity,
          colorId: productDetail.colorId,
          color,
          dimensions: product.dimensions
        }],
      });
    }
    toast.success(`Đã thêm ${productDetail.metaTagTitle} vào giỏ hàng`);
  };

  const handleUpdateQuantity = (productDetailsId, quantity) => {
    if (quantity < 1) return;
    updateActiveInvoice({
      cart: cart.map((item) =>
        item.productDetailsId === productDetailsId ? { ...item, quantity } : item
      ),
    });
  };

  const handleRemoveFromCart = (productDetailsId) => {
    updateActiveInvoice({
      cart: cart.filter((item) => item.productDetailsId !== productDetailsId),
    });
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    dispatch(setPage(0));
    dispatch(fetchProducts({
      search: value,
      categoryId: categoryFilter,
      furnitureTypeId: furnitureTypeFilter,
      colorId: colorFilter,
      page: 0,
      size: pageSize
    }));
  }, [dispatch, categoryFilter, furnitureTypeFilter, colorFilter, pageSize]);

  const handlePageChange = (data) => {
    dispatch(setPage(data.selected));
    dispatch(fetchProducts({
      search: searchTerm,
      categoryId: categoryFilter,
      furnitureTypeId: furnitureTypeFilter,
      colorId: colorFilter,
      page: data.selected,
      size: pageSize
    }));
  };

  const getMainImage = (imageUrl) => {
    return imageUrl ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(imageUrl)}` : defaultImage;
  };

  const getColorName = (colorId) => {
    const colorMap = {
      1: "Tự Nhiên",
      4: "Nâu",
    };
    return colorMap[colorId] || "Không xác định";
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-100">
      <nav className="bg-[#b91c1c] text-white p-4 sticky top-0 z-[1000] shadow-lg">
        <div className="flex items-center justify-between w-full max-w-[95vw] mx-auto">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">POS System</h1>
            <div className="flex items-center space-x-3 overflow-x-auto">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="relative flex items-center">
                  <button
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeInvoiceId === invoice.id ? "bg-white text-[#b91c1c] shadow-md" : "bg-[#a11717] hover:bg-[#c82323]"}`}
                    onClick={() => handleSwitchInvoice(invoice.id)}
                  >
                    Hóa đơn {invoice.id}
                    {invoice.cart.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 rounded-full">
                        {invoice.cart.length}
                      </span>
                    )}
                  </button>
                  <button
                    className="ml-2 text-white hover:text-gray-200"
                    onClick={() => handleDeleteInvoice(invoice.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition flex items-center"
                onClick={() => handleAddInvoice()}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm hóa đơn
              </button>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition flex items-center"
              onClick={() => {
                console.log("Opening product modal");
                setIsProductModalOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" /> Sản phẩm
            </button>
            <button
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition flex items-center"
              onClick={() => {
                console.log("Opening customer modal");
                setIsCustomerModalOpen(true);
              }}
            >
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" /> Khách hàng
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-[95vw] mx-auto">
        <div className="flex-1 flex flex-col bg-white shadow-md m-2 rounded-lg overflow-hidden">
          <div className="p-6 flex-1 overflow-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Giỏ hàng</h2>
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[50vh]">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 min-w-[150px]">Sản phẩm</th>
                      <th className="px-4 py-3 min-w-[100px]">Màu sắc</th>
                      <th className="px-4 py-3 min-w-[120px]">Kích thước</th>
                      <th className="px-4 py-3 min-w-[100px]">Số lượng</th>
                      <th className="px-4 py-3 min-w-[120px]">Đơn giá</th>
                      <th className="px-4 py-3 min-w-[120px]">Giảm giá</th>
                      <th className="px-4 py-3 min-w-[120px]">Tổng</th>
                      <th className="px-4 py-3 min-w-[80px]">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.color}</td>
                        <td className="px-4 py-3">{item.dimensions || "N/A"} cm</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productDetailsId, parseInt(e.target.value))}
                            className="w-20 border rounded-md text-right p-1 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-3">{(item.discountedPrice || item.price).toLocaleString("vi-VN")} ₫</td>
                        <td className="px-4 py-3">{item.discountDisplay || "0"}</td>
                        <td className="px-4 py-3">{((item.discountedPrice || item.price) * item.quantity).toLocaleString("vi-VN")} ₫</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleRemoveFromCart(item.productDetailsId)} className="text-red-600 hover:text-red-800">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {cart.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-gray-500">
                          Giỏ hàng trống
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-1 border-t border-gray-200">
            <p className="text-[#b91c1c] text-base font-semibold mt-4">
              Hóa đơn {activeInvoiceId}: {cart.length} sản phẩm
            </p>
          </div>

          {activeInvoice && customerId && (
            <div className="p-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-50">{customer.fullname}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-50">{customer.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-50">{customer.email || "Không có"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <p className="p-2 border border-gray-300 rounded-md bg-gray-50">{customer.address || "Không có"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="w-full md:w-80 bg-white shadow-md m-2 rounded-lg p-6 flex flex-col justify-between">
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Tổng tiền: ({cart.length} sản phẩm)</span>
              <span>{total.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế (8%)</span>
              <span>{taxAmount.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Chiết khấu</span>
              <input
                id="discount-sidebar"
                className="w-32 p-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                type="number"
                value={discount}
                onChange={(e) =>
                  updateActiveInvoice({ discount: e.target.value === "" ? 0 : parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="text-red-600 text-lg">{totalAmount.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Tiền khách đưa</span>
              <input
                id="customerPaid"
                className="w-32 p-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                type="number"
                value={customerPaid}
                onChange={(e) =>
                  updateActiveInvoice({ customerPaid: e.target.value === "" ? 0 : parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex justify-between">
              <span>Tiền thừa trả khách</span>
              <span>{(customerPaid - totalAmount).toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm border-b border-gray-200 pb-1">
              <i className="fas fa-pencil-alt"></i>
              <input
                className="w-full bg-transparent border-none focus:outline-none placeholder-gray-400"
                placeholder="Thêm ghi chú"
                type="text"
                value={note}
                onChange={(e) => updateActiveInvoice({ note: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>In hóa đơn</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={printReceipt}
                  className="sr-only peer"
                  type="checkbox"
                  onChange={(e) => updateActiveInvoice({ printReceipt: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
          <form className="mt-6" onSubmit={handlePayment}>
            <fieldset className="flex justify-between text-sm text-gray-700 mb-4">
              <label className="flex items-center space-x-1">
                <input
                  checked={paymentMethod === "Tiền mặt"}
                  name="payment"
                  type="radio"
                  value="Tiền mặt"
                  onChange={(e) => updateActiveInvoice({ paymentMethod: e.target.value })}
                />
                <span>Tiền mặt</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  checked={paymentMethod === "Thẻ"}
                  name="payment"
                  type="radio"
                  value="Thẻ"
                  onChange={(e) => updateActiveInvoice({ paymentMethod: e.target.value })}
                />
                <span>Thẻ</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  checked={paymentMethod === "Chuyển khoản"}
                  name="payment"
                  type="radio"
                  value="Chuyển khoản"
                  onChange={(e) => updateActiveInvoice({ paymentMethod: e.target.value })}
                />
                <span>Chuyển khoản</span>
              </label>
            </fieldset>
            <button
              className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-semibold py-3 rounded-md transition shadow-md"
              type="submit"
            >
              Thanh toán
            </button>
          </form>
        </aside>
      </div>
      {printInvoice && (
        <div ref={componentRef} style={{ display: "none" }}>
          <InvoicePrint invoice={printInvoice} />
        </div>
      )}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-8 rounded-lg w-full max-w-[95vw] h-full max-h-[95vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#3E3F5E]">Danh sách sản phẩm</h2>
              <button
                onClick={() => {
                  console.log("Closing product modal");
                  setIsProductModalOpen(false);
                }}
                className="text-gray-700 font-semibold hover:text-gray-900"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Tìm tên, SKU, hoặc mô tả..."
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange(setCategoryFilter)(e)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại nội thất</label>
                <select
                  value={furnitureTypeFilter}
                  onChange={(e) => handleFilterChange(setFurnitureTypeFilter)(e)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                >
                  <option value="">Tất cả loại nội thất</option>
                  {furnitureTypes.map((type) => (
                    <option key={type.furnitureTypeId} value={type.furnitureTypeId}>{type.furnitureTypeName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                <select
                  value={colorFilter}
                  onChange={(e) => handleFilterChange(setColorFilter)(e)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                >
                  <option value="">Tất cả màu sắc</option>
                  {productColors.map((color) => (
                    <option key={color.colorId} value={color.colorId}>{color.colorName}</option>
                  ))}
                </select>
              </div>
            </div>
            {productsLoading && <p className="text-center py-4">Đang tải...</p>}
            {productsError && <p className="text-center py-4 text-red-500">Lỗi: {productsError}</p>}
            {!productsLoading && !productsError && (!products || products.length === 0) && (
              <p className="text-center py-4 text-gray-500">Không tìm thấy sản phẩm nào</p>
            )}
            {!productsLoading && !productsError && products && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.flatMap((product) => 
                  (Array.isArray(product.productDetails) ? product.productDetails : []).map((detail) => ({
                    ...detail,
                    dimensions: product.dimensions,
                    product
                  }))
                ).map((productDetail) => {
                  let discountDisplay = "0";
                  if (productDetail.product?.discount && productDetail.product.discount.discountType !== "none") {
                    if (productDetail.product.discount.discountType === "PERCENTAGE") {
                      discountDisplay = `${productDetail.product.discount.discountValue}%`;
                    } else {
                      discountDisplay = `${(productDetail.product.discount.discountValue || 0).toLocaleString("vi-VN")} ₫`;
                    }
                  }
                  return (
                    <div
                      key={productDetail.productDetailsId}
                      className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition"
                    >
                      <img
                        src={getMainImage(productDetail.imageUrl)}
                        alt={productDetail.metaTagTitle}
                        className="w-full h-32 object-cover rounded-md mb-2"
                        loading="lazy"
                      />
                      <h3 className="text-sm font-semibold text-gray-700 truncate">{productDetail.metaTagTitle}</h3>
                      <p className="text-xs text-gray-500">Mã SKU: {productDetail.sku}</p>
                      <p className="text-sm text-gray-700">Màu sắc: {productColors.find(c => c.colorId === productDetail.colorId)?.colorName || getColorName(productDetail.colorId)}</p>
                      <p className="text-sm text-gray-700">Kích thước: {productDetail.dimensions || "N/A"} cm</p>
                      <div className="text-sm text-gray-700">
                        {productDetail.product?.discount && productDetail.product.discount.discountType !== "none" ? (
                          <>
                            <p className="line-through text-gray-500">Giá gốc: {productDetail.price.toLocaleString("vi-VN")} ₫</p>
                            <p className="text-red-600">Giá giảm: {(productDetail.product.discountedPrice || productDetail.price).toLocaleString("vi-VN")} ₫ ({discountDisplay})</p>
                          </>
                        ) : (
                          <p>Giá: {productDetail.price.toLocaleString("vi-VN")} ₫</p>
                        )}
                      </div>
                      <button
                        className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition w-full flex items-center justify-center shadow-md"
                        onClick={() => handleAddToCart(productDetail, productDetail.product)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Thêm
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {totalPages > 1 && !productsLoading && !productsError && (
              <div className="mt-6 flex justify-center">
                <ReactPaginate
                  previousLabel={'Trước'}
                  nextLabel={'Sau'}
                  breakLabel={'...'}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={'flex items-center space-x-1'}
                  pageClassName={'px-3 py-1 border rounded-md hover:bg-gray-100 cursor-pointer'}
                  activeClassName={'bg-[#b91c1c] text-white border-[#b91c1c]'}
                  previousClassName={'px-3 py-1 border rounded-md hover:bg-gray-100 cursor-pointer'}
                  nextClassName={'px-3 py-1 border rounded-md hover:bg-gray-100 cursor-pointer'}
                  breakClassName={'px-3 py-1 border rounded-md'}
                  disabledClassName={'opacity-50 cursor-not-allowed'}
                  forcePage={currentPage}
                />
              </div>
            )}
            {products && (
              <p className="mt-2 text-center text-sm text-gray-600">
                Tổng cộng: {products.flatMap((product) => Array.isArray(product.productDetails) ? product.productDetails : []).length} biến thể
              </p>
            )}
          </div>
        </div>
      )}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-8 rounded-lg w-full max-w-[95vw] h-full max-h-[95vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#3E3F5E]">Quản lý khách hàng</h2>
              <button
                onClick={() => {
                  console.log("Closing customer modal");
                  setIsCustomerModalOpen(false);
                  setPhone("");
                  setFullname("");
                  setEmail("");
                  setAddress("");
                }}
                className="text-gray-700 font-semibold hover:text-gray-900"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                <input
                  id="customer-phone"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                  placeholder="Nhập số điện thoại"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="customer-fullname" className="block text-sm font-medium text-gray-700 mb-1">Tên khách</label>
                <input
                  id="customer-fullname"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                  placeholder="Nhập tên khách"
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="customer-email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                  placeholder="Nhập email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="customer-address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  id="customer-address"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b91c1c] shadow-sm"
                  placeholder="Nhập địa chỉ"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
            <button
              className="mt-4 bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2 transition shadow-md"
              type="button"
              onClick={handleSaveCustomer}
            >
              <i className="fas fa-user-plus"></i>
              <span>Thêm khách hàng</span>
            </button>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Danh sách khách hàng</h3>
              <ul className="max-h-96 overflow-y-auto border rounded-md">
                {customersLoading && <li className="p-2 text-center">Đang tải...</li>}
                {customersError && <li className="p-2 text-red-500 text-center">Lỗi: {customersError}</li>}
                {!customersLoading && !customersError && customers.length === 0 && (
                  <li className="p-2 text-center text-gray-500">Không có khách hàng</li>
                )}
                {!customersLoading && !customersError && customers.map((cust) => (
                  <li
                    key={cust.id}
                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      if (activeInvoice) {
                        updateActiveInvoice({ customerId: cust.id });
                      }
                      setIsCustomerModalOpen(false);
                      toast.success(`Đã chọn khách hàng: ${cust.fullname}`);
                    }}
                  >
                    {cust.fullname} - {cust.phoneNumber}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}