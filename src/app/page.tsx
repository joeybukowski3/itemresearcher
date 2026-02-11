"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import type { SearchInput, ResearchResult } from "@/types";

export default function Home() {
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(input: SearchInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data as ResearchResult);
    } catch {
      setError("Failed to connect to the research service. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-primary"
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
          <div>
            <h1 className="text-lg font-bold text-foreground">Item Researcher</h1>
            <p className="text-sm text-muted">Appliance &amp; Electronics Lookup</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Search section */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Research Any Appliance or Electronic
            </h2>
            <p className="text-muted max-w-lg mx-auto">
              Enter what you know about the item and we&apos;ll provide specifications,
              age, original pricing, and current replacement costs.
            </p>
          </div>
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12 animate-pulse-subtle">
            <div className="inline-flex items-center gap-3 text-muted">
              <svg
                className="animate-spin h-6 w-6 text-primary"
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
              <span className="text-lg">Researching your item...</span>
            </div>
            <p className="text-sm text-muted mt-2">
              Analyzing specifications, pricing, and availability from major retailers.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-red-800">Research Failed</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && <ResultsDisplay result={result} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-muted">
          <p>
            Pricing sourced from major retailers including Best Buy, Lowe&apos;s, Home Depot, Walmart, Amazon, and manufacturer stores.
          </p>
          <p className="mt-1">
            All estimates are approximate. Verify pricing directly with retailers for the most current information.
          </p>
        </div>
      </footer>
    </div>
  );
}
