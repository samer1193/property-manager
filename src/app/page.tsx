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
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Dashboard() {
  const { properties, loading, getStats, getTenantsByProperty } = useData();
  const stats = getStats();

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
              <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">
                Overview of your property portfolio
              </p>
            </div>
            <Link
              href="/properties/new"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-500 sm:w-auto"
            >
              + Add Property
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Properties
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-100 sm:mt-2 sm:text-3xl">
                {stats.totalProperties}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Tenants
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-100 sm:mt-2 sm:text-3xl">
                {stats.totalTenants}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Monthly
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-400 sm:mt-2 sm:text-3xl">
                {formatCurrency(stats.totalMonthlyRent)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Occupancy
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-100 sm:mt-2 sm:text-3xl">
                {stats.occupancyRate.toFixed(0)}%
              </p>
              {stats.latePayments > 0 && (
                <p className="mt-1 text-xs text-red-400">
                  {stats.latePayments} late
                </p>
              )}
            </div>
          </div>

          {/* Properties List */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <h2 className="text-base font-semibold text-slate-100 sm:text-lg">Your Properties</h2>
            <Link
              href="/properties"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </Link>
          </div>

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
              {properties.slice(0, 6).map((property) => {
                const propertyTenants = getTenantsByProperty(property.id);
                const monthlyRent = propertyTenants
                  .filter((t) => t.status === "active")
                  .reduce((sum, t) => sum + t.rentAmount, 0);

                return (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="group rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition hover:border-slate-700 hover:bg-slate-900 sm:rounded-2xl sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">
                          {propertyTypeIcons[property.type] || "🏠"}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-slate-100 group-hover:text-blue-400 transition">
                            {property.name}
                          </h3>
                          <p className="truncate text-sm text-slate-400">
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </div>
                      <span className="hidden shrink-0 rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400 sm:inline">
                        {property.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/50 pt-3 sm:mt-4 sm:pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-sm font-medium text-slate-200">
                          {propertyTenants.filter((t) => t.status === "active").length}
                          {property.units && ` / ${property.units}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Rent</p>
                        <p className="text-sm font-medium text-emerald-400">
                          {formatCurrency(monthlyRent)}
                        </p>
                      </div>
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
