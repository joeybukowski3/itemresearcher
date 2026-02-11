import type { SearchInput, ResearchResult } from "@/types";

/**
 * Generates realistic demo results based on user input.
 * Used when no ANTHROPIC_API_KEY is configured (demo/test mode).
 */
export function generateDemoResult(input: SearchInput): ResearchResult {
  const brand = input.brand?.trim() || "";
  const model = input.model?.trim() || "";
  const category = input.category || "";
  const hasSerial = !!input.serial?.trim();
  const hasDescription = !!input.description?.trim();

  // Determine confidence based on how much info was provided
  const infoCount = [brand, model, input.serial, input.description].filter(Boolean).length;
  const confidenceLevel: "high" | "medium" | "low" =
    brand && model ? "high" : infoCount >= 2 ? "medium" : "low";

  // Build item name from what we have
  const itemName = buildItemName(brand, model, category, input.description);

  // Pick a demo profile based on category or guess from input
  const profile = getDemoProfile(brand, model, category, input.description);

  const suggestions: string[] = [];
  if (!brand) suggestions.push("Provide the brand/manufacturer for more accurate identification");
  if (!model) suggestions.push("Provide the model number for exact specifications and pricing");
  if (!hasSerial) suggestions.push("Provide the serial number for precise manufacture date");
  if (!category) suggestions.push("Select a category to narrow down comparable models");

  const confidenceExplanation =
    confidenceLevel === "high"
      ? "Brand and model number were provided, allowing for specific product identification."
      : confidenceLevel === "medium"
        ? "Some identifying information was provided, but results may be approximate without a full brand and model number."
        : "Limited information was provided. Results are estimated based on the description and category. Accuracy will improve significantly with a brand and model number.";

  return {
    itemName,
    description: profile.description,
    specifications: profile.specifications,
    ageEstimate: {
      estimatedYear: profile.year,
      estimatedAge: profile.age,
      source: hasSerial
        ? `Serial number format analysis per ${brand || "manufacturer"} encoding standards (DEMO DATA)`
        : `Based on model lineup release history and earliest online reviews (DEMO DATA)`,
      confidence: hasSerial ? "high" : brand && model ? "medium" : "low",
    },
    originalMSRP: profile.originalMSRP,
    currentReplacement: {
      sameModel: profile.sameModel,
      comparable: profile.comparable,
    },
    confidence: {
      level: confidenceLevel,
      explanation: confidenceExplanation,
      suggestions,
    },
    searchTermUsed: [brand, model, getCategoryLabel(category)].filter(Boolean).join(" "),
  };
}

function buildItemName(
  brand: string,
  model: string,
  category: string,
  description?: string,
): string {
  if (brand && model) return `${brand} ${model}`;
  if (brand && category) return `${brand} ${getCategoryLabel(category)}`;
  if (brand) return `${brand} (model unknown)`;
  if (model) return `Model ${model}`;
  if (description) {
    const words = description.split(" ").slice(0, 5).join(" ");
    return words.length < description.length ? `${words}...` : words;
  }
  return "Unknown Item";
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    refrigerator: "Refrigerator",
    washer: "Washing Machine",
    dryer: "Dryer",
    dishwasher: "Dishwasher",
    "oven-range": "Oven/Range",
    microwave: "Microwave",
    hvac: "HVAC System",
    "water-heater": "Water Heater",
    tv: "Television",
    laptop: "Laptop",
    desktop: "Desktop Computer",
    tablet: "Tablet",
    smartphone: "Smartphone",
    audio: "Audio System",
    camera: "Camera",
  };
  return map[category] || "";
}

interface DemoProfile {
  description: string;
  specifications: string[];
  year: string;
  age: string;
  originalMSRP: string;
  sameModel: { retailer: string; price: string; isExactMatch: boolean }[];
  comparable: { retailer: string; price: string; isExactMatch: boolean }[];
}

