import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  loading,
  emptyMessage = "No products found matching your criteria.",
  showCartButton = true,
  onAddToCart,
  showAdminActions = false,
  onDelete
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="row">
        <div className="col-12 text-center text-muted py-5">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
      {products.map((product) => (
        <div className="col" key={product.id}>
          <ProductCard
            product={product}
            showCartButton={showCartButton}
            onAddToCart={onAddToCart}
            showAdminActions={showAdminActions}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
