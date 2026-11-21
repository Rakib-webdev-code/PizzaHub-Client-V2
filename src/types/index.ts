export type Role = "vendor" | "customer" | "admin";

export type SubscriptionPlan = "free" | "premium";

export type MenuItemStatus = "pending" | "approved" | "rejected" | "inactive";

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type MenuCategory =
  | "Classic Pizzas"
  | "Vegetarian Pizzas"
  | "Meat Lovers"
  | "Specialty / Gourmet Pizzas"
  | "Sides & Appetizers"
  | "Beverages & Desserts";

export interface Vendor {
  _id: string;
  name: string;
  businessName?: string;
  email?: string;
  image?: string;
  subscriptionPlan?: SubscriptionPlan;
}

export interface MenuItem {
  _id: string;
  vendorId: Vendor | string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: MenuItemStatus;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  itemId: MenuItem | string;
  vendorId: Vendor | string;
  customerId: Vendor | string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  vendorId: Vendor | string;
  plan: "premium";
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "pending" | "paid" | "failed" | "expired";
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  businessName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string | null;
  isBlocked: boolean;
  favorites?: string[];
}

export interface MenuItemPage {
  items: MenuItem[];
  total: number;
  page: number;
  pages: number;
}