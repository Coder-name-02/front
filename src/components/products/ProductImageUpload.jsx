export default function ProductImageUpload({ 
  imageFiles, 
  onChange, 
  inputId = "productImagesInput",
  existingImages = [],
  onRemoveExistingImage,
  isRequired = true
}) {
  return (
    <div className="mb-4 p-4 bg-light rounded border">
      <label className="form-label fw-bold d-block mb-3 text-secondary text-center">
        Product Images {isRequired && <span className="text-danger">*</span>}
      </label>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
          {existingImages.map((img) => (
            <div key={img.id} className="position-relative" style={{ width: "100px", height: "100px" }}>
              <img src={img.url} alt="Product" className="img-thumbnail w-100 h-100 object-fit-cover" />
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                style={{ width: "24px", height: "24px", lineHeight: "1" }}
                onClick={() => onRemoveExistingImage?.(img.id)}
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Images */}
      <div className="text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control d-none"
          id={inputId}
          onChange={onChange}
          required={isRequired && existingImages.length === 0}
        />
        <label htmlFor={inputId} className="btn btn-outline-primary px-4 py-2 fw-bold">
          {existingImages.length > 0 ? "Add More Images" : "Choose Images"}
        </label>
        
        {imageFiles.length > 0 && (
          <div className="mt-4">
            <p className="fw-bold mb-2 text-start small">New files to upload:</p>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {imageFiles.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div key={index} className="position-relative" style={{ width: "80px", height: "80px" }}>
                    <img src={previewUrl} alt="New Preview" className="img-thumbnail w-100 h-100 object-fit-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
