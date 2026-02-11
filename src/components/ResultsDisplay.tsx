"use client";

import type { ResearchResult } from "@/types";

interface ResultsDisplayProps {
  result: ResearchResult;
}

function ConfidenceBadge({
  level,
}: {
  level: "high" | "medium" | "low";
}) {
  const config = {
    high: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "High Confidence" },
    medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Medium Confidence" },
    low: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Low Confidence - Estimated" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${c.bg} ${c.text}`}>
      <span className={`w-2 h-2 rounded-full ${level === "high" ? "bg-green-500" : level === "medium" ? "bg-amber-500" : "bg-red-500"}`} />
      {c.label}
    </span>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg p-5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wide flex items-center gap-2 mb-3">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function PricingRow({
  source,
}: {
  source: { retailer: string; price: string; url?: string; isExactMatch: boolean };
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground">{source.retailer}</span>
        {!source.isExactMatch && (
          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200">
            comparable
          </span>
        )}
      </div>
      <span className="font-semibold text-foreground">{source.price}</span>
    </div>
  );
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-foreground">{result.itemName}</h2>
          <ConfidenceBadge level={result.confidence.level} />
        </div>
        <p className="text-foreground/80 leading-relaxed">{result.description}</p>
      </div>

      {/* Confidence warning if not high */}
      {result.confidence.level !== "high" && (
        <div className={`rounded-lg border p-4 mb-4 ${result.confidence.level === "medium" ? "bg-amber-50/50 border-amber-200" : "bg-red-50/50 border-red-200"}`}>
          <p className={`text-sm font-medium mb-1 ${result.confidence.level === "medium" ? "text-amber-800" : "text-red-800"}`}>
            {result.confidence.explanation}
          </p>
          {result.confidence.suggestions.length > 0 && (
            <div className="mt-2">
              <p className={`text-xs font-medium mb-1 ${result.confidence.level === "medium" ? "text-amber-700" : "text-red-700"}`}>
                To improve results:
              </p>
              <ul className={`text-xs list-disc list-inside ${result.confidence.level === "medium" ? "text-amber-600" : "text-red-600"}`}>
                {result.confidence.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {/* Specifications */}
        {result.specifications.length > 0 && (
          <Section
            title="Key Specifications"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <ul className="space-y-1.5">
              {result.specifications.map((spec, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-primary mt-1 shrink-0">&#8226;</span>
                  {spec}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Age Estimate */}
        <Section
          title="Estimated Age"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground">
                {result.ageEstimate.estimatedAge}
              </span>
              <span className="text-sm text-muted">
                (approx. {result.ageEstimate.estimatedYear})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Source: {result.ageEstimate.source}</span>
            </div>
            <ConfidenceBadge level={result.ageEstimate.confidence} />
          </div>
        </Section>

        {/* Original MSRP */}
        <Section
          title="Original Market Price"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        >
          <p className="text-2xl font-bold text-foreground">{result.originalMSRP}</p>
          <p className="text-sm text-muted mt-1">Estimated price when introduced to market</p>
        </Section>

        {/* Replacement Costs */}
        <Section
          title="Current Replacement Costs"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          {result.currentReplacement.sameModel.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Same / Equivalent Model</h4>
              {result.currentReplacement.sameModel.map((s, i) => (
                <PricingRow key={i} source={s} />
              ))}
            </div>
          )}
          {result.currentReplacement.comparable.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Comparable New Models</h4>
              {result.currentReplacement.comparable.map((s, i) => (
                <PricingRow key={i} source={s} />
              ))}
            </div>
          )}
          {result.currentReplacement.sameModel.length === 0 &&
            result.currentReplacement.comparable.length === 0 && (
              <p className="text-sm text-muted">No pricing data available.</p>
            )}
        </Section>
      </div>
    </div>
  );
}
