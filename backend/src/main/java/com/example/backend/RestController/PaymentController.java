package com.example.backend.RestController;

import com.example.backend.dto.PaymentDTO;
import com.example.backend.repository.imp.PaymentServiceImp;
import com.example.backend.repository.repo.InvoiceRepository;
import com.example.backend.repository.repo.OrderRepository;
import com.example.backend.repository.repo.CustomerRepository;
import com.example.backend.utils.JWTUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentServiceImp paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Value("${vnpay.hash-secret}")
    private String vnpHashSecret;

    @Value("${vnpay.vnp_Tmm_Code}")
    private String vnpTmnCode;

    @Value("${vnpay.vnp_PayUrl}")
    private String vnpPayUrl;

    // Endpoint tạo URL thanh toán VNPay
    @PostMapping("/create-vnpay-url")
    public ResponseEntity<Map<String, String>> createVnpayUrl(
            @Valid @RequestBody PaymentDTO paymentDTO,
            HttpServletRequest request,
            Authentication authentication) {
        try {
            // Tạo vnp_TxnRef dựa trên kích thước bảng Order + 1
            long orderCount = orderRepository.findAll().size();
            String vnp_TxnRef = String.valueOf(orderCount + 1);

            // Tạo URL thanh toán VNPay
            BigDecimal amount = paymentDTO.getAmount();
            BigDecimal vnpAmount = amount.multiply(new BigDecimal("100"));
            String amountForVNPay = vnpAmount.stripTrailingZeros().toPlainString();

            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Số tiền phải lớn hơn 0");
            }

            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", "2.1.0");
            vnpParams.put("vnp_Command", "pay");
            vnpParams.put("vnp_TmnCode", vnpTmnCode);
            vnpParams.put("vnp_Amount", amountForVNPay);
            vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
            vnpParams.put("vnp_CurrCode", "VND");
            String clientIp = getClientIpAddress(request);
            if (!isValidIp(clientIp)) {
                logger.warn("IP không hợp lệ, sử dụng 127.0.0.1: {}", clientIp);
                clientIp = "127.0.0.1";
            }
            vnpParams.put("vnp_IpAddr", clientIp);
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_OrderInfo", "Thanh toan don hang #" + vnp_TxnRef);
            vnpParams.put("vnp_OrderType", "250000");
            // Sử dụng returnUrl từ PaymentDTO, hoặc mặc định nếu không có
            String returnUrl = paymentDTO.getReturnUrl() != null ? paymentDTO.getReturnUrl() : "http://localhost:3000/cart";
            vnpParams.put("vnp_ReturnUrl", returnUrl);
            vnpParams.put("vnp_TxnRef", vnp_TxnRef);

            // Thêm vnp_ExpireDate
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            cld.add(Calendar.MINUTE, 15);
            vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

            // Thêm thông tin hóa đơn
            vnpParams.put("vnp_Bill_Mobile", paymentDTO.getBillMobile() != null ? paymentDTO.getBillMobile() : "");
            vnpParams.put("vnp_Bill_Email", paymentDTO.getBillEmail() != null ? paymentDTO.getBillEmail() : "");
            vnpParams.put("vnp_Bill_FirstName", paymentDTO.getBillFirstName() != null ? paymentDTO.getBillFirstName() : "Nguyen");
            vnpParams.put("vnp_Bill_LastName", paymentDTO.getBillLastName() != null ? paymentDTO.getBillLastName() : "Van A");
            vnpParams.put("vnp_Bill_Address", paymentDTO.getBillAddress() != null ? paymentDTO.getBillAddress() : "123 Duong 1");
            vnpParams.put("vnp_Bill_City", paymentDTO.getBillCity() != null ? paymentDTO.getBillCity() : "Ha Noi");
            vnpParams.put("vnp_Bill_Country", paymentDTO.getBillCountry() != null ? paymentDTO.getBillCountry() : "VN");

            // Tạo chữ ký bảo mật
            List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (String fieldName : fieldNames) {
                String fieldValue = vnpParams.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=')
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        hashData.append('&');
                        query.append('&');
                    }
                }
            }

            String vnp_SecureHash = hmacSHA512(vnpHashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnp_SecureHash);

            String vnp_PayUrl = vnpPayUrl + "?" + query.toString();
            logger.info("Generated VNPAY URL: {}", vnp_PayUrl);

            Map<String, String> response = new HashMap<>();
            response.put("vnp_PayUrl", vnp_PayUrl);
            response.put("vnp_TxnRef", vnp_TxnRef);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating VNPAY URL: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi khi tạo URL thanh toán: " + e.getMessage()));
        }
    }

    // Endpoint tạo Payment
    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(
            @Valid @RequestBody PaymentDTO paymentDTO,
            Authentication authentication) {
        try {
            // Kiểm tra orderId hợp lệ
            if (paymentDTO.getOrderId() == null) {
                throw new IllegalArgumentException("Order ID is required");
            }

            // Lưu PaymentDTO
            paymentService.createPayment(paymentDTO);

            return ResponseEntity.ok(Map.of("message", "Payment created successfully"));
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: ", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            logger.error("Unauthorized access: ", e);
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error creating payment: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi khi tạo payment"));
        }
    }
    @PostMapping
    public ResponseEntity<?> create(@RequestBody PaymentDTO  paymentDTO){
        paymentService.createPayment(paymentDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Endpoint xử lý IPN từ VNPay
    @PostMapping("/ipn")
    public ResponseEntity<?> handleIpn(HttpServletRequest request) {
        try {
            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String vnp_SecureHash = request.getParameter("vnp_SecureHash");

            // Xác minh chữ ký bảo mật
            Map<String, String> vnpParams = new HashMap<>();
            for (String paramName : request.getParameterMap().keySet()) {
                if (!paramName.equals("vnp_SecureHash")) {
                    vnpParams.put(paramName, request.getParameter(paramName));
                }
            }
            List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            for (String fieldName : fieldNames) {
                String fieldValue = vnpParams.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                        hashData.append('&');
                    }
                }
            }
            String computedHash = hmacSHA512(vnpHashSecret, hashData.toString());
            if (!computedHash.equals(vnp_SecureHash)) {
                logger.warn("Invalid VNPay secure hash for txnRef: {}", vnp_TxnRef);
                return ResponseEntity.status(400).body(Map.of("RspCode", "97", "Message", "Invalid checksum"));
            }

            // Lưu log hoặc thông báo, không tạo Order, Invoice, hay PaymentDTO
            logger.info("IPN received for txnRef: {}, status: {}, amount: {}", vnp_TxnRef, vnp_ResponseCode, request.getParameter("vnp_Amount"));

            return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
        } catch (Exception e) {
            logger.error("Error handling IPN: ", e);
            return ResponseEntity.status(500).body(Map.of("RspCode", "99", "Message", "Unknown error"));
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }
        return ipAddress != null ? ipAddress : "127.0.0.1";
    }

    private boolean isValidIp(String ip) {
        if (ip == null || ip.isEmpty()) return false;
        String ipPattern = "^([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
                "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
                "([01]?\\d\\d?|2[0-4]\\d|25[0-5])\\." +
                "([01]?\\d\\d?|2[0-4]\\d|25[0-5])$";
        return ip.matches(ipPattern);
    }

    private String hmacSHA512(String secretKey, String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}