//package com.example.backend.RestController;
//
//import com.example.backend.dto.EmployeeDTO;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/employees")
//public class EmployeeRestController {
//    @Autowired
//    private EmployeeDTOServiceImp employeeService;
//
//    @GetMapping
//    public List<EmployeeDTO> getAllEmployees() {
//        return employeeService.getAllEmployees();
//    }
//
//    @PostMapping
//    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO dto) {
//        return ResponseEntity.ok(employeeService.createEmployee(dto));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
//        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
//        employeeService.deleteEmployee(id);
//        return ResponseEntity.noContent().build();
//    }
//}
//
//
//
