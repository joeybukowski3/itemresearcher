export type ItemCategory =
  | "refrigerator"
  | "washer"
  | "dryer"
  | "dishwasher"
  | "oven-range"
  | "microwave"
  | "hvac"
  | "water-heater"
  | "tv"
  | "laptop"
  | "desktop"
  | "tablet"
  | "smartphone"
  | "audio"
  | "camera"
  | "other";

export const CATEGORY_OPTIONS: { value: ItemCategory; label: string; group: string }[] = [
  { value: "refrigerator", label: "Refrigerator / Freezer", group: "Appliances" },
  { value: "washer", label: "Washing Machine", group: "Appliances" },
  { value: "dryer", label: "Dryer", group: "Appliances" },
  { value: "dishwasher", label: "Dishwasher", group: "Appliances" },
  { value: "oven-range", label: "Oven / Range / Stove", group: "Appliances" },
  { value: "microwave", label: "Microwave", group: "Appliances" },
  { value: "hvac", label: "HVAC / Air Conditioner", group: "Appliances" },
  { value: "water-heater", label: "Water Heater", group: "Appliances" },
  { value: "tv", label: "Television", group: "Electronics" },
  { value: "laptop", label: "Laptop", group: "Electronics" },
  { value: "desktop", label: "Desktop Computer", group: "Electronics" },
  { value: "tablet", label: "Tablet", group: "Electronics" },
  { value: "smartphone", label: "Smartphone", group: "Electronics" },
  { value: "audio", label: "Audio / Speakers", group: "Electronics" },
  { value: "camera", label: "Camera", group: "Electronics" },
  { value: "other", label: "Other", group: "Other" },
];

export interface SearchInput {
  brand: string;
  model: string;
  serial: string;
  description: string;
  category: ItemCategory | "";
}

export interface PricingSource {
  retailer: string;
  price: string;
  url?: string;
  isExactMatch: boolean;
}

export interface AgeEstimate {
  estimatedYear: string;
  estimatedAge: string;
  source: string;
  confidence: "high" | "medium" | "low";
}

export interface ResearchResult {
  itemName: string;
  description: string;
  specifications: string[];
  ageEstimate: AgeEstimate;
  originalMSRP: string;
  currentReplacement: {
    sameModel: PricingSource[];
    comparable: PricingSource[];
  };
  confidence: {
    level: "high" | "medium" | "low";
    explanation: string;
    suggestions: string[];
  };
  searchTermUsed: string;
}
