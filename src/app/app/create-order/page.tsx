import { createClient } from "@/lib/supabase/server";
import { CreateOrderClient } from "./create-order-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CreateOrderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const restaurantId = (await supabase.from("restaurant_members").select("restaurant_id").eq("user_id", user?.id).single()).data?.restaurant_id
  if (!user) {
    return <div>Not logged in</div>
  }

  const membership = await prisma.restaurantMember.findUnique({
    where: {
      restaurantId_userId: {
        restaurantId,
        userId: user.id,
      },
    },
  })

  if (!membership) {
    return <div>Not allowed</div>
  }

  const items = await prisma.menuItem.findMany({
    where: { restaurantId, active: true },
  })

  return <CreateOrderClient items={items} />;
}
