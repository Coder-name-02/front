import { categoryOptions } from "../../constants/categories";

export default function ProductFilters({
  filterCategory,
  filterBrand,
  sortBy,
  availableBrands,
  onCategoryChange,
  onBrandChange,
  onSortChange,
}) {
  return (
    <div className="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div className="row g-3 align-items-center">
        <div className="col-md-3">
          <label className="form-label fw-bold">Category</label>
          <select
            className="form-select border-0 shadow-sm"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Brand</label>
          <select
            className="form-select border-0 shadow-sm"
            value={filterBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            disabled={!filterCategory}
          >
            <option value="">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Sort By</label>
          <select
            className="form-select border-0 shadow-sm"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="time">Time (Newest First)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
