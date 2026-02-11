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
  { value: "apartment", label: "Apartment", icon: "🏗️" },
  { value: "plaza", label: "Plaza", icon: "🏬" },
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
      
      <main className="pt-14 lg:pl-64 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/properties"
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              ← Back to Properties
            </Link>
            <h1 className="mt-4 text-xl font-bold text-slate-100 sm:text-2xl">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Enter the details of your property
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:space-y-6 sm:rounded-2xl sm:p-6">
              {/* Property Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Property Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: type.value }))
                      }
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-left transition sm:p-3 ${
                        formData.type === type.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{type.icon}</span>
                      <span className="text-xs font-medium sm:text-sm">{type.label}</span>
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="sm:col-span-1">
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Zip *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
                  />
                </div>
              )}

              {/* Purchase Info */}
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
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
                  placeholder="Any additional notes..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:px-4 sm:text-base"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 sm:w-auto"
              >
                Add Property
              </button>
              <Link
                href="/properties"
                className="w-full rounded-lg border border-slate-700 px-6 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-slate-100 sm:w-auto"
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
