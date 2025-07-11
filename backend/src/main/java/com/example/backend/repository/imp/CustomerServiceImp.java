package com.example.backend.repository.imp;


import com.example.backend.dto.CustomerDTO;
import com.example.backend.entities.Customer;
import com.example.backend.repository.repo.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class CustomerServiceImp{
    @Autowired
    private CustomerRepository customerRepository;

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setFullName(customerDTO.getFullname());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        customer.setStatus(customerDTO.getStatus() != null ? customerDTO.getStatus() : 1);
        customer.setUser(null); // No User created

        customerRepository.save(customer);

        customerDTO.setId(customer.getId());
        return customerDTO;
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findByIsActiveTrue().stream().map(customer -> {
            CustomerDTO dto = new CustomerDTO();
            dto.setId(customer.getId());
            dto.setFullname(customer.getFullName());
            dto.setEmail(customer.getEmail());
            dto.setPhoneNumber(customer.getPhoneNumber());
            dto.setAddress(customer.getAddress());
            dto.setStatus(customer.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<CustomerDTO> getCustomersByIds(List<Long> ids) {
        return customerRepository.findByIdsAndIsActiveTrue(ids).stream().map(customer -> {
            CustomerDTO dto = new CustomerDTO();
            dto.setId(customer.getId());
            dto.setFullname(customer.getFullName());
            dto.setEmail(customer.getEmail());
            dto.setPhoneNumber(customer.getPhoneNumber());
            dto.setAddress(customer.getAddress());
            dto.setStatus(customer.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFullname(customer.getFullName());
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setAddress(customer.getAddress());
        dto.setStatus(customer.getStatus());
        return dto;
    }
}
