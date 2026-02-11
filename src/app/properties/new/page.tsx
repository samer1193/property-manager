"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";
import type { PropertyType } from "@/types";

const propertyTypes: { value: PropertyType; label: string; icon: string }[] = [
  { value: "rental_home", label: "Rental Home", icon: "🏠" },
  { value: "condo", label: "Condo", icon: "🏢" },
  { value: "apartment", label: "Apartment Building", icon: "🏗️" },
  { value: "plaza", label: "Plaza / Strip Mall", icon: "🏬" },
  { value: "commercial", label: "Commercial", icon: "🏪" },
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { addProperty } = useData();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "rental_home" as PropertyType,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    units: "",
    purchasePrice: "",
    purchaseDate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addProperty({
      name: formData.name,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      units: formData.units ? parseInt(formData.units) : undefined,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      purchaseDate: formData.purchaseDate || undefined,
      notes: formData.notes || undefined,
    });

    router.push("/properties");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      
      <main className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/properties"
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              ← Back to Properties
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-slate-100">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Enter the details of your property
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6">
              {/* Property Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: type.value }))
                      }
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left transition ${
                        formData.type === type.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Property Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Oak Street Duplex"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="IL"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Units (for multi-unit properties) */}
              {["apartment", "plaza", "commercial"].includes(formData.type) && (
                <div>
                  <label
                    htmlFor="units"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Number of Units
                  </label>
                  <input
                    type="number"
                    id="units"
                    name="units"
                    min="1"
                    value={formData.units}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Purchase Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="purchasePrice"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Purchase Price
                  </label>
                  <input
                    type="number"
                    id="purchasePrice"
                    name="purchasePrice"
                    min="0"
                    step="1000"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="250000"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="purchaseDate"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes about this property..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Add Property
              </button>
              <Link
                href="/properties"
                className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
