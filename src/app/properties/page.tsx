"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";

const propertyTypeIcons: Record<string, string> = {
  condo: "🏢",
  rental_home: "🏠",
  plaza: "🏬",
  apartment: "🏗️",
  commercial: "🏪",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function PropertiesPage() {
  const { properties, loading, getTenantsByProperty } = useData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />
      
      <main className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Properties</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your rental properties
              </p>
            </div>
            <Link
              href="/properties/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              + Add Property
            </Link>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-16">
              <div className="rounded-full bg-slate-800 p-4">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-slate-200">
                No properties yet
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Get started by adding your first property
              </p>
              <Link
                href="/properties/new"
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                + Add Property
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const propertyTenants = getTenantsByProperty(property.id);
                const activeTenants = propertyTenants.filter((t) => t.status === "active");
                const monthlyRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0);

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {propertyTypeIcons[property.type] || "🏠"}
                        </span>
                        <div>
                          <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition">
                            {property.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {property.address}
                          </p>
                          <p className="text-xs text-slate-500">
                            {property.city}, {property.state} {property.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-sm font-medium text-slate-200">
                          {activeTenants.length}
                          {property.units && ` / ${property.units} units`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Monthly Income</p>
                        <p className="text-sm font-medium text-emerald-400">
                          {formatCurrency(monthlyRent)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs capitalize text-slate-400">
                        {property.type.replace("_", " ")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
