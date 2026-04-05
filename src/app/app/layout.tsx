import { AppShell } from "@/components/app-shell";
import { RestaurantProvider } from "@/components/restaurant-context";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ModalProvider } from "@/components/Modal";

export default async function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app/orders");

  const member = await prisma.restaurantMember.findFirst({
    where: { userId: user.id },
    include: { restaurant: true },
  });
  if (!member) redirect("/setup");

  return (
    <RestaurantProvider
      value={{
        restaurantId: member.restaurantId,
        role: member.role,
        restaurantName: member.restaurant.name,
      }}
    >
      <ModalProvider>
        <AppShell>{children}</AppShell>
      </ModalProvider>
    </RestaurantProvider>
  );
}
