"use client";

import { createContext, useContext } from "react";
import type { MemberRole } from "@prisma/client";

export type RestaurantContextValue = {
  restaurantId: string;
  role: MemberRole;
  restaurantName: string;
};

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({
  value,
  children,
}: {
  value: RestaurantContextValue;
  children: React.ReactNode;
}) {
  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return ctx;
}
