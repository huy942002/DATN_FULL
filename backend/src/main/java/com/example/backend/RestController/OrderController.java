package com.example.backend.RestController;

import com.example.backend.dto.OrderDTO;
import com.example.backend.entities.Customer;
import com.example.backend.entities.Order;
import com.example.backend.repository.imp.OrderServiceImp;
import com.example.backend.repository.repo.CustomerRepository;
import com.example.backend.repository.repo.OrderRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderServiceImp orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders(Authentication authentication) {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO, Authentication authentication) {
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        if (!customer.getId().equals(orderDTO.getCustomerId())) {
            throw new SecurityException("Unauthorized access to customer");
        }
        return ResponseEntity.ok(orderService.createOrder(orderDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Integer id, @Valid @RequestBody OrderDTO orderDTO, Authentication authentication) {
        orderDTO.setOrderId(id);
        return ResponseEntity.ok(orderService.updateOrder(id, orderDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id, Authentication authentication) {
        String username = authentication.getName();
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!existingOrder.getCustomer().getUser().getUsername().equals(username)) {
            throw new SecurityException("Unauthorized access to order");
        }
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}