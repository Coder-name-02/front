"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../../lib/CartContext";
import ProductGrid from "../../components/products/ProductGrid";
import ProductFilters from "../../components/products/ProductFilters";
import { getBrandsForCategory } from "../../constants/categories";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, loading } = useCart();
  
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [sortBy, setSortBy] = useState("time");

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Extract products from cart items
  let products = cart.map((item) => ({
    ...item.product,
    id: item.product_id, // make sure product has correct id for routing
  }));

  // Apply frontend filters
  if (filterCategory) {
    products = products.filter(p => String(p.category) === String(filterCategory));
  }
  if (filterBrand) {
    products = products.filter(p => p.brand === filterBrand);
  }

  // Apply frontend sort
  if (sortBy === "price_asc") {
    products.sort((a, b) => (a.ong_price - (a.discount || 0)) - (b.ong_price - (b.discount || 0)));
  } else if (sortBy === "price_desc") {
    products.sort((a, b) => (b.ong_price - (b.discount || 0)) - (a.ong_price - (a.discount || 0)));
  }

  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setFilterBrand("");
  };

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <h2 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-heart-fill text-danger" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
          </svg>
          Your Favorites
        </h2>
        <span className="badge bg-secondary rounded-pill">{cart.length} Items</span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm rounded-4 border">
          <span style={{ fontSize: "4rem", opacity: 0.5 }}>💔</span>
          <h4 className="mt-3 text-dark fw-bold">No favorites yet</h4>
          <p className="text-muted mb-4">You haven't saved any items to your favorites.</p>
          <button className="btn btn-primary px-4 py-2 fw-bold" onClick={() => router.push("/")}>
            Explore Products
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <ProductFilters
              filterCategory={filterCategory}
              filterBrand={filterBrand}
              sortBy={sortBy}
              availableBrands={getBrandsForCategory(filterCategory)}
              onCategoryChange={handleCategoryChange}
              onBrandChange={setFilterBrand}
              onSortChange={setSortBy}
            />
          </div>
          
          <ProductGrid 
            products={products} 
            loading={false}
            emptyMessage="No favorites match your selected filters."
            showCartButton={true}
          />
        </>
      )}
    </div>
  );
}
