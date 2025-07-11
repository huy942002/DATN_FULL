import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faCartPlus, faTrash, faSearch, faUserPlus, faFilter, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
import 'react-toastify/dist/ReactToastify.css';
import { Drawer } from 'flowbite-react';
import {
    addCustomer,
    fetchCustomers,
} from '../../../../features/slices/customersSlice';
import { addOrder } from '../../../../features/slices/orderSlice';
import { addInvoice } from '../../../../features/slices/invoiceSlice';
import {
    fetchProductsPos,
    setSearch,
    setCategoryId,
    setFurnitureTypeId,
    setColorId,
    setSortBy,
    setSortDirection,
    setPage,
} from '../../../../features/slices/productSlice';
import { getProductColors } from '../../../../features/slices/productColorSlice';
import { GetAllCategories } from '../../../../features/slices/categorySlice';
import { fetchFurnitureTypes } from '../../../../features/slices/furnitureTypeSlice';
import config from '../../../../api/apiSevices';
import defaultImage from '../../../../assets/images/default.jpg';
import { createSelector } from 'reselect';

// Memoized Redux selectors
const selectProductsState = (state) => state.products || {};
const selectProducts = createSelector(
    [selectProductsState],
    (products) => ({
        products: products.products || [],
        loading: products.loading || false,
        error: products.error || null,
        totalPages: products.totalPages || 0,
        currentPage: products.currentPage || 0,
        search: products.search || '',
        categoryId: products.categoryId || null,
        furnitureTypeId: products.furnitureTypeId || null,
        colorId: products.colorId || null,
        sortBy: products.sortBy || 'productName',
        sortDirection: products.sortDirection || 'ASC',
        pageSize: products.pageSize || 10,
    })
);

// Custom Pagination Component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(0, currentPage - halfRange);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Trang trước"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {startPage > 0 && (
                <>
                    <button
                        onClick={() => onPageChange(0)}
                        className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === 0 ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
                        aria-label="Trang 1"
                    >
                        1
                    </button>
                    {startPage > 1 && <span className="px-3 py-1 text-gray-600">...</span>}
                </>
            )}
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === page ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
                    aria-label={`Trang ${page + 1}`}
                >
                    {page + 1}
                </button>
            ))}
            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <span className="px-3 py-1 text-gray-600">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages - 1)}
                        className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === totalPages - 1 ? 'bg-[#22c55e] text-white border-[#22c55e]' : ''}`}
                        aria-label={`Trang ${totalPages}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Trang sau"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

// InvoicePrint Component
const InvoicePrint = ({ invoice }) => {
    if (!invoice || !invoice.invoiceId) {
        return <div>Không có hóa đơn để in</div>;
    }
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Hóa đơn #{invoice.invoiceId}</h2>
            <p><strong>Khách hàng:</strong> {invoice.customerName || 'Chưa chọn khách hàng'}</p>
            <p><strong>Ngày:</strong> {new Date(invoice.invoiceDate).toLocaleString('vi-VN')}</p>
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
                            <td className="text-right">{item.price.toLocaleString('vi-VN')} ₫</td>
                            <td className="text-right">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <p><strong>Tổng tiền:</strong> {invoice.totalAmount?.toLocaleString('vi-VN')} ₫</p>
                <p><strong>Thuế (8%):</strong> {(invoice.taxAmount || 0).toLocaleString('vi-VN')} ₫</p>
                <p><strong>Phí vận chuyển:</strong> {(invoice.shippingFee || 0).toLocaleString('vi-VN')} ₫</p>
                <p><strong>Khách trả:</strong> {invoice.customerPaid?.toLocaleString('vi-VN')} ₫</p>
                <p><strong>Phương thức:</strong> {invoice.paymentMethod || 'Không xác định'}</p>
            </div>
        </div>
    );
};

