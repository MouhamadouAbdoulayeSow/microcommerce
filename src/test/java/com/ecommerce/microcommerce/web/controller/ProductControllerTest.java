package com.ecommerce.microcommerce.web.controller;

import com.ecommerce.microcommerce.model.Product;
import com.ecommerce.microcommerce.web.dao.ProductDao;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.endsWith;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductDao productDao;

    @Test
    void listReturnsAllProducts() throws Exception {
        when(productDao.findAll()).thenReturn(List.of(
                new Product(1, "Ordinateur portable", 350, 120),
                new Product(2, "Aspirateur Robot", 500, 200)));

        mockMvc.perform(get("/Produits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nom").value("Ordinateur portable"));
    }

    @Test
    void unknownProductReturns404() throws Exception {
        when(productDao.findById(42)).thenReturn(null);

        mockMvc.perform(get("/Produits/42"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Le produit avec l'id 42 est Introuvable."));
    }

    @Test
    void createReturns201WithLocation() throws Exception {
        when(productDao.save(any(Product.class))).thenReturn(new Product(5, "Clavier", 30, 10));

        mockMvc.perform(post("/Produits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"Clavier\",\"prix\":30,\"prixAchat\":10}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", endsWith("/Produits/5")));
    }

    @Test
    void invalidProductReturns400WithFieldErrors() throws Exception {
        mockMvc.perform(post("/Produits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nom\":\"\",\"prix\":0,\"prixAchat\":10}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.prix").exists())
                .andExpect(jsonPath("$.errors.nom").exists());
        verify(productDao, never()).save(any());
    }

    @Test
    void updateUnknownProductReturns404() throws Exception {
        when(productDao.existsById(9)).thenReturn(false);

        mockMvc.perform(put("/Produits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":9,\"nom\":\"Clavier\",\"prix\":30,\"prixAchat\":10}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteExistingProductReturns204() throws Exception {
        when(productDao.existsById(1)).thenReturn(true);

        mockMvc.perform(delete("/Produits/1"))
                .andExpect(status().isNoContent());
        verify(productDao).deleteById(1);
    }
}
