import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { OrdersDateFilter } from "./DateFilter";
import { getISTDateRange } from "@/utils/time";
import { OrderCard } from "./OrderCard";
import { formatToRs } from "@/utils/currency";

export const dynamic = "force-dynamic";


export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ date?: string }>}) {
  const supabase = await createClient();
  const params = await searchParams;
  const { start , end } = getISTDateRange(params.date);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-4">Unauthorized</div>;
  }

  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  const restaurantId = membership?.restaurant_id;

  if (!restaurantId) {
    return <div className="p-4">No restaurant found</div>;
  }


  const orders = await prisma.order.findMany({
    where: { restaurantId, createdAt : {
      gte: start,
      lt: end,
    } },
    include: {
      lines: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalSales = orders.reduce((acc: number, order) => acc + order.totalCents, 0);

  return (
    <div className="flex flex-1 flex-col px-4 pt-6 overflow-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <OrdersDateFilter />
      </div>

      <div className="mt-6 flex flex-col gap-4 overflow-auto">
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500">No orders yet</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
        <div className="flex justify-between text-lg">
          <div>Total Sales</div>
          <div>{formatToRs(totalSales)}</div>
        </div>
      </div>
    </div>
  );
}
