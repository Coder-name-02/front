"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { categoryOptions } from "../../constants/categories";
import { slugToBrand } from "../../lib/brandUtils";
import ProductGrid from "../../components/products/ProductGrid";
import ProductFilters from "../../components/products/ProductFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BrandPage() {
  const params = useParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("time");
  
  // We don't filter by brand or category in the UI here because it's already scoped to a brand
  
  // Resolve brand name from slug
  const allBrands = Array.from(new Set(categoryOptions.flatMap((cat) => cat.brands)));
  const brandName = slugToBrand(params.brand, allBrands);

  const fetchBrandProducts = useCallback(async () => {
    if (!brandName) return;

    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("brand", brandName);
      query.append("sort_by", sortBy);

      const res = await fetch(`${API_URL}/api/v1/products?${query.toString()}`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      console.error(`Failed to fetch products for ${brandName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [brandName, sortBy]);

  useEffect(() => {
    if (!brandName) {
      // If the URL slug doesn't match any known brand, redirect to home
      router.replace("/");
      return;
    }
    
    fetchBrandProducts();
  }, [brandName, fetchBrandProducts, router]);

  if (!brandName) {
    return null; // Redirecting
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold mb-0">{brandName} Products</h2>
        <span className="badge bg-primary ms-3 rounded-pill">{products.length} Items</span>
      </div>

      <div className="mb-4">
        {/* We reuse ProductFilters but hide the brand/category dropdowns since they are fixed */}
        <div className="card shadow-sm border-0" style={{ borderRadius: "12px" }}>
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <span className="text-muted fw-bold">Browsing everything by {brandName}</span>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select bg-light border-0 fw-bold"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="time">Sort by: Newest</option>
                  <option value="price_asc">Sort by: Price (Low to High)</option>
                  <option value="price_desc">Sort by: Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGrid 
        products={products} 
        loading={loading}
        emptyMessage={`No ${brandName} products available at the moment.`}
        showCartButton={true}
      />
    </div>
  );
}
