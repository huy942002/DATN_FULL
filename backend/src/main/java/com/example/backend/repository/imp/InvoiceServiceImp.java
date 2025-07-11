package com.example.backend.repository.imp;

import com.example.backend.dto.InvoiceDTO;
import com.example.backend.entities.Invoice;
import com.example.backend.entities.Order;
import com.example.backend.entities.Customer;
import com.example.backend.entities.Employee;
import com.example.backend.repository.repo.InvoiceRepository;
import com.example.backend.repository.repo.OrderRepository;
import com.example.backend.repository.repo.CustomerRepository;
import com.example.backend.repository.repo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImp {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Order order = orderRepository.findById(invoiceDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Customer customer = customerRepository.findById(invoiceDTO.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Employee employee = invoiceDTO.getEmployeeId() != null ?
                employeeRepository.findById(invoiceDTO.getEmployeeId())
                        .orElseThrow(() -> new IllegalArgumentException("Employee not found")) : null;

        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoice.setCustomer(customer);
        invoice.setEmployee(employee);
        invoice.setTotalAmount(new BigDecimal(String.valueOf(invoiceDTO.getTotalAmount())));
        invoice.setTaxAmount(new BigDecimal(String.valueOf(invoiceDTO.getTaxAmount())));
        invoice.setFinalAmount(new BigDecimal(String.valueOf(invoiceDTO.getFinalAmount())));
        invoice.setInvoiceStatus(Invoice.InvoiceStatus.valueOf(String.valueOf(invoiceDTO.getInvoiceStatus())));
        invoice.setPaymentMethod(invoiceDTO.getPaymentMethod());
        invoice.setActive(true);

        invoiceRepository.save(invoice);

        invoiceDTO.setInvoiceId(invoice.getInvoiceId());
        invoiceDTO.setInvoiceDate(invoice.getInvoiceDate());
        return invoiceDTO;
    }

    @Transactional
    public InvoiceDTO updateInvoice(Integer id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        Order order = orderRepository.findById(invoiceDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Customer customer = invoiceDTO.getCustomerId() != null ?
                customerRepository.findById(invoiceDTO.getCustomerId())
                        .orElseThrow(() -> new IllegalArgumentException("Customer not found")) : null;

        Employee employee = invoiceDTO.getEmployeeId() != null ?
                employeeRepository.findById(invoiceDTO.getEmployeeId())
                        .orElseThrow(() -> new IllegalArgumentException("Employee not found")) : null;

        invoice.setOrder(order);
        invoice.setCustomer(customer);
        invoice.setEmployee(employee);
        invoice.setTotalAmount(invoiceDTO.getTotalAmount());
        invoice.setTaxAmount(invoiceDTO.getTaxAmount() != null ? invoiceDTO.getTaxAmount() : BigDecimal.ZERO);
        invoice.setFinalAmount(invoiceDTO.getTotalAmount().add(invoice.getTaxAmount()));
        invoice.setInvoiceStatus(invoiceDTO.getInvoiceStatus());
        invoice.setPaymentMethod(invoiceDTO.getPaymentMethod());

        invoiceRepository.save(invoice);

        invoiceDTO.setInvoiceId(invoice.getInvoiceId());
        invoiceDTO.setInvoiceDate(invoice.getInvoiceDate());
        invoiceDTO.setFinalAmount(invoice.getFinalAmount());
        return invoiceDTO;
    }

    @Transactional
    public void deleteInvoice(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        invoice.setActive(false); // Soft delete
        invoiceRepository.save(invoice);
    }

    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findByIsActiveTrue().stream().map(invoice -> {
            InvoiceDTO dto = new InvoiceDTO();
            dto.setInvoiceId(invoice.getInvoiceId());
            dto.setOrderId(invoice.getOrder().getOrderId());
            dto.setCustomerId(invoice.getCustomer() != null ? invoice.getCustomer().getId() : null);
            dto.setEmployeeId(invoice.getEmployee() != null ? invoice.getEmployee().getId() : null);
            dto.setTotalAmount(invoice.getTotalAmount());
            dto.setTaxAmount(invoice.getTaxAmount());
            dto.setFinalAmount(invoice.getFinalAmount());
            dto.setInvoiceDate(invoice.getInvoiceDate());
            dto.setInvoiceStatus(invoice.getInvoiceStatus());
            dto.setPaymentMethod(invoice.getPaymentMethod());
            return dto;
        }).collect(Collectors.toList());
    }
}