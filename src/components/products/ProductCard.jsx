import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../lib/CartContext";

function HeartIcon({ filled }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.171C12.72-3.042 23.333 4.867 8 15"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
    </svg>
  );
}

export default function ProductCard({ product, showCartButton = true, showAdminActions = false, onDelete }) {
  const salePrice = product.ong_price - (product.discount || 0);
  const imageUrl = product.images?.[0]?.url || product.image_url;
  
  const { isInCart, toggleCartItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const inCart = isInCart(product.id);

  const handleToggleCart = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    
    setIsUpdating(true);
    await toggleCartItem(product.id);
    setIsUpdating(false);
  };

  return (
    <div className="card h-100 shadow-sm border p-3 hover-lift position-relative" style={{ borderRadius: "12px" }}>
      {showAdminActions && (
        <div className="position-absolute top-0 end-0 p-2 d-flex gap-1" style={{ zIndex: 10 }}>
          <Link href={`/dashboard/edit/${product.id}`} className="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px" }} title="Edit">
            <EditIcon />
          </Link>
          <button 
            type="button" 
            className="btn btn-sm btn-danger border rounded-circle d-flex align-items-center justify-content-center" 
            style={{ width: "30px", height: "30px" }} 
            title="Delete"
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(product.id);
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      )}

      <Link href={`/products/${product.id}`} className="text-decoration-none text-dark d-flex flex-column h-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="card-img-top object-fit-contain"
            style={{ height: "150px" }}
            alt={product.title}
          />
        ) : (
          <div
            className="card-img-top bg-light d-flex align-items-center justify-content-center"
            style={{ height: "180px" }}
          >
            <span className="text-muted">No Image</span>
          </div>
        )}

        <div className="card-body p-0 mt-3 d-flex flex-column">
          <h6 className="card-title text-truncate text-dark mb-3">{product.title}</h6>

          <div className="d-flex justify-content-between align-items-end mt-auto">
            <div className="d-flex flex-column align-items-start gap-1">
              <span className="fw-bold" style={{ color: "#f83a59", fontSize: "1rem" }}>
                {salePrice} Ks
              </span>
              {product.discount > 0 && (
                <span
                  className="text-secondary text-decoration-line-through small"
                  style={{ fontSize: "0.85rem" }}
                >
                  {product.ong_price} Ks
                </span>
              )}
            </div>

            {showCartButton && (
              <button
                type="button"
                className={`btn btn-sm rounded-circle border d-flex align-items-center justify-content-center ${
                  inCart ? "btn-danger text-white border-danger" : "btn-light"
                }`}
                style={{ width: "35px", height: "35px", zIndex: 5, transition: "all 0.2s" }}
                aria-label={inCart ? "Remove from favorites" : "Add to favorites"}
                onClick={handleToggleCart}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <HeartIcon filled={inCart} />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
