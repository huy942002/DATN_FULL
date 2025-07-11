package com.example.backend.service;

import com.example.backend.entities.User;
import com.example.backend.entities.UserRole;
import com.example.backend.repository.repo.UserRepository;
import com.example.backend.repository.repo.UserRoleRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
public class UsersDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public UsersDetailsService(UserRepository userRepository, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        var roles = userRoleRepository.findByUserId(user.getUserId()).stream()
                .map(UserRole::getRole)
                .collect(Collectors.toList());

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(roles.stream().map(role -> new SimpleGrantedAuthority(role)).collect(Collectors.toList()))
                .build();
    }
}


