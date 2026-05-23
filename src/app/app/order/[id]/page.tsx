import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { OrderPageClient } from "./order-page-client";

export const dynamic = "force-dynamic";


export default async function OrderIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;
  const { print } = await searchParams;
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

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      lines: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  if (!order) {
    return <div className="p-4">Order not found</div>;
  }

  if (order.restaurantId !== restaurantId) {
    return <div className="p-4">Order not found</div>;
  }

  return <OrderPageClient order={order} shouldPrint={print === "true"} />;
}
