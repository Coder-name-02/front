"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import CreateProductForm from "../../../../components/products/CreateProductForm";
import { getAuthHeaders } from "../../../../lib/apiAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load product");
        }
        const data = await response.json();
        
        // Convert category to string for select input to work properly
        data.category = data.category ? data.category.toString() : "";
        
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [session, status, router, id]);

  if (status === "loading" || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">Error</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => router.push("/dashboard")}
        >
          &larr; Back to Dashboard
        </button>
      </div>
      
      {product && (
        <CreateProductForm 
          apiUrl={API_URL}
          getAuthHeaders={() => getAuthHeaders(session)}
          onSuccess={() => router.push("/dashboard")}
          mode="edit"
          initialData={product}
        />
      )}
    </div>
  );
}
