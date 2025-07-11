package com.example.backend.repository.imp;

import com.example.backend.entities.Functions;
import com.example.backend.repository.irepo.IFunctionService;
import com.example.backend.repository.repo.FunctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FunctionServiceImp implements IFunctionService {
    @Autowired
    private FunctionRepository functionRepository;

    @Override
    public Iterable<Functions> findAll() {
        return functionRepository.findAll();
    }

    @Override
    public Optional<Functions> findById(Integer id) {
        return functionRepository.findById(id);
    }

    @Override
    public Functions save(Functions function) {
        return functionRepository.save(function);
    }

    @Override
    public void remove(Integer id) {
        functionRepository.deleteById(id);
    }
}
