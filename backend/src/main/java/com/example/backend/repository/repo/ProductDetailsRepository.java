package com.example.backend.repository.repo;

import com.example.backend.entities.ProductDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductDetailsRepository extends JpaRepository<ProductDetails,Integer> {
    // Phương thức tìm kiếm với sku chứa chuỗi con và active cụ thể, hỗ trợ phân trang
    Page<ProductDetails> findBySkuContainingAndActive(String sku, Boolean active, Pageable pageable);

    // Phương thức tìm kiếm với active cụ thể, hỗ trợ phân trang
    Page<ProductDetails> findByActive(Boolean active, Pageable pageable);

    // Phương thức tìm kiếm với sku chứa chuỗi con, hỗ trợ phân trang
    Page<ProductDetails> findBySkuContaining(String sku, Pageable pageable);

    // Phương thức tìm kiếm theo SKU chính xác
    Optional<ProductDetails> findBySku(String sku);

    // Find a ProductDetails by its barcode
    Optional<ProductDetails> findByBarcode(String barcode);

    // Phương thức mới: Lấy danh sách ProductDetails theo productId
    @Query("SELECT pcd FROM ProductDetails pcd WHERE pcd.product.id = :productId")
    List<ProductDetails> findAllByProductId(@Param("productId") Integer productId);

    void deleteByProductProductId(Integer productId);

    long countByProductProductId(Integer productId);

}
