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
      
      <main className="pt-14 lg:pl-64 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">Properties</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your rental properties
              </p>
            </div>
            <Link
              href="/properties/new"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-500 sm:w-auto"
            >
              + Add Property
            </Link>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12 sm:rounded-2xl sm:py-16">
              <div className="rounded-full bg-slate-800 p-4">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="mt-4 text-base font-medium text-slate-200 sm:text-lg">
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
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {properties.map((property) => {
                const propertyTenants = getTenantsByProperty(property.id);
                const activeTenants = propertyTenants.filter((t) => t.status === "active");
                const monthlyRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0);

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:border-slate-700 hover:bg-slate-900 sm:rounded-2xl sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl sm:text-2xl">
                        {propertyTypeIcons[property.type] || "🏠"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-slate-100 group-hover:text-blue-400 transition">
                          {property.name}
                        </h3>
                        <p className="truncate text-sm text-slate-400">
                          {property.address}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {property.city}, {property.state} {property.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/50 pt-3 sm:mt-4 sm:pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-sm font-medium text-slate-200">
                          {activeTenants.length}
                          {property.units && ` / ${property.units}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Monthly</p>
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
