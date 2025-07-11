import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { XCircleIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { removeFromCart, updateCartItemQuantity, clearCart } from "../../../features/slices/cartSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const Cart = () => {
  const count = useRef(0); // Use ref to keep track of callback count
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    paymentMethod: "Tiền mặt",
    billingAddress: "",
    shippingAddress: "",
  });
  const [tempPaymentData, setTempPaymentData] = useState(() => {
    // Load tempPaymentData from localStorage if available
    const storedData = localStorage.getItem("tempPaymentData");
    return storedData ? JSON.parse(storedData) : null;
  });
  const hasProcessedRef = useRef(false); // Track if callback has been processed

  const userData = useMemo(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : null;
  }, []);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && userData) {
      setCustomerInfo((prev) => ({
        ...prev,
        billingAddress: userData.address || "",
        shippingAddress: userData.address || "",
      }));
    }
  }, [token, userData]);

  const { total, taxAmount, finalAmount } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = total * 0.08;
    const finalAmount = total + taxAmount;
    return { total, taxAmount, finalAmount };
  }, [cartItems]);

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

  useEffect(() => {
    let isCancelled = false;
    const handleVNPayCallback = async () => {
      console.log("VNPay callback triggered", location.search);

      // Kiểm tra nếu callback đã được xử lý trong phiên hiện tại
      if (hasProcessedRef.current) {
        console.log("Callback already processed in current session");
        return;
      }

      const query = new URLSearchParams(location.search);
      const vnp_ResponseCode = query.get("vnp_ResponseCode");
      const vnp_TxnRef = query.get("vnp_TxnRef");
      const vnp_TransactionNo = query.get("vnp_TransactionNo");
      const vnp_Amount = query.get("vnp_Amount");

      // Kiểm tra nếu giao dịch đã được xử lý trước đó
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
              navigate("/cart"); // Updated redirect
              return;
            }
            setTempPaymentData(JSON.parse(storedData));
          }

          try {
            // Gọi API để tạo đơn hàng
            const orderData = {
              customerId: userData.id,
              totalAmount: finalAmount,
              paymentMethod: "VNPAY",
              shippingMethod: "Giao hàng tận nơi",
              status: "PROCESSING",
              orderNotes: "",
              billingAddress: customerInfo.billingAddress || userData.address || null,
              shippingAddress: customerInfo.shippingAddress || userData.address || null,
              orderDetails: cartItems.map((item) => ({
                productDetailsId: item.productDetailsId,
                quantity: item.quantity,
                price: item.price.toFixed(2),
                discount: "0.00",
                total: (item.price * item.quantity).toFixed(2),
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

            // Tạo OrderDetails
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

            // Tạo Invoice
            const invoiceData = {
              orderId: orderResult.orderId,
              customerId: userData.id,
              employeeId: null,
              totalAmount: finalAmount.toFixed(2),
              taxAmount: taxAmount.toFixed(2),
              finalAmount: finalAmount.toFixed(2),
              invoiceStatus: "PAID",
              paymentMethod: "VNPAY",
            };

            console.log("Creating invoice:", invoiceData);
            await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/invoices`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify(invoiceData),
            });

            // Tạo Payment
            const paymentData = {
              orderId: orderResult.orderId,
              customerId: userData.id,
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

            // Lưu vnp_TxnRef để ngăn xử lý lại
            localStorage.setItem("processedTxnRef", vnp_TxnRef);
            hasProcessedRef.current = true;
            toast.success(`Thanh toán VNPAY thành công! Mã đơn hàng: ${orderResult.orderId}${vnp_TransactionNo ? `, Transaction No: ${vnp_TransactionNo}` : ""}`);
            dispatch(clearCart());
            localStorage.removeItem("tempPaymentData");
            setTempPaymentData(null);
          } catch (error) {
            console.error("Error in VNPay callback:", error);
            toast.error(`Lỗi tạo đơn hàng, chi tiết đơn hàng, hóa đơn hoặc payment: ${error.message}. Vui lòng liên hệ hỗ trợ.`);
          }
        } else {
          console.log("VNPay payment failed with response code:", vnp_ResponseCode);
          toast.error(`Thanh toán thất bại! Mã lỗi: ${vnp_ResponseCode}`);
        }
        navigate("/cart"); // Updated redirect
        return isCancelled = true;
      } else {
        console.log("Missing VNPay parameters or tempPaymentData");
      }
    };
    if (count.current < 1) {
      handleVNPayCallback();
      count.current++;
    }else{
      count.current = 0;
    }
  }, [location.search]);

  const handleQuantityChange = (productId, productDetailsId, change) => {
    const item = cartItems.find(
      (item) => item.productId === productId && item.productDetailsId === productDetailsId
    );
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        dispatch(updateCartItemQuantity({ productId, productDetailsId, quantity: newQuantity }));
      }
    }
  };

  const handleRemoveItem = (productId, productDetailsId) => {
    dispatch(removeFromCart({ productId, productDetailsId }));
  };

  const setModal = () => {
    if (!token || !userData || !userData.id) {
      setIsConfirmModalOpen(true);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  const handleCheckout = async () => {
    try {
      const paymentData = {
        amount: finalAmount.toFixed(2),
        paymentMethod: customerInfo.paymentMethod,
        billMobile: userData.phoneNumber || "",
        billEmail: userData.email || "",
        billFirstName: userData.fullname ? userData.fullname.split(" ")[0] || "Nguyen" : "Nguyen",
        billLastName: userData.fullname ? userData.fullname.split(" ").pop() || "Van A" : "Van A",
        billAddress: customerInfo.billingAddress || userData.address || "123 Duong 1",
        billCity: "Ha Noi",
        billCountry: "VN",
        paymentStatus: "PENDING",
        returnUrl: "http://localhost:3000/cart", // Add returnUrl for Cart
      };

      if (customerInfo.paymentMethod === "Tiền mặt") {
        // Gửi yêu cầu tạo đơn hàng
        const orderData = {
          customerId: userData.id,
          totalAmount: finalAmount,
          paymentMethod: customerInfo.paymentMethod,
          shippingMethod: "Giao hàng tận nơi",
          status: "PROCESSING",
          orderNotes: "",
          billingAddress: customerInfo.billingAddress || userData.address || null,
          shippingAddress: customerInfo.shippingAddress || userData.address || null,
          orderDetails: cartItems.map((item) => ({
            productDetailsId: item.productDetailsId,
            quantity: item.quantity,
            price: item.price.toFixed(2),
            discount: "0.00",
            total: (item.price * item.quantity).toFixed(2),
          })),
        };

        console.log("Creating cash order with data:", orderData);
        const orderResult = await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(orderData),
        });

        // Tạo OrderDetails
        for (const detail of orderData.orderDetails) {
          const orderDetailData = {
            orderId: orderResult.orderId,
            productDetailsId: detail.productDetailsId,
            quantity: detail.quantity,
            price: detail.price,
            discount: detail.discount,
            total: detail.total,
          };

          console.log("Creating cash order detail:", orderDetailData);
          await retryFetch(`${process.env.REACT_APP_BACKEND_URL}/api/order-details`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(orderDetailData),
          });
        }

        toast.success(`Đặt hàng thành công! Mã đơn hàng: ${orderResult.orderId}`);
        dispatch(clearCart());
        setIsCheckoutModalOpen(false);
        navigate("/cart");
      } else {
        // Lưu paymentData vào state và localStorage
        setTempPaymentData(paymentData);
        localStorage.setItem("tempPaymentData", JSON.stringify(paymentData));

        // Gửi yêu cầu tạo URL thanh toán VNPay
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
      console.error("Checkout error:", error);
      const errorMessage = error.message.includes("VNPAY")
        ? `Lỗi thanh toán VNPAY: ${error.message}`
        : `Lỗi hệ thống: ${error.message || "Vui lòng thử lại sau"}`;
      toast.error(errorMessage);
      setTempPaymentData(null);
      localStorage.removeItem("tempPaymentData");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Giỏ Hàng</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={`${item.productId}-${item.productDetailsId}`}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-medium">{item.productName}</h3>
                <p className="text-sm text-gray-500">Color: {item.color}</p>
                <p className="text-sm">Price: {item.price.toLocaleString("vi-VN")}đ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.productDetailsId, -1)
                  }
                  className="p-2 text-gray-600 hover:bg-gray-100"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId, item.productDetailsId, 1)
                  }
                  className="p-2 text-gray-600 hover:bg-gray-100"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => handleRemoveItem(item.productId, item.productDetailsId)}
                className="text-red-500 hover:text-red-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">
          Tổng Cộng: {finalAmount.toLocaleString("vi-VN")}đ
        </p>
        <button
          className="mt-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-blue-600 transition duration-300"
          onClick={() => setModal()}
        >
          Tiến Hành Thanh Toán
        </button>
      </div>

      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative shadow-2xl transform transition-all duration-300">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsCheckoutModalOpen(false)}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thông Tin Thanh Toán</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Họ Tên</label>
                <input
                  type="text"
                  value={userData?.fullname || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                <input
                  type="text"
                  value={userData?.phoneNumber || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={userData?.email || ""}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa Chỉ Thanh Toán</label>
                <input
                  type="text"
                  value={customerInfo.billingAddress}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, billingAddress: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder={userData?.address || "Nhập địa chỉ thanh toán"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Địa Chỉ Giao Hàng</label>
                <input
                  type="text"
                  value={customerInfo.shippingAddress}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, shippingAddress: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder={userData?.address || "Nhập địa chỉ giao hàng"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phương Thức Thanh Toán</label>
                <select
                  value={customerInfo.paymentMethod}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="VNPAY">VNPAY</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-blue-600 transition duration-300"
                onClick={handleCheckout}
              >
                Xác Nhận Thanh Toán
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-8 rounded-lg w-full max-w-sm relative shadow-2xl transform transition-all duration-300">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Thông Báo</h2>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tiếp tục thanh toán. Bạn có muốn đăng nhập ngay bây giờ?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-blue-600 transition duration-300"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  navigate("/login");
                }}
              >
                Đăng Nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;