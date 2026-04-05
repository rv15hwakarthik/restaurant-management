import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get restaurantId
    const { data: membershipData } = await supabase
      .from("restaurant_members")
      .select("restaurant_id")
      .eq("user_id", user.id)
      .single();

    const restaurantId = membershipData?.restaurant_id;

    if (!restaurantId) {
      return NextResponse.json({ error: "No restaurant" }, { status: 400 });
    }

    // ✅ Validate body
    const body = await req.json();
    const { lines } = body;

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // ✅ Fetch menu items from DB (never trust client price)
    const menuItemIds = lines.map((l: any) => l.menuItemId);

    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId,
        active: true,
      },
    });

    if (menuItems.length !== lines.length) {
      return NextResponse.json(
        { error: "Invalid menu items" },
        { status: 400 }
      );
    }

    // ✅ Build order lines + total
    let totalCents = 0;

    const orderLinesData = lines.map((line: any) => {
      const item = menuItems.find((m) => m.id === line.menuItemId)!;

      const quantity = Math.max(1, line.quantity); // safety
      const unitPriceCents = item.priceCents;

      totalCents += unitPriceCents * quantity;

      return {
        menuItemId: item.id,
        quantity,
        unitPriceCents,
      };
    });

    // ✅ Create order with nested lines
    const order = await prisma.order.create({
      data: {
        restaurantId,
        createdByUserId: user.id,
        status: "OPEN",
        totalCents,
        lines: {
          create: orderLinesData,
        },
      },
      include: {
        lines: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}