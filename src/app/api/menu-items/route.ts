import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
      const supabase = await createClient()
  
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
  
      if (error || !user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
      }
  
      const restaurantId = (await req.json()).restaurantId
  
      const membership = await prisma.restaurantMember.findUnique({
        where: {
          restaurantId_userId: {
            restaurantId,
            userId: user.id,
          },
        },
      })
  
      if (!membership) {
        return Response.json({ error: "Forbidden" }, { status: 403 })
      }
  
      const items = await prisma.menuItem.findMany({
        where: {
          restaurantId,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
  
      return Response.json(items)
    } catch (err) {
      console.error(err)
      return Response.json({ error: "Something went wrong" }, { status: 500 })
    }
  }

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const restaurantId = (await supabase.from("restaurant_members").select("restaurant_id").eq("user_id", user?.id).single()).data?.restaurant_id
    const body = await req.json()
    const { name, description, priceCents } = body

    if (!restaurantId || !name || !priceCents) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }


    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId,
        name,
        description,
        priceCents,
      },
    })

    return NextResponse.json(menuItem, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, priceCents, active, id } = body

    const existingItem = await prisma.menuItem.findUnique({
      where: { id },
    })

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const membership = await prisma.restaurantMember.findUnique({
      where: {
        restaurantId_userId: {
          restaurantId: existingItem.restaurantId,
          userId: user.id,
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 5. Update item (only update provided fields)
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(priceCents !== undefined && { priceCents }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json(updatedItem)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}