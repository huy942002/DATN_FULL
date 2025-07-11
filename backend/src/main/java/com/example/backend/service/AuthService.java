package com.example.backend.service;

import com.example.backend.dto.ReqRes;
import com.example.backend.entities.User;
import com.example.backend.entities.Customer;
import com.example.backend.entities.Employee;
import com.example.backend.entities.UserRole;
import com.example.backend.repository.repo.UserRepository;
import com.example.backend.repository.repo.UserRoleRepository;
import com.example.backend.repository.repo.CustomerRepository;
import com.example.backend.repository.repo.EmployeeRepository;
import com.example.backend.utils.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRoleRepository userRoleRepository;

    public JWTUtils getJwtUtils() {
        return jwtUtils;
    }

    public ReqRes signUp(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            // Validate required fields
            if (registrationRequest.getUsername() == null || registrationRequest.getPassword() == null) {
                throw new IllegalArgumentException("Username and password are required");
            }
            Map<String, Object> userData = registrationRequest.getUserData();
            if (userData == null ||
                    userData.get("fullname") == null || userData.get("email") == null ||
                    userData.get("phoneNumber") == null || userData.get("address") == null) {
                throw new IllegalArgumentException("All user fields (fullname, email, phoneNumber, address) are required");
            }
            List<String> roles = registrationRequest.getRole() != null ? registrationRequest.getRole() : List.of("USER");

            // Create User
            User user = new User();
            user.setUsername(registrationRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            user.setStatus(registrationRequest.getStatus() != 0 ? registrationRequest.getStatus() : 1);
            User savedUser = userRepo.save(user);

            // Create roles
            for (String role : roles) {
                UserRole userRole = new UserRole();
                userRole.setUser(savedUser);
                userRole.setRole(role);
                userRole.setActive(true);
                userRoleRepository.save(userRole);
            }

            // Create Customer or Employee based on roles
            Map<String, Object> responseUserData = new HashMap<>();
            responseUserData.put("username", savedUser.getUsername());
            if (roles.contains("ADMIN")) {
                Employee employee = new Employee();
                employee.setUser(savedUser);
                employee.setFullName((String) userData.get("fullname"));
                employee.setEmail((String) userData.get("email"));
                employee.setPhoneNumber((String) userData.get("phoneNumber"));
                employee.setAddress((String) userData.get("address"));
                employee.setPosition((String) userData.get("position") != null ? (String) userData.get("position") : "Staff");
                employee.setSalary(userData.get("salary") != null ? new BigDecimal(userData.get("salary").toString()) : BigDecimal.ZERO);
                employee.setStatus(1);
                employee.setActive(true);
                Employee savedEmployee = employeeRepository.save(employee);
                responseUserData.put("id", savedEmployee.getId());
                responseUserData.put("fullname", savedEmployee.getFullName());
                responseUserData.put("email", savedEmployee.getEmail());
                responseUserData.put("phoneNumber", savedEmployee.getPhoneNumber());
                responseUserData.put("address", savedEmployee.getAddress());
                responseUserData.put("position", savedEmployee.getPosition());
                responseUserData.put("salary", savedEmployee.getSalary());
            } else {
                Customer customer = new Customer();
                customer.setUser(savedUser);
                customer.setFullName((String) userData.get("fullname"));
                customer.setEmail((String) userData.get("email"));
                customer.setPhoneNumber((String) userData.get("phoneNumber"));
                customer.setAddress((String) userData.get("address"));
                customer.setStatus(1);
                customer.setActive(true);
                Customer savedCustomer = customerRepository.save(customer);
                responseUserData.put("id", savedCustomer.getId());
                responseUserData.put("fullname", savedCustomer.getFullName());
                responseUserData.put("email", savedCustomer.getEmail());
                responseUserData.put("phoneNumber", savedCustomer.getPhoneNumber());
                responseUserData.put("address", savedCustomer.getAddress());
            }

            if (savedUser != null && savedUser.getUserId() > 0) {
                resp.setOurUsers(savedUser);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
                resp.setUserData(responseUserData);
                resp.setRole(roles);
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes signIn(ReqRes signinRequest) {
        ReqRes response = new ReqRes();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getUsername(), signinRequest.getPassword()));
            User user = userRepo.findByUsername(signinRequest.getUsername()).orElseThrow(() -> new IllegalArgumentException("User not found"));
            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }
            List<String> userRoles = userRoleRepository.findByUserId(user.getUserId()).stream()
                    .map(UserRole::getRole)
                    .collect(Collectors.toList());
            Map<String, Object> userData = new HashMap<>();
            userData.put("username", user.getUsername());

            if (userRoles.contains("Admin")) {
                Employee employee = employeeRepository.findByUserAndIsActiveTrue(user)
                        .orElseThrow(() -> new IllegalArgumentException("Employee not found for user"));
                userData.put("id", employee.getId());
                userData.put("fullname", employee.getFullName());
                userData.put("email", employee.getEmail());
                userData.put("phoneNumber", employee.getPhoneNumber());
                userData.put("address", employee.getAddress());
                userData.put("position", employee.getPosition());
                userData.put("salary", employee.getSalary());
            } else {
                Customer customer = customerRepository.findByUsername(signinRequest.getUsername())
                        .orElseThrow(() -> new IllegalArgumentException("Customer not found for user"));
                userData.put("id", customer.getId());
                userData.put("fullname", customer.getFullName());
                userData.put("email", customer.getEmail());
                userData.put("phoneNumber", customer.getPhoneNumber());
                userData.put("address", customer.getAddress());
            }

            response.setStatusCode(200);
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully Signed In");
            response.setRole(userRoles);
            response.setUserData(userData);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setError(e.getMessage());
        }
        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        String username = jwtUtils.extractUsername(refreshTokenRequest.getToken());
        User user = userRepo.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), user)) {
            var jwt = jwtUtils.generateToken(user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshTokenRequest.getToken());
            response.setExpirationTime("24Hr");
            response.setMessage("Successfully Refreshed Token");
        } else {
            response.setStatusCode(500);
            response.setError("Invalid refresh token");
        }
        return response;
    }

    public Boolean isTokenValid(String token) {
        return !jwtUtils.isTokenExpired(token);
    }
}