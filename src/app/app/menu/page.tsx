
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server";
import { AddItem } from "./AddItem";
import ItemCard from "./ItemCard";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
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
    where: { restaurantId },
  })

  return (
    <div className="flex flex-1 flex-col px-4 pt-6">
      <h1 className="text-xl font-semibold tracking-tight flex items-center justify-between">
        <span>Menu</span>
        <AddItem />
      </h1>
      <div className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        {!items?.length ? <div>No items in the menu yet.</div> :
        (items.map((item) => <ItemCard key={item.id} item={item} />))}
      </div>
    </div>
  );
}
