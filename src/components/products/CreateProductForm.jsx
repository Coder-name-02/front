"use client";

import { useState } from "react";
import { categoryOptions, getBrandsForCategory } from "../../constants/categories";
import { handleAuthError } from "../../lib/apiAuth";
import { uploadProductImages } from "../../lib/uploadProductImages";
import ProductImageUpload from "./ProductImageUpload";
import SpecificationFields from "./SpecificationFields";

const emptyFormData = {
  title: "",
  ong_price: "",
  discount: "",
  stock: "",
  category: "",
  brand: "",
  description: "",
};

export default function CreateProductForm({ apiUrl, getAuthHeaders, onSuccess, mode = "create", initialData = null }) {
  const [formData, setFormData] = useState(
    initialData ? {
      title: initialData.title || "",
      ong_price: initialData.ong_price || "",
      discount: initialData.discount || "",
      stock: initialData.stock || "",
      category: initialData.category || "",
      brand: initialData.brand || "",
      description: initialData.description || "",
    } : emptyFormData
  );
  
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  
  const [specifications, setSpecifications] = useState(initialData?.specifications || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBrands = getBrandsForCategory(formData.category);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleRemoveExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setRemovedImageIds((prev) => [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authHeaders = await getAuthHeaders();
      if (!authHeaders) {
        alert("Please log in first.");
        return;
      }

      let uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadProductImages(imageFiles, authHeaders, apiUrl);
      }

      const payload = {
        product: {
          title: formData.title,
          ong_price: parseFloat(formData.ong_price),
          discount: parseFloat(formData.discount || 0),
          stock: parseInt(formData.stock, 10),
          category: parseInt(formData.category, 10),
          brand: formData.brand,
          description: formData.description,
        },
        image_urls: uploadedImageUrls,
        remove_image_ids: removedImageIds,
        specifications,
      };

      const url = mode === "edit" ? `${apiUrl}/api/v1/products/${initialData.id}` : `${apiUrl}/api/v1/products`;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      if (await handleAuthError(response)) return;

      if (response.ok) {
        alert(`Product ${mode === "edit" ? "updated" : "created"} successfully!`);
        if (mode === "create") {
          setFormData(emptyFormData);
          setImageFiles([]);
          setExistingImages([]);
          setRemovedImageIds([]);
          setSpecifications([]);
        }
        onSuccess?.();
      } else {
        const errData = await response.json().catch(() => ({}));
        const message = errData.errors?.join(", ") || errData.error || `Failed to ${mode} product`;
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || `Error ${mode === "edit" ? "updating" : "creating"} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow border-0" style={{ borderRadius: "12px" }}>
      <div className="card-body p-4 p-md-5">
        <h4 className="card-title mb-4 fw-bold text-primary">
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </h4>
        <form onSubmit={handleSubmit}>
          <ProductImageUpload
            imageFiles={imageFiles}
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            existingImages={existingImages}
            onRemoveExistingImage={handleRemoveExistingImage}
            isRequired={mode === "create"}
          />

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">Title <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control p-2 bg-light border-0"
                placeholder="Product Title"
                required
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Original Price ($) <span className="text-danger">*</span></label>
              <input
                type="number"
                step="0.01"
                className="form-control p-2 bg-light border-0"
                placeholder="0.00"
                required
                value={formData.ong_price}
                onChange={(e) => updateField("ong_price", e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Discount ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-control p-2 bg-light border-0"
                placeholder="0.00"
                value={formData.discount}
                onChange={(e) => updateField("discount", e.target.value)}
              />
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-bold">Category <span className="text-danger">*</span></label>
              <select
                className="form-select p-2 bg-light border-0"
                required
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, category: e.target.value, brand: "" }));
                }}
              >
                <option value="">Select Category</option>
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Brand <span className="text-danger">*</span></label>
              <select
                className="form-select p-2 bg-light border-0"
                required
                disabled={!formData.category}
                value={formData.brand}
                onChange={(e) => updateField("brand", e.target.value)}
              >
                <option value="">Select Brand</option>
                {availableBrands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Stock Quantity <span className="text-danger">*</span></label>
              <input
                type="number"
                className="form-control p-2 bg-light border-0"
                placeholder="0"
                required
                value={formData.stock}
                onChange={(e) => updateField("stock", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Description</label>
            <textarea
              className="form-control p-3 bg-light border-0"
              rows="4"
              placeholder="Enter product details..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <SpecificationFields
            specifications={specifications}
            onChange={setSpecifications}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
            style={{ borderRadius: "8px" }}
          >
            {isSubmitting ? "Uploading & Saving..." : mode === "edit" ? "Update Product" : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
