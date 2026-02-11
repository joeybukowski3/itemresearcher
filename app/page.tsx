"use client";
import React, { useState } from 'react';
import { Search, Info } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // DEMO MODE SIMULATION
    // This pretends to search so you can see the UI working
    setTimeout(() => {
      setResults({
        name: "Samsung Front-Load Washer (WF45R6100AW)",
        age: "~4 years (Manufactured 2020)",
        source: "Serial number decoding via Samsung Technical Guide",
        msrp: "$899.00",
        replacement: "$748.00 - $949.00 (Best Buy / Lowe's)",
        confidence: "High",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Item Researcher &nbsp;
          <span className="font-bold text-blue-600">Demo Mode</span>
        </p>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">What are we researching?</h1>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-lg">
          <input 
            type="text" 
            placeholder="Brand (e.g. Samsung)" 
            className="p-3 border rounded-lg text-black"
          />
          <input 
            type="text" 
            placeholder="Model Number" 
            className="p-3 border rounded-lg text-black"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2"
          >
            {loading ? "Searching..." : "Research Item"} <Search size={18} />
          </button>
        </form>

        {results && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 text-black">
            <h2 className="text-xl font-bold mb-4">{results.name}</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Estimated Age</span>
                <span className="font-medium">{results.age}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Original MSRP</span>
                <span className="font-medium">{results.msrp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Replacement Cost</span>
                <span className="font-bold text-blue-600">{results.replacement}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400 bg-gray-100 p-2 rounded flex gap-2">
              <Info size={16} /> Source: {results.source}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
