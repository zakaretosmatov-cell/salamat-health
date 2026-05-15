export type UserRole = "admin" | "receptionist" | "doctor" | "patient";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Patient {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodType?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string[];
  allergies?: string[];
  status: "active" | "inactive" | "emergency";
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  avatar?: string;
  schedule?: Record<string, string[]>;
  isAvailable: boolean;
  rating?: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: "consultation" | "follow-up" | "emergency" | "wellness" | "therapy";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string;
  roomId?: string;
  paymentStatus: "pending" | "paid" | "insurance" | "waived";
  createdAt: Date;
}

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  amount: number;
  currency: string;
  method: "cash" | "card" | "insurance" | "online";
  status: "pending" | "completed" | "refunded" | "failed";
  description: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  number: string;
  type: "consultation" | "treatment" | "wellness" | "recovery" | "emergency";
  floor: number;
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  currentPatientId?: string;
  amenities?: string[];
}

export interface WellnessSession {
  id: string;
  patientId: string;
  patientName: string;
  type: "massage" | "yoga" | "meditation" | "hydrotherapy" | "physiotherapy" | "counseling";
  therapistId?: string;
  therapistName?: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  notes?: string;
  price: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "emergency";
  isRead: boolean;
  createdAt: Date;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  prescription?: Prescription[];
  notes?: string;
  attachments?: string[];
  followUpDate?: string;
  createdAt: Date;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  availableRooms: number;
  monthlyRevenue: number;
  pendingPayments: number;
  activeStaff: number;
  emergencyCases: number;
  wellnessSessions: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
