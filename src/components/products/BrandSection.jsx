"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { brandToSlug } from "../../lib/brandUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BrandSection({ brandName }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrandProducts() {
      try {
        const params = new URLSearchParams();
        params.append("brand", brandName);
        params.append("sort_by", "time");
        params.append("limit", "20"); // Fetch newest 20

        const res = await fetch(`${API_URL}/api/v1/products?${params.toString()}`);
        if (res.ok) {
          setProducts(await res.json());
        }
      } catch (err) {
        console.error(`Failed to fetch products for ${brandName}:`, err);
      } finally {
        setLoading(false);
      }
    }
    
    if (brandName) {
      fetchBrandProducts();
    }
  }, [brandName]);

  if (loading) {
    return (
      <div className="my-5">
        <h4 className="fw-bold mb-4">{brandName} Products</h4>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Do not render section if no products exist for this brand
  }

  const brandSlug = brandToSlug(brandName);

  return (
    <section className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">{brandName} Products</h4>
        <Link href={`/${brandSlug}`} className="text-decoration-none fw-bold text-primary">
          More &rarr;
        </Link>
      </div>

      <div 
        className="d-flex gap-4 pb-3" 
        style={{ 
          overflowX: "auto", 
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            style={{ 
              minWidth: "220px", 
              width: "220px",
              scrollSnapAlign: "start" 
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
