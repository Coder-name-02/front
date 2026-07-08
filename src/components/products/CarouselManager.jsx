"use client";

import { useState, useEffect, useCallback } from "react";
import { handleAuthError } from "../../lib/apiAuth";
import { uploadProductImages } from "../../lib/uploadProductImages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

export default function CarouselManager({ getAuthHeaders }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [editingSlide, setEditingSlide] = useState(null); // null = create mode
  const [imageFile, setImageFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch ALL slides (including inactive) for admin.
      // The public index only returns active ones, so we'll fetch all
      // using auth headers so the admin can manage hidden slides too.
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API_URL}/api/v1/carousel_images?all=true`, { headers });
      if (await handleAuthError(res)) return;
      if (res.ok) {
        setSlides(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch carousel slides:", err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const resetForm = () => {
    setEditingSlide(null);
    setImageFile(null);
    setLinkUrl("");
    setPosition("");
    setIsActive(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setLinkUrl(slide.link_url || "");
    setPosition(slide.position || "");
    setIsActive(slide.is_active);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        alert("Please log in first.");
        return;
      }

      let imageUrl = editingSlide?.image_url || "";
      let imagekitId = editingSlide?.imagekit_id || "";

      // Upload new image if selected
      if (imageFile) {
        const uploads = await uploadProductImages([imageFile], headers, API_URL);
        imageUrl = uploads[0].url;
        imagekitId = uploads[0].fileId;
      }

      if (!editingSlide && !imageUrl) {
        alert("Please select an image to upload.");
        return;
      }

      const payload = {
        image_url: imageUrl,
        imagekit_id: imagekitId,
        link_url: linkUrl || null,
        position: parseInt(position, 10) || slides.length + 1,
        is_active: isActive,
      };

      const url = editingSlide
        ? `${API_URL}/api/v1/carousel_images/${editingSlide.id}`
        : `${API_URL}/api/v1/carousel_images`;
      const method = editingSlide ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
      });

      if (await handleAuthError(res)) return;

      if (res.ok || res.status === 201) {
        alert(`Slide ${editingSlide ? "updated" : "created"} successfully!`);
        resetForm();
        fetchSlides();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.errors?.join(", ") || "Failed to save slide.");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Error saving carousel slide.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API_URL}/api/v1/carousel_images/${id}`, {
        method: "DELETE",
        headers,
      });

      if (await handleAuthError(res)) return;

      if (res.ok || res.status === 204) {
        setSlides(slides.filter((s) => s.id !== id));
      } else {
        alert("Failed to delete slide.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting slide.");
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API_URL}/api/v1/carousel_images/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ is_active: !slide.is_active }),
      });

      if (await handleAuthError(res)) return;

      if (res.ok) {
        setSlides(slides.map((s) =>
          s.id === slide.id ? { ...s, is_active: !s.is_active } : s
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* ── Form ── */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
        <div className="card-body p-4">
          <h5 className="fw-bold text-primary mb-3">
            {editingSlide ? "Edit Slide" : "Add New Slide"}
          </h5>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                Banner Image {!editingSlide && <span className="text-danger">*</span>}
              </label>

              {/* Show existing image when editing */}
              {editingSlide?.image_url && !imageFile && (
                <div className="mb-2">
                  <img
                    src={editingSlide.image_url}
                    alt="Current banner"
                    className="rounded border"
                    style={{ maxHeight: "120px", objectFit: "cover" }}
                  />
                  <p className="small text-muted mt-1 mb-0">Current image (select a new file to replace)</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="form-control bg-light border-0"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required={!editingSlide}
              />

              {imageFile && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="New Preview"
                    className="rounded border"
                    style={{ maxHeight: "120px", objectFit: "cover" }}
                  />
                  <p className="small text-muted mt-1 mb-0">New file: {imageFile.name}</p>
                </div>
              )}
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-5">
                <label className="form-label fw-bold">Link URL</label>
                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="e.g. /products/5 (optional)"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  Position <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control bg-light border-0"
                  placeholder={`${slides.length + 1}`}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="isActiveSwitch"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <label className="form-check-label fw-bold" htmlFor="isActiveSwitch">
                    Active (visible on homepage)
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-4 py-2"
                disabled={isSubmitting}
                style={{ borderRadius: "8px" }}
              >
                {isSubmitting
                  ? "Uploading & Saving..."
                  : editingSlide
                  ? "Update Slide"
                  : "Add Slide"}
              </button>

              {editingSlide && (
                <button
                  type="button"
                  className="btn btn-outline-secondary fw-bold px-4 py-2"
                  onClick={resetForm}
                  style={{ borderRadius: "8px" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Slides List ── */}
      <h5 className="fw-bold mb-3">All Slides ({slides.length})</h5>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <span style={{ fontSize: "3rem" }}>🖼️</span>
          <p className="mt-2">No carousel slides yet. Add one above!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle bg-white shadow-sm rounded" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th style={{ width: "180px" }}>Preview</th>
                <th>Link URL</th>
                <th style={{ width: "100px" }}>Status</th>
                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id} style={{ opacity: slide.is_active ? 1 : 0.5 }}>
                  <td className="fw-bold">{slide.position}</td>
                  <td>
                    <img
                      src={slide.image_url}
                      alt={`Slide ${slide.position}`}
                      className="rounded border"
                      style={{ height: "60px", width: "140px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    {slide.link_url ? (
                      <code className="small">{slide.link_url}</code>
                    ) : (
                      <span className="text-muted small">No link</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm fw-bold ${
                        slide.is_active
                          ? "btn-success"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => handleToggleActive(slide)}
                      style={{ borderRadius: "20px", fontSize: "0.75rem" }}
                    >
                      {slide.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleEdit(slide)}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleDelete(slide.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
