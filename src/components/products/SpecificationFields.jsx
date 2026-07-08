export default function SpecificationFields({ specifications, onChange }) {
  const updateSpec = (index, field, value) => {
    const next = specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    onChange(next);
  };

  const removeSpec = (index) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    onChange([...specifications, { title: "", data: "" }]);
  };

  return (
    <div className="mb-4 p-4 bg-light rounded border">
      <label className="form-label fw-bold d-block mb-3 text-secondary">Specifications</label>
      {specifications.map((spec, index) => (
        <div key={index} className="row g-2 mb-2 align-items-center">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Title (e.g., Battery)"
              value={spec.title}
              onChange={(e) => updateSpec(index, "title", e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Data (e.g., 3000mah)"
              value={spec.data}
              onChange={(e) => updateSpec(index, "data", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 text-end">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeSpec(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm mt-2 fw-bold"
        onClick={addSpec}
      >
        + Add Specification
      </button>
    </div>
  );
}
