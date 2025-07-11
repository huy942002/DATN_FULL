package com.example.backend.RestController;

import com.example.backend.dto.PaymentDTO;
import com.example.backend.entities.Invoice;
import com.example.backend.repository.imp.PaymentServiceImp;
import com.example.backend.repository.repo.InvoiceRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {

    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);

    @Value("${vnpay.hash-secret}")
    private String vnpHashSecret;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentServiceImp paymentService;

    @PostMapping
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, String> webhookData) {
        try {
            logger.info("Raw webhook data: {}", new ObjectMapper().writeValueAsString(webhookData));
            String vnp_SecureHash = webhookData.get("vnp_SecureHash");
            webhookData.remove("vnp_SecureHash");

            String computedHash = generateSecureHash(webhookData, vnpHashSecret);
            if (!computedHash.equals(vnp_SecureHash)) {
                logger.error("Invalid webhook signature, computed: {}, received: {}", computedHash, vnp_SecureHash);
                return ResponseEntity.badRequest().body("Invalid webhook signature");
            }

            String vnp_ResponseCode = webhookData.get("vnp_ResponseCode");
            String vnp_TxnRef = webhookData.get("vnp_TxnRef");
            String vnp_TransactionNo = webhookData.get("vnp_TransactionNo");

            Integer orderId = Integer.parseInt(vnp_TxnRef);
            PaymentDTO paymentDTO = paymentService.findByOrderId(orderId);
            paymentDTO.setPaymentTransactionId(vnp_TransactionNo);
            paymentDTO.setPaymentStatus("00".equals(vnp_ResponseCode) ? "COMPLETED" : "FAILED");

            Invoice invoice = invoiceRepository.findByOrder_OrderId(orderId)
                    .orElseThrow(() -> new IllegalArgumentException("Invoice not found for orderId: " + orderId));

            if ("00".equals(vnp_ResponseCode)) {
                invoice.setInvoiceStatus(Invoice.InvoiceStatus.PAID);
                logger.info("Invoice updated to PAID for orderId: {}", orderId);
            } else {
                invoice.setInvoiceStatus(Invoice.InvoiceStatus.FAILED);
                logger.warn("Invoice updated to FAILED for orderId: {}, responseCode: {}", orderId, vnp_ResponseCode);
            }

            invoiceRepository.save(invoice);
            paymentService.updatePayment(paymentDTO.getPaymentId(), paymentDTO);
            logger.info("Payment updated to {} for orderId: {}", vnp_ResponseCode, orderId);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error processing webhook: ", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String generateSecureHash(Map<String, String> params, String secretKey) throws Exception {
        String[] fieldNames = params.keySet().toArray(new String[0]);
        Arrays.sort(fieldNames);
        StringBuilder data = new StringBuilder();
        for (String fieldName : fieldNames) {
            data.append(fieldName).append("=").append(params.get(fieldName));
        }
        Mac mac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(data.toString().getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}