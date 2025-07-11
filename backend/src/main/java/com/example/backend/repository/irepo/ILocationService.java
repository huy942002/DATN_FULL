package com.example.backend.repository.irepo;

import com.example.backend.entities.Locations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface ILocationService extends IGeneralService<Locations> {
}