import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: string = "UGX") => {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDeposit = (price: number, depositPercentage: number = 30) => {
  return Math.ceil((price * depositPercentage) / 100);
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "bg-green-500";
    case "booked":
      return "bg-amber-500";
    case "occupied":
      return "bg-red-500";
    case "pending":
      return "bg-blue-500";
    case "confirmed":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    case "completed":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "Available";
    case "booked":
      return "Booked";
    case "occupied":
      return "Occupied";
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "rejected":
      return "Rejected";
    case "completed":
      return "Completed";
    default:
      return status;
  }
};

export const generateBookingId = () => {
  return `BK-${Date.now().toString(36).toUpperCase()}`;
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Simple localStorage persistence utility functions
export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch (e) {
      console.error("Error parsing stored data", e);
      return defaultValue;
    }
  }
  return defaultValue;
};