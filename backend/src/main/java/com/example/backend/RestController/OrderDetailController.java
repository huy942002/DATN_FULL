package com.example.backend.RestController;

import com.example.backend.dto.OrderDetailDTO;
import com.example.backend.entities.OrderDetail;
import com.example.backend.repository.repo.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @GetMapping
    public ResponseEntity<List<OrderDetailDTO>> getAllOrderDetails(@RequestParam(required = false) Integer orderId) {
        List<OrderDetail> details = orderId != null
                ? orderDetailRepository.findByOrderOrderIdAndIsActiveTrue(orderId)
                : orderDetailRepository.findByIsActiveTrue();
        List<OrderDetailDTO> dtos = details.stream().map(detail -> {
            OrderDetailDTO dto = new OrderDetailDTO();
            dto.setOrderDetailId(detail.getOrderDetailId());
            dto.setProductDetailsId(detail.getProductDetails().getProductDetailsId());
            dto.setProductName(detail.getProductDetails().getMetaTagTitle()); // Include product name
            dto.setQuantity(detail.getQuantity());
            dto.setPrice(detail.getPrice());
            dto.setDiscount(detail.getDiscount());
            dto.setTotal(detail.getTotal());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<OrderDetailDTO> createOrderDetail(@Valid @RequestBody OrderDetailDTO orderDetailDTO) {
        OrderDetail detail = new OrderDetail();
        detail.setQuantity(orderDetailDTO.getQuantity());
        detail.setPrice(orderDetailDTO.getPrice());
        detail.setDiscount(orderDetailDTO.getDiscount());
        detail.setTotal(orderDetailDTO.getTotal());
        orderDetailRepository.save(detail);

        orderDetailDTO.setOrderDetailId(detail.getOrderDetailId());
        return ResponseEntity.ok(orderDetailDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> updateOrderDetail(@PathVariable Integer id, @Valid @RequestBody OrderDetailDTO orderDetailDTO) {
        OrderDetail detail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("OrderDetail not found"));
        detail.setQuantity(orderDetailDTO.getQuantity());
        detail.setPrice(orderDetailDTO.getPrice());
        detail.setDiscount(orderDetailDTO.getDiscount());
        detail.setTotal(orderDetailDTO.getTotal());
        orderDetailRepository.save(detail);

        orderDetailDTO.setOrderDetailId(id);
        return ResponseEntity.ok(orderDetailDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Integer id) {
        OrderDetail detail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("OrderDetail not found"));
        detail.setActive(false);
        orderDetailRepository.save(detail);
        return ResponseEntity.ok().build();
    }
}