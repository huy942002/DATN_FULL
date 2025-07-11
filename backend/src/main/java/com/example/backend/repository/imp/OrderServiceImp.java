package com.example.backend.repository.imp;

import com.example.backend.dto.OrderDTO;
import com.example.backend.dto.OrderDetailDTO;
import com.example.backend.entities.Customer;
import com.example.backend.entities.Order;
import com.example.backend.entities.OrderDetail;
import com.example.backend.entities.ProductDetails;
import com.example.backend.repository.repo.CustomerRepository;
import com.example.backend.repository.repo.OrderRepository;
import com.example.backend.repository.repo.OrderDetailRepository;
import com.example.backend.repository.repo.ProductDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImp {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductDetailsRepository productDetailsRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setTotalAmount(new BigDecimal(String.valueOf(orderDTO.getTotalAmount())));
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingMethod(orderDTO.getShippingMethod());
        order.setStatus(orderDTO.getStatus());
        order.setOrderNotes(orderDTO.getOrderNotes());
        order.setBillingAddress(orderDTO.getBillingAddress());
        order.setShippingAddress(orderDTO.getShippingAddress());
        order.setActive(true);

        if (orderDTO.getCustomerId() != null) {
            Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
            order.setCustomer(customer);
        }

        orderRepository.save(order);

        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            ProductDetails productDetails = productDetailsRepository.findById(detailDTO.getProductDetailsId())
                    .orElseThrow(() -> new IllegalArgumentException("Product details not found"));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProductDetails(productDetails);
            detail.setQuantity(detailDTO.getQuantity());
            detail.setPrice(new BigDecimal(String.valueOf(detailDTO.getPrice())));
            detail.setDiscount(new BigDecimal(String.valueOf(detailDTO.getDiscount())));
            detail.setTotal(new BigDecimal(String.valueOf(detailDTO.getTotal())));
            detail.setActive(true);

            orderDetailRepository.save(detail);
        }

        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate());
        return orderDTO;
    }

    @Transactional
    public OrderDTO updateOrder(Integer id, OrderDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setPaymentMethod(orderDTO.getPaymentMethod());
        order.setShippingMethod(orderDTO.getShippingMethod());
        order.setStatus(orderDTO.getStatus());
        order.setOrderNotes(orderDTO.getOrderNotes());
        order.setBillingAddress(orderDTO.getBillingAddress());
        order.setShippingAddress(orderDTO.getShippingAddress());

        orderRepository.save(order);

        // Delete old OrderDetails
        List<OrderDetail> existingDetails = orderDetailRepository.findByOrderAndIsActiveTrue(order);
        existingDetails.forEach(detail -> {
            detail.setActive(false);
            orderDetailRepository.save(detail);
        });

        // Create new OrderDetails
        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            ProductDetails productDetails = productDetailsRepository.findById(detailDTO.getProductDetailsId())
                    .orElseThrow(() -> new IllegalArgumentException("Product details not found"));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProductDetails(productDetails);
            detail.setQuantity(detailDTO.getQuantity());
            detail.setPrice(detailDTO.getPrice());
            detail.setDiscount(detailDTO.getDiscount());
            detail.setTotal(detailDTO.getTotal());
            detail.setActive(true);

            orderDetailRepository.save(detail);
        }

        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate());
        return orderDTO;
    }

    @Transactional
    public void deleteOrder(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setActive(false); // Soft delete
        orderRepository.save(order);

        List<OrderDetail> details = orderDetailRepository.findByOrderAndIsActiveTrue(order);
        details.forEach(detail -> {
            detail.setActive(false);
            orderDetailRepository.save(detail);
        });
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findByIsActiveTrue().stream().map(order -> {
            OrderDTO dto = new OrderDTO();
            dto.setOrderId(order.getOrderId());
            dto.setCustomerId(order.getCustomer() != null ? order.getCustomer().getId() : null);
            dto.setTotalAmount(order.getTotalAmount());
            dto.setOrderDate(order.getOrderDate());
            dto.setPaymentMethod(order.getPaymentMethod());
            dto.setShippingMethod(order.getShippingMethod());
            dto.setStatus(order.getStatus());
            dto.setOrderNotes(order.getOrderNotes());
            dto.setBillingAddress(order.getBillingAddress());
            dto.setShippingAddress(order.getShippingAddress());

            List<OrderDetailDTO> detailDTOs = orderDetailRepository.findByOrderAndIsActiveTrue(order)
                    .stream()
                    .map(detail -> {
                        OrderDetailDTO detailDTO = new OrderDetailDTO();
                        detailDTO.setOrderDetailId(detail.getOrderDetailId());
                        detailDTO.setProductDetailsId(detail.getProductDetails().getProductDetailsId());
                        detailDTO.setQuantity(detail.getQuantity());
                        detailDTO.setPrice(detail.getPrice());
                        detailDTO.setDiscount(detail.getDiscount());
                        detailDTO.setTotal(detail.getTotal());
                        return detailDTO;
                    })
                    .collect(Collectors.toList());

            dto.setOrderDetails(detailDTOs);
            return dto;
        }).collect(Collectors.toList());
    }
}