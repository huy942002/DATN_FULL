package com.example.backend.repository.repo;

import com.example.backend.entities.User;
import com.example.backend.entities.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    @Query("SELECT u FROM UserRole u WHERE u.user.id=?1")
    List<UserRole> findByUserId(Integer userID);

    @Query("SELECT u.role  FROM UserRole u WHERE u.user.id=?1")
    List<String> findRoleByUserId(Integer userId);

    List<UserRole> findByUser(User user);
    void deleteByUser(User user);


    List<UserRole> findByIsActiveTrue();



}

