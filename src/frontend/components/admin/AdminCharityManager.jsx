"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  image_url: "",
  impact_goal_percent: 0,
  impact_metric: "",
  impact_value: "",
  is_featured: false,
  total_raised: 0,
};

export default function AdminCharityManager({ charities = [] }) {
  const router = useRouter();
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setSelectedCharity(null);
    setFormState(EMPTY_FORM);
    setError("");
  }

  function startEdit(charity) {
    setSelectedCharity(charity);
    setFormState({
      name: charity.name || "",
      description: charity.description || "",
      category: charity.category || "",
      image_url: charity.image_url || "",
      impact_goal_percent: charity.impact_goal_percent || 0,
      impact_metric: charity.impact_metric || "",
      impact_value: charity.impact_value || "",
      is_featured: Boolean(charity.is_featured),
      total_raised: Number(charity.total_raised || 0),
    });
    setError("");
  }

  function updateField(key, value) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const method = selectedCharity ? "PATCH" : "POST";
    const response = await fetch("/api/charities", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        selectedCharity ? { id: selectedCharity.id, ...formState } : formState
      ),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to save charity.");
      setSaving(false);
      return;
    }

    setSaving(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete(charity) {
    const confirmed = window.confirm(
      `Delete ${charity.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    const response = await fetch("/api/charities", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: charity.id }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Unable to delete charity.");
      return;
    }

    if (selectedCharity?.id === charity.id) {
      resetForm();
    }

    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
      <div className="xl:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-2xl">Live Charity List</h2>
          <button
            onClick={resetForm}
            className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md"
          >
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  {charity.category}
                </span>
                {charity.is_featured ? (
                  <span className="text-[9px] bg-tertiary-fixed-dim text-black px-2 py-0.5 rounded font-bold uppercase">
                    Featured
                  </span>
                ) : null}
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">
                {charity.name}
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                {charity.description}
              </p>
              <div className="text-xs text-outline space-y-1 mb-6">
                <p>Raised: ${Number(charity.total_raised || 0).toLocaleString()}</p>
                <p>Impact Goal: {charity.impact_goal_percent || 0}%</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(charity)}
                  className="flex-1 py-2 bg-surface-container-high text-primary font-bold text-[10px] uppercase tracking-widest rounded hover:bg-secondary hover:text-white transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(charity)}
                  className="py-2 px-3 bg-surface-container-high text-error font-bold text-[10px] uppercase tracking-widest rounded hover:bg-error hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-2 bg-surface-container-lowest p-6 rounded-xl h-fit">
        <h2 className="font-headline font-bold text-2xl mb-6">
          {selectedCharity ? "Edit Charity" : "Create Charity"}
        </h2>

        {error ? (
          <div className="bg-error-container text-on-error-container px-4 py-3 text-sm rounded-lg mb-4">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Charity name"
            className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            required
          />
          <input
            value={formState.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Category"
            className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            required
          />
          <textarea
            value={formState.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Description"
            rows={4}
            className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            required
          />
          <input
            value={formState.image_url}
            onChange={(event) => updateField("image_url", event.target.value)}
            placeholder="Image URL"
            className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              max="100"
              value={formState.impact_goal_percent}
              onChange={(event) =>
                updateField("impact_goal_percent", Number(event.target.value))
              }
              placeholder="Impact Goal %"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={formState.total_raised}
              onChange={(event) =>
                updateField("total_raised", Number(event.target.value))
              }
              placeholder="Total Raised"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              value={formState.impact_metric}
              onChange={(event) => updateField("impact_metric", event.target.value)}
              placeholder="Impact Metric"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            />
            <input
              value={formState.impact_value}
              onChange={(event) => updateField("impact_value", event.target.value)}
              placeholder="Impact Value"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-secondary"
            />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={formState.is_featured}
              onChange={(event) => updateField("is_featured", event.target.checked)}
            />
            Featured charity
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : selectedCharity
                ? "Update Charity"
                : "Create Charity"}
          </button>
        </form>
      </div>
    </div>
  );
}
