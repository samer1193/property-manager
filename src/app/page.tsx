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
  const { properties, tenants, loading, getStats, getTenantsByProperty } = useData();
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
      
      <main className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-400">
                Overview of your property portfolio
              </p>
            </div>
            <Link
              href="/properties/new"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              + Add Property
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Properties
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {stats.totalProperties}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Active Tenants
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {stats.totalTenants}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Monthly Revenue
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {formatCurrency(stats.totalMonthlyRent)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Occupancy Rate
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-100">
                {stats.occupancyRate.toFixed(0)}%
              </p>
              {stats.latePayments > 0 && (
                <p className="mt-1 text-xs text-red-400">
                  {stats.latePayments} late payment{stats.latePayments > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Properties List */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Your Properties</h2>
            <Link
              href="/properties"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </Link>
          </div>

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
              {properties.slice(0, 6).map((property) => {
                const propertyTenants = getTenantsByProperty(property.id);
                const monthlyRent = propertyTenants
                  .filter((t) => t.status === "active")
                  .reduce((sum, t) => sum + t.rentAmount, 0);

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
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {property.type.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-800/50 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">Tenants</p>
                        <p className="text-sm font-medium text-slate-200">
                          {propertyTenants.filter((t) => t.status === "active").length}
                          {property.units && ` / ${property.units}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Monthly Rent</p>
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
