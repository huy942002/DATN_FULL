import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

const InvoiceCard = ({ id, products, customer, status, onDelete, onSelect }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const statusColor = {
        'Đã xử lý': 'bg-[#ff6b6b]',
        'Chưa xử lý': 'bg-[#4ade80]',
        'Đang xử lý': 'bg-[#f97316]',
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="bg-[#0ea75d] rounded-md p-6 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <p className="font-bold text-lg cursor-pointer" onClick={() => onSelect(id)}>
                    Hóa đơn #{id.toString().padStart(3, '0')}
                </p>
                <div className="relative dropdown">
                    <button
                        className={`px-3 py-1 rounded-full text-white ${statusColor[status]} flex items-center`}
                        onClick={toggleDropdown}
                    >
                        {status}
                        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} ml-2`}></i>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <a
                                href={`/admin/pos/detailInvoice/${id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSelect(id);
                                }}
                            >
                                Chi tiết
                            </a>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete(id);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                Xóa hóa đơn
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <p>{products} sản phẩm</p>
                <p className="mt-2">{customer.fullname || 'Chưa chọn khách'}</p>
            </div>
        </div>
    );
};

const AutoInvoiceGeneration = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState(() => {
        const savedInvoices = sessionStorage.getItem('pos_invoices');
        return savedInvoices ? JSON.parse(savedInvoices) : [];
    });
    const [activeInvoiceId, setActiveInvoiceId] = useState(invoices[0]?.id || null);

    useEffect(() => {
        sessionStorage.setItem('pos_invoices', JSON.stringify(invoices));
    }, [invoices]);

    const handleAddInvoice = () => {
        const newId = invoices.length ? Math.max(...invoices.map((inv) => inv.id)) + 1 : 1;
        const newInvoice = {
            id: newId,
            products: 0,
            customer: {
                fullname: "",
                email: "",
                phoneNumber: "",
                address: "",
                status: 1,
                username: "",
                password: "",
                roles: []
            },
            status: 'Chưa xử lý',
            cart: [],
        };
        setInvoices([...invoices, newInvoice]);
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
            setActiveInvoiceId(newInvoices[0]?.id || null);
        }
        toast.success(`Đã xóa hóa đơn ${id}`);
    };

    const handleSelectInvoice = (id) => {
        setActiveInvoiceId(id);
        navigate(`/admin/pos/detailInvoice/${id}`);
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 bg-[#f8f9fa]">
                    <div className="bg-white rounded-sm p-6 min-h-[500px]">
                        <h2 className="text-black font-semibold text-lg mb-4">Hóa Đơn Đang Tạo</h2>
                        <div className='mb-4'>
                            <input
                                type="search"
                                placeholder="Tìm kiếm khách hàng..."
                                className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-400 focus:outline-none"
                            />
                            <button
                                onClick={handleAddInvoice}
                                className="bg-[#d9f0e4] text-[#0ea75d] font-semibold text-sm rounded px-3 py-1 ml-2"
                            >
                                Thêm hóa đơn
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 mb-6 text-black text-sm">
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#071a2c] text-white font-semibold">
                                    A
                                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        {invoices.length}
                                    </span>
                                </div>
                                <button
                                    className="bg-[#d9f0e4] text-[#0ea75d] font-semibold text-sm rounded px-3 py-1"
                                >
                                    Tất cả hóa đơn
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#0ea75d] text-white font-semibold">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        {invoices.filter(inv => inv.status === 'Chưa xử lý').length}
                                    </span>
                                </div>
                                <span>Chưa xử lý</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#ff6b6b] text-white font-semibold">
                                    <i className="fas fa-user"></i>
                                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        {invoices.filter(inv => inv.status === 'Đã xử lý').length}
                                    </span>
                                </div>
                                <span>Đã xử lý</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#f97316] text-white font-semibold">
                                    <i className="fas fa-sync"></i>
                                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                        {invoices.filter(inv => inv.status === 'Đang xử lý').length}
                                    </span>
                                </div>
                                <span>Đang xử lý</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded bg-[#1d9bf0] text-white font-semibold">
                                    <i className="fas fa-sync-alt"></i>
                                </div>
                                <span>Reload</span>
                            </div>
                        </div>
                        <h3 className="text-black font-semibold mb-4">Danh sách hóa đơn</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {invoices.length === 0 ? (
                                <p className="text-center py-4 text-gray-500 col-span-3">Không có hóa đơn</p>
                            ) : (
                                invoices.map((invoice) => (
                                    <InvoiceCard
                                        key={invoice.id}
                                        id={invoice.id}
                                        products={invoice.cart ? invoice.cart.length : 0}
                                        customer={invoice.customer}
                                        status={invoice.status}
                                        onDelete={handleDeleteInvoice}
                                        onSelect={handleSelectInvoice}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AutoInvoiceGeneration;