function getDemoProfile(
  brand: string,
  model: string,
  category: string,
  description?: string,
): DemoProfile {
  const effectiveCategory = category || guessCategory(brand, model, description);

  switch (effectiveCategory) {
    case "refrigerator":
      return {
        description: `${brand || "This"} ${model || "refrigerator"} is a French door refrigerator with an ice maker and water dispenser. It features a stainless steel exterior, adjustable shelving, and energy-efficient operation. This model was positioned as a mid-range to premium offering in the manufacturer's lineup.`,
        specifications: [
          "Capacity: 26.5 cu. ft. total (18.6 fridge / 7.9 freezer)",
          "Dimensions: 35.75\" W x 70\" H x 33.75\" D",
          "Energy Star certified — estimated 687 kWh/year",
          "French door configuration with bottom freezer drawer",
          "Built-in ice maker and filtered water dispenser",
        ],
        year: "2020-2021",
        age: "4-5 years old (as of 2025)",
        originalMSRP: "$1,799 - $2,099",
        sameModel: model
          ? [{ retailer: "Lowe's", price: "$1,899", isExactMatch: true }]
          : [],
        comparable: [
          { retailer: "Home Depot", price: "$1,998", isExactMatch: false },
          { retailer: "Best Buy", price: "$2,099", isExactMatch: false },
          { retailer: "Lowe's", price: "$1,849", isExactMatch: false },
        ],
      };

    case "washer":
      return {
        description: `${brand || "This"} ${model || "washing machine"} is a front-load washer with steam cleaning capability and vibration reduction technology. It offers multiple wash cycles including sanitize and allergen settings. This unit was marketed as a high-efficiency model in the mid-range price segment.`,
        specifications: [
          "Capacity: 4.5 cu. ft. drum",
          "Spin speed: Up to 1,200 RPM",
          "Energy Star certified — uses approximately 15 gallons per cycle",
          "Steam cleaning and sanitize cycle",
          "10+ wash cycles including delicates, heavy duty, and quick wash",
        ],
        year: "2021-2022",
        age: "3-4 years old (as of 2025)",
        originalMSRP: "$849 - $999",
        sameModel: model
          ? [{ retailer: "Home Depot", price: "$899", isExactMatch: true }]
          : [],
        comparable: [
          { retailer: "Lowe's", price: "$949", isExactMatch: false },
          { retailer: "Best Buy", price: "$899", isExactMatch: false },
          { retailer: "Home Depot", price: "$999", isExactMatch: false },
        ],
      };

    case "dryer":
      return {
        description: `${brand || "This"} ${model || "dryer"} is an electric dryer with sensor dry technology and a large-capacity drum. It features multiple drying cycles and a wrinkle-prevention option. Positioned in the mid-range of the manufacturer's laundry lineup.`,
        specifications: [
          "Capacity: 7.4 cu. ft. drum",
          "Electric, 240V connection",
          "Sensor dry technology with moisture sensors",
          "Steam refresh cycle",
          "12 drying cycles including air dry, delicates, and heavy duty",
        ],
        year: "2021-2022",
        age: "3-4 years old (as of 2025)",
        originalMSRP: "$749 - $899",
        sameModel: [],
        comparable: [
          { retailer: "Lowe's", price: "$849", isExactMatch: false },
          { retailer: "Best Buy", price: "$799", isExactMatch: false },
          { retailer: "Home Depot", price: "$899", isExactMatch: false },
        ],
      };

    case "dishwasher":
      return {
        description: `${brand || "This"} ${model || "dishwasher"} is a built-in dishwasher with a stainless steel tub and third rack for utensils. It features quiet operation and multiple wash cycle options. A solid mid-range model with good capacity and efficiency.`,
        specifications: [
          "Place settings: 14",
          "Noise level: 44 dBA",
          "Stainless steel interior tub",
          "Third rack for flatware and utensils",
          "Energy Star certified — estimated 269 kWh/year",
        ],
        year: "2022",
        age: "3 years old (as of 2025)",
        originalMSRP: "$649 - $799",
        sameModel: model
          ? [{ retailer: "Best Buy", price: "$749", isExactMatch: true }]
          : [],
        comparable: [
          { retailer: "Lowe's", price: "$699", isExactMatch: false },
          { retailer: "Home Depot", price: "$749", isExactMatch: false },
        ],
      };

    case "tv":
      return {
        description: `${brand || "This"} ${model || "television"} is a 4K UHD Smart TV with HDR support and built-in streaming apps. It features a sleek design with thin bezels and supports both Wi-Fi and Bluetooth connectivity. Positioned as a popular mainstream model.`,
        specifications: [
          "Display: 55\" 4K UHD (3840 x 2160)",
          "HDR10 and HLG support",
          "Smart TV platform with built-in streaming apps",
          "Refresh rate: 60Hz native (120Hz motion processing)",
          "3 HDMI ports, 2 USB ports, Wi-Fi 5, Bluetooth 5.0",
        ],
        year: "2022-2023",
        age: "2-3 years old (as of 2025)",
        originalMSRP: "$549 - $699",
        sameModel: [],
        comparable: [
          { retailer: "Best Buy", price: "$449", isExactMatch: false },
          { retailer: "Amazon", price: "$429", isExactMatch: false },
          { retailer: "Walmart", price: "$398", isExactMatch: false },
        ],
      };

    case "laptop":
      return {
        description: `${brand || "This"} ${model || "laptop"} is a portable computer designed for everyday productivity and light multimedia use. It features a modern processor, solid-state storage, and a full HD display. A reliable mid-range option for home and office use.`,
        specifications: [
          "Processor: Intel Core i5 / AMD Ryzen 5 (11th/12th Gen equivalent)",
          "Memory: 8GB DDR4 RAM",
          "Storage: 256GB NVMe SSD",
          "Display: 15.6\" FHD (1920 x 1080) IPS",
          "Battery life: Up to 8 hours, USB-C charging supported",
        ],
        year: "2022-2023",
        age: "2-3 years old (as of 2025)",
        originalMSRP: "$599 - $749",
        sameModel: [],
        comparable: [
          { retailer: "Best Buy", price: "$599", isExactMatch: false },
          { retailer: "Amazon", price: "$549", isExactMatch: false },
          { retailer: "Walmart", price: "$529", isExactMatch: false },
        ],
      };

    default:
      return {
        description: `${brand || "This item"} ${model ? `(model ${model})` : ""} is an appliance or electronic device. Based on the limited information provided, this appears to be a standard consumer-grade product. More specific details require additional identifying information such as brand and model number.`,
        specifications: [
          "Category: General appliance/electronic",
          "Further specifications require brand and model number",
          "Check the item's label or manual for detailed specs",
        ],
        year: "2020-2023",
        age: "2-5 years old (estimated, as of 2025)",
        originalMSRP: "$200 - $1,500 (broad estimate without model info)",
        sameModel: [],
        comparable: [
          { retailer: "Best Buy", price: "$300 - $1,200", isExactMatch: false },
          { retailer: "Amazon", price: "$250 - $1,100", isExactMatch: false },
        ],
      };
  }
}

function guessCategory(
  brand: string,
  model: string,
  description?: string,
): string {
  const text = `${brand} ${model} ${description || ""}`.toLowerCase();

  if (/fridge|refrigerat|freezer/.test(text)) return "refrigerator";
  if (/wash(?:er|ing)/.test(text)) return "washer";
  if (/dry(?:er|ing)/.test(text)) return "dryer";
  if (/dishwash/.test(text)) return "dishwasher";
  if (/oven|range|stove|cooktop/.test(text)) return "oven-range";
  if (/microwave/.test(text)) return "microwave";
  if (/hvac|air\s*condition|furnace|heat\s*pump/.test(text)) return "hvac";
  if (/water\s*heat/.test(text)) return "water-heater";
  if (/tv|television|oled|qled/.test(text)) return "tv";
  if (/laptop|notebook|chromebook/.test(text)) return "laptop";
  if (/desktop|pc|tower/.test(text)) return "desktop";
  if (/tablet|ipad/.test(text)) return "tablet";
  if (/phone|iphone|galaxy\s*s/.test(text)) return "smartphone";
  if (/speaker|soundbar|audio|headphone/.test(text)) return "audio";
  if (/camera|dslr|mirrorless/.test(text)) return "camera";

  return "other";
}
