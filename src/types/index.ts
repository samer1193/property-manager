export type PropertyType = 'condo' | 'rental_home' | 'plaza' | 'apartment' | 'commercial';

export interface Lease {
  id: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  // Store as base64 for localStorage, would use cloud storage in production
  fileData?: string;
}

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  unit?: string; // For plazas/apartments with multiple units
  rentAmount: number;
  rentDueDay: number; // Day of month rent is due (1-31)
  leaseStart: string;
  leaseEnd: string;
  lease?: Lease;
  status: 'active' | 'late' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  units?: number; // Number of units (for plazas/apartments)
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
  image?: string; // Base64 or URL
  createdAt: string;
  updatedAt: string;
}

export interface RentPayment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'late' | 'partial';
  notes?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  totalMonthlyRent: number;
  occupancyRate: number;
  latePayments: number;
}
