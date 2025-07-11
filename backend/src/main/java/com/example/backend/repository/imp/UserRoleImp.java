package com.example.backend.repository.imp;

import com.example.backend.entities.UserRole;
import com.example.backend.repository.irepo.IUserRole;
import com.example.backend.repository.repo.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserRoleImp implements IUserRole {
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Override
    public Iterable<UserRole> findAll() {
        return userRoleRepository.findAll();
    }

    @Override
    public Optional<UserRole> findById(Integer id) {
        return userRoleRepository.findById(id);
    }

    @Override
    public UserRole save(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    @Override
    public void remove(Integer id) {
        userRoleRepository.deleteById(id);
    }
}
