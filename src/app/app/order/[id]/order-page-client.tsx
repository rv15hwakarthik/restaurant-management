"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderDetails } from "@/components/common/OrderDetails";

export function OrderPageClient({
  order,
  shouldPrint,
}: {
  order: Parameters<typeof OrderDetails>[0]["order"];
  shouldPrint: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    if (shouldPrint) {
      function afterPrint() {
        router.push("/app/create-order");
      }

      window.addEventListener("afterprint", afterPrint);
      window.print();

      return () => {
        window.removeEventListener("afterprint", afterPrint);
      };
    }
  }, [shouldPrint, router]);

  return (
    <div className="flex flex-1 flex-col px-4 pt-6 overflow-auto">
      <div className="mt-4">
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
