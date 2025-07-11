package com.example.backend.repository.irepo;

import com.example.backend.entities.Category;

public interface ICategoryService extends IGeneralService<Category>{
    public Category updateCategory(Category category);
}
