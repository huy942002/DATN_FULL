import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchSlides = createAsyncThunk("home/fetchSlides", async () => {
  try {
    const response = await axios.get("http://localhost:8080/public/product-sections/slides?page=0&size=5"); // Fetch 5 slides
    return response.data.content || [];
  } catch (error) {
    throw new Error("Failed to fetch slides");
  }
});

const fetchProducts = createAsyncThunk("home/fetchProducts", async ({ sectionType, page = 0, size = 4 }) => {
  try {
    let url = "";
    switch (sectionType) {
      case "featured":
        url = "http://localhost:8080/public/product-sections/featured";
        break;
      case "suggestions":
        url = "http://localhost:8080/public/product-sections/suggestions";
        break;
      case "newest":
        url = "http://localhost:8080/public/product-sections/newest";
        break;
      case "deals":
        url = "http://localhost:8080/public/product-sections/deals";
        break;
      case "promotions":
        url = "http://localhost:8080/public/product-sections/promotions";
        break;
      default:
        url = "http://localhost:8080/public/product-sections/suggestions";
    }
    const response = await axios.get(`${url}?page=${page}&size=${size}`);
    return { sectionType, products: response.data.content || [], totalPages: response.data.totalPages || 1, currentPage: page };
  } catch (error) {
    throw new Error(`Failed to fetch ${sectionType} products: ${error.message}`);
  }
});

const fetchFurnitureTypes = createAsyncThunk("home/fetchFurnitureTypes", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/furniture-types"); // Adjust endpoint
    return response.data || [];
  } catch (error) {
    throw new Error("Failed to fetch furniture types");
  }
});

const fetchLocations = createAsyncThunk("home/fetchLocations", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/locations"); // Adjust endpoint
    return response.data || [];
  } catch (error) {
    throw new Error("Failed to fetch locations");
  }
});

const fetchWoodTypes = createAsyncThunk("home/fetchWoodTypes", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/wood-types"); // Adjust endpoint
    return response.data || [];
  } catch (error) {
    throw new Error("Failed to fetch wood types");
  }
});

const fetchStyles = createAsyncThunk("home/fetchStyles", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/styles"); // Adjust endpoint
    return response.data || [];
  } catch (error) {
    throw new Error("Failed to fetch styles");
  }
});

const homeSlice = createSlice({
  name: "home",
  initialState: {
    slides: [],
    products: {
      featured: [],
      suggestions: [],
      newest: [],
      deals: [],
      promotions: [],
    },
    furnitureTypes: [],
    locations: [],
    woodTypes: [],
    styles: [],
    pagination: {
      slides: { totalPages: 1, currentPage: 0 },
      featured: { totalPages: 1, currentPage: 0 },
      suggestions: { totalPages: 1, currentPage: 0 },
      newest: { totalPages: 1, currentPage: 0 },
      deals: { totalPages: 1, currentPage: 0 },
      promotions: { totalPages: 1, currentPage: 0 },
    },
    loading: {
      slides: false,
      products: false,
      furnitureTypes: false,
      locations: false,
      woodTypes: false,
      styles: false,
    },
    error: {
      slides: null,
      products: null,
      furnitureTypes: null,
      locations: null,
      woodTypes: null,
      styles: null,
    },
  },
  reducers: {
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    setProducts: (state, action) => {
      const { sectionType, products } = action.payload;
      state.products[sectionType] = products;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlides.pending, (state) => {
        state.loading.slides = true;
        state.error.slides = null;
      })
      .addCase(fetchSlides.fulfilled, (state, action) => {
        state.loading.slides = false;
        state.slides = action.payload;
        state.pagination.slides.currentPage = 0;
        state.pagination.slides.totalPages = 1;
      })
      .addCase(fetchSlides.rejected, (state, action) => {
        state.loading.slides = false;
        state.error.slides = action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        const { sectionType, products, totalPages, currentPage } = action.payload;
        state.products[sectionType] = products;
        state.pagination[sectionType].totalPages = totalPages;
        state.pagination[sectionType].currentPage = currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.error.message;
      })
      .addCase(fetchFurnitureTypes.pending, (state) => {
        state.loading.furnitureTypes = true;
        state.error.furnitureTypes = null;
      })
      .addCase(fetchFurnitureTypes.fulfilled, (state, action) => {
        state.loading.furnitureTypes = false;
        state.furnitureTypes = action.payload;
      })
      .addCase(fetchFurnitureTypes.rejected, (state, action) => {
        state.loading.furnitureTypes = false;
        state.error.furnitureTypes = action.error.message;
      })
      .addCase(fetchLocations.pending, (state) => {
        state.loading.locations = true;
        state.error.locations = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading.locations = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading.locations = false;
        state.error.locations = action.error.message;
      })
      .addCase(fetchWoodTypes.pending, (state) => {
        state.loading.woodTypes = true;
        state.error.woodTypes = null;
      })
      .addCase(fetchWoodTypes.fulfilled, (state, action) => {
        state.loading.woodTypes = false;
        state.woodTypes = action.payload;
      })
      .addCase(fetchWoodTypes.rejected, (state, action) => {
        state.loading.woodTypes = false;
        state.error.woodTypes = action.error.message;
      })
      .addCase(fetchStyles.pending, (state) => {
        state.loading.styles = true;
        state.error.styles = null;
      })
      .addCase(fetchStyles.fulfilled, (state, action) => {
        state.loading.styles = false;
        state.styles = action.payload;
      })
      .addCase(fetchStyles.rejected, (state, action) => {
        state.loading.styles = false;
        state.error.styles = action.error.message;
      });
  },
});

export const { setSlides, setProducts } = homeSlice.actions;
export { fetchSlides, fetchProducts, fetchFurnitureTypes, fetchLocations, fetchWoodTypes, fetchStyles };
export default homeSlice.reducer;