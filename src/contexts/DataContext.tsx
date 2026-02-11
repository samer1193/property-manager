"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Property, Tenant, DashboardStats } from "@/types";

interface DataContextType {
  properties: Property[];
  tenants: Tenant[];
  loading: boolean;
  
  // Property actions
  addProperty: (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  
  // Tenant actions
  addTenant: (tenant: Omit<Tenant, "id" | "createdAt" | "updatedAt">) => Tenant;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantsByProperty: (propertyId: string) => Tenant[];
  
  // Stats
  getStats: () => DashboardStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  properties: "pm_properties",
  tenants: "pm_tenants",
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedProperties = localStorage.getItem(STORAGE_KEYS.properties);
    const storedTenants = localStorage.getItem(STORAGE_KEYS.tenants);
    
    if (storedProperties) {
      setProperties(JSON.parse(storedProperties));
    }
    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    }
    setLoading(false);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.properties, JSON.stringify(properties));
    }
  }, [properties, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.tenants, JSON.stringify(tenants));
    }
  }, [tenants, loading]);

  // Property actions
  const addProperty = (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">): Property => {
    const now = new Date().toISOString();
    const newProperty: Property = {
      ...propertyData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProperties((prev) => [...prev, newProperty]);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    // Also delete associated tenants
    setTenants((prev) => prev.filter((t) => t.propertyId !== id));
  };

  const getProperty = (id: string) => properties.find((p) => p.id === id);

  // Tenant actions
  const addTenant = (tenantData: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Tenant => {
    const now = new Date().toISOString();
    const newTenant: Tenant = {
      ...tenantData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setTenants((prev) => [...prev, newTenant]);
    return newTenant;
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const getTenantsByProperty = (propertyId: string) =>
    tenants.filter((t) => t.propertyId === propertyId);

  // Stats
  const getStats = (): DashboardStats => {
    const activeTenants = tenants.filter((t) => t.status === "active");
    const totalMonthlyRent = activeTenants.reduce((sum, t) => sum + t.rentAmount, 0);
    const latePayments = tenants.filter((t) => t.status === "late").length;
    
    // Calculate occupancy (simplified - assumes 1 unit per tenant slot)
    const totalUnits = properties.reduce((sum, p) => sum + (p.units || 1), 0);
    const occupiedUnits = activeTenants.length;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

    return {
      totalProperties: properties.length,
      totalTenants: activeTenants.length,
      totalMonthlyRent,
      occupancyRate,
      latePayments,
    };
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        tenants,
        loading,
        addProperty,
        updateProperty,
        deleteProperty,
        getProperty,
        addTenant,
        updateTenant,
        deleteTenant,
        getTenantsByProperty,
        getStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
