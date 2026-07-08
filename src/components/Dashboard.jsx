"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getBrandsForCategory } from "../constants/categories";
import { getAuthHeaders, handleAuthError } from "../lib/apiAuth";
import ProductFilters from "./products/ProductFilters";
import ProductGrid from "./products/ProductGrid";
import CreateProductForm from "./products/CreateProductForm";
import CarouselManager from "./products/CarouselManager";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("view");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const authHeaders = useCallback(
    () => getAuthHeaders(session),
    [session]
  );

  const fetchProducts = useCallback(async () => {
    const headers = await authHeaders();
    if (!headers) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      if (filterBrand) params.append("brand", filterBrand);
      if (sortBy) params.append("sort_by", sortBy);

      const response = await fetch(`${API_URL}/api/v1/products?${params.toString()}`, {
        headers,
      });

      if (await handleAuthError(response)) return;

      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, filterCategory, filterBrand, sortBy]);

  useEffect(() => {
    if (activeTab === "view" && session?.jwt) {
      fetchProducts();
    }
  }, [activeTab, session, fetchProducts]);

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilterBrand("");
  };

  const handleProductCreated = () => {
    setActiveTab("view");
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const headers = await authHeaders();
      if (!headers) {
        alert("Please log in first.");
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
        method: "DELETE",
        headers,
      });

      if (await handleAuthError(response)) return;

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.error || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="container mt-4 pb-5">
      <h2 className="mb-4">Admin Dashboard</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "view" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("view")}
          >
            View Products
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "create" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Create Product
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "carousel" ? "active fw-bold" : ""}`}
            onClick={() => setActiveTab("carousel")}
          >
            Carousel
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "view" && (
          <>
            <ProductFilters
              filterCategory={filterCategory}
              filterBrand={filterBrand}
              sortBy={sortBy}
              availableBrands={getBrandsForCategory(filterCategory)}
              onCategoryChange={handleCategoryChange}
              onBrandChange={setFilterBrand}
              onSortChange={setSortBy}
            />
            <ProductGrid 
              products={products} 
              loading={loading}
              showAdminActions={true}
              onDelete={handleDeleteProduct}
            />
          </>
        )}

        {activeTab === "create" && (
          <CreateProductForm
            apiUrl={API_URL}
            getAuthHeaders={authHeaders}
            onSuccess={handleProductCreated}
          />
        )}

        {activeTab === "carousel" && (
          <CarouselManager getAuthHeaders={authHeaders} />
        )}
      </div>
    </div>
  );
}
