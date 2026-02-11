"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useData } from "@/contexts/DataContext";
import type { Tenant } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  late: "bg-red-500/20 text-red-200 border-red-500/40",
  inactive: "bg-slate-500/20 text-slate-300 border-slate-500/40",
};

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const {
    getProperty,
    deleteProperty,
    getTenantsByProperty,
    addTenant,
    updateTenant,
    deleteTenant,
    loading,
  } = useData();

  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [tenantForm, setTenantForm] = useState({
    name: "",
    email: "",
    phone: "",
    unit: "",
    rentAmount: "",
    rentDueDay: "1",
    leaseStart: "",
    leaseEnd: "",
    status: "active" as Tenant["status"],
    notes: "",
  });

  const property = getProperty(propertyId);
  const tenants = getTenantsByProperty(propertyId);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-100">Property Not Found</h1>
          <Link href="/properties" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const handleDeleteProperty = () => {
    if (confirm("Are you sure you want to delete this property? All tenant data will be lost.")) {
      deleteProperty(propertyId);
      router.push("/properties");
    }
  };

  const resetTenantForm = () => {
    setTenantForm({
      name: "",
      email: "",
      phone: "",
      unit: "",
      rentAmount: "",
      rentDueDay: "1",
      leaseStart: "",
      leaseEnd: "",
      status: "active",
      notes: "",
    });
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    addTenant({
      propertyId,
      name: tenantForm.name,
      email: tenantForm.email,
      phone: tenantForm.phone,
      unit: tenantForm.unit || undefined,
      rentAmount: parseFloat(tenantForm.rentAmount),
      rentDueDay: parseInt(tenantForm.rentDueDay),
      leaseStart: tenantForm.leaseStart,
      leaseEnd: tenantForm.leaseEnd,
      status: tenantForm.status,
      notes: tenantForm.notes || undefined,
    });
    setShowAddTenant(false);
    resetTenantForm();
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setTenantForm({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      unit: tenant.unit || "",
      rentAmount: tenant.rentAmount.toString(),
      rentDueDay: tenant.rentDueDay.toString(),
      leaseStart: tenant.leaseStart,
      leaseEnd: tenant.leaseEnd,
      status: tenant.status,
      notes: tenant.notes || "",
    });
  };

  const handleUpdateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;
    
    updateTenant(editingTenant.id, {
      name: tenantForm.name,
      email: tenantForm.email,
      phone: tenantForm.phone,
      unit: tenantForm.unit || undefined,
      rentAmount: parseFloat(tenantForm.rentAmount),
      rentDueDay: parseInt(tenantForm.rentDueDay),
      leaseStart: tenantForm.leaseStart,
      leaseEnd: tenantForm.leaseEnd,
      status: tenantForm.status,
      notes: tenantForm.notes || undefined,
    });
    setEditingTenant(null);
    resetTenantForm();
  };

  const handleDeleteTenant = (tenantId: string) => {
    if (confirm("Are you sure you want to remove this tenant?")) {
      deleteTenant(tenantId);
    }
  };

  const handleLeaseUpload = async (tenantId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      updateTenant(tenantId, {
        lease: {
          id: `lease-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          fileData: reader.result as string,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const activeTenants = tenants.filter((t) => t.status === "active");
  const totalMonthlyRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0);

  const ordinalSuffix = (n: number) => {
    if (n === 1 || n === 21 || n === 31) return "st";
    if (n === 2 || n === 22) return "nd";
    if (n === 3 || n === 23) return "rd";
    return "th";
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
            
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-100 sm:text-2xl">{property.name}</h1>
                <p className="mt-1 text-sm text-slate-400 sm:text-base">{property.address}</p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
              <button
                onClick={handleDeleteProperty}
                className="w-full rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 sm:w-auto"
              >
                Delete Property
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-2 sm:mb-8 sm:gap-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tenants</p>
              <p className="mt-1 text-lg font-bold text-slate-100 sm:mt-2 sm:text-2xl">
                {activeTenants.length}
                {property.units && <span className="text-sm text-slate-500 sm:text-lg"> / {property.units}</span>}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Monthly</p>
              <p className="mt-1 text-lg font-bold text-emerald-400 sm:mt-2 sm:text-2xl">
                {formatCurrency(totalMonthlyRent)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 sm:rounded-2xl sm:p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Type</p>
              <p className="mt-1 text-lg font-bold capitalize text-slate-100 sm:mt-2 sm:text-2xl">
                {property.type.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Tenants Section */}
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <h2 className="text-base font-semibold text-slate-100 sm:text-lg">Tenants</h2>
            <button
              onClick={() => setShowAddTenant(true)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500 sm:px-4 sm:py-2"
            >
              + Add Tenant
            </button>
          </div>

          {/* Add/Edit Tenant Modal */}
          {(showAddTenant || editingTenant) && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
              <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-slate-800 bg-slate-950 p-4 sm:max-w-lg sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">
                    {editingTenant ? "Edit Tenant" : "Add New Tenant"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddTenant(false);
                      setEditingTenant(null);
                      resetTenantForm();
                    }}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant} className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Name *</label>
                      <input
                        type="text"
                        required
                        value={tenantForm.name}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Unit #</label>
                      <input
                        type="text"
                        value={tenantForm.unit}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, unit: e.target.value }))}
                        placeholder="e.g., 2A"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Email *</label>
                      <input
                        type="email"
                        required
                        value={tenantForm.email}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={tenantForm.phone}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Monthly Rent *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={tenantForm.rentAmount}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, rentAmount: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Rent Due Day *</label>
                      <select
                        value={tenantForm.rentDueDay}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, rentDueDay: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            {day}{ordinalSuffix(day)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Lease Start *</label>
                      <input
                        type="date"
                        required
                        value={tenantForm.leaseStart}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, leaseStart: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Lease End *</label>
                      <input
                        type="date"
                        required
                        value={tenantForm.leaseEnd}
                        onChange={(e) => setTenantForm((prev) => ({ ...prev, leaseEnd: e.target.value }))}
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Status</label>
                    <select
                      value={tenantForm.status}
                      onChange={(e) => setTenantForm((prev) => ({ ...prev, status: e.target.value as Tenant["status"] }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="late">Late on Payment</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Notes</label>
                    <textarea
                      rows={2}
                      value={tenantForm.notes}
                      onChange={(e) => setTenantForm((prev) => ({ ...prev, notes: e.target.value }))}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 sm:w-auto"
                    >
                      {editingTenant ? "Save Changes" : "Add Tenant"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTenant(false);
                        setEditingTenant(null);
                        resetTenantForm();
                      }}
                      className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-slate-600 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tenants List */}
          {tenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-10 sm:rounded-2xl sm:py-12">
              <span className="text-4xl">👥</span>
              <h3 className="mt-4 text-base font-medium text-slate-200 sm:text-lg">No tenants yet</h3>
              <p className="mt-1 text-sm text-slate-400">Add your first tenant</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 sm:rounded-2xl sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-100">{tenant.name}</h3>
                        {tenant.unit && (
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                            Unit {tenant.unit}
                          </span>
                        )}
                        <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusColors[tenant.status]}`}>
                          {tenant.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{tenant.email}</p>
                      <p className="text-sm text-slate-400">{tenant.phone}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <div>
                          <span className="text-slate-500">Rent: </span>
                          <span className="font-medium text-emerald-400">{formatCurrency(tenant.rentAmount)}/mo</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Due: </span>
                          <span className="text-slate-300">{tenant.rentDueDay}{ordinalSuffix(tenant.rentDueDay)}</span>
                        </div>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="text-slate-500">Lease: </span>
                        <span className="text-slate-300">{tenant.leaseStart} → {tenant.leaseEnd}</span>
                      </div>
                      
                      {/* Lease Upload */}
                      <div className="mt-4">
                        {tenant.lease ? (
                          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
                            <span className="text-lg">📄</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-200">{tenant.lease.fileName}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(tenant.lease.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={tenant.lease.fileData}
                              download={tenant.lease.fileName}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          <label className="inline-block cursor-pointer rounded-lg border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-400 transition hover:border-slate-600 hover:text-slate-300">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleLeaseUpload(tenant.id, file);
                              }}
                            />
                            📎 Upload Lease
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 border-t border-slate-800/50 pt-3 sm:border-0 sm:pt-0">
                      <button
                        onClick={() => handleEditTenant(tenant)}
                        className="flex-1 rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-700 sm:flex-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTenant(tenant.id)}
                        className="flex-1 rounded-lg px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10 sm:flex-none"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
