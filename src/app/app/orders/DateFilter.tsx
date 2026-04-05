"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function OrdersDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const todayIST = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const selectedDate = searchParams.get("date") || todayIST;

  return (
    <div>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => {
          const date = e.target.value;
          router.replace(`/app/orders?date=${date}`);
          router.refresh();
        }}
        className="rounded-xl border px-3 py-2 text-sm"
      />
    </div>
  );
}