const DetailInvoice = () => {
    const count = useRef(0); // Use ref to keep track of callback count
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const componentRef = useRef();
    const hasProcessedRef = useRef(false); // Track if VNPAY callback has been processed

    // Redux selectors
    const { customers, loading: customersLoading, error: customersError } = useSelector(
        (state) => state.customers || { customers: [], loading: false, error: null }
    );
    const {
        products,
        loading: productsLoading,
        error: productsError,
        totalPages,
        currentPage,
        search: productSearch,
        categoryId,
        furnitureTypeId,
        colorId,
        sortBy,
        sortDirection,
        pageSize,
    } = useSelector(selectProducts);
    const productColors = useSelector((state) => state.productColors || []);
    const categories = useSelector((state) => state.category.categories || []);
    const furnitureTypes = useSelector((state) => state.furnitureTypes.furnitureTypes || []);

    // State
    const [invoices, setInvoices] = useState(() =>
        JSON.parse(sessionStorage.getItem('pos_invoices')) || []
    );
    const [activeTab, setActiveTab] = useState('customer');
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
    const [customerOption, setCustomerOption] = useState('Mới');
    const [customer, setCustomer] = useState({
        fullname: '',
        phoneNumber: '',
        email: '',
        address: '',
        shipping_address: '',
    });
    const [newCustomer, setNewCustomer] = useState({
        fullname: '',
        phoneNumber: '',
        email: '',
        address: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [furnitureTypeFilter, setFurnitureTypeFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [sortByFilter, setSortByFilter] = useState('productName');
    const [sortDirectionFilter, setSortDirectionFilter] = useState('ASC');
    const [discount, setDiscount] = useState(0);
    const [customerPaid, setCustomerPaid] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Tiền mặt');
    const [note, setNote] = useState('');
    const [printReceipt, setPrintReceipt] = useState(true);
    const [printInvoice, setPrintInvoice] = useState(null);
    const [tempPaymentData, setTempPaymentData] = useState(() => {
        const storedData = localStorage.getItem("tempPaymentData");
        return storedData ? JSON.parse(storedData) : null;
    });

    const token = window.localStorage.getItem('token');
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Find invoice
    const invoice = invoices.find((inv) => inv.id === parseInt(id)) || null;
    const cart = invoice?.cart || [];
    const customerId = invoice?.customerId || null;
    const selectedCustomer = customers.find((c) => c.customerId === customerId) || {
        fullname: 'Chưa chọn khách hàng',
        phoneNumber: '',
        email: '',
        address: '',
        shipping_address: '',
    };

    // Calculations
    const total = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const taxAmount = total * 0.08;
    const shippingFee = 0;
    const totalAmount = total + taxAmount + shippingFee - discount;

    // Retry fetch function
    const retryFetch = async (url, options, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || `HTTP error: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                if (i < retries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
    };

    // Handle VNPAY callback
    useEffect(() => {
        let isCancelled = false;
        const handleVNPayCallback = async () => {
            console.log("VNPay callback triggered", location.search);

            if (hasProcessedRef.current) {
                console.log("Callback already processed in current session");
                return;
            }

            const query = new URLSearchParams(location.search);
            const vnp_ResponseCode = query.get("vnp_ResponseCode");
            const vnp_TxnRef = query.get("vnp_TxnRef");
            const vnp_TransactionNo = query.get("vnp_TransactionNo");
            const vnp_Amount = query.get("vnp_Amount");

            const processedTxnRef = localStorage.getItem("processedTxnRef");
            if (processedTxnRef === vnp_TxnRef) {
                console.log("Transaction already processed:", vnp_TxnRef);
                hasProcessedRef.current = true;
                return;
            }

            if (isCancelled) {
                console.log("Callback cancelled");
                return;
            }

            if (vnp_ResponseCode && vnp_TxnRef && vnp_TransactionNo && vnp_Amount) {
                console.log("VNPay parameters:", { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo, vnp_Amount, tempPaymentData });
                if (vnp_ResponseCode === "00") {
                    if (!tempPaymentData) {
                        console.error("tempPaymentData is null, retrieving from localStorage");
                        const storedData = localStorage.getItem("tempPaymentData");
                        if (!storedData) {
                            toast.error("Lỗi: Dữ liệu thanh toán tạm thời không tồn tại. Vui lòng thử lại.");
                            navigate(`/admin/pos/detailInvoice/${id}`);
                            return;
                        }
                        setTempPaymentData(JSON.parse(storedData));
                    }

                    try {
                        let newCustomerId = customerId;
                        if (!customerId && customer.fullname && customer.phoneNumber) {
                            const customerData = {
                                fullname: customer.fullname,
                                phoneNumber: customer.phoneNumber || null,
                                email: customer.email || null,
                                address: customer.address || null,
                                status: 1,
                                username: '',
                                password: '',
                                roles: [],
                            };
                            const customerResult = await dispatch(addCustomer(customerData)).unwrap();
                            newCustomerId = customerResult.id;
                        }

                        const orderData = {
                            customerId: newCustomerId,
                            totalAmount: totalAmount.toFixed(2),
                            paymentMethod: "VNPAY",
                            shippingMethod: "Tại quầy",
                            status: "PROCESSING",
                            orderNotes: note,
                            billingAddress: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
                            shippingAddress: customer.shipping_address || customer.address || null,
                            orderDetails: cart.map((item) => ({
                                productDetailsId: item.productDetailsId,
                                quantity: item.quantity,
                                price: item.discountedPrice.toFixed(2),
                                discount: item.itemDiscount.toFixed(2),
                                total: (item.discountedPrice * item.quantity).toFixed(2),
                            })),
                        };

                        console.log("Creating order with data:", orderData);
                        const orderResult = await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...(token && { Authorization: `Bearer ${token}` }),
                            },
                            body: JSON.stringify(orderData),
                        });

                        for (const detail of orderData.orderDetails) {
                            const orderDetailData = {
                                orderId: orderResult.orderId,
                                productDetailsId: detail.productDetailsId,
                                quantity: detail.quantity,
                                price: detail.price,
                                discount: detail.discount,
                                total: detail.total,
                            };

                            console.log("Creating order detail:", orderDetailData);
                            await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/order-details`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    ...(token && { Authorization: `Bearer ${token}` }),
                                },
                                body: JSON.stringify(orderDetailData),
                            });
                        }

                        const invoiceData = {
                            orderId: orderResult.orderId,
                            customerId: newCustomerId,
                            employeeId: null,
                            totalAmount: totalAmount.toFixed(2),
                            taxAmount: taxAmount.toFixed(2),
                            finalAmount: totalAmount.toFixed(2),
                            invoiceStatus: "PAID",
                            paymentMethod: "VNPAY",
                        };

                        console.log("Creating invoice:", invoiceData);
                        const invoiceResult = await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/invoices`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...(token && { Authorization: `Bearer ${token}` }),
                            },
                            body: JSON.stringify(invoiceData),
                        });

                        const paymentData = {
                            orderId: orderResult.orderId,
                            customerId: newCustomerId,
                            amount: (parseFloat(vnp_Amount) / 100).toFixed(2),
                            paymentStatus: "COMPLETED",
                            paymentMethod: "VNPAY",
                            paymentTransactionId: vnp_TxnRef,
                            billMobile: tempPaymentData.billMobile,
                            billEmail: tempPaymentData.billEmail,
                            billFirstName: tempPaymentData.billFirstName,
                            billLastName: tempPaymentData.billLastName,
                            billAddress: tempPaymentData.billAddress,
                            billCity: tempPaymentData.billCity,
                            billCountry: tempPaymentData.billCountry,
                        };

                        console.log("Creating payment:", paymentData);
                        await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/create-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...(token && { Authorization: `Bearer ${token}` }),
                            },
                            body: JSON.stringify(paymentData),
                        });

                        localStorage.setItem("processedTxnRef", vnp_TxnRef);
                        hasProcessedRef.current = true;
                        toast.success(`Thanh toán VNPAY thành công! Mã hóa đơn: ${invoiceResult.invoiceId}${vnp_TransactionNo ? `, Transaction No: ${vnp_TransactionNo}` : ""}`);
                        setInvoices(invoices.filter((inv) => inv.id !== parseInt(id)));
                        localStorage.removeItem("tempPaymentData");
                        setTempPaymentData(null);

                        if (printReceipt) {
                            setPrintInvoice({
                                ...invoiceResult,
                                customerName: customer.fullname,
                                orderDetails: cart.map((item) => ({
                                    productName: item.name,
                                    quantity: item.quantity,
                                    price: item.discountedPrice,
                                })),
                                invoiceDate: new Date(),
                                customerPaid,
                                paymentMethod: "VNPAY",
                            });
                            handlePrint();
                        }
                    } catch (error) {
                        console.error("Error in VNPay callback:", error);
                        toast.error(`Lỗi tạo đơn hàng, chi tiết đơn hàng, hóa đơn hoặc payment: ${error.message}. Vui lòng liên hệ hỗ trợ.`);
                    }
                } else {
                    console.log("VNPay payment failed with response code:", vnp_ResponseCode);
                    toast.error(`Thanh toán thất bại! Mã lỗi: ${vnp_ResponseCode}`);
                }
                navigate(`/admin/pos/detailInvoice/${id}`);
                isCancelled = true;
            } else {
                console.log("Missing VNPay parameters or tempPaymentData");
            }
        };
        if (count.current < 1) {
            handleVNPayCallback();
            count.current++;
        } else {
            count.current = 0;
        }
    }, [location.search, dispatch, navigate, token, customerId, customer, cart, totalAmount, taxAmount, customerPaid, printReceipt, id, invoices]);

    // Effects
    useEffect(() => {
        sessionStorage.setItem('pos_invoices', JSON.stringify(invoices));
    }, [invoices]);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (!invoice) {
            setCustomer({
                fullname: selectedCustomer.fullname,
                phoneNumber: selectedCustomer.phoneNumber || '',
                email: selectedCustomer.email || '',
                address: selectedCustomer.address || '',
                shipping_address: selectedCustomer.address || '',
            });
            setDiscount(invoice?.discount || 0);
            setCustomerPaid(invoice?.customerPaid || 0);
            setPaymentMethod(invoice?.paymentMethod || 'Tiền mặt');
            setNote(invoice?.note || '');
            setPrintReceipt(invoice?.printReceipt !== false);
        }
    }, [invoice, selectedCustomer]);

    useEffect(() => {
        if (isProductModalOpen) {
            setSearchTerm(productSearch);
            setCategoryFilter(categoryId || '');
            setFurnitureTypeFilter(furnitureTypeId || '');
            setColorFilter(colorId || '');
            setSortByFilter(sortBy);
            setSortDirectionFilter(sortDirection);
        }
    }, [isProductModalOpen, productSearch, categoryId, furnitureTypeId, colorId, sortBy, sortDirection]);

    useEffect(() => {
        if (isProductModalOpen) {
            dispatch(getProductColors());
            dispatch(GetAllCategories());
            dispatch(fetchFurnitureTypes());
        }
    }, [dispatch, isProductModalOpen]);

    useEffect(() => {
        if (!isProductModalOpen) return;
        dispatch(fetchProductsPos({
            search: productSearch,
            categoryId: categoryId || undefined,
            furnitureTypeId: furnitureTypeId || undefined,
            colorId: colorId || undefined,
            sortBy,
            sortDirection,
            page: currentPage,
            size: pageSize,
        }));
    }, [dispatch, isProductModalOpen, productSearch, categoryId, furnitureTypeId, colorId, sortBy, sortDirection, currentPage, pageSize]);

    // Handlers
    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'address' && prev.shipping_address === prev.address ? { shipping_address: value } : {}),
        }));
    };

    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveCustomer = async () => {
        if (!customer.fullname) {
            toast.error('Vui lòng nhập họ tên khách hàng');
            return;
        }
        if (customer.phoneNumber && !/^\d{10}$/.test(customer.phoneNumber)) {
            toast.error('Số điện thoại phải có đúng 10 chữ số');
            return;
        }
        if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        try {
            const customerData = {
                fullname: customer.fullname,
                phoneNumber: customer.phoneNumber || null,
                email: customer.email || null,
                address: customer.address || null,
                status: 1,
                username: '',
                password: '',
                roles: [],
            };
            const customerResult = await dispatch(addCustomer(customerData)).unwrap();
            const updatedInvoices = invoices.map((inv) =>
                inv.id === parseInt(id)
                    ? {
                        ...inv,
                        customerId: customerResult.id,
                        customer: { ...customerData, shipping_address: customer.shipping_address },
                    }
                    : inv
            );
            setInvoices(updatedInvoices);
            toast.success('Thông tin khách hàng đã được lưu!');
        } catch (error) {
            toast.error('Lỗi khi lưu khách hàng!');
        }
    };

    const handleSaveNewCustomer = async () => {
        if (!newCustomer.fullname) {
            toast.error('Vui lòng nhập họ tên khách hàng');
            return;
        }
        if (newCustomer.phoneNumber && !/^\d{10}$/.test(newCustomer.phoneNumber)) {
            toast.error('Số điện thoại phải có đúng 10 chữ số');
            return;
        }
        if (newCustomer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCustomer.email)) {
            toast.error('Email không hợp lệ');
            return;
        }

        try {
            const customerData = {
                id: Date.now(),
                fullname: newCustomer.fullname,
                phoneNumber: newCustomer.phoneNumber || null,
                email: newCustomer.email || null,
                address: newCustomer.address || null,
                status: 1,
                username: '',
                password: '',
                roles: [],
            };
            const customerResult = await dispatch(addCustomer(customerData)).unwrap();
            handleSelectCustomer(customerResult);
            toast.success('Đã thêm khách hàng mới!');
            setIsCustomerModalOpen(false);
        } catch (error) {
            toast.error('Lỗi khi thêm khách hàng!');
        }
    };

    const handleSelectCustomer = (selectedCustomer) => {
        const updatedInvoices = invoices.map((inv) =>
            inv.id === parseInt(id)
                ? {
                    ...inv,
                    customerId: selectedCustomer.id,
                    customerDetails: {
                        fullname: selectedCustomer.fullname,
                        phoneNumber: selectedCustomer.phoneNumber || null,
                        email: selectedCustomer.email || null,
                        address: selectedCustomer.address || null,
                        shipping_address: selectedCustomer.address || null,
                    },
                }
                : inv
        );
        setInvoices(updatedInvoices);
        setCustomer({
            fullname: selectedCustomer.fullname,
            phoneNumber: selectedCustomer.phoneNumber || '',
            email: selectedCustomer.email || '',
            address: selectedCustomer.address || '',
            shipping_address: selectedCustomer.address || '',
        });
        setCustomerOption('Mới');
        setIsCustomerModalOpen(false);
    };

    const handleCustomerOptionChange = (e) => {
        const value = e.target.value;
        setCustomerOption(value);
        if (value === 'Chọn khách cũ') {
            setIsCustomerModalOpen(true);
        } else {
            setCustomer({
                fullname: 'Chưa chọn khách',
                phoneNumber: '',
                email: '',
                address: '',
                shipping_address: '',
            });
        }
    };

    const handleAddToCart = (productDetail, product) => {
        if (!productDetail.active) {
            toast.error('Sản phẩm không khả dụng');
            return;
        }

        const existingItem = cart.find((item) => item.productDetailsId === productDetail.productDetailsId);
        const basePrice = productDetail.price;
        let discountedPrice = basePrice;
        let itemDiscount = 0;
        let discountDisplay = '0';

        if (product.discount && product.discount.discountType !== 'none') {
            if (product.discount.discountType === 'PERCENTAGE') {
                itemDiscount = (basePrice * (product.discount.discountValue || 0)) / 100;
                discountDisplay = `${product.discount.discountValue}%`;
            } else {
                itemDiscount = product.discount.discountValue || 0;
                discountDisplay = `${itemDiscount.toLocaleString('vi-VN')} ₫`;
            }
            discountedPrice = basePrice - itemDiscount;
        }

        const color =
            productColors.find((c) => c.colorId === productDetail.colorId)?.colorName ||
            (productDetail.colorId === 1 ? 'Tự Nhiên' : productDetail.colorId === 4 ? 'Nâu' : 'Không xác định');

        const updatedCart = existingItem
            ? cart.map((item) =>
                item.productDetailsId === productDetail.productDetailsId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
            : [
                ...cart,
                {
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
                    dimensions: product.dimensions,
                },
            ];

        const updatedInvoices = invoices.map((inv) =>
            inv.id === parseInt(id)
                ? { ...inv, cart: updatedCart, products: updatedCart.length }
                : inv
        );
        setInvoices(updatedInvoices);
        toast.success(`Đã thêm ${productDetail.metaTagTitle} vào giỏ hàng`);
    };

    const handleUpdateQuantity = (productDetailsId, quantity) => {
        if (quantity < 1) return;
        const updatedCart = cart.map((item) =>
            item.productDetailsId === productDetailsId ? { ...item, quantity } : item
        );
        const updatedInvoices = invoices.map((inv) =>
            inv.id === parseInt(id)
                ? { ...inv, cart: updatedCart, products: updatedCart.length }
                : inv
        );
        setInvoices(updatedInvoices);
    };

    const handleRemoveFromCart = (productDetailsId) => {
        const updatedCart = cart.filter((item) => item.productDetailsId !== productDetailsId);
        const updatedInvoices = invoices.map((inv) =>
            inv.id === parseInt(id)
                ? { ...inv, cart: updatedCart, products: updatedCart.length }
                : inv
        );
        setInvoices(updatedInvoices);
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm');
            return;
        }

        try {
            let newCustomerId = customerId;
            if (!customerId && customer.fullname && customer.phoneNumber) {
                const customerData = {
                    fullname: customer.fullname,
                    phoneNumber: customer.phoneNumber || null,
                    email: customer.email || null,
                    address: customer.address || null,
                    status: 1,
                    username: '',
                    password: '',
                    roles: [],
                };
                const customerResult = await dispatch(addCustomer(customerData)).unwrap();
                newCustomerId = customerResult.id;
            }

            if (!newCustomerId) {
                toast.error('Vui lòng chọn hoặc tạo khách hàng trước khi thanh toán');
                return;
            }

            const paymentData = {
                amount: totalAmount.toFixed(2),
                paymentMethod: paymentMethod,
                billMobile: customer.phoneNumber || "",
                billEmail: customer.email || "",
                billFirstName: customer.fullname ? customer.fullname.split(" ")[0] || "Nguyen" : "Nguyen",
                billLastName: customer.fullname ? customer.fullname.split(" ").pop() || "Van A" : "Van A",
                billAddress: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
                billCity: "Ha Noi",
                billCountry: "VN",
                paymentStatus: "PENDING",
                returnUrl: `http://localhost:3000/admin/pos/detailInvoice/${id}`,
            };

            if (paymentMethod === "Tiền mặt" || paymentMethod === "Thẻ" || paymentMethod === "Chuyển khoản") {
                const orderData = {
                    customerId: newCustomerId,
                    totalAmount: totalAmount.toFixed(2),
                    paymentMethod: paymentMethod,
                    shippingMethod: "Tại quầy",
                    status: "PROCESSING",
                    orderNotes: note,
                    billingAddress: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
                    shippingAddress: customer.shipping_address || customer.address || null,
                    orderDetails: cart.map((item) => ({
                        productDetailsId: item.productDetailsId,
                        quantity: item.quantity,
                        price: item.discountedPrice.toFixed(2),
                        discount: item.itemDiscount.toFixed(2),
                        total: (item.discountedPrice * item.quantity).toFixed(2),
                    })),
                };

                console.log("Creating order with data:", orderData);
                const orderResult = await dispatch(addOrder(orderData)).unwrap();

                for (const detail of orderData.orderDetails) {
                    const orderDetailData = {
                        orderId: orderResult.orderId,
                        productDetailsId: detail.productDetailsId,
                        quantity: detail.quantity,
                        price: detail.price,
                        discount: detail.discount,
                        total: detail.total,
                    };

                    console.log("Creating order detail:", orderDetailData);
                    await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/order-details`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: JSON.stringify(orderDetailData),
                    });
                }

                const invoiceData = {
                    orderId: orderResult.orderId,
                    customerId: newCustomerId,
                    employeeId: null,
                    totalAmount: totalAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    finalAmount: totalAmount.toFixed(2),
                    invoiceStatus: "PAID",
                    paymentMethod: paymentMethod,
                };

                console.log("Creating invoice:", invoiceData);
                const invoiceResult = await dispatch(addInvoice(invoiceData)).unwrap();

                const paymentRecordData = {
                    amount: totalAmount.toFixed(2),
                    paymentMethod: paymentMethod,
                    billMobile: customer.phoneNumber || "",
                    billEmail: customer.email || "",
                    billFirstName: customer.fullname ? customer.fullname.split(" ")[0] || "Nguyen" : "Nguyen",
                    billLastName: customer.fullname ? customer.fullname.split(" ").pop() || "Van A" : "Van A",
                    billAddress: "Thôn 6, Hát Môn, Hát Môn, Hà Nội",
                    billCity: "Ha Noi",
                    billCountry: "VN",
                    paymentStatus: "PENDING",
                    returnUrl: `http://localhost:3000/admin/pos/detailInvoice/${id}`,
                };

                console.log("Creating payment record:", paymentRecordData);
                await config.post('/payments', paymentRecordData, axiosConfig);
                toast.success(`Thanh toán thành công! Mã hóa đơn: ${invoiceResult.invoiceId}`);
                setInvoices(invoices.filter((inv) => inv.id !== parseInt(id)));
                setIsPaymentDrawerOpen(false);

                if (printReceipt) {
                    setPrintInvoice({
                        ...invoiceResult,
                        customerName: customer.fullname,
                        orderDetails: cart.map((item) => ({
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.discountedPrice,
                        })),
                        invoiceDate: new Date(),
                        customerPaid,
                        paymentMethod,
                    });
                    handlePrint();
                }

                navigate('/admin/pos');
            } else if (paymentMethod === "VNPAY") {
                setTempPaymentData(paymentData);
                localStorage.setItem("tempPaymentData", JSON.stringify(paymentData));

                console.log("Creating VNPay URL with data:", paymentData);
                const data = await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/payments/create-vnpay-url`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: JSON.stringify(paymentData),
                });

                if (data.vnp_PayUrl) {
                    console.log("Redirecting to VNPay URL:", data.vnp_PayUrl);
                    window.location.href = data.vnp_PayUrl;
                } else {
                    throw new Error("Không tạo được URL thanh toán VNPAY");
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(`Lỗi: ${error.message || 'Thanh toán thất bại'}`);
            setTempPaymentData(null);
            localStorage.removeItem("tempPaymentData");
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => setPrintInvoice(null),
    });

    const handleResetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setFurnitureTypeFilter('');
        setColorFilter('');
        setSortByFilter('productName');
        setSortDirectionFilter('ASC');
        dispatch(setSearch(''));
        dispatch(setCategoryId(null));
        dispatch(setFurnitureTypeId(null));
        dispatch(setColorId(null));
        dispatch(setSortBy('productName'));
        dispatch(setSortDirection('ASC'));
        dispatch(setPage(0));
    };

    const getMainImage = (imageUrl) => {
        return imageUrl
            ? `http://localhost:8080/public/load?imagePath=${encodeURIComponent(imageUrl)}`
            : defaultImage;
    };

    // Early return for no invoice
    if (!invoice) {
        return (
            <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
                <main className="flex-1 p-6 bg-[#f8f9fa]">
                    <div className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết hóa đơn</h2>
                        <p className="text-center py-4 text-gray-500">Không tìm thấy hóa đơn</p>
                        <button
                            onClick={() => navigate('/admin/pos')}
                            className="mt-4 bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2 flex items-center space-x-2 mx-auto"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Quay lại danh sách hóa đơn</span>
                        </button>
                    </div>
                    <ToastContainer />
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <main className="flex-1 p-6 bg-[#f8f9fa]">
                <div className="bg-white rounded-lg shadow-md p-6 min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Chi tiết hóa đơn #{id.padStart(3, '0')}
                        </h2>
                        <button
                            onClick={() => navigate('/admin/pos')}
                            className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2 flex items-center space-x-2"
                        >
                            <i className="fas fa-arrow-left"></i>
                            <span>Quay lại</span>
                        </button>
                    </div>
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'customer'
                                ? 'border-b-2 border-[#22c55e] text-[#22c55e]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('customer')}
                        >
                            Thông tin khách hàng
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'order'
                                ? 'border-b-2 border-[#22c55e] text-[#22c55e]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('order')}
                        >
                            Chi tiết đơn hàng
                        </button>
                    </div>
                    {activeTab === 'customer' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Thông tin khách hàng</h3>
                                <select
                                    className="border border-gray-300 rounded-md text-sm text-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                                    value={customerOption}
                                    onChange={handleCustomerOptionChange}
                                >
                                    <option value="Mới">Mới</option>
                                    <option value="Chọn khách cũ">Chọn khách cũ</option>
                                </select>
                            </div>
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ tên khách hàng
                                        </label>
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={customer.fullname}
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập họ tên"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={customer.phoneNumber}
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={customer.email}
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ khách hàng
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={customer.address}
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập địa chỉ khách hàng"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ giao hàng
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_address"
                                            value={customer.shipping_address}
                                            onChange={handleCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập địa chỉ giao hàng"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveCustomer}
                                    className="mt-4 bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                                >
                                    <i className="fas fa-save"></i>
                                    <span>Lưu</span>
                                </button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'order' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Giỏ hàng</h3>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsProductModalOpen(true)}
                                        className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                                    >
                                        <FontAwesomeIcon icon={faCartPlus} />
                                        <span>Thêm sản phẩm</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-700">
                                    <thead className="text-xs uppercase bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3">Sản phẩm</th>
                                            <th className="px-4 py-3">Màu sắc</th>
                                            <th className="px-4 py-3">Kích thước</th>
                                            <th className="px-4 py-3">Số lượng</th>
                                            <th className="px-4 py-3">Đơn giá</th>
                                            <th className="px-4 py-3">Giảm giá</th>
                                            <th className="px-4 py-3">Tổng</th>
                                            <th className="px-4 py-3">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.length > 0 ? (
                                            cart.map((item, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3">{item.name}</td>
                                                    <td className="px-4 py-3">{item.color || 'Không xác định'}</td>
                                                    <td className="px-4 py-3">{item.dimensions || 'N/A'} cm</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleUpdateQuantity(item.productDetailsId, parseInt(e.target.value))
                                                            }
                                                            className="w-20 border rounded-md text-right p-1 focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                                            min="1"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {(item.discountedPrice || item.price).toLocaleString('vi-VN')} ₫
                                                    </td>
                                                    <td className="px-4 py-3">{item.discountDisplay || '0'}</td>
                                                    <td className="px-4 py-3">
                                                        {((item.discountedPrice || item.price) * item.quantity).toLocaleString('vi-VN')} ₫
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleRemoveFromCart(item.productDetailsId)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                                    Khách hàng chưa mua sản phẩm nào!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {cart.length > 0 && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setIsPaymentDrawerOpen(true)}
                                        className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                                    >
                                        <i className="fas fa-save"></i>
                                        <span>Thanh toán</span>
                                    </button>
                                </div>
                            )}
                            <Drawer
                                open={isPaymentDrawerOpen}
                                onClose={() => setIsPaymentDrawerOpen(false)}
                                position="right"
                                className="w-full max-w-md"
                            >
                                <div className="p-4 border-b">
                                    <h5 className="inline-flex items-center text-base font-semibold text-gray-500">
                                        <svg
                                            className="w-4 h-4 me-2.5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                        </svg>
                                        Thanh toán
                                    </h5>
                                </div>
                                <div className="p-4 space-y-4 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Tổng tiền ({cart.length} sản phẩm):</span>
                                        <span>{total.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Thuế (8%):</span>
                                        <span>{taxAmount.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span>{shippingFee.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Chiết khấu:</span>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={(e) =>
                                                setDiscount(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)
                                            }
                                            className="w-32 p-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                        />
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-red-600">{totalAmount.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tiền khách đưa:</span>
                                        <input
                                            type="number"
                                            value={customerPaid}
                                            onChange={(e) =>
                                                setCustomerPaid(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)
                                            }
                                            className="w-32 p-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tiền thừa trả khách:</span>
                                        <span>{(customerPaid - totalAmount).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-400 text-sm border-b border-gray-200 pb-1">
                                        <i className="fas fa-pencil-alt"></i>
                                        <input
                                            className="w-full bg-transparent border-none focus:outline-none placeholder-gray-400"
                                            placeholder="Thêm ghi chú"
                                            type="text"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>In hóa đơn:</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                checked={printReceipt}
                                                className="sr-only peer"
                                                type="checkbox"
                                                onChange={(e) => setPrintReceipt(e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                        </label>
                                    </div>
                                    <fieldset className="flex justify-between text-sm text-gray-700 mb-4">
                                        <label className="flex items-center space-x-1">
                                            <input
                                                checked={paymentMethod === 'Tiền mặt'}
                                                name="payment"
                                                type="radio"
                                                value="Tiền mặt"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>Tiền mặt</span>
                                        </label>
                                        <label className="flex items-center space-x-1">
                                            <input
                                                checked={paymentMethod === 'Thẻ'}
                                                name="payment"
                                                type="radio"
                                                value="Thẻ"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>Thẻ</span>
                                        </label>
                                        <label className="flex items-center space-x-1">
                                            <input
                                                checked={paymentMethod === 'Chuyển khoản'}
                                                name="payment"
                                                type="radio"
                                                value="Chuyển khoản"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>Chuyển khoản</span>
                                        </label>
                                        <label className="flex items-center space-x-1">
                                            <input
                                                checked={paymentMethod === 'VNPAY'}
                                                name="payment"
                                                type="radio"
                                                value="VNPAY"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>VNPAY</span>
                                        </label>
                                    </fieldset>
                                    <button
                                        onClick={handlePayment}
                                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center justify-center space-x-2"
                                    >
                                        <i className="fas fa-save"></i>
                                        <span>Xác nhận thanh toán</span>
                                    </button>
                                </div>
                            </Drawer>
                        </div>
                    )}
                    {isCustomerModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
                            <div className="bg-white p-8 rounded-lg w-full max-w-[95vw] max-h-[95vh] overflow-auto shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h2>
                                    <button
                                        onClick={() => setIsCustomerModalOpen(false)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <FontAwesomeIcon icon={faTimes} size="lg" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Điện thoại
                                        </label>
                                        <input
                                            name="phoneNumber"
                                            value={newCustomer.phoneNumber}
                                            onChange={handleNewCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập số điện thoại"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên khách
                                        </label>
                                        <input
                                            name="fullname"
                                            value={newCustomer.fullname}
                                            onChange={handleNewCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập tên khách"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            value={newCustomer.email}
                                            onChange={handleNewCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập email"
                                            type="email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ
                                        </label>
                                        <input
                                            name="address"
                                            value={newCustomer.address}
                                            onChange={handleNewCustomerChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm"
                                            placeholder="Nhập địa chỉ"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveNewCustomer}
                                    className="bg-[#22c55e] hover:bg-green-600 text-white font-semibold rounded-md px-6 py-2 flex items-center space-x-2"
                                >
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    <span>Thêm khách hàng</span>
                                </button>
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Danh sách khách hàng
                                    </h3>
                                    <ul className="max-h-96 overflow-y-auto border rounded-md">
                                        {customersLoading && <li className="p-2 text-center">Đang tải...</li>}
                                        {customersError && (
                                            <li className="p-2 text-red-500 text-center">Lỗi: {customersError}</li>
                                        )}
                                        {!customersLoading && !customersError && customers.length === 0 && (
                                            <li className="p-2 text-center text-gray-500">Không có khách hàng</li>
                                        )}
                                        {!customersLoading &&
                                            !customersError &&
                                            customers.map((cust) => (
                                                <li
                                                    key={cust.id}
                                                    className="p-2 border-b hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        handleSelectCustomer(cust);
                                                        toast.success(`Đã chọn khách hàng: ${cust.fullname}`);
                                                    }}
                                                >
                                                    {cust.fullname} - {cust.phoneNumber || 'Không có'}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {isProductModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] p-4">
                            <div className="bg-white rounded-xl w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h2>
                                    <button
                                        onClick={() => setIsProductModalOpen(false)}
                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                        title="Đóng"
                                    >
                                        <FontAwesomeIcon icon={faTimes} size="lg" />
                                    </button>
                                </div>
                                <div className="p-6 bg-gray-50 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row gap-4 md:items-end">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tìm kiếm
                                            </label>
                                            <div className="relative">
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSearchTerm(value);
                                                        dispatch(setSearch(value));
                                                        dispatch(setPage(0));
                                                    }}
                                                    placeholder="Tìm theo tên, SKU, mô tả..."
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                    title="Nhập tên, SKU hoặc mô tả sản phẩm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Danh mục
                                            </label>
                                            <select
                                                value={categoryFilter}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setCategoryFilter(value);
                                                    dispatch(setCategoryId(value));
                                                    dispatch(setPage(0));
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                title="Chọn danh mục sản phẩm"
                                            >
                                                <option value="">Tất cả danh mục</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.categoryId} value={cat.categoryId}>
                                                        {cat.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại nội thất
                                            </label>
                                            <select
                                                value={furnitureTypeFilter}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFurnitureTypeFilter(value);
                                                    dispatch(setFurnitureTypeId(value));
                                                    dispatch(setPage(0));
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                title="Chọn loại nội thất"
                                            >
                                                <option value="">Tất cả loại nội thất</option>
                                                {furnitureTypes.map((type) => (
                                                    <option key={type.furnitureTypeId} value={type.furnitureTypeId}>
                                                        {type.typeName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Màu sắc
                                            </label>
                                            <select
                                                value={colorFilter}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setColorFilter(value);
                                                    dispatch(setColorId(value));
                                                    dispatch(setPage(0));
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                title="Chọn màu sắc sản phẩm"
                                            >
                                                <option value="">Tất cả màu sắc</option>
                                                {productColors.map((color) => (
                                                    <option key={color.colorId} value={color.colorId}>
                                                        {color.colorName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sắp xếp
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={sortByFilter}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSortByFilter(value);
                                                        dispatch(setSortBy(value));
                                                        dispatch(setPage(0));
                                                    }}
                                                    className="w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                    title="Chọn tiêu chí sắp xếp"
                                                >
                                                    <option value="productName">Tên sản phẩm</option>
                                                    <option value="price">Giá</option>
                                                    <option value="discountedPrice">Giá giảm</option>
                                                    <option value="stockQuantity">Số lượng tồn</option>
                                                    <option value="createdAt">Ngày tạo</option>
                                                    <option value="updatedAt">Ngày cập nhật</option>
                                                    <option value="ratingCount">Độ phổ biến</option>
                                                </select>
                                                <select
                                                    value={sortDirectionFilter}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSortDirectionFilter(value);
                                                        dispatch(setSortDirection(value));
                                                        dispatch(setPage(0));
                                                    }}
                                                    className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm transition"
                                                    title="Chọn hướng sắp xếp"
                                                >
                                                    <option value="ASC">Tăng dần</option>
                                                    <option value="DESC">Giảm dần</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                onClick={handleResetFilters}
                                                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center space-x-2 transition"
                                                title="Xóa tất cả bộ lọc"
                                            >
                                                <FontAwesomeIcon icon={faFilter} />
                                                <span className="hidden md:inline">Xóa bộ lọc</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    {productsLoading && (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22c55e]"></div>
                                        </div>
                                    )}
                                    {productsError && (
                                        <p className="text-center py-8 text-red-500 text-lg">Lỗi: {productsError}</p>
                                    )}
                                    {!productsLoading && !productsError && (!products || products.length === 0) && (
                                        <p className="text-center py-8 text-gray-500 text-lg">
                                            Không tìm thấy sản phẩm nào
                                        </p>
                                    )}
                                    {!productsLoading && !productsError && products && products.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {products
                                                .flatMap((product) =>
                                                    (Array.isArray(product.productDetails)
                                                        ? product.productDetails
                                                        : []
                                                    ).map((detail) => ({
                                                        ...detail,
                                                        dimensions: product.dimensions,
                                                        product,
                                                    }))
                                                )
                                                .map((productDetail) => {
                                                    let discountDisplay = '0';
                                                    let discountedPrice = productDetail.price;
                                                    const hasDiscount = productDetail.product?.discount && productDetail.product.discount.discountType !== 'none';
                                                    if (hasDiscount) {
                                                        if (productDetail.product.discount.discountType === 'PERCENTAGE') {
                                                            discountDisplay = `${productDetail.product.discount.discountValue}%`;
                                                            discountedPrice = productDetail.price * (1 - productDetail.product.discount.discountValue / 100);
                                                        } else {
                                                            discountDisplay = `${productDetail.product.discount.discountValue.toLocaleString('vi-VN')} ₫`;
                                                            discountedPrice = productDetail.price - productDetail.product.discount.discountValue;
                                                        }
                                                    }
                                                    const stockStatus = productDetail.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng';
                                                    const stockColor = productDetail.stockQuantity > 0 ? 'text-green-600' : 'text-red-600';
                                                    return (
                                                        <div
                                                            key={productDetail.productDetailsId}
                                                            className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                                        >
                                                            {hasDiscount && (
                                                                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                                    Giảm {discountDisplay}
                                                                </span>
                                                            )}
                                                            <img
                                                                src={getMainImage(productDetail.imageUrl)}
                                                                alt={productDetail.metaTagTitle}
                                                                className="w-full h-48 object-cover rounded-t-lg"
                                                                loading="lazy"
                                                            />
                                                            <div className="p-4">
                                                                <h3 className="text-base font-semibold text-gray-800 truncate" title={productDetail.metaTagTitle}>
                                                                    {productDetail.metaTagTitle}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 mt-1">Mã SKU: {productDetail.sku}</p>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Màu sắc:{' '}
                                                                    {productColors.find((c) => c.colorId === productDetail.colorId)?.colorName ||
                                                                        (productDetail.colorId === 1 ? 'Tự Nhiên' : productDetail.colorId === 4 ? 'Nâu' : 'Không xác định')}
                                                                </p>
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    Kích thước: {productDetail.dimensions || 'N/A'} cm
                                                                </p>
                                                                <p className={`text-sm mt-1 font-medium ${stockColor}`}>
                                                                    Tình trạng: {stockStatus} ({productDetail.stockQuantity || 0})
                                                                </p>
                                                                <div className="mt-2">
                                                                    {hasDiscount ? (
                                                                        <div>
                                                                            <p className="text-sm text-gray-500 line-through">
                                                                                Giá gốc: {productDetail.price.toLocaleString('vi-VN')} ₫
                                                                            </p>
                                                                            <p className="text-base font-semibold text-red-600">
                                                                                Giá giảm: {discountedPrice.toLocaleString('vi-VN')} ₫
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-base font-semibold text-gray-800">
                                                                            Giá: {productDetail.price.toLocaleString('vi-VN')} ₫
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    className={`mt-3 w-full py-2 rounded-lg text-white font-semibold transition-colors duration-200 ${productDetail.active && productDetail.stockQuantity > 0
                                                                        ? 'bg-[#22c55e] hover:bg-green-600'
                                                                        : 'bg-gray-400 cursor-not-allowed'
                                                                        }`}
                                                                    onClick={() => productDetail.active && productDetail.stockQuantity > 0 && handleAddToCart(productDetail, productDetail.product)}
                                                                    disabled={!productDetail.active || productDetail.stockQuantity <= 0}
                                                                    title={productDetail.active && productDetail.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Sản phẩm không khả dụng'}
                                                                >
                                                                    <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Thêm vào giỏ
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    )}
                                </div>
                                {totalPages > 1 && !productsLoading && !productsError && (
                                    <div className="p-6 border-t border-gray-200">
                                        <Pagination
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            onPageChange={(page) => dispatch(setPage(page))}
                                        />
                                    </div>
                                )}
                                {products && products.length > 0 && (
                                    <p className="text-center text-sm text-gray-600 py-4">
                                        Hiển thị {products.flatMap((product) => (Array.isArray(product.productDetails) ? product.productDetails : [])).length} biến thể
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {printInvoice && (
                <div ref={componentRef} style={{ display: 'none' }}>
                    <InvoicePrint invoice={printInvoice} />
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default DetailInvoice;