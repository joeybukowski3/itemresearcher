"use client";

import { useState } from "react";
import { CATEGORY_OPTIONS, type ItemCategory, type SearchInput } from "@/types";

interface SearchFormProps {
  onSearch: (input: SearchInput) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory | "">("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasInput = brand || model || serial || description;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasInput) return;
    onSearch({ brand, model, serial, description, category });
  }

  const groups = CATEGORY_OPTIONS.reduce(
    (acc, opt) => {
      if (!acc[opt.group]) acc[opt.group] = [];
      acc[opt.group].push(opt);
      return acc;
    },
    {} as Record<string, typeof CATEGORY_OPTIONS>,
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Primary search area */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col gap-4">
          {/* Brand + Model row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-muted mb-1"
              >
                Brand / Manufacturer
              </label>
              <input
                id="brand"
                type="text"
                placeholder="e.g. Samsung, Whirlpool, LG"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-muted mb-1"
              >
                Model Number
              </label>
              <input
                id="model"
                type="text"
                placeholder="e.g. WF45R6100AW"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category selector */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-muted mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory | "")}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            >
              <option value="">Select a category (optional)</option>
              {Object.entries(groups).map(([group, options]) => (
                <optgroup key={group} label={group}>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Toggle advanced fields */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-primary hover:text-primary-hover transition-colors text-left flex items-center gap-1"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {showAdvanced ? "Fewer fields" : "More fields (serial number, description)"}
          </button>

          {/* Advanced fields */}
          {showAdvanced && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <div>
                <label
                  htmlFor="serial"
                  className="block text-sm font-medium text-muted mb-1"
                >
                  Serial Number
                </label>
                <input
                  id="serial"
                  type="text"
                  placeholder="Found on the item's label or tag"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <p className="text-xs text-muted mt-1">
                  Serial numbers can help determine manufacture date and specific configuration.
                </p>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-muted mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={2}
                  placeholder="Describe the item if you don't have brand/model info (e.g. stainless steel French door refrigerator, about 5 years old)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!hasInput || isLoading}
            className="w-full py-3 px-6 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Researching...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Research Item
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-muted mt-3">
        Provide as much information as possible for the most accurate results.
        At minimum, enter a brand and model number or a description.
      </p>
    </form>
  );
}
