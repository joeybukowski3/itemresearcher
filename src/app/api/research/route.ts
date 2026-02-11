import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { SearchInput, ResearchResult } from "@/types";

const anthropic = new Anthropic();

function buildPrompt(input: SearchInput): string {
  const parts: string[] = [];

  if (input.brand) parts.push(`Brand: ${input.brand}`);
  if (input.model) parts.push(`Model: ${input.model}`);
  if (input.serial) parts.push(`Serial Number: ${input.serial}`);
  if (input.category) parts.push(`Category: ${input.category}`);
  if (input.description) parts.push(`Description: ${input.description}`);

  const itemInfo = parts.join("\n");

  return `You are an expert product researcher specializing in appliances and electronics. A user wants to research an item with the following information:

${itemInfo}

Based on this information, provide a detailed research report. You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) matching this exact structure:

{
  "itemName": "Full product name (Brand + Model Name + Model Number if known)",
  "description": "A brief 2-3 sentence description of the item, what it is, its key features, and its market position.",
  "specifications": [
    "Key spec 1 (e.g., capacity, dimensions, power, resolution)",
    "Key spec 2",
    "Key spec 3",
    "Key spec 4",
    "Key spec 5"
  ],
  "ageEstimate": {
    "estimatedYear": "YYYY or YYYY-YYYY range",
    "estimatedAge": "X years old (as of 2025)",
    "source": "How you determined this - e.g., 'Model number decoding per manufacturer serial format', 'First press release/review found online dated YYYY', 'Based on model lineup release history', etc.",
    "confidence": "high | medium | low"
  },
  "originalMSRP": "$X,XXX (or range like $X,XXX - $X,XXX)",
  "currentReplacement": {
    "sameModel": [
      {
        "retailer": "Retailer name (Best Buy, Lowes, Home Depot, Walmart, Amazon, or manufacturer)",
        "price": "$X,XXX",
        "isExactMatch": true
      }
    ],
    "comparable": [
      {
        "retailer": "Retailer name",
        "price": "$X,XXX",
        "isExactMatch": false
      }
    ]
  },
  "confidence": {
    "level": "high | medium | low",
    "explanation": "Why this confidence level - what info was available vs missing",
    "suggestions": ["Suggestion to improve results, e.g., 'Provide the model number for exact specifications'"]
  },
  "searchTermUsed": "The search term you would use to find this item online"
}

IMPORTANT RULES:
1. For pricing, ONLY reference major retailers: Best Buy, Lowe's, Home Depot, Walmart, Amazon, or the manufacturer's own store. Prioritize these sources in order of reliability for the product category.
2. For age estimation, explain your methodology clearly. If using serial number decoding, cite the manufacturer's known serial format. If using release dates, cite the earliest reviews or press releases you're aware of.
3. If the user provided limited information, still provide your best estimate but set confidence to "low" and explain what's missing in the suggestions array.
4. For the "sameModel" pricing array, only include entries if the exact same model (or its direct successor) is still sold. Otherwise leave it empty.
5. For "comparable" pricing, find 2-3 current models from major retailers that would serve as a like-for-like replacement.
6. All prices should be in USD.
7. Be specific and factual. Do not make up prices or specifications. If unsure, provide reasonable ranges and note the uncertainty.`;
}

function parseResponse(text: string): ResearchResult {
  // Strip any markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  // Validate and provide defaults for required fields
  return {
    itemName: parsed.itemName || "Unknown Item",
    description: parsed.description || "No description available.",
    specifications: Array.isArray(parsed.specifications) ? parsed.specifications : [],
    ageEstimate: {
      estimatedYear: parsed.ageEstimate?.estimatedYear || "Unknown",
      estimatedAge: parsed.ageEstimate?.estimatedAge || "Unknown",
      source: parsed.ageEstimate?.source || "Unable to determine",
      confidence: parsed.ageEstimate?.confidence || "low",
    },
    originalMSRP: parsed.originalMSRP || "Unknown",
    currentReplacement: {
      sameModel: Array.isArray(parsed.currentReplacement?.sameModel)
        ? parsed.currentReplacement.sameModel
        : [],
      comparable: Array.isArray(parsed.currentReplacement?.comparable)
        ? parsed.currentReplacement.comparable
        : [],
    },
    confidence: {
      level: parsed.confidence?.level || "low",
      explanation: parsed.confidence?.explanation || "Limited information provided.",
      suggestions: Array.isArray(parsed.confidence?.suggestions)
        ? parsed.confidence.suggestions
        : [],
    },
    searchTermUsed: parsed.searchTermUsed || "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const input: SearchInput = await request.json();

    // Validate that at least some input was provided
    if (!input.brand && !input.model && !input.serial && !input.description) {
      return NextResponse.json(
        { error: "Please provide at least a brand, model, serial number, or description." },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(input);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Failed to get a response from the research engine." },
        { status: 500 },
      );
    }

    const result = parseResponse(textBlock.text);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Research API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse research results. Please try again." },
        { status: 500 },
      );
    }

    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
