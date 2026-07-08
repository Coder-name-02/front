"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getAuthHeaders, handleAuthError } from "../../../lib/apiAuth";
import { useCart } from "../../../lib/CartContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const { isInCart, toggleCartItem } = useCart();
  const isAdmin = session?.user?.role === "admin";

  //fetchProduct
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/api/v1/products/${id}`);
  //       if (!response.ok) {
  //         throw new Error("Product not found");
  //       }
  //       const data = await response.json();
  //       setProduct(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, [id]);

  //handleDelete
  // const handleDelete = async () => {
  //   if (!window.confirm("Are you sure you want to delete this product?")) return;

  //   try {
  //     const headers = await getAuthHeaders(session);
  //     if (!headers) {
  //       alert("Please log in first.");
  //       return;
  //     }

  //     const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
  //       method: "DELETE",
  //       headers,
  //     });

  //     if (await handleAuthError(response)) return;

  //     if (response.ok) {
  //       alert("Product deleted successfully");
  //       router.push("/dashboard");
  //     } else {
  //       const errData = await response.json().catch(() => ({}));
  //       alert(errData.error || "Failed to delete product");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Error deleting product");
  //   }
  // };

  //handle toggle cart
  // const handleToggleCart = async () => {
  //   if (isUpdatingCart) return;
  //   setIsUpdatingCart(true);
  //   await toggleCartItem(product.id);
  //   setIsUpdatingCart(false);
  // };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">Error</h3>
        <p>{error || "Product not found"}</p>
        <button className="btn btn-primary" onClick={() => router.push("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const salePrice = product.ong_price - (product.discount || 0);
  const inCart = isInCart(product.id);

  return (
    <div className="container mt-5 mb-5">
      {isAdmin && (
        <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-3 rounded border">
          <span className="fw-bold text-secondary">Admin Controls</span>
          <div className="d-flex gap-2">
            <Link href={`/dashboard/edit/${product.id}`} className="btn btn-primary btn-sm px-3 fw-bold">
              Edit Product
            </Link>
            <button className="btn btn-danger btn-sm px-3 fw-bold" onClick={handleDelete}>
              Delete Product
            </button>
          </div>
        </div>
      )}

      <div className="row g-5">
        {/* Left Column - Images */}
        <div className="col-md-6">
          <div className="position-sticky" style={{ top: "2rem" }}>
            {product.images?.length > 0 ? (
              <>
                <div className="card border-0 shadow-sm mb-3 overflow-hidden rounded-4" style={{ height: "450px" }}>
                  <img
                    src={product.images[activeImageIndex].url}
                    alt={product.title}
                    className="w-100 h-100 object-fit-contain p-4 bg-white"
                  />
                </div>
                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto py-2">
                    {product.images.map((img, index) => (
                      <div 
                        key={img.id}
                        className={`card flex-shrink-0 cursor-pointer overflow-hidden ${activeImageIndex === index ? 'border-primary border-2 shadow-sm' : 'border'}`}
                        style={{ width: "80px", height: "80px", cursor: "pointer", transition: "all 0.2s ease" }}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img 
                          src={img.url} 
                          alt="Thumbnail" 
                          className="w-100 h-100 object-fit-cover p-1 bg-white" 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="card border-0 shadow-sm mb-3 bg-light d-flex align-items-center justify-content-center rounded-4" style={{ height: "450px" }}>
                <span className="text-muted fs-4">No Image Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="col-md-6">
          <div className="mb-2">
            {product.brand && (
              <span className="badge bg-secondary text-uppercase py-2 px-3 rounded-pill mb-2">
                {product.brand}
              </span>
            )}
            <h1 className="fw-bold mb-3" style={{ fontSize: "2.5rem" }}>{product.title}</h1>
            
            <div className="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom">
              <span className="fw-bold" style={{ color: "#f83a59", fontSize: "2rem" }}>
                {salePrice.toLocaleString()} Ks
              </span>
              {product.discount > 0 && (
                <span className="text-secondary text-decoration-line-through fs-5">
                  {product.ong_price.toLocaleString()} Ks
                </span>
              )}
              {product.discount > 0 && (
                <span className="badge bg-success ms-auto fs-6">
                  Save {product.discount.toLocaleString()} Ks
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            {/* <h5 className="fw-bold mb-3">Product Description</h5> */}
            <p className="text-muted" style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="mb-5 d-flex gap-3 align-items-center">
            <div className={`badge ${product.stock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} fs-6 p-2 px-3 rounded-3`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </div>
            
            <button 
              className={`btn btn-lg flex-grow-1 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 ${
                inCart ? "btn-outline-primary" : "btn-primary"
              }`}
              disabled={product.stock === 0 || isUpdatingCart}
              onClick={handleToggleCart}
              style={{ transition: "all 0.3s ease" }}
            >
              {isUpdatingCart ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : inCart ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg>
                  Remove from Favorites
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.171C12.72-3.042 23.333 4.867 8 15"/>
                  </svg>
                  Add to Favorites
                </>
              )}
            </button>
          </div>

         
        </div>
        <div>
           {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="card border-0 bg-light rounded-4 p-4">
              <h5 className="fw-bold mb-4">Specifications</h5>
              <div className="table-responsive">
                <table className="table table-borderless table-sm mb-0">
                  <tbody>
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="border-bottom">
                        <td className="text-muted fw-semibold py-3 w-25">{spec.title}</td>
                        <td className="py-3 text-dark">{spec.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
