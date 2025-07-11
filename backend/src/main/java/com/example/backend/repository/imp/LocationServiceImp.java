package com.example.backend.repository.imp;

import com.example.backend.entities.Locations;
import com.example.backend.repository.irepo.ILocationService;
import com.example.backend.repository.repo.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationServiceImp implements ILocationService {
    @Autowired
    private LocationRepository locationRepository;

    @Override
    public Iterable<Locations> findAll() {
        return locationRepository.findAll();
    }

    @Override
    public Optional<Locations> findById(Integer id) {
        return locationRepository.findById(id);
    }

    @Override
    public Locations save(Locations location) {
        return locationRepository.save(location);
    }

    @Override
    public void remove(Integer id) {
        locationRepository.deleteById(id);
    }

}
