import React, { useEffect, useState } from "react";
import { getTemplates, createAppRequest } from "../services/api";

export default function NewAppRequest() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    app_name: "",
    description: "",
    template_name: "",
    environment: "dev",
    requires_database: false,
    requires_cache: false,
    ingress_type: "internal",
    owner_team: "",
  });

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await getTemplates();
        setTemplates(data.templates || []);
      } catch (err) {
        setError(err.message);
      }
    }

    loadTemplates();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const data = await createAppRequest(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h2>New App Request</h2>

      {error && (
        <div style={{ marginBottom: "1rem", color: "red" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label>Application Name</label>
          <br />
          <input
            name="app_name"
            value={form.app_name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Description</label>
          <br />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Template</label>
          <br />
          <select
            name="template_name"
            value={form.template_name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Environment</label>
          <br />
          <select
            name="environment"
            value={form.environment}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="dev">dev</option>
            <option value="stage">stage</option>
            <option value="prod">prod</option>
          </select>
        </div>

        <div>
          <label>Ingress Type</label>
          <br />
          <select
            name="ingress_type"
            value={form.ingress_type}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="internal">internal</option>
            <option value="public">public</option>
          </select>
        </div>

        <div>
          <label>Owner Team</label>
          <br />
          <input
            name="owner_team"
            value={form.owner_team}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <label>
          <input
            type="checkbox"
            name="requires_database"
            checked={form.requires_database}
            onChange={handleChange}
          />{" "}
          Requires Database
        </label>

        <label>
          <input
            type="checkbox"
            name="requires_cache"
            checked={form.requires_cache}
            onChange={handleChange}
          />{" "}
          Requires Cache
        </label>

        <button type="submit" style={{ padding: "0.75rem 1rem" }}>
          Create App Request
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Created Request</h3>
          <pre style={{ background: "#f5f5f5", padding: "1rem", overflowX: "auto" }}>
{JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
