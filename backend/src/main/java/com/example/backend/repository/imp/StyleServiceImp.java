package com.example.backend.repository.imp;

import com.example.backend.entities.Style;
import com.example.backend.repository.irepo.IStyleService;
import com.example.backend.repository.repo.StyleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StyleServiceImp implements IStyleService {
    @Autowired
    private StyleRepository styleRepository;

    @Override
    public Iterable<Style> findAll() {
        return styleRepository.findAll();
    }

    @Override
    public Optional<Style> findById(Integer id) {
        return styleRepository.findById(id);
    }

    @Override
    public Style save(Style style) {
        return styleRepository.save(style);
    }

    @Override
    public void remove(Integer id) {
        styleRepository.deleteById(id);
    }
